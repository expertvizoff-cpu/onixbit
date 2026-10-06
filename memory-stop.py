#!/usr/bin/env python3
"""Exactly one owner-approved stop of an unused retained container, if needed.
No production file writes, reloads, cleanup, image changes or automatic restarts.
The script is a local prepared transport; invocation is not owner authorisation.
"""
import datetime
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import stat
import subprocess
import sys
import urllib.error
import urllib.request

PINNED_BASELINE = {'activeBuildId': 'bjdTSW2nkZjtCHuYn7ViB', 'archiveInventory': [{'bytes': 396337, 'relativePath': 'demo-incoming/20261002-relay-demo-f9d009c.tgz'}], 'candidate': '20261006-design-root-copy', 'capacity': {'diskFreeBytes': 1605738496, 'memoryAvailableBytes': 1563107328}, 'checkedAt': '2026-10-06T10:53:02.232520+00:00', 'checks': {'minimumHeadroom': False, 'snapshotStable': True}, 'containers': [{'id': '51cacfedef85fd793cbfa81ef99a778f9bc2da735ea2752351988159c023f0b3', 'imageId': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'name': 'onixbit-full-site-20261004-content-depth-rc', 'networkNames': ['onixbit-site_default'], 'readOnlyRootfs': True, 'running': True, 'startedAt': '2026-10-04T06:58:49.673721221Z', 'user': '1001:1001'}, {'id': 'b64148d18bc83c286fec8a5b6df932d9f8388807f657eee475943ae0378b2ac2', 'imageId': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'name': 'onixbit-full-site-20261004-relay-f178f70', 'networkNames': ['onixbit-site_default'], 'readOnlyRootfs': True, 'running': True, 'startedAt': '2026-10-04T04:07:00.617443609Z', 'user': '1001:1001'}, {'id': '5ffaf5be8d2b7e19863417939fc7901d24e6b68d925c90f8a089059d2535b3cb', 'imageId': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'name': 'onixbit-full-site-20261003-full-site-rc-0f191e5', 'networkNames': ['onixbit-site_default'], 'readOnlyRootfs': True, 'running': False, 'startedAt': '2026-10-03T18:19:54.81259699Z', 'user': '1001:1001'}, {'id': 'e820d16fc0804bfea038ee64308b7a6dc8ebf184973bddbd79aa1d6e3f4b4e53', 'imageId': 'sha256:ec73d93b72199683b0b903e5d1808af9b916518c99c7b4048fa7d46dce58f1a6', 'name': 'onixbit-site-web-1', 'networkNames': ['onixbit-site_default'], 'readOnlyRootfs': False, 'running': True, 'startedAt': '2026-09-28T07:20:43.136458054Z', 'user': 'nextjs'}, {'id': '430f8973554a64e331d48d700c7fcd2eaf878a24415afd8e1627e1839872e531', 'imageId': 'sha256:5f5c8640aae01df9654968d946d8f1a56c497f1dd5c5cda4cf95ab7c14d58648', 'name': 'onixbit-site-caddy-1', 'networkNames': ['onixbit-site_default'], 'readOnlyRootfs': False, 'running': True, 'startedAt': '2026-09-20T17:53:01.097506219Z', 'user': ''}, {'id': 'fa17cf1e01cb366246ebc6097383958cfce6f7471258d2ceb9895dca98df12a3', 'imageId': 'sha256:5f5c8640aae01df9654968d946d8f1a56c497f1dd5c5cda4cf95ab7c14d58648', 'name': 'onixbit-demo-20261002-relay-demo-launch-foundation-v5', 'networkNames': ['onixbit-site_default'], 'readOnlyRootfs': True, 'running': True, 'startedAt': '2026-10-03T08:00:53.399434882Z', 'user': '1001:1001'}, {'id': 'd615917c3ced438ce4c98e9945ed7c1042ee3d724cbe91b90299953b843ae1f7', 'imageId': 'sha256:48e4b67d85f87bd551df43704e24d252f56cc5f8e9718841aace50f19948f0f9', 'name': 'onixbit-design-b24-concept-0b57c249b34d', 'networkNames': ['onixbit-site_default'], 'readOnlyRootfs': True, 'running': True, 'startedAt': '2026-09-28T13:49:45.316633906Z', 'user': '1001:1001'}], 'current': '/opt/onixbit-site/releases/bc80907dd9f716c9db36506704b73d7c5899d67e', 'existingDesignRuntime': {'arch': 'x64', 'glibc': 'glibc 2.36', 'node': 'v22.23.2', 'platform': 'linux'}, 'http': {'https://media.onixbit.ru/healthz': {'bytes': 11, 'cacheControl': 'private, no-store', 'contentType': 'application/json; charset=utf-8', 'sha256': '4062edaf750fb8074e7e83e0c9028c94e32468a8b6f1614774328ef045150f93', 'status': 200, 'xRobotsTag': ''}, 'https://onixbit.ru/': {'bytes': 105865, 'cacheControl': 's-maxage=31536000', 'contentType': 'text/html; charset=utf-8', 'sha256': '7981d1c79b173f162a113d878415a56ef7cc2d299fad9cfb06a9615b5d235119', 'status': 200, 'xRobotsTag': ''}, 'https://onixbit.ru/api/health': {'bytes': 31, 'cacheControl': 's-maxage=31536000', 'contentType': 'application/json', 'healthContract': True, 'sha256': '42cdaaa8dc12ba963a1f2b152e2828dc048c0996920cd0c845ebd38e0c35f0f7', 'status': 200, 'xRobotsTag': ''}, 'https://onixbit.ru/demo': {'bytes': 0, 'cacheControl': '', 'contentType': '', 'location': '/demo/', 'sha256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'status': 308, 'xRobotsTag': 'noindex, nofollow, noarchive'}, 'https://onixbit.ru/demo/': {'bytes': 37899, 'cacheControl': 'no-store', 'contentType': 'text/html; charset=utf-8', 'sha256': '6d5ffa5148b44d116a89f1d1f55bad355143c525532505cec556288d3e95fc16', 'status': 200, 'xRobotsTag': 'noindex, nofollow, noarchive'}, 'https://onixbit.ru/demo/company.html': {'bytes': 15005, 'cacheControl': 'no-store', 'contentType': 'text/html; charset=utf-8', 'sha256': 'ec630bd56a2f3d8588400bd5b60865ef69a80ab8fd1ab0a411122e9d2abc5e99', 'status': 200, 'xRobotsTag': 'noindex, nofollow, noarchive'}, 'https://onixbit.ru/design/': {'bytes': 654644, 'cacheControl': 's-maxage=31536000', 'contentType': 'text/html; charset=utf-8', 'sha256': 'fb244acc30766aa6a4989af5f2863a720db0483023c5471821cfd002933b54b5', 'status': 200, 'xRobotsTag': 'noindex, nofollow, noarchive'}, 'https://onixbit.ru/design/api/health': {'bytes': 31, 'cacheControl': 's-maxage=31536000', 'contentType': 'application/json', 'healthContract': True, 'sha256': '42cdaaa8dc12ba963a1f2b152e2828dc048c0996920cd0c845ebd38e0c35f0f7', 'status': 200, 'xRobotsTag': 'noindex, nofollow, noarchive'}}, 'network': 'onixbit-site_default', 'proxyConfig': {'activePath': '/opt/onixbit-site/releases/7c96b74bae0711ee9041b7ebfeb2bdc545b220b2/Caddyfile', 'deviceInode': '64771:129052', 'gid': 1000, 'mode': '0o644', 'protectedBlockHashes': {'demo': '744c5e42de966b3a965ab4a8202b026bb3b65ad87c1588dc4770cd96dfe558e2', 'design': '87dcf8a796de30d0ab9fa98e9ff789f9e5ee77d8db64176680d89ad7a6ecc2f3'}, 'rootUpstream': 'onixbit-full-site-20261004-content-depth-rc:3000', 'sha256': '8c4fb1bc13a606b85c1c8ed69bf96dca36715d8e3948d49dc46bdde9d2d1f5e5', 'uid': 1000}, 'readOnly': True, 'regenerableCacheInventory': [{'diskBytes': 36864, 'relativePath': 'previews/b24-concept-0b57c249b34d/.next/cache/images'}], 'remainingBeforeActivation': ['Exact candidate container smoke including writable Next caches and image resize', 'Public build-time settings agreement; accepted build has disabled Sentry DSN', 'Fresh backup, drift lock, validated root-only Caddy diff and rollback journal', 'Exact publication authorisation and post-publication UI verification'], 'retainedBuildId': 'FuluQNL8rKLzaSJ6N672L', 'schemaVersion': 1, 'status': 'STOP_CAPACITY', 'storageBytes': {'backups': 12288, 'demo-incoming': 401408, 'preview-backups': 327680, 'previews': 24950927360, 'releases': 167882752}}
ROOT = Path('/opt/onixbit-site')
ACTIVE = 'onixbit-full-site-20261004-content-depth-rc'
RETAINED = 'onixbit-full-site-20261004-relay-f178f70'
RETAINED_ID = 'b64148d18bc83c286fec8a5b6df932d9f8388807f657eee475943ae0378b2ac2'
PROXY = 'onixbit-site-caddy-1'
STARTUP_MEMORY = 1536 * 1024**2
BUILD_PATHS = {
    ACTIVE: ROOT / 'full-site-releases/20261004-content-depth-rc/runtime/.next/BUILD_ID',
    RETAINED: ROOT / 'full-site-releases/20261004-relay-f178f70/runtime/.next/BUILD_ID',
}
REPORT = {'schemaVersion': 1, 'readOnly': False, 'status': 'NOT_COMPLETE',
          'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'scope': 'Stop only pinned inactive retained Fulu if current MemAvailable is below 1536MiB',
          'stopAttempted': False, 'stopped': False, 'restartPerformed': False, 'checks': {}}

def require(value, code):
    if not value:
        raise RuntimeError(code)


def run(*args):
    process = subprocess.run(args, capture_output=True, text=True, timeout=45 if args[:2] == ('docker', 'stop') else 25,
                             check=False)
    require(process.returncode == 0, 'COMMAND_FAILED_' + args[0].upper())
    return process.stdout.strip()


def digest(data):
    return hashlib.sha256(data).hexdigest()


def field(name, expression):
    # Call sites use constant fields, never .Config or .Config.Env.
    return json.loads(run('docker', 'inspect', '--format',
                          '{{json ' + expression + '}}', name))


def identity(name):
    require(re.fullmatch(r'onixbit-[a-z0-9-]+', name), 'CONTAINER_NAME')
    return {'name': name, 'id': field(name, '.Id'),
            'imageId': field(name, '.Image'),
            'running': field(name, '.State.Running'),
            'startedAt': field(name, '.State.StartedAt'),
            'user': field(name, '.Config.User'),
            'readOnlyRootfs': field(name, '.HostConfig.ReadonlyRootfs'),
            'networkNames': run('docker', 'inspect', '--format',
                               '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}',
                               name).split()}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def http(url):
    require(url.startswith(('https://onixbit.ru/', 'https://media.onixbit.ru/')),
            'HTTP_ORIGIN')
    request = urllib.request.Request(url, method='GET',
                                     headers={'Accept-Encoding': 'identity'})
    try:
        response = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect()).open(request, timeout=20)
    except urllib.error.HTTPError as error:
        response = error
    with response:
        body = response.read(8 * 1024 * 1024 + 1)
        require(len(body) <= 8 * 1024 * 1024, 'HTTP_BODY_LIMIT')
        result = {'status': response.status, 'bytes': len(body), 'sha256': digest(body),
                  'contentType': response.headers.get('Content-Type', ''),
                  'xRobotsTag': response.headers.get('X-Robots-Tag', ''),
                  'cacheControl': response.headers.get('Cache-Control', '')}
        location = response.headers.get('Location')
        if location:
            require(location.startswith(('/', 'https://onixbit.ru/')), 'HTTP_REDIRECT_SCOPE')
            result['location'] = location
        if url.endswith('/api/health'):
            health = json.loads(body)
            result['healthContract'] = (type(health) is dict
                and set(health) == {'ok', 'service'} and health['ok'] is True
                and health['service'] == 'onixbit')
        return result


def memory_available():
    values = dict(line.split(':', 1) for line in Path('/proc/meminfo').read_text().splitlines())
    return int(values['MemAvailable'].strip().split()[0]) * 1024


def source_builds():
    result = {}
    for name, path in BUILD_PATHS.items():
        require(path.is_relative_to(ROOT) and path.resolve(strict=True) == path
                and stat.S_ISREG(path.lstat().st_mode), 'SOURCE_BUILD_PATH')
        for parent in path.parents:
            if parent == ROOT: break
            require(not parent.is_symlink(), 'SOURCE_BUILD_PARENT_SYMLINK')
        result[name] = path.read_text().strip()
    require(result[ACTIVE] == PINNED_BASELINE['activeBuildId'] == 'bjdTSW2nkZjtCHuYn7ViB', 'ACTIVE_SOURCE_BUILD_DRIFT')
    require(result[RETAINED] == PINNED_BASELINE['retainedBuildId'] == 'FuluQNL8rKLzaSJ6N672L', 'RETAINED_SOURCE_BUILD_DRIFT')
    return result


def config_identity():
    current = ROOT / 'current'
    require(current.is_symlink() and str(current.resolve(strict=True)) == PINNED_BASELINE['current'], 'CURRENT_DRIFT')
    config = PINNED_BASELINE['proxyConfig']
    active_path = Path(config['activePath'])
    require(active_path.is_relative_to(ROOT) and active_path.resolve(strict=True) == active_path
            and stat.S_ISREG(active_path.lstat().st_mode), 'ACTIVE_CONFIG_PATH')
    data = active_path.read_bytes(); info = active_path.stat(); text = data.decode('utf-8')
    require(digest(data) == config['sha256'] == 'd61c951c85f625aa561ea2a012e1456f755c17385e86cdff3c482a6a205c42e5', 'CONFIG_SHA_DRIFT')
    require(f'{info.st_dev}:{info.st_ino}' == config['deviceInode'] == '64771:129052'
            and info.st_uid == config['uid'] and info.st_gid == config['gid']
            and oct(info.st_mode & 0o7777) == config['mode'], 'CONFIG_METADATA_DRIFT')
    mounts = [m for m in field(PROXY, '.Mounts') if m['Destination'] == '/etc/caddy/Caddyfile']
    # Docker may retain an old bind inode while a historical Source alias
    # follows current elsewhere. Compare the actual mounted inode and bytes.
    require(len(mounts) == 1 and mounts[0]['Type'] == 'bind', 'CONFIG_BIND_DRIFT')
    require(run('docker', 'exec', PROXY, 'stat', '-Lc', '%d:%i', '/etc/caddy/Caddyfile') == config['deviceInode'], 'CONFIG_CONTAINER_INODE_DRIFT')
    require(run('docker', 'exec', PROXY, 'sha256sum', '/etc/caddy/Caddyfile').split()[0] == config['sha256'], 'CONFIG_CONTAINER_SHA_DRIFT')
    require(text.count('reverse_proxy ' + ACTIVE + ':3000') == 1 and RETAINED not in text, 'RETAINED_IS_REFERENCED_OR_ACTIVE_DRIFT')
    return json.loads(json.dumps(config))


def snapshot(stopped=False):
    require(ROOT.is_dir() and not ROOT.is_symlink() and ROOT.resolve() == ROOT, 'ROOT_LAYOUT')
    config = config_identity(); expected = json.loads(json.dumps(PINNED_BASELINE['containers']))
    require(len(expected) == 6, 'PROTECTED_SET_COUNT')
    if stopped:
        for item in expected:
            if item['name'] == RETAINED: item['running'] = False
    containers = [identity(item['name']) for item in expected]
    require(containers == expected, 'PROTECTED_CONTAINER_DRIFT')
    old = next(item for item in containers if item['name'] == RETAINED)
    require(old['id'] == RETAINED_ID, 'RETAINED_ID_DRIFT')
    builds = source_builds()
    public = {url: http(url) for url in PINNED_BASELINE['http']}
    require(public == PINNED_BASELINE['http'], 'PROTECTED_HTTP_DRIFT')
    require(config_identity() == config, 'CONFIG_CHANGED_DURING_SNAPSHOT')
    require([identity(item['name']) for item in expected] == containers, 'CONTAINER_CHANGED_DURING_SNAPSHOT')
    require(source_builds() == builds, 'SOURCE_BUILD_CHANGED_DURING_SNAPSHOT')
    return {'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'proxyConfig': config, 'current': PINNED_BASELINE['current'], 'containers': containers,
            'http': public, 'sourceBuildIds': builds,
            'capacity': {'diskFreeBytes': shutil.disk_usage(ROOT).free, 'memoryAvailableBytes': memory_available()}}


def main():
    require(len(sys.argv) == 2 and sys.argv[1] == '--owner-approved-retained-fulu-memory-stop', 'EXPLICIT_OWNER_APPROVED_ACTION_REQUIRED')
    lock_fds = []
    try:
        # Existing release/demo locks only. No O_CREAT and no lock-file write.
        for name in ('.full-site-publish.lock', '.demo-publish.lock'):
            fd = os.open(ROOT / name, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
            lock_fds.append(fd); require(stat.S_ISREG(os.fstat(fd).st_mode), 'NONREGULAR_EXISTING_LOCK')
            fcntl.flock(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
        before = snapshot(); REPORT['before'] = before
        REPORT['memoryBeforeDecisionBytes'] = memory_available()
        if REPORT['memoryBeforeDecisionBytes'] >= STARTUP_MEMORY:
            REPORT['action'] = 'SKIPPED_ALREADY_SUFFICIENT_MEMORY'
        else:
            # Last identity/config check immediately before the sole mutation.
            require(identity(RETAINED) == next(c for c in before['containers'] if c['name'] == RETAINED), 'STOP_TARGET_CHANGED')
            config_identity()
            REPORT['memoryImmediatelyBeforeStopBytes'] = memory_available()
            if REPORT['memoryImmediatelyBeforeStopBytes'] >= STARTUP_MEMORY:
                REPORT['action'] = 'SKIPPED_MEMORY_RECOVERED_DURING_PRECHECK'
            else:
                REPORT['stopAttempted'] = True
                run('docker', 'stop', '--time', '30', RETAINED)
                REPORT['stopped'] = True; REPORT['action'] = 'STOPPED_ONLY_RETAINED_FULU'
        after = snapshot(REPORT['stopped']); REPORT['after'] = after
        REPORT['checks'] = {'snapshotStable': True, 'protectedHTTPUnchanged': True,
                            'activeAndOtherContainersUnchanged': True,
                            'onlyRetainedRunningTransition': REPORT['stopped'],
                            'filesAndConfigRetained': True}
        updated = json.loads(json.dumps(PINNED_BASELINE))
        updated.update({k: after[k] for k in ('checkedAt', 'current', 'proxyConfig', 'containers', 'http', 'capacity')})
        updated['activeBuildId'] = after['sourceBuildIds'][ACTIVE]
        updated['retainedBuildId'] = after['sourceBuildIds'][RETAINED]
        updated['historicalInventoryCheckedAt'] = PINNED_BASELINE['checkedAt']
        updated['checks'] = {'snapshotStable': True, 'minimumHeadroom': after['capacity']['diskFreeBytes'] >= 2 * 1024**3 and after['capacity']['memoryAvailableBytes'] >= 768 * 1024**2}
        updated['status'] = 'PREFLIGHT_PASS' if updated['checks']['minimumHeadroom'] else 'STOP_CAPACITY'
        updated['approvedMaintenance'] = {'scope': 'retained Fulu only', 'container': RETAINED,
                                          'containerId': RETAINED_ID, 'stopped': REPORT['stopped']}
        REPORT['newBaseline'] = updated
        REPORT['requiredMemoryBytes'] = STARTUP_MEMORY
        if after['capacity']['memoryAvailableBytes'] < STARTUP_MEMORY:
            REPORT['status'] = 'STOP_INSUFFICIENT_MEMORY_NO_OTHER_ACTION'
        else:
            REPORT['status'] = 'MEMORY_READY_PROTECTED_PASS'
        REPORT['recovery'] = 'No automatic start. Unexpected public/config/container failure requires controller review; retained files/image/container remain.'
        REPORT['reviewOnlyRollbackCommand'] = ['docker', 'start', RETAINED]
    finally:
        for fd in reversed(lock_fds): os.close(fd)


if __name__ == '__main__':
    try:
        main()
    except BaseException as error:
        REPORT['status'] = 'STOP_REVIEW_REQUIRED'
        REPORT['failureCode'] = str(error) if type(error) is RuntimeError else type(error).__name__
        # If stop was attempted, expose only the selected identity/memory fields,
        # even when the full postcondition snapshot failed. Never retry/start.
        if REPORT['stopAttempted']:
            try: REPORT['retainedAfterFailure'] = identity(RETAINED)
            except BaseException: REPORT['retainedAfterFailure'] = 'INSPECTION_FAILED'
            try: REPORT['memoryAfterFailureBytes'] = memory_available()
            except BaseException: REPORT['memoryAfterFailureBytes'] = None
    payload = json.dumps(REPORT, sort_keys=True).encode().hex()
    print('ONIXBIT_SAFE_REPORT_AP=' + payload.translate(str.maketrans('0123456789abcdef', 'abcdefghijklmnop')))
    sys.exit(0 if REPORT['status'] == 'MEMORY_READY_PROTECTED_PASS' else 1)
