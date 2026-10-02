#!/usr/bin/env bash
# First publication of an isolated /demo/ static preview. Run on the VPS only.
# Does not rebuild, restart, replace or switch the production/old-design app.
set -Eeuo pipefail
umask 022

fail() { printf 'STOP: %s\n' "$*" >&2; exit 1; }
[[ "${APP_DIR:-}" =~ ^/[A-Za-z0-9_./-]+$ && "$APP_DIR" != / && "$APP_DIR" != *'/../'* ]] || fail 'Invalid APP_DIR'
[[ "${RELEASE_ID:-}" =~ ^20261002-relay-demo-[a-z0-9-]+$ ]] || fail 'Invalid RELEASE_ID'
[[ "${PACKAGE_SHA:-}" =~ ^[a-f0-9]{64}$ ]] || fail 'Invalid PACKAGE_SHA'
[[ ! -L "$APP_DIR" ]] || fail 'APP_DIR must not be a symlink'
test "$(realpath -m "$APP_DIR")" = "$APP_DIR" || fail 'APP_DIR must be canonical'

bundle="$APP_DIR/demo-incoming/$RELEASE_ID.tgz"
target="$APP_DIR/previews/$RELEASE_ID"
backup_dir="$APP_DIR/preview-backups/$RELEASE_ID"
container="onixbit-demo-$RELEASE_ID"
proxy=onixbit-site-caddy-1
production=onixbit-site-web-1
domain=https://onixbit.ru
live=''
started=0
changed=0
candidate_sha=''

for program in docker python3 curl sha256sum stat find flock; do command -v "$program" >/dev/null || fail "Missing $program"; done
test -d "$APP_DIR" && test -L "$APP_DIR/current" || fail 'Unexpected application layout'
assert_storage_parents() {
  python3 - "$APP_DIR" <<'PY'
from pathlib import Path
import sys
root = Path(sys.argv[1])
assert root.is_dir() and not root.is_symlink() and root.resolve(strict=True) == root
for name in ('demo-incoming', 'previews', 'preview-backups'):
    parent = root / name
    assert not parent.is_symlink(), 'Storage parent must not be a symlink'
    assert parent.resolve() == parent and parent.parent == root, 'Storage parent escaped APP_DIR'
    assert not parent.exists() or parent.is_dir(), 'Storage parent is not a directory'
PY
}
assert_storage_parents
test -f "$bundle" && test ! -L "$bundle" || fail 'Archive absent or unsafe'
test "$(sha256sum "$bundle" | cut -d' ' -f1)" = "$PACKAGE_SHA" || fail 'Archive checksum mismatch'
test ! -e "$target" && test ! -L "$target" && test ! -e "$backup_dir" && test ! -L "$backup_dir" || fail 'Release already exists; inspect before retry'
! docker inspect "$container" >/dev/null 2>&1 || fail 'Demo container already exists; inspect before retry'
# Serializes this script in addition to the shared GitHub concurrency group.
test ! -L "$APP_DIR/.demo-publish.lock" || fail 'Lock path must not be a symlink'
exec 9>"$APP_DIR/.demo-publish.lock"
flock -n 9 || fail 'Another demo publication is in progress'
test "$(docker inspect --format '{{.State.Running}}' "$proxy")" = true
test "$(docker inspect --format '{{.State.Running}}' "$production")" = true

proxy_inode="$(docker exec "$proxy" stat -Lc '%d:%i' /etc/caddy/Caddyfile)"
while IFS= read -r candidate_live; do
  if [ "$(stat -Lc '%d:%i' "$candidate_live" 2>/dev/null || true)" = "$proxy_inode" ]; then
    test -z "$live" || fail 'Multiple host paths match the proxy config'
    live="$candidate_live"
  fi
done < <(find "$APP_DIR" -type f -name Caddyfile -print)
test -n "$live" || fail 'Cannot identify the active bind-mounted Caddyfile'
original_sha="$(sha256sum "$live" | cut -d' ' -f1)"
test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$original_sha"

