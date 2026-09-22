#!/usr/bin/env bash
# Reviewed /design-only update. Never switches current or the production web.
set -euo pipefail
umask 022
[[ "${APP_DIR:-}" =~ ^/[A-Za-z0-9_./-]+$ && "$APP_DIR" != / && "$APP_DIR" != *'/../'* ]]
[[ "$RELEASE_ID" =~ ^[a-z0-9-]+$ && "$BASE_RELEASE_ID" =~ ^[a-z0-9-]+$ ]]
[[ "$EXPECTED_BUILD_ID" =~ ^[A-Za-z0-9_-]+$ && "$BASE_BUILD_ID" =~ ^[A-Za-z0-9_-]+$ ]]
for value in "$PACKAGE_SHA" "$DEPENDENCY_LOCK_SHA" "$BASE_PACKAGE_JSON_SHA" "$PACKAGE_JSON_SHA" "$EXPECTED_PROXY_SHA"; do [[ "$value" =~ ^[a-f0-9]{64}$ ]]; done
[[ "$BASE_RELEASE_ID" = 20260921-founder14-89985b024f && "$BASE_BUILD_ID" = SqA3Tqma8pPH5qWmjPgr_ ]]
base="$APP_DIR/previews/$BASE_RELEASE_ID"
target="$APP_DIR/previews/$RELEASE_ID"
old_container="onixbit-design-$BASE_RELEASE_ID"
container="onixbit-design-$RELEASE_ID"
proxy=onixbit-site-caddy-1
production=onixbit-site-web-1
live="$APP_DIR/current/Caddyfile"
backup="$APP_DIR/preview-backups/Caddyfile-$RELEASE_ID"
bundle="/tmp/onixbit-preview-$RELEASE_ID.tgz"
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$EXPECTED_PROXY_SHA"
test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$EXPECTED_PROXY_SHA"
test "$(stat -Lc '%d:%i' "$live")" = "$(docker exec "$proxy" stat -Lc '%d:%i' /etc/caddy/Caddyfile)"
test "$(sha256sum "$bundle" | cut -d' ' -f1)" = "$PACKAGE_SHA"
test "$(cat "$base/.next/BUILD_ID")" = "$BASE_BUILD_ID"
test "$(sha256sum "$base/package-lock.json" | cut -d' ' -f1)" = "$DEPENDENCY_LOCK_SHA"
test "$(sha256sum "$base/package.json" | cut -d' ' -f1)" = "$BASE_PACKAGE_JSON_SHA"
test "$(docker inspect --format '{{.State.Running}}' "$old_container")" = true
test ! -e "$target"
! docker inspect "$container" >/dev/null 2>&1
before_web_image="$(docker inspect --format '{{.Image}}' "$production")"
before_web_started="$(docker inspect --format '{{.State.StartedAt}}' "$production")"
before_proxy_started="$(docker inspect --format '{{.State.StartedAt}}' "$proxy")"
before_current="$(readlink -f "$APP_DIR/current")"
before_root="$(curl --connect-timeout 3 --max-time 20 -fsS https://onixbit.ru/ | sha256sum | cut -d' ' -f1)"
preview_image="$(docker inspect --format '{{.Image}}' "$old_container")"
# Reject archive traversal, links, secrets and dependency-tree replacements before extraction.
python3 - "$bundle" <<'PY'
from pathlib import PurePosixPath
import sys, tarfile
with tarfile.open(sys.argv[1], 'r:gz') as archive:
    for member in archive.getmembers():
        path = PurePosixPath(member.name)
        assert not path.is_absolute() and '..' not in path.parts
        assert member.isfile() or member.isdir()
        assert 'node_modules' not in path.parts
        assert not any(part == '.git' or part.startswith('.env') for part in path.parts)
PY
mkdir -p "$target" "$APP_DIR/preview-backups"
cp "$live" "$backup"
changed=0
started=0
rollback() {
  code=$?
  if [ "$code" -ne 0 ]; then
    set +e
    restored=1
    if [ "$changed" -eq 1 ]; then
      docker start "$old_container" >/dev/null || restored=0
      cat "$backup" > "$live" || restored=0
      docker exec "$proxy" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile || restored=0
    fi
    if [ "$started" -eq 1 ]; then docker stop "$container" >/dev/null || restored=0; fi
    curl --connect-timeout 3 --max-time 10 --retry 5 --retry-all-errors --retry-delay 1 --retry-max-time 60 -fsS https://onixbit.ru/design/api/health >/dev/null || restored=0
    test "$(sha256sum "$live" | cut -d' ' -f1)" = "$EXPECTED_PROXY_SHA" || restored=0
    test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$EXPECTED_PROXY_SHA" || restored=0
    test "$(docker inspect --format '{{.Image}}' "$production")" = "$before_web_image" || restored=0
    test "$(docker inspect --format '{{.State.StartedAt}}' "$production")" = "$before_web_started" || restored=0
    test "$(docker inspect --format '{{.State.StartedAt}}' "$proxy")" = "$before_proxy_started" || restored=0
    test "$(readlink -f "$APP_DIR/current")" = "$before_current" || restored=0
    test "$(curl --connect-timeout 3 --max-time 20 -fsS https://onixbit.ru/ | sha256sum | cut -d' ' -f1)" = "$before_root" || restored=0
    if [ "$restored" -eq 1 ]; then echo 'Previous /design preview verified restored; production identity preserved.'; else echo 'ROLLBACK_FAILED: inspect restoration before any further action.' >&2; fi
  fi
  exit "$code"
}
trap rollback EXIT
cp -a "$base/node_modules" "$target/node_modules"
cp "$base/package-lock.json" "$target/package-lock.json"
tar -xzf "$bundle" -C "$target" --no-same-owner
test "$(cat "$target/.next/BUILD_ID")" = "$EXPECTED_BUILD_ID"
test "$(sha256sum "$target/package.json" | cut -d' ' -f1)" = "$PACKAGE_JSON_SHA"
test "$(sha256sum "$target/package-lock.json" | cut -d' ' -f1)" = "$DEPENDENCY_LOCK_SHA"
python3 - "$base/package.json" "$target/package.json" <<'PY'
import json, sys
before, after = (json.load(open(path)) for path in sys.argv[1:])
for field in ('dependencies', 'devDependencies', 'overrides'):
    assert before.get(field) == after.get(field)
