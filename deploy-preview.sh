#!/usr/bin/env bash
# Publish only the isolated /design application. The production root container
# and current release symlink must remain byte-for-byte and process-identical.
set -euo pipefail
umask 022

[[ "${APP_DIR:-}" =~ ^/[A-Za-z0-9_./-]+$ && "$APP_DIR" != / && "$APP_DIR" != *'/../'* ]]
[[ "${RELEASE_ID:-}" =~ ^[a-z0-9-]+$ ]]
[[ "${EXPECTED_BUILD_ID:-}" =~ ^[A-Za-z0-9_.-]+$ ]]
for value in "${PACKAGE_SHA:-}" "${DEPENDENCY_LOCK_SHA:-}" "${PACKAGE_JSON_SHA:-}"; do
  [[ "$value" =~ ^[a-f0-9]{64}$ ]]
done

bundle="/tmp/onixbit-preview-$RELEASE_ID.tgz"
target="$APP_DIR/previews/$RELEASE_ID"
container="onixbit-design-$RELEASE_ID"
proxy="onixbit-site-caddy-1"
production="onixbit-site-web-1"
container_caddy_inode="$(docker exec "$proxy" stat -Lc '%d:%i' /etc/caddy/Caddyfile)"
live=""
while IFS= read -r candidate_live; do
  if [ "$(stat -Lc '%d:%i' "$candidate_live" 2>/dev/null || true)" = "$container_caddy_inode" ]; then
    live="$candidate_live"
    break
  fi
done < <(find "$APP_DIR" -type f -name Caddyfile -print 2>/dev/null)
test -n "$live"
backup="$APP_DIR/preview-backups/Caddyfile-$RELEASE_ID"

old_container=""
while IFS= read -r name; do
  if [ "$(docker inspect --format '{{.State.Running}}' "$name" 2>/dev/null || true)" = true ]; then
    old_container="$name"
    break
  fi
done < <(docker ps --format '{{.Names}}' | grep '^onixbit-design-' || true)

base=""
while IFS= read -r candidate_base; do
  if [ -f "$candidate_base/package.json" ] && [ -f "$candidate_base/package-lock.json" ] && [ -d "$candidate_base/node_modules" ] && \
     [ "$(sha256sum "$candidate_base/package-lock.json" | cut -d' ' -f1)" = "$DEPENDENCY_LOCK_SHA" ]; then
    base="$candidate_base"
    break
  fi
done < <(find "$APP_DIR/previews" -mindepth 1 -maxdepth 1 -type d -printf '%T@ %p\n' 2>/dev/null | sort -nr | cut -d' ' -f2-)

test -f "$bundle"
test -f "$live"
test -n "$base"
test "$(sha256sum "$bundle" | cut -d' ' -f1)" = "$PACKAGE_SHA"
test ! -e "$target"
! docker inspect "$container" >/dev/null 2>&1

host_proxy_sha="$(sha256sum "$live" | cut -d' ' -f1)"
container_proxy_sha="$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)"
host_proxy_inode="$(stat -Lc '%d:%i' "$live")"
container_proxy_inode="$(docker exec "$proxy" stat -Lc '%d:%i' /etc/caddy/Caddyfile)"
test "$host_proxy_sha" = "$container_proxy_sha"
test "$host_proxy_inode" = "$container_proxy_inode"

before_web_image="$(docker inspect --format '{{.Image}}' "$production")"
before_web_started="$(docker inspect --format '{{.State.StartedAt}}' "$production")"
before_proxy_started="$(docker inspect --format '{{.State.StartedAt}}' "$proxy")"
before_current="$(readlink -f "$APP_DIR/current")"
before_root="$(curl --connect-timeout 3 --max-time 20 -fsS https://onixbit.ru/ | sha256sum | cut -d' ' -f1)"
if [ -n "$old_container" ]; then
  preview_image="$(docker inspect --format '{{.Config.Image}}' "$old_container")"
else
  preview_image="node:22-bookworm-slim"
  docker image inspect "$preview_image" >/dev/null 2>&1 || docker pull "$preview_image" >/dev/null
fi

python3 - "$bundle" <<'PY'
from pathlib import PurePosixPath
import sys, tarfile