http_hash() { curl --connect-timeout 5 --max-time 30 -fsS "$domain$1" | sha256sum | cut -d' ' -f1; }
design_identity() {
  local name
  while IFS= read -r name; do
    docker inspect --format '{{.Name}} {{.Image}} {{.State.StartedAt}} {{.State.Running}}' "$name"
  done < <(docker ps --format '{{.Names}}' | sort | sed -n '/^onixbit-design-/p')
}
before_web_image="$(docker inspect --format '{{.Image}}' "$production")"
before_web_started="$(docker inspect --format '{{.State.StartedAt}}' "$production")"
before_proxy_started="$(docker inspect --format '{{.State.StartedAt}}' "$proxy")"
before_current="$(readlink -f "$APP_DIR/current")"
before_root="$(http_hash /)"
before_design="$(http_hash /design/)"
before_design_identity="$(design_identity)"
test -n "$before_design_identity" || fail 'Expected existing design preview is absent'
# Next.js may normalize a missing route's trailing slash before returning 404.
# Permit only that exact slash normalization; never follow a redirect elsewhere.
python3 - <<'PY'
import urllib.error, urllib.parse, urllib.request
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs): return None
opener = urllib.request.build_opener(NoRedirect)
allowed = {'https://onixbit.ru/demo', 'https://onixbit.ru/demo/'}
for initial in allowed:
    url, visited = initial, set()
    while True:
        assert url not in visited, 'Existing demo redirect loop'
        visited.add(url)
        try:
            opener.open(url, timeout=20)
            raise AssertionError('Demo already responds; inspect before publication')
        except urllib.error.HTTPError as response:
            if response.code == 404: break
            assert response.code in (301, 302, 307, 308), 'Unexpected demo response'
            url = urllib.parse.urljoin(url, response.headers['Location'])
            assert url in allowed, 'Existing demo redirect must not be overwritten'
PY

# Before creating anything, validate archive names, size and all file hashes.
python3 - "$bundle" "$live" <<'PY'
from pathlib import PurePosixPath, Path
import hashlib, re, sys, tarfile
config = Path(sys.argv[2]).read_text()
assert 'ONIXBIT DEMO PREVIEW' not in config, 'Demo marker already exists'
assert not re.search(r'/demo(?:[/\s?"}]|$)', config), 'Existing demo route'
assert config.count('  # BEGIN ONIXBIT DESIGN PREVIEW') == 1, 'Unexpected design route layout'
assert config.count('reverse_proxy web:3000') == 1, 'Unexpected production upstream'
with tarfile.open(sys.argv[1], 'r:gz') as archive:
    members = archive.getmembers()
    assert 1 < len(members) < 1000, 'Unexpected file count'
    assert sum(m.size for m in members) <= 40 * 1024 * 1024, 'Archive exceeds 40 MiB'
    files, seen = {}, set()
    for member in members:
        name = member.name.rstrip('/')
        path = PurePosixPath(name)
        assert re.fullmatch(r'[A-Za-z0-9_./-]+', name), 'Unsafe archive name'
        assert not path.is_absolute() and '..' not in path.parts and '.' not in path.parts
        assert name not in seen, 'Duplicate archive entry'
        seen.add(name)
        assert member.isfile() or member.isdir(), 'Links/devices are prohibited'
        assert name == 'MANIFEST.sha256' or path.parts[0] == 'site'
        assert not any(p.startswith('.') or p in ('node_modules', 'deploy') for p in path.parts)
        if member.isfile():
            assert member.size <= 10 * 1024 * 1024, 'Oversized file'
            files[name] = archive.extractfile(member).read()
    assert 'site/index.html' in files and 'MANIFEST.sha256' in files
    rows = files.pop('MANIFEST.sha256').decode('ascii').splitlines()
    manifest = {}
    for row in rows:
        match = re.fullmatch(r'([a-f0-9]{64})  (site/[A-Za-z0-9_./-]+)', row)
        assert match, 'Invalid manifest row'
        checksum, name = match.groups()
        assert name not in manifest, 'Duplicate manifest entry'
        manifest[name] = checksum
    assert manifest.keys() == files.keys(), 'Manifest does not cover exact archive'
    for name, data in files.items():
        assert hashlib.sha256(data).hexdigest() == manifest[name], 'Payload checksum mismatch'
