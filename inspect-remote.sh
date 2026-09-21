#!/usr/bin/env bash
# Read-only snapshot. No file/config/container mutations, uploads or restarts.
set -euo pipefail
[[ "${APP_DIR:-}" =~ ^/[A-Za-z0-9_./-]+$ && "$APP_DIR" != / && "$APP_DIR" != *'/../'* ]]
python3 - "$APP_DIR" <<'PY'
from pathlib import Path
import base64, datetime, hashlib, json, subprocess, sys
from urllib.request import Request, urlopen
root = Path(sys.argv[1])
release = '20260921-founder14-89985b024f'
expected_build = 'SqA3Tqma8pPH5qWmjPgr_'
preview = 'onixbit-design-' + release
proxy, production = 'onixbit-site-caddy-1', 'onixbit-site-web-1'
def run(*args):
    return subprocess.check_output(args, text=True).strip()
def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def encoded(value):
    return base64.b64encode(value.encode()).decode()
def identity(name):
    return {field: run('docker', 'inspect', '--format', template, name) for field, template in {
        'imageId': '{{.Image}}', 'startedAt': '{{.State.StartedAt}}', 'running': '{{.State.Running}}'
    }.items()}
def http(url):
    with urlopen(Request(url, method='GET'), timeout=20) as response:
        body = response.read()
        return {'status': response.status, 'sha256Base64': encoded(hashlib.sha256(body).hexdigest()), 'noindex': 'noindex' in response.headers.get('X-Robots-Tag', '')}
live = root / 'current/Caddyfile'
host_sha = digest(live)
container_sha = run('docker', 'exec', proxy, 'sha256sum', '/etc/caddy/Caddyfile').split()[0]
host_inode = run('stat', '-Lc', '%d:%i', str(live))
container_inode = run('docker', 'exec', proxy, 'stat', '-Lc', '%d:%i', '/etc/caddy/Caddyfile')
base = root / 'previews' / release
build = (base / '.next/BUILD_ID').read_text().strip()
old_upstream_count = live.read_text().count('reverse_proxy ' + preview + ':3000')
result = {
    'readOnly': True,
    'capturedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'baseReleaseId': release, 'baseBuildId': build, 'expectedBuildMatches': build == expected_build,
    'basePackageJsonShaBase64': encoded(digest(base / 'package.json')),
    'dependencyLockShaBase64': encoded(digest(base / 'package-lock.json')),
    'proxy': {'hostSha256Base64': encoded(host_sha), 'containerSha256Base64': encoded(container_sha),
              'hashesMatch': host_sha == container_sha, 'hostInode': host_inode, 'containerInode': container_inode,
              'inodesMatch': host_inode == container_inode, 'expectedPreviewUpstreamCount': old_upstream_count},
    'currentPathSha256Base64': encoded(hashlib.sha256(str((root / 'current').resolve()).encode()).hexdigest()),
    'previewContainer': identity(preview), 'productionContainer': identity(production), 'proxyContainer': identity(proxy),
    'productionRoot': http('https://onixbit.ru/'), 'previewHealth': http('https://onixbit.ru/design/api/health'),
    'mediaHealth': http('https://media.onixbit.ru/healthz'),
}
print('ONIXBIT_READONLY_SNAPSHOT=' + json.dumps(result, separators=(',', ':')))
assert build == expected_build and old_upstream_count == 1
assert host_sha == container_sha and host_inode == container_inode
assert result['previewContainer']['running'] == 'true'
PY