with tarfile.open(sys.argv[1], 'r:gz') as archive:
    members = archive.getmembers()
    assert members
    for member in members:
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
      if [ -n "$old_container" ]; then docker start "$old_container" >/dev/null 2>&1 || restored=0; fi
      cat "$backup" > "$live" || restored=0
      docker exec "$proxy" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1 || restored=0
    fi
    if [ "$started" -eq 1 ]; then
      docker rm -f "$container" >/dev/null 2>&1 || restored=0
    fi
    rm -rf "$target" >/dev/null 2>&1 || restored=0
    curl --connect-timeout 3 --max-time 10 --retry 5 --retry-all-errors --retry-delay 1 --retry-max-time 60 -fsS https://onixbit.ru/design/api/health >/dev/null || restored=0
    test "$(docker inspect --format '{{.Image}}' "$production" 2>/dev/null)" = "$before_web_image" || restored=0
    test "$(docker inspect --format '{{.State.StartedAt}}' "$production" 2>/dev/null)" = "$before_web_started" || restored=0
    test "$(readlink -f "$APP_DIR/current" 2>/dev/null)" = "$before_current" || restored=0
    test "$(curl --connect-timeout 3 --max-time 20 -fsS https://onixbit.ru/ | sha256sum | cut -d' ' -f1)" = "$before_root" || restored=0
    if [ "$restored" -eq 1 ]; then
      echo 'Previous /design preview restored; production identity preserved.'
    else
      echo 'ROLLBACK_FAILED: inspect the preview proxy before another publication.' >&2
    fi
  fi
  exit "$code"
}
trap rollback EXIT

cp -a "$base/node_modules" "$target/node_modules"
cp "$base/package-lock.json" "$target/package-lock.json"
tar -xzf "$bundle" -C "$target" --no-same-owner

test -f "$target/server.js"
test "$(cat "$target/.next/BUILD_ID")" = "$EXPECTED_BUILD_ID"
test "$(sha256sum "$target/package.json" | cut -d' ' -f1)" = "$PACKAGE_JSON_SHA"
test "$(sha256sum "$target/package-lock.json" | cut -d' ' -f1)" = "$DEPENDENCY_LOCK_SHA"
test ! -e "$target/.env"
test ! -e "$target/.env.local"

python3 - "$base/package.json" "$target/package.json" <<'PY'
import json, sys
before, after = (json.load(open(path)) for path in sys.argv[1:])
for field in ('dependencies', 'devDependencies', 'overrides'):
    assert before.get(field) == after.get(field), field
assert {k: v for k, v in before.items() if k != 'scripts'} == {k: v for k, v in after.items() if k != 'scripts'}
PY

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
  if docker exec "$container" node -e 'fetch("http://127.0.0.1:3000/design/api/health",{signal:AbortSignal.timeout(8000)}).then(async r=>{if(!r.ok||!(await r.json()).ok)process.exit(1)}).catch(()=>process.exit(1))'; then
    break
  fi
  if [ "$attempt" -eq 30 ]; then exit 1; fi
  sleep 2
done

docker exec "$container" node -e 'const fs=require("fs"),p="/app/.next/cache/probe";fs.writeFileSync(p,"ok");fs.unlinkSync(p);require("sharp")({create:{width:2,height:2,channels:3,background:{r:255,g:0,b:0}}}).resize(1,1).png().toBuffer().then(b=>{if(!b.length)process.exit(1);console.log("Image/cache preflight passed")}).catch(e=>{console.error(e.message);process.exit(1)})'

candidate="$target/Caddyfile.preview"
python3 - "$live" "$candidate" "$container" <<'PY'
from pathlib import Path
import sys
original = Path(sys.argv[1]).read_text()
container = sys.argv[3]
begin = '  # BEGIN ONIXBIT DESIGN PREVIEW — root production remains on web:3000'
end = '  # END ONIXBIT DESIGN PREVIEW'
block = f"""  # BEGIN ONIXBIT DESIGN PREVIEW — root production remains on web:3000
  @design path /design /design/*
  handle @design {{
    header X-Robots-Tag "noindex, nofollow, noarchive"
    reverse_proxy {container}:3000
  }}
  @darkPreview path /dark /dark/
  handle @darkPreview {{
    header X-Robots-Tag "noindex, nofollow, noarchive"
    redir * /design/?theme=dark 302
  }}
  @lightPreview path /light /light/
  handle @lightPreview {{
    header X-Robots-Tag "noindex, nofollow, noarchive"
    redir * /design/?theme=light 302
  }}
  @autoPreview path /auto /auto/
  handle @autoPreview {{
    header X-Robots-Tag "noindex, nofollow, noarchive"
    redir * /design/?theme=auto 302
  }}
  handle {{
    reverse_proxy web:3000
  }}
  # END ONIXBIT DESIGN PREVIEW"""
