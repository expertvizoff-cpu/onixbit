#!/usr/bin/env bash
# Update only the approved existing /demo/ static preview. Run on the VPS only.
# This is intentionally bound to the previously verified depth/motion v3 demo release.
# Keeps the old demo container and files untouched as the rollback target.
# Does not rebuild, restart, replace or switch the production/old-design app.
set -Eeuo pipefail
umask 022

# Actions annotations contain only curated failures or fixed stage/line fields.
# Do not include BASH_COMMAND, environment values, paths or command output.
fail() {
  local message="$*"
  message="${message//'%'/'%25'}"
  message="${message//$'\r'/'%0D'}"
  message="${message//$'\n'/'%0A'}"
  printf '::error title=Onixbit demo update::%s\n' "$message" >&2
  printf 'STOP: %s\n' "$*" >&2
  exit 1
}
stage=preflight
trap 'printf "::error title=Onixbit demo update::Stage %s failed at script line %s.\n" "$stage" "$LINENO" >&2' ERR
[[ "${APP_DIR:-}" =~ ^/[A-Za-z0-9_./-]+$ && "$APP_DIR" != / && "$APP_DIR" != *'/../'* ]] || fail 'Invalid APP_DIR'
[[ "${RELEASE_ID:-}" =~ ^20261002-relay-demo-[a-z0-9-]+$ ]] || fail 'Invalid RELEASE_ID'
[[ "${PACKAGE_SHA:-}" =~ ^[a-f0-9]{64}$ ]] || fail 'Invalid PACKAGE_SHA'
[[ ! -L "$APP_DIR" ]] || fail 'APP_DIR must not be a symlink'
test "$(realpath -m "$APP_DIR")" = "$APP_DIR" || fail 'APP_DIR must be canonical'

bundle="$APP_DIR/demo-incoming/$RELEASE_ID.tgz"
target="$APP_DIR/previews/$RELEASE_ID"
backup_dir="$APP_DIR/preview-backups/$RELEASE_ID"
container="onixbit-demo-$RELEASE_ID"
previous_release=20261002-relay-demo-depth-motion-v3
previous_container="onixbit-demo-$previous_release"
previous_index_sha=80ff388d07008e31d853572cadc39b60bab1fd6ff40def9939b066a7f7f3825d
previous_site="$APP_DIR/previews/$previous_release/site"
test "$RELEASE_ID" != "$previous_release" || fail 'Never overwrite the current demo release'
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
test "$(docker inspect --format '{{.State.Running}}' "$previous_container")" = true
# Read only identity/configuration fields, never container environment or secrets.
previous_identity="$(docker inspect --format '{{.Id}} {{.Image}} {{.State.StartedAt}} {{.State.Running}}' "$previous_container")"
previous_image="$(docker inspect --format '{{.Image}}' "$previous_container")"
[[ "$previous_image" =~ ^sha256:[a-f0-9]{64}$ ]]
test "$(docker inspect --format '{{.Config.User}} {{.HostConfig.ReadonlyRootfs}}' "$previous_container")" = '1001:1001 true'
previous_mount="$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/srv"}}{{.Source}} {{.RW}}{{end}}{{end}}' "$previous_container")"
test "$previous_mount" = "$previous_site false" || fail 'Previous demo mount changed'
python3 - "$previous_site" <<'PY_OLD'
from pathlib import Path
import sys
site = Path(sys.argv[1])
assert site.is_dir() and not site.is_symlink() and site.resolve(strict=True) == site
index = site / 'index.html'
assert index.is_file() and not index.is_symlink()
PY_OLD
test "$(sha256sum "$previous_site/index.html" | cut -d' ' -f1)" = "$previous_index_sha" || fail 'Previous demo index drift'

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
test "$(http_hash /demo/)" = "$previous_index_sha" || fail 'Public demo is not the expected previous release'
test "$(docker exec "$proxy" wget -q -T 5 -O - "http://$previous_container:8080/" | sha256sum | cut -d' ' -f1)" = "$previous_index_sha" || fail 'Previous demo is not available internally'

