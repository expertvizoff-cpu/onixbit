"""Read-only inventory source. Run on the staging host only after exact approval.

No SQL, HTTP, Node execution, container exec, configuration or service changes.
Never emits config values, tenant identifiers, mount paths or process environment.
"""
import hashlib
import json
import os
from pathlib import Path
import pwd
import re
import signal
import stat
import subprocess
import sys
import time

APP = Path('/home/deploy/apps/onixbit-messenger-staging')
ORIGIN = 'https://messenger-test.onixbit.ru'
BOXED_ORIGIN = 'https://onixbit.su'
CONTAINERS = ('onixbit-messenger-staging-api', 'onixbit-messenger-staging-db',
              'onixbit-site-caddy-1')
CODE = ('main.js', 'server.js', 'bitrix-embedded/runtime.js',
        'bitrix-embedded/native-session-wire.js', 'bitrix-embedded/composer-runtime.js',
        'bitrix-embedded/reply-inbox-runtime.js', 'delivery/route-publication-runtime.js')
PACKAGES = ('fastify', 'better-auth', 'pg', 'zod')
FLAGS = ('nativeEnabled', 'mutationsEnabled', 'finishEnabled')


class Stop(Exception):
    pass


def owned_file(root, relative, limit):
    """Resolve only fixed relative names beneath an owned directory; no links."""
    if root.resolve() != root or not root.is_dir():
        raise Stop('PATH_BOUNDARY')
    path = root / relative
    if not path.is_relative_to(root) or '..' in Path(relative).parts:
        raise Stop('PATH_BOUNDARY')
    for item in [*path.relative_to(root).parents][::-1]:
        if (root / item).is_symlink():
            raise Stop('PATH_BOUNDARY')
    meta = path.lstat()
    if not stat.S_ISREG(meta.st_mode) or meta.st_uid != os.geteuid() or meta.st_size > limit:
        raise Stop('FILE_BOUNDARY')
    with os.fdopen(os.open(path, os.O_RDONLY | os.O_NOFOLLOW), 'rb') as stream:
        opened = os.fstat(stream.fileno())
        fields = ('st_dev', 'st_ino', 'st_size', 'st_mode', 'st_uid')
        if any(getattr(opened, key) != getattr(meta, key) for key in fields):
            raise Stop('FILE_CHANGED')
        data = stream.read(limit + 1)
    if len(data) != meta.st_size:
        raise Stop('FILE_CHANGED')
    return data, meta


def file_metadata(root, relative, limit=2 * 1024 * 1024, private=False):
    try:
        data, meta = owned_file(root, relative, limit)
    except FileNotFoundError:
        return {'present': False}
    if private and meta.st_mode & 0o077:
        raise Stop('PRIVATE_FILE_MODE')
    return {'present': True, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}


def private_json(root, relative):
    data, meta = owned_file(root, relative, 262144)
    if meta.st_mode & 0o077:
        raise Stop('PRIVATE_FILE_MODE')
    value = json.loads(data)
    if not isinstance(value, dict):
        raise Stop('CONFIG_SHAPE')
    return value


def inspect_container(name):
    if name not in CONTAINERS:
        raise Stop('CONTAINER_BOUNDARY')
    fmt = '{{json .Id}}\n{{json .Image}}\n{{json .State.Running}}\n{{json .Mounts}}'
    result = subprocess.run(
        ['/usr/bin/docker', '--host', 'unix:///var/run/docker.sock',
         'inspect', '--format', fmt, name],
        env={'PATH': '/usr/bin:/bin', 'LANG': 'C'}, stdin=subprocess.DEVNULL,
        capture_output=True, timeout=5, check=False)
    if result.returncode != 0 or len(result.stdout) > 32768:
        raise Stop('CONTAINER_INSPECTION')
    lines = result.stdout.splitlines()
    if len(lines) != 4:
        raise Stop('CONTAINER_INSPECTION')
    identity, image, running, mounts = map(json.loads, lines)
    if not isinstance(identity, str) or not re.fullmatch(r'[a-f0-9]{64}', identity):
        raise Stop('CONTAINER_INSPECTION')
    if not isinstance(image, str) or not re.fullmatch(r'sha256:[a-f0-9]{64}', image):
        raise Stop('CONTAINER_INSPECTION')
    if running is not True:
        raise Stop('CONTAINER_NOT_RUNNING')
    return {'id': identity, 'image': image, 'running': running}, mounts


def mount_root(mounts, destination):
    matches = [v for v in mounts if v.get('Destination') == destination]
    if len(matches) != 1 or matches[0].get('Type') != 'bind':
        raise Stop('MOUNT_BOUNDARY')
    root = Path(matches[0]['Source'])
    if not root.is_relative_to(APP) or root == APP or root.resolve() != root:
        raise Stop('MOUNT_BOUNDARY')
    meta = root.stat()
    if not stat.S_ISDIR(meta.st_mode) or meta.st_uid != os.geteuid():
        raise Stop('MOUNT_BOUNDARY')
    return root


