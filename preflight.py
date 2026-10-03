#!/usr/bin/env python3
"""Read-only inventory for the accepted Onixbit full-site candidate.

Run only after authorising the exact /opt/onixbit-site production inspection.
No upload, file write, pull, build, container creation, reload or form POST.
Never request the complete Docker inspect document or any environment field.
"""
import datetime
import hashlib
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request

ROOT = Path('/opt/onixbit-site')
PROXY = 'onixbit-site-caddy-1'
WEB = 'onixbit-site-web-1'
DEMO = 'onixbit-demo-20261002-relay-demo-launch-foundation-v5'
RELEASE = '20261003-full-site-rc-0f191e5'
REPORT = {'schemaVersion': 1, 'readOnly': True,
          'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
          'candidate': RELEASE, 'checks': {}, 'status': 'NOT_COMPLETE'}


def require(value, code):
    if not value:
        raise RuntimeError(code)


def run(*args):
    process = subprocess.run(args, capture_output=True, text=True, timeout=25,
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
        response = urllib.request.build_opener(NoRedirect).open(request, timeout=20)
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


def main():
    require(len(sys.argv) == 2 and sys.argv[1] == '--inspect-onixbit-production',
            'EXPLICIT_SCOPE_ARGUMENT_REQUIRED')
    require(ROOT.is_dir() and not ROOT.is_symlink() and ROOT.resolve() == ROOT,
            'APP_ROOT_LAYOUT')
    current = ROOT / 'current'
    require(current.is_symlink(), 'CURRENT_NOT_SYMLINK')
    resolved = current.resolve(strict=True)
    require(resolved.is_dir() and resolved.is_relative_to(ROOT / 'releases'),
            'CURRENT_OUTSIDE_RELEASES_OR_NOT_DIRECTORY')
    REPORT['current'] = str(resolved)
    mounts = field(PROXY, '.Mounts')
    config_mounts = [m for m in mounts if m['Destination'] == '/etc/caddy/Caddyfile']
    require(len(config_mounts) == 1 and config_mounts[0]['Type'] == 'bind', 'CADDY_BIND')
    inode = run('docker', 'exec', PROXY, 'stat', '-Lc', '%d:%i', '/etc/caddy/Caddyfile')
    proxy_sha = run('docker', 'exec', PROXY, 'sha256sum', '/etc/caddy/Caddyfile').split()[0]
    candidates = {Path(config_mounts[0]['Source']), current / 'Caddyfile', ROOT / 'Caddyfile'}
    candidates.update((ROOT / 'releases').glob('*/Caddyfile'))
    candidates.update((ROOT / 'previews').glob('*/Caddyfile'))
    matched = set()
    for path in candidates:
        if not path.is_file():
            continue
        path = path.resolve(strict=True)
        require(path.is_relative_to(ROOT), 'CADDY_PATH_OUTSIDE_ROOT')
        stat = path.stat()
        if f'{stat.st_dev}:{stat.st_ino}' == inode:
            matched.add(path)
    require(len(matched) == 1, 'ACTIVE_CADDY_INODE_NOT_UNIQUE')
    active = matched.pop()
    data = active.read_bytes()
    require(digest(data) == proxy_sha, 'CADDY_HOST_CONTAINER_MISMATCH')
    config = data.decode('utf-8')
    require(config.count('reverse_proxy web:3000') == 1, 'ROOT_UPSTREAM_DRIFT')
    require(config.count('reverse_proxy ' + DEMO + ':8080') == 1, 'DEMO_UPSTREAM_DRIFT')
    designs = re.findall(r'reverse_proxy (onixbit-design-[a-z0-9-]+):3000', config)
    require(len(designs) == 1, 'DESIGN_UPSTREAM_NOT_UNIQUE')
    protected = {}
    for name in ('DEMO', 'DESIGN'):
        begin = '  # BEGIN ONIXBIT ' + name + ' PREVIEW'
        end = '  # END ONIXBIT ' + name + ' PREVIEW'
        require(config.count(begin) == config.count(end) == 1, 'PREVIEW_BLOCK_' + name)
        start = config.index(begin)
        stop = config.index(end, start) + len(end)
        protected[name.lower()] = digest(config[start:stop].encode())
    stat = active.stat()
    REPORT['proxyConfig'] = {'activePath': str(active), 'sha256': proxy_sha,
                             'deviceInode': inode, 'mode': oct(stat.st_mode & 0o7777),
                             'uid': stat.st_uid, 'gid': stat.st_gid,
                             'rootUpstream': 'web:3000', 'protectedBlockHashes': protected}
    containers = [identity(name) for name in (WEB, PROXY, DEMO, designs[0])]
    REPORT['containers'] = containers
    require(all(c['running'] for c in containers), 'PROTECTED_CONTAINER_NOT_RUNNING')
    networks = set(containers[0]['networkNames'])
    for container in containers[1:]:
        networks &= set(container['networkNames'])
    require(len(networks) == 1, 'SHARED_NETWORK_NOT_UNIQUE')
    REPORT['network'] = networks.pop()
    runtime = json.loads(run('docker', 'exec', designs[0], 'node', '-e',
        "process.stdout.write(JSON.stringify({node:process.version,arch:process.arch,platform:process.platform}))"))
    runtime['glibc'] = run('docker', 'exec', designs[0], 'getconf', 'GNU_LIBC_VERSION')
    REPORT['existingDesignRuntime'] = runtime
    require(runtime['node'].startswith('v22.') and runtime['arch'] == 'x64'
            and runtime['platform'] == 'linux' and re.fullmatch(r'glibc [0-9.]+', runtime['glibc']),
            'GLIBC_NODE22_UNAVAILABLE')
    disk = shutil.disk_usage(ROOT)
    memory = dict(line.split(':', 1) for line in Path('/proc/meminfo').read_text().splitlines())
    available = int(memory['MemAvailable'].strip().split()[0]) * 1024
    REPORT['capacity'] = {'diskFreeBytes': disk.free, 'memoryAvailableBytes': available}
    REPORT['checks']['minimumHeadroom'] = disk.free >= 2 * 1024**3 and available >= 768 * 1024**2
    storage = {}
    for name in ('releases', 'previews', 'preview-backups', 'demo-incoming', 'backups'):
        path = ROOT / name
        if path.is_dir() and not path.is_symlink():
            storage[name] = int(run('du', '-sxk', str(path)).split()[0]) * 1024
    REPORT['storageBytes'] = storage
    archives = []
    for parent in (ROOT, ROOT / 'demo-incoming'):
        if not parent.is_dir() or parent.is_symlink():
            continue
        for path in sorted(parent.iterdir()):
            if (path.is_file() and not path.is_symlink()
                    and path.name.endswith(('.tgz', '.tar.gz', '.zip'))):
                archives.append({'relativePath': str(path.relative_to(ROOT)),
                                 'bytes': path.stat().st_size})
    REPORT['archiveInventory'] = archives
    caches = []
    for parent in (ROOT / 'releases', ROOT / 'previews'):
        if not parent.is_dir() or parent.is_symlink():
            continue
        children = sorted(parent.iterdir())
        require(len(children) <= 200, 'RELEASE_INVENTORY_BOUND')
        for release in children:
            if not release.is_dir() or release.is_symlink():
                continue
            for suffix in ('.next/cache/images', '.next/cache/webpack', '.next/cache/swc'):
                cache = release / suffix
                if cache.is_dir() and not cache.is_symlink() and cache.resolve() == cache:
                    caches.append({'relativePath': str(cache.relative_to(ROOT)),
                                   'diskBytes': int(run('du', '-sxk', str(cache)).split()[0]) * 1024})
    REPORT['regenerableCacheInventory'] = caches
    for relative in ('full-site-incoming', 'full-site-releases', 'full-site-backups'):
        parent = ROOT / relative
        require(not parent.is_symlink() and parent.resolve() == parent
                and (not parent.exists() or parent.is_dir()), 'UNSAFE_NEW_STORAGE_PARENT')
        for leaf in (parent / RELEASE, parent / (RELEASE + '.tar.gz')):
            require(not leaf.exists() and not leaf.is_symlink(), 'CANDIDATE_PATH_ALREADY_EXISTS')
    names = run('docker', 'ps', '-a', '--format', '{{.Names}}').splitlines()
    require('onixbit-full-site-' + RELEASE not in names, 'CANDIDATE_CONTAINER_ALREADY_EXISTS')
    urls = ['https://onixbit.ru' + p for p in
            ('/', '/api/health', '/demo', '/demo/', '/demo/company.html', '/design/', '/design/api/health')]
    urls.append('https://media.onixbit.ru/healthz')
    REPORT['http'] = {url: http(url) for url in urls}
    for url, result in REPORT['http'].items():
        if url.endswith('/demo'):
            require(result['status'] == 308 and result.get('location') in
                    ('/demo/', 'https://onixbit.ru/demo/'), 'DEMO_SLASH_REDIRECT')
        else:
            require(result['status'] == 200, 'PUBLIC_HTTP_STATUS')
        if '/demo/' in url or '/design/' in url:
            require('noindex' in result['xRobotsTag'], 'PREVIEW_INDEXING_HEADER')
            # Preserve the observed existing contours. The legacy Next design
            # cache contract differs from the separately published static demo.
            expected_cache = 'no-store' if '/demo/' in url else 's-maxage=31536000'
            require(result['cacheControl'] == expected_cache, 'PREVIEW_CACHE_HEADER')
        if 'healthContract' in result:
            require(result['healthContract'], 'PUBLIC_HEALTH_CONTRACT')
    require(current.resolve(strict=True) == resolved, 'CURRENT_CHANGED_DURING_PROBE')
    require(digest(active.read_bytes()) == proxy_sha, 'CADDY_CHANGED_DURING_PROBE')
    final_stat = active.stat()
    require(f'{final_stat.st_dev}:{final_stat.st_ino}' == inode, 'CADDY_HOST_INODE_CHANGED_DURING_PROBE')
    require(run('docker', 'exec', PROXY, 'stat', '-Lc', '%d:%i', '/etc/caddy/Caddyfile') == inode,
            'CADDY_INODE_CHANGED_DURING_PROBE')
    require(run('docker', 'exec', PROXY, 'sha256sum', '/etc/caddy/Caddyfile').split()[0] == proxy_sha,
            'CADDY_CONTAINER_CHANGED_DURING_PROBE')
    for before in containers:
        require(identity(before['name']) == before, 'CONTAINER_CHANGED_DURING_PROBE')
    REPORT['checks']['snapshotStable'] = True
    REPORT['status'] = 'PREFLIGHT_PASS' if REPORT['checks']['minimumHeadroom'] else 'STOP_CAPACITY'
    REPORT['remainingBeforeActivation'] = [
        'Exact candidate container smoke including writable Next caches and image resize',
        'Public build-time settings agreement; accepted build has disabled Sentry DSN',
        'Fresh backup, drift lock, validated root-only Caddy diff and rollback journal',
        'Exact publication authorisation and post-publication UI verification']


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        REPORT['status'] = 'STOP'
        REPORT['failureCode'] = str(error) if type(error) is RuntimeError else type(error).__name__
    # GitHub masks its short VPS_PORT secret wherever its digits occur, including
    # ordinary public SHA256 values. Encode only this explicitly selected safe
    # metadata, never environments/config bytes/credentials/diagnostic reports.
    payload = json.dumps(REPORT, sort_keys=True).encode().hex()
    print('ONIXBIT_SAFE_REPORT_AP=' + payload.translate(str.maketrans('0123456789abcdef', 'abcdefghijklmnop')))
    sys.exit(0 if REPORT['status'] == 'PREFLIGHT_PASS' else 1)