# Before creating anything, validate archive names, size and all file hashes.
stage=archive
python3 - "$bundle" "$live" "$previous_container" <<'PY'
from pathlib import PurePosixPath, Path
import hashlib, re, sys, tarfile
config = Path(sys.argv[2]).read_text()
begin = '  # BEGIN ONIXBIT DEMO PREVIEW\n'
end = '  # END ONIXBIT DEMO PREVIEW\n'
assert config.count(begin) == config.count(end) == 1, 'Expected one marked demo block'
start, finish = config.index(begin), config.index(end) + len(end)
assert start < finish
block = config[start:finish]
expected = '''  # BEGIN ONIXBIT DEMO PREVIEW
  @onixbitDemoBare path /demo
  handle @onixbitDemoBare {
    header X-Robots-Tag "noindex, nofollow, noarchive"
    redir * /demo/ 308
  }
  handle_path /demo/* {
    header X-Robots-Tag "noindex, nofollow, noarchive"
    header Cache-Control "no-store"
    reverse_proxy PREVIOUS_CONTAINER:8080
  }
  # END ONIXBIT DEMO PREVIEW
'''.replace('PREVIOUS_CONTAINER', sys.argv[3])
assert block == expected, 'Existing demo block/upstream drift; review required'
assert not re.search(r'/demo(?:[/\s?"}]|$)', config[:start] + config[finish:]), 'Demo route outside marker'
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
        if member.isfile() and name != 'MANIFEST.sha256':
            assert (name == 'site/index.html' or
                    re.fullmatch(r'site/src/(?:[A-Za-z0-9_-]+/)*[A-Za-z0-9_.-]+\.(?:js|mjs|css)', name) or
                    re.fullmatch(r'site/assets/(?:three/[A-Za-z0-9_.-]+\.(?:js|txt)|fonts/[A-Za-z0-9_.-]+\.(?:woff2|txt)|onixbit-(?:logo|mark)\.png)', name)), 'Unexpected runtime file'
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
  test "$(docker inspect --format '{{.Id}} {{.Image}} {{.State.StartedAt}} {{.State.Running}}' "$previous_container")" = "$previous_identity" &&
  test "$(sha256sum "$previous_site/index.html" | cut -d' ' -f1)" = "$previous_index_sha" &&
  test "$(docker exec "$proxy" wget -q -T 5 -O - "http://$previous_container:8080/" | sha256sum | cut -d' ' -f1)" = "$previous_index_sha" &&
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
python3 - "$backup_dir/before.json" "$original_sha" "$proxy_inode" "$before_web_image" "$before_web_started" "$before_proxy_started" "$before_current" "$before_root" "$before_design" "$before_design_identity" "$previous_container" "$previous_identity" "$previous_index_sha" <<'PY'
from pathlib import Path
import datetime, json, sys
keys = ('proxySha256', 'proxyInode', 'rootImage', 'rootStartedAt', 'proxyStartedAt', 'current', 'rootHtmlSha256', 'designHtmlSha256', 'designContainers', 'previousDemoContainer', 'previousDemoIdentity', 'previousDemoHtmlSha256')
record = dict(zip(keys, sys.argv[2:], strict=True))
record['capturedAt'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
Path(sys.argv[1]).write_text(json.dumps(record, indent=2) + '\n')
PY

write_config() {
  python3 - "$live" "$backup_dir/Caddyfile.before" "$backup_dir/Caddyfile.candidate" "$backup_dir/activation.json" "$proxy_inode" "$1" "$previous_container" "$container" <<'PY'
from pathlib import Path
import hashlib, json, os, signal, sys
live, backup, candidate, journal = map(Path, sys.argv[1:5])
expected_inode, mode, previous_container, next_container = sys.argv[5:]
before, after = backup.read_bytes(), candidate.read_bytes()
digest = lambda data: hashlib.sha256(data).hexdigest()
identity = {'inode': expected_inode, 'beforeSha256': digest(before), 'candidateSha256': digest(after)}
old = ('    reverse_proxy ' + previous_container + ':8080\n').encode()
new = ('    reverse_proxy ' + next_container + ':8080\n').encode()
assert before.count(old) == 1 and old != new
assert after == before.replace(old, new, 1), 'Only the reviewed demo upstream may change'
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
  trap - EXIT INT TERM ERR
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
    test "$(http_hash /demo/)" = "$previous_index_sha" || restored=0
    if [ "$restored" -eq 1 ]; then
      if [ "$started" -eq 1 ]; then docker rm -f "$container" >/dev/null || restored=0; fi
    fi
    if [ "$restored" -eq 1 ]; then
      echo 'Update failed; original demo/root/design/config verified. Only new demo container removed. Release evidence retained.' >&2
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

stage=container
caddy_image_id="$previous_image"
[[ "$caddy_image_id" =~ ^sha256:[a-f0-9]{64}$ ]]
docker image inspect "$caddy_image_id" >/dev/null
docker run -d --name "$container" --restart unless-stopped \
  --network onixbit-site_default --user 1001:1001 --memory 96m --cpus 0.25 \
  --read-only --cap-drop ALL --cap-add NET_BIND_SERVICE --security-opt no-new-privileges:true \
  --tmpfs /tmp:rw,noexec,nosuid,size=8m -v "$target/site:/srv:ro" \
  "$caddy_image_id" caddy file-server --root /srv --listen :8080 >/dev/null
started=1
stage=internal-health
expected_html="$(sha256sum "$target/site/index.html" | cut -d' ' -f1)"
for attempt in $(seq 1 15); do
  if [ "$(docker inspect --format '{{.State.Running}}' "$container")" != true ]; then
    fail 'Isolated static server exited before HTTP readiness; inspect startup error'
  fi
  if docker exec "$proxy" wget -q -T 5 -O - "http://$container:8080/" | sha256sum | cut -d' ' -f1 | grep -Fxq "$expected_html"; then break; fi
  test "$attempt" != 15 || fail 'Internal demo health failed'
  sleep 1
done

stage=config-validate
candidate="$backup_dir/Caddyfile.candidate"
python3 - "$backup_dir/Caddyfile.before" "$candidate" "$previous_container" "$container" <<'PY'
from pathlib import Path
import sys
source = Path(sys.argv[1]).read_bytes()
begin = b'  # BEGIN ONIXBIT DEMO PREVIEW\n'
end = b'  # END ONIXBIT DEMO PREVIEW\n'
assert source.count(begin) == source.count(end) == 1
start, finish = source.index(begin), source.index(end) + len(end)
assert start < finish
block = source[start:finish]
old = ('    reverse_proxy ' + sys.argv[3] + ':8080\n').encode()
new = ('    reverse_proxy ' + sys.argv[4] + ':8080\n').encode()
assert block.count(old) == source.count(old) == 1
updated = block.replace(old, new, 1)
Path(sys.argv[2]).write_bytes(source[:start] + updated + source[finish:])
PY
candidate_sha="$(sha256sum "$candidate" | cut -d' ' -f1)"
# Caddy's own container /tmp is used only for its native validate command.
container_candidate="/tmp/onixbit-demo-$RELEASE_ID.caddy"
docker cp "$candidate" "$proxy:$container_candidate"
docker exec "$proxy" caddy validate --config "$container_candidate" --adapter caddyfile
verify_protected
test "$(http_hash /demo/)" = "$previous_index_sha" || fail 'Previous demo changed before activation'
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$original_sha"
test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$original_sha"
test "$(stat -Lc '%d:%i' "$live")" = "$proxy_inode"
# Preserve the single-file bind-mount inode. Candidate validation precedes the
# journaled in-place write; Caddy's config reload activates the route atomically.
stage=activate
changed=1
write_config activate
docker exec "$proxy" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile

# Exact response bytes for every static asset, MIME types and isolated routing.
stage=public-smoke
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
        assert response.headers.get('Cache-Control') == 'no-store'
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

stage=protected-post
verify_protected
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$candidate_sha"
test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$candidate_sha"
test "$(stat -Lc '%d:%i' "$live")" = "$proxy_inode"
docker exec "$proxy" rm -f "$container_candidate"
printf 'RELEASE_ID=%s\nPACKAGE_SHA=%s\nPROXY_SHA=%s\nPREVIOUS_CONTAINER=%s\nPREVIOUS_INDEX_SHA=%s\n' "$RELEASE_ID" "$PACKAGE_SHA" "$candidate_sha" "$previous_container" "$previous_index_sha" > "$backup_dir/published.txt"
rm -f "$bundle"
echo 'Updated https://onixbit.ru/demo/. Previous demo retained for rollback; root/design HTML, containers, current link and proxy process verified unchanged.'
cat "$backup_dir/published.txt"