PY

verify_protected() {
  test "$(docker inspect --format '{{.Image}}' "$production")" = "$before_web_image" &&
  test "$(docker inspect --format '{{.State.StartedAt}}' "$production")" = "$before_web_started" &&
  test "$(docker inspect --format '{{.State.StartedAt}}' "$proxy")" = "$before_proxy_started" &&
  test "$(readlink -f "$APP_DIR/current")" = "$before_current" &&
  test "$(design_identity)" = "$before_design_identity" &&
  test "$(http_hash /)" = "$before_root" &&
  test "$(http_hash /design/)" = "$before_design" &&
  curl --connect-timeout 5 --max-time 20 -fsS "$domain/api/health" >/dev/null &&
  curl --connect-timeout 5 --max-time 20 -fsS "$domain/design/api/health" >/dev/null &&
  curl --connect-timeout 5 --max-time 20 -fsS https://media.onixbit.ru/healthz >/dev/null
}

assert_storage_parents
mkdir -p "$target" "$backup_dir"
cp -p "$live" "$backup_dir/Caddyfile.before"
printf '%s\n' "$live" > "$backup_dir/active-config-path.txt"
python3 - "$backup_dir/before.json" "$original_sha" "$proxy_inode" "$before_web_image" "$before_web_started" "$before_proxy_started" "$before_current" "$before_root" "$before_design" "$before_design_identity" <<'PY'
from pathlib import Path
import datetime, json, sys
keys = ('proxySha256', 'proxyInode', 'rootImage', 'rootStartedAt', 'proxyStartedAt', 'current', 'rootHtmlSha256', 'designHtmlSha256', 'designContainers')
record = dict(zip(keys, sys.argv[2:], strict=True))
record['capturedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
Path(sys.argv[1]).write_text(json.dumps(record, indent=2) + '\n')
PY

write_config() {
  python3 - "$live" "$backup_dir/Caddyfile.before" "$backup_dir/Caddyfile.candidate" "$backup_dir/activation.json" "$proxy_inode" "$1" <<'PY'
from pathlib import Path
import hashlib, json, os, signal, sys
live, backup, candidate, journal = map(Path, sys.argv[1:5])
expected_inode, mode = sys.argv[5:]
before, after = backup.read_bytes(), candidate.read_bytes()
digest = lambda data: hashlib.sha256(data).hexdigest()
identity = {'inode': expected_inode, 'beforeSha256': digest(before), 'candidateSha256': digest(after)}
assert len(after) > len(before), 'Preview insertion must only add config bytes'
def record(phase):
    temporary = journal.with_suffix('.next')
    fd = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_TRUNC | os.O_NOFOLLOW, 0o600)
    try:
        with os.fdopen(fd, 'wb', closefd=False) as stream:
            stream.write((json.dumps({**identity, 'phase': phase}) + '\n').encode())
            stream.flush()
            os.fsync(fd)
    finally:
        os.close(fd)
    os.replace(temporary, journal)
    directory = os.open(journal.parent, os.O_RDONLY | os.O_DIRECTORY)
    try: os.fsync(directory)
    finally: os.close(directory)
def interrupted(signum, frame):
    raise InterruptedError('Config write interrupted')
signal.signal(signal.SIGTERM, interrupted)
signal.signal(signal.SIGINT, interrupted)
fd = os.open(live, os.O_RDWR | os.O_NOFOLLOW)
try:
    stat = os.fstat(fd)
    assert f'{stat.st_dev}:{stat.st_ino}' == expected_inode, 'Active config inode changed'
    with os.fdopen(fd, 'rb', closefd=False) as stream:
        current = stream.read()
    if mode == 'activate':
        assert current == before, 'Config drift before activation'
        desired = after
    else:
        assert mode == 'restore'
        owned = current in (before, after)
        if not owned and journal.exists():
            intent = json.loads(journal.read_text())
            if all(intent.get(k) == v for k, v in identity.items()) and intent.get('phase') == 'writing':
                # A killed own write can contain only an exact candidate prefix
                # followed by untouched original bytes (or an extended prefix).
                prefix = 0
                while prefix < min(len(current), len(after)) and current[prefix] == after[prefix]:
                    prefix += 1
                owned = current == after[:prefix] + before[prefix:]
        assert owned, 'Config drift: refuse to overwrite another edit'
        desired = before
    def write_all(data):
        os.lseek(fd, 0, os.SEEK_SET)
        offset = 0
        while offset < len(data):
            written = os.write(fd, data[offset:])
            if written <= 0: raise OSError('Config write made no progress')
            offset += written
        os.ftruncate(fd, len(data))
        os.fsync(fd)
    if mode == 'activate':
        record('writing')
        try:
            write_all(desired)
            record('written')
        except BaseException:
            # Same open fd and inode: restore even when the first write was short.
            signal.signal(signal.SIGTERM, signal.SIG_IGN)
            signal.signal(signal.SIGINT, signal.SIG_IGN)
            write_all(before)
            record('restored')
            raise
    else:
        write_all(desired)
        record('restored')
finally:
    os.close(fd)
PY
}