if begin in original and end in original:
    first = original.index(begin)
    last = original.index(end, first) + len(end)
    updated = original[:first] + block + original[last:]
else:
    needle = '  reverse_proxy web:3000'
    assert original.count(needle) == 1
    updated = original.replace(needle, block)
Path(sys.argv[2]).write_text(updated)
PY

docker cp "$candidate" "$proxy:/tmp/onixbit-design-preview.caddy"
docker exec "$proxy" caddy validate --config /tmp/onixbit-design-preview.caddy --adapter caddyfile

test "$(readlink -f "$APP_DIR/current")" = "$before_current"
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$host_proxy_sha"
test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$host_proxy_sha"
test "$(docker inspect --format '{{.Image}}' "$production")" = "$before_web_image"
test "$(docker inspect --format '{{.State.StartedAt}}' "$production")" = "$before_web_started"
test "$(docker inspect --format '{{.State.StartedAt}}' "$proxy")" = "$before_proxy_started"

changed=1
cat "$candidate" > "$live"
docker exec "$proxy" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile

candidate_sha="$(sha256sum "$candidate" | cut -d' ' -f1)"
test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$candidate_sha"
test "$(stat -Lc '%d:%i' "$live")" = "$(docker exec "$proxy" stat -Lc '%d:%i' /etc/caddy/Caddyfile)"

curl --connect-timeout 3 --max-time 20 -fsS "https://onixbit.ru/design/api/health?release=$RELEASE_ID" >/dev/null
curl --connect-timeout 3 --max-time 30 -fsS "https://onixbit.ru/design/vnedrenie-bitrix24?release=$RELEASE_ID" -o "$target/check-bitrix24.html"
grep -Fq 'От точечной настройки до корпоративной архитектуры' "$target/check-bitrix24.html"
grep -Fq 'ONIXBIT Enterprise' "$target/check-bitrix24.html"
grep -Fq 'Разберём задачу и предложим следующий шаг' "$target/check-bitrix24.html"
removed_status="$(curl --connect-timeout 3 --max-time 20 -sS -o /dev/null -w '%{http_code}' https://onixbit.ru/design/preview/vnedrenie-bitrix24)"
test "$removed_status" = 404
curl --connect-timeout 3 --max-time 20 -fsS "https://onixbit.ru/design/media/bitrix24-implementation/continuous-office-night.webp?release=$RELEASE_ID" >/dev/null
curl --connect-timeout 3 --max-time 15 -fsSI https://onixbit.ru/design/ | grep -iq 'x-robots-tag:.*noindex'

for mode in dark light auto; do
  curl --connect-timeout 3 --max-time 20 -fsSL "https://onixbit.ru/$mode/" -o "$target/check-$mode.html"
  grep -q '/design/' "$target/check-$mode.html"
done

test "$(curl --connect-timeout 3 --max-time 20 -fsS https://onixbit.ru/ | sha256sum | cut -d' ' -f1)" = "$before_root"
test "$(docker inspect --format '{{.Image}}' "$production")" = "$before_web_image"
test "$(docker inspect --format '{{.State.StartedAt}}' "$production")" = "$before_web_started"
test "$(docker inspect --format '{{.State.StartedAt}}' "$proxy")" = "$before_proxy_started"
test "$(readlink -f "$APP_DIR/current")" = "$before_current"
curl --connect-timeout 3 --max-time 15 -fsS https://onixbit.ru/api/health >/dev/null
curl --connect-timeout 3 --max-time 15 -fsS https://media.onixbit.ru/healthz >/dev/null

if [ -n "$old_container" ] && [ "$old_container" != "$container" ]; then docker stop "$old_container" >/dev/null || true; fi
rm -f "$bundle"

echo 'Reviewed /design Bitrix24 page published. Production root container, release link and proxy process were preserved.'
printf 'RELEASE_ID=%s\nBUILD_ID=%s\nPACKAGE_SHA=%s\nPROXY_SHA=%s\nPREVIOUS_PREVIEW=%s\n' \
  "$RELEASE_ID" "$EXPECTED_BUILD_ID" "$PACKAGE_SHA" "$candidate_sha" "$old_container"