assert {k:v for k,v in before.items() if k != 'scripts'} == {k:v for k,v in after.items() if k != 'scripts'}
PY
test ! -e "$target/.env"
test ! -e "$target/.env.local"
mkdir -p "$target/.next/cache"
chmod -R a+rX "$target"
docker run -d --name "$container" --restart unless-stopped \
  --network onixbit-site_default --user 1001:1001 --memory 640m --cpus 0.75 \
  --read-only --cap-drop ALL --security-opt no-new-privileges:true \
  --tmpfs /tmp:rw,noexec,nosuid,size=32m \
  --tmpfs /app/.next/cache:rw,noexec,nosuid,size=160m,uid=1001,gid=1001 \
  -e NODE_ENV=production -e NEXT_TELEMETRY_DISABLED=1 -e HOSTNAME=0.0.0.0 -e PORT=3000 \
  -v "$target:/app:ro" -w /app "$preview_image" node server.js >/dev/null
started=1
for attempt in $(seq 1 30); do
  if docker exec "$container" node -e 'fetch("http://127.0.0.1:3000/design/api/health",{signal:AbortSignal.timeout(8000)}).then(async r=>{if(!r.ok||!(await r.json()).ok)process.exit(1)}).catch(()=>process.exit(1))'; then break; fi
  if [ "$attempt" -eq 30 ]; then exit 1; fi
  sleep 2
done
docker exec "$container" node -e 'const fs=require("fs"),p="/app/.next/cache/probe";fs.writeFileSync(p,"ok");fs.unlinkSync(p);require("sharp")({create:{width:2,height:2,channels:3,background:{r:255,g:0,b:0}}}).resize(1,1).png().toBuffer().then(b=>{if(!b.length)process.exit(1);console.log("Image/cache preflight passed")}).catch(e=>{console.error(e.message);process.exit(1)})'
candidate="$target/Caddyfile.preview"
python3 - "$live" "$candidate" "$old_container" "$container" <<'PY'
from pathlib import Path
import sys
original=Path(sys.argv[1]).read_text()
old='reverse_proxy '+sys.argv[3]+':3000'
new='reverse_proxy '+sys.argv[4]+':3000'
assert original.count(old) == 1
Path(sys.argv[2]).write_text(original.replace(old, new))
PY
docker cp "$candidate" "$proxy:/tmp/onixbit-character-preview.caddy"
docker exec "$proxy" caddy validate --config /tmp/onixbit-character-preview.caddy --adapter caddyfile
test "$(readlink -f "$APP_DIR/current")" = "$before_current"
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$EXPECTED_PROXY_SHA"
test "$(docker inspect --format '{{.Image}}' "$production")" = "$before_web_image"
test "$(docker inspect --format '{{.State.StartedAt}}' "$production")" = "$before_web_started"
changed=1
cat "$candidate" > "$live"
docker exec "$proxy" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
candidate_sha="$(sha256sum "$candidate" | cut -d' ' -f1)"
test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$candidate_sha"
test "$(stat -Lc '%d:%i' "$live")" = "$(docker exec "$proxy" stat -Lc '%d:%i' /etc/caddy/Caddyfile)"
for mode in dark light auto; do
  curl --connect-timeout 3 --max-time 20 -fsSL "https://onixbit.ru/$mode/" -o "$target/check-$mode.html"
  grep -q '/design/_next/static/' "$target/check-$mode.html"
done
curl --connect-timeout 3 --max-time 15 -fsSI https://onixbit.ru/design/ | grep -iq 'x-robots-tag:.*noindex'
test "$(curl --connect-timeout 3 --max-time 20 -fsS https://onixbit.ru/ | sha256sum | cut -d' ' -f1)" = "$before_root"
test "$(docker inspect --format '{{.Image}}' "$production")" = "$before_web_image"
test "$(docker inspect --format '{{.State.StartedAt}}' "$production")" = "$before_web_started"
test "$(docker inspect --format '{{.State.StartedAt}}' "$proxy")" = "$before_proxy_started"
test "$(readlink -f "$APP_DIR/current")" = "$before_current"
curl --connect-timeout 3 --max-time 15 -fsS https://onixbit.ru/design/api/health
curl --connect-timeout 3 --max-time 15 -fsS https://media.onixbit.ru/healthz >/dev/null
docker stop "$old_container" >/dev/null
echo 'Reviewed /design published. Production root HTML, application, current link and proxy start time preserved.'
printf 'RELEASE_ID=%s\nBUILD_ID=%s\nPACKAGE_SHA=%s\nPROXY_SHA=%s\n' "$RELEASE_ID" "$EXPECTED_BUILD_ID" "$PACKAGE_SHA" "$candidate_sha"
printf 'PROXY_SHA_BASE64='
printf '%s' "$candidate_sha" | base64 | tr -d '\n'
printf '\n'