rollback() {
  code=$?
  trap - EXIT INT TERM
  if [ "$code" -ne 0 ]; then
    set +e
    restored=1
    if [ "$changed" -eq 1 ]; then
      # The writer restores an interrupted own write, but refuses unrelated drift.
      if ! write_config restore; then
        restored=0
      else
        docker exec "$proxy" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1 || restored=0
        test "$(sha256sum "$live" | cut -d' ' -f1)" = "$original_sha" || restored=0
        test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$original_sha" || restored=0
        test "$(stat -Lc '%d:%i' "$live")" = "$proxy_inode" || restored=0
      fi
    fi
    verify_protected || restored=0
    if [ "$restored" -eq 1 ]; then
      if [ "$started" -eq 1 ]; then docker rm -f "$container" >/dev/null || restored=0; fi
    fi
    if [ "$restored" -eq 1 ]; then
      echo 'Publication failed; original root/design/config verified. New demo container removed. Release evidence retained.' >&2
    else
      echo 'ROLLBACK_FAILED: stop. Preserve container/release and inspect config drift before any retry.' >&2
    fi
  fi
  exit "$code"
}
trap rollback EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

tar -xzf "$bundle" -C "$target" --no-same-owner --no-same-permissions
find "$target" -type d -exec chmod 755 {} +
find "$target" -type f -exec chmod 644 {} +
(cd "$target" && sha256sum --quiet -c MANIFEST.sha256)

caddy_image_id="$(docker inspect --format '{{.Image}}' "$proxy")"
[[ "$caddy_image_id" =~ ^sha256:[a-f0-9]{64}$ ]]
docker image inspect "$caddy_image_id" >/dev/null
docker run -d --name "$container" --restart unless-stopped \
  --network onixbit-site_default --user 1001:1001 --memory 96m --cpus 0.25 \
  --read-only --cap-drop ALL --security-opt no-new-privileges:true \
  --tmpfs /tmp:rw,noexec,nosuid,size=8m -v "$target/site:/srv:ro" \
  "$caddy_image_id" caddy file-server --root /srv --listen :8080 >/dev/null
started=1
expected_html="$(sha256sum "$target/site/index.html" | cut -d' ' -f1)"
for attempt in $(seq 1 15); do
  if docker exec "$proxy" wget -q -T 5 -O - "http://$container:8080/" | sha256sum | cut -d' ' -f1 | grep -Fxq "$expected_html"; then break; fi
  test "$attempt" != 15 || fail 'Internal demo health failed'
  sleep 1