def configuration_summary(api, native, registry):
    """Only explicit booleans/counts; never return a copied input object."""
    if api.get('baseUrl') != ORIGIN or native.get('appOrigin') != ORIGIN:
        raise Stop('ORIGIN_BOUNDARY')
    if any(type(native.get(k)) is not bool for k in FLAGS):
        raise Stop('CONFIG_SHAPE')
    if len(registry) > 20 or any(not isinstance(v, dict) for v in registry.values()):
        raise Stop('REGISTRY_SHAPE')
    route = native.get('routeCatalog')
    composer = native.get('composer')
    max_auth = api.get('maxAuth')
    for value in (route, composer, max_auth):
        if value is not None and not isinstance(value, dict):
            raise Stop('CONFIG_SHAPE')
    fields = ('databaseUrl', 'composerLabelDatabaseUrl', 'composerOutboxDatabaseUrl',
              'replyInboxDatabaseUrl', 'nativeEchoDatabaseUrl', 'replyProcessorDatabaseUrl')
    return {
        'nativeFlags': {k: native[k] for k in FLAGS},
        'clientIdConfigured': bool(native.get('clientId')),
        'clientSecretConfigured': bool(native.get('clientSecret')),
        'boxedOwnOriginAllowed': BOXED_ORIGIN in native.get('boxedOrigins', []),
        'routePublicationConfigured': bool(api.get('routePublicationFile')),
        'routeCatalogEnabled': (route or {}).get('enabled') is True,
        'composerEnabled': (composer or {}).get('enabled') is True,
        'firstChatEnabled': (composer or {}).get('firstChatEnabled') is True,
        'replyInboxConfigured': bool(native.get('replyInboxFile')),
        'maxAuthEnabled': bool(max_auth) and max_auth.get('enabled') is True,
        'tenantSlots': len(registry),
        'tenantFieldsConfigured': {key: sum(bool(v.get(key)) for v in registry.values())
                                   for key in fields},
    }


def inventory():
    if os.geteuid() == 0 or pwd.getpwuid(os.geteuid()).pw_name != 'deploy':
        raise Stop('DEPLOY_ACCOUNT_REQUIRED')
    if APP.resolve() != APP or not APP.is_dir():
        raise Stop('APP_BOUNDARY')
    before = {name: inspect_container(name) for name in CONTAINERS}
    runtime = mount_root(before[CONTAINERS[0]][1], '/app')
    private = mount_root(before[CONTAINERS[0]][1], '/run/onixbit')
    config_hashes = {name: file_metadata(private, name, 262144, private=True)
                     for name in ('api.json', 'bitrix.json', 'bitrix-tenants.json')}
    api = private_json(private, 'api.json')
    native = private_json(private, 'bitrix.json')
    registry_path = native.get('tenantRegistryFile')
    if registry_path != '/run/onixbit/bitrix-tenants.json':
        raise Stop('REGISTRY_PATH_BOUNDARY')
    summary = configuration_summary(api, native, private_json(private, 'bitrix-tenants.json'))
    files = {name: file_metadata(runtime, 'apps/api/dist/' + name) for name in CODE}
    packages = {}
    for name in PACKAGES:
        data, _ = owned_file(runtime, 'node_modules/' + name + '/package.json', 65536)
        value = json.loads(data).get('version')
        if not isinstance(value, str) or not re.fullmatch(r'\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?', value):
            raise Stop('PACKAGE_VERSION')
        packages[name] = value
    frontend = file_metadata(runtime, 'apps/cabinet/dist/index.html')
    bootstrap = file_metadata(runtime, 'ops/staging/bootstrap.mjs')
    after = {name: inspect_container(name) for name in CONTAINERS}
    if before != after:
        raise Stop('CONTAINER_DRIFT')
    if config_hashes != {name: file_metadata(private, name, 262144, private=True)
                         for name in config_hashes}:
        raise Stop('CONFIG_DRIFT')
    return {'containers': {k: v[0] for k, v in before.items()},
            'configuration': summary, 'configFiles': config_hashes,
            'compiledFiles': files, 'packageVersions': packages,
            'frontendIndex': frontend, 'bootstrapSource': bootstrap,
            'databaseStateInspected': False, 'dependencyTreeVerified': False,
            'deploymentAuthorized': False}


def main():
    if sys.argv[1:] != ['--inspect-current-messenger']:
        return 2
    started = time.monotonic()
    def expired(_signal, _frame):
        raise Stop('INVENTORY_DEADLINE')
    signal.signal(signal.SIGALRM, expired)
    signal.alarm(40)
    try:
        report = {'status': 'INVENTORIED', **inventory()}
        code = 0
    except Stop as error:
        report, code = {'status': 'STOP', 'code': str(error)}, 2
    except Exception:
        report, code = {'status': 'STOP', 'code': 'INVENTORY_UNAVAILABLE'}, 2
    finally:
        signal.alarm(0)
    report.update(purpose='current-messenger-runtime-inventory-v1', readOnly=True,
                  elapsedSeconds=round(time.monotonic() - started, 3), retryAllowed=False)
    print(json.dumps(report, separators=(',', ':')))
    return code


if __name__ == '__main__':
    raise SystemExit(main())