done

candidate="$backup_dir/Caddyfile.candidate"
python3 - "$live" "$candidate" "$container" <<'PY'
from pathlib import Path
import sys
source = Path(sys.argv[1]).read_text()
needle = '  # BEGIN ONIXBIT DESIGN PREVIEW'
assert source.count(needle) == 1
block = '''  # BEGIN ONIXBIT DEMO PREVIEW
  @onixbitDemoBare path /demo
  handle @onixbitDemoBare {
    header X-Robots-Tag "noindex, nofollow, noarchive"
    redir * /demo/ 308
  }
  handle_path /demo/* {
    header X-Robots-Tag "noindex, nofollow, noarchive"
    header Cache-Control "no-store"
    reverse_proxy DEMO_CONTAINER:8080
  }
  # END ONIXBIT DEMO PREVIEW

'''.replace('DEMO_CONTAINER', sys.argv[3])
Path(sys.argv[2]).write_text(source.replace(needle, block + needle))
PY
candidate_sha="$(sha256sum "$candidate" | cut -d' ' -f1)"
# Caddy's own container /tmp is used only for its native validate command.
container_candidate="/tmp/onixbit-demo-$RELEASE_ID.caddy"
docker cp "$candidate" "$proxy:$container_candidate"
docker exec "$proxy" caddy validate --config "$container_candidate" --adapter caddyfile
verify_protected
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$original_sha"
test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$original_sha"
test "$(stat -Lc '%d:%i' "$live")" = "$proxy_inode"
changed=1
write_config activate
docker exec "$proxy" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile

# Exact response bytes for every static asset, MIME types and isolated routing.
python3 - "$target" "$RELEASE_ID" <<'PY'
from pathlib import Path
import hashlib, sys, urllib.error, urllib.request
root, release = Path(sys.argv[1]), sys.argv[2]
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs): return None
try:
    urllib.request.build_opener(NoRedirect).open('https://onixbit.ru/demo', timeout=20)
    raise AssertionError('Missing demo slash redirect')
except urllib.error.HTTPError as response:
    assert response.code == 308 and response.headers['Location'].endswith('/demo/')
for row in (root / 'MANIFEST.sha256').read_text().splitlines():
    expected, path = row.split('  ', 1)
    relative = path.removeprefix('site/')
    request_path = '' if relative == 'index.html' else relative
    with urllib.request.urlopen('https://onixbit.ru/demo/' + request_path + '?release=' + release, timeout=30) as response:
        assert response.status == 200
        assert 'noindex' in response.headers.get('X-Robots-Tag', '')
        assert hashlib.sha256(response.read()).hexdigest() == expected, relative
        kind = response.headers.get_content_type()
        if relative.endswith(('.js', '.mjs')): assert kind in ('text/javascript', 'application/javascript'), (relative, kind)
        if relative.endswith('.css'): assert kind == 'text/css', (relative, kind)
        if relative.endswith('.html'): assert kind == 'text/html', (relative, kind)
        if relative.endswith('.woff2'): assert kind == 'font/woff2', (relative, kind)
try:
    urllib.request.urlopen('https://onixbit.ru/demo/absent-' + release, timeout=20)
    raise AssertionError('Missing static 404')
except urllib.error.HTTPError as response:
    assert response.code == 404
PY

verify_protected
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$candidate_sha"
test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$candidate_sha"
test "$(stat -Lc '%d:%i' "$live")" = "$proxy_inode"
docker exec "$proxy" rm -f "$container_candidate"
printf 'RELEASE_ID=%s\nPACKAGE_SHA=%s\nPROXY_SHA=%s\n' "$RELEASE_ID" "$PACKAGE_SHA" "$candidate_sha" > "$backup_dir/published.txt"
rm -f "$bundle"
echo 'Published https://onixbit.ru/demo/. Root/design HTML, containers, current link and proxy process verified unchanged.'
cat "$backup_dir/published.txt"
