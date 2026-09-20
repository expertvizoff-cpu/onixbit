#!/usr/bin/env bash
set -euo pipefail
umask 022
test -n "$APP_DIR"
test -n "$PACKAGE_SHA"
test -n "$RELEASE_ID"
[[ "$RELEASE_ID" =~ ^[a-z0-9-]+$ ]]
bundle="/tmp/onixbit-preview-${RELEASE_ID}.tgz"
target="$APP_DIR/previews/$RELEASE_ID"
container="onixbit-design-$RELEASE_ID"
proxy=onixbit-site-caddy-1
live="$APP_DIR/current/Caddyfile"
backup="$APP_DIR/preview-backups/Caddyfile-$RELEASE_ID"
expected_config=aa0d794414b2a38273cf9a7557f5d54b2063e09dec09a2a6bc03e6de184ae94e
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$expected_config"
test "$(sha256sum "$bundle" | cut -d' ' -f1)" = "$PACKAGE_SHA"
test ! -e "$target"
! docker inspect "$container" >/dev/null 2>&1
before_image="$(docker inspect --format '{{.Image}}' onixbit-site-web-1)"
before_started="$(docker inspect --format '{{.State.StartedAt}}' onixbit-site-web-1)"
before_release="$(readlink -f "$APP_DIR/current")"
root_before="$(curl -fsS https://onixbit.ru/ | sha256sum | cut -d' ' -f1)"
mkdir -p "$target" "$APP_DIR/preview-backups"
cp "$live" "$backup"
changed=0
started=0
rollback() {
  code=$?
  if [ "$code" -ne 0 ]; then
    if [ "$changed" -eq 1 ]; then
      cat "$backup" > "$live"
      docker exec "$proxy" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
    fi
    if [ "$started" -eq 1 ]; then docker stop "$container" >/dev/null; fi
    echo 'Preview failed; prior proxy configuration restored.'
  fi
  exit "$code"
}
trap rollback EXIT
tar -xzf "$bundle" -C "$target" --no-same-owner
test -f "$target/server.js"
test -f "$target/.next/BUILD_ID"
test ! -e "$target/.env"
test ! -e "$target/.env.local"
mkdir -p "$target/.next/cache"
chmod -R a+rX "$target"
docker pull node:22-bookworm-slim >/dev/null
docker run -d --name "$container" --restart unless-stopped \
  --network onixbit-site_default --user 1001:1001 \
  --memory 640m --cpus 0.75 --read-only --cap-drop ALL \
  --security-opt no-new-privileges:true \
  --tmpfs /tmp:rw,noexec,nosuid,size=32m \
  --tmpfs /app/.next/cache:rw,noexec,nosuid,size=160m,uid=1001,gid=1001 \
  -e NODE_ENV=production -e NEXT_TELEMETRY_DISABLED=1 \
  -e HOSTNAME=0.0.0.0 -e PORT=3000 \
  -v "$target:/app:ro" -w /app node:22-bookworm-slim node server.js >/dev/null
started=1
for attempt in $(seq 1 30); do
  if docker exec "$container" node -e 'fetch("http://127.0.0.1:3000/design/api/health").then(async r=>{if(!r.ok||!(await r.json()).ok)process.exit(1)}).catch(()=>process.exit(1))'; then break; fi
  if [ "$attempt" -eq 30 ]; then exit 1; fi
  sleep 2
done
docker exec "$container" node -e '
  if(process.arch!=="x64")throw Error("Preview bundle requires x64");
  const fs=require("fs"), file="/app/.next/cache/preview-write-probe";
  fs.writeFileSync(file,"ok");fs.unlinkSync(file);
  require("sharp")({create:{width:2,height:2,channels:3,background:{r:255,g:0,b:0}}})
    .resize(1,1).png().toBuffer().then(buffer=>{if(!buffer.length)process.exit(1);console.log("Preview image and cache preflight passed")})
    .catch(error=>{console.error(error.message);process.exit(1)});
'
candidate="$target/Caddyfile.preview"
python3 - "$live" "$candidate" "$container" <<'PY'
from pathlib import Path
import sys
source=Path(sys.argv[1]).read_text()
needle='  reverse_proxy web:3000'
assert source.count(needle)==1
block='''  # BEGIN ONIXBIT DESIGN PREVIEW — root production remains on web:3000
  @design path /design /design/*
  handle @design {
    header X-Robots-Tag "noindex, nofollow, noarchive"
    reverse_proxy CONTAINER:3000
  }
  @darkPreview path /dark /dark/
  handle @darkPreview {
    header X-Robots-Tag "noindex, nofollow, noarchive"
    redir * /design/?theme=dark 302
  }
  @lightPreview path /light /light/
  handle @lightPreview {
    header X-Robots-Tag "noindex, nofollow, noarchive"
    redir * /design/?theme=light 302
  }
  @autoPreview path /auto /auto/
  handle @autoPreview {
    header X-Robots-Tag "noindex, nofollow, noarchive"
    redir * /design/?theme=auto 302
  }
  handle {
    reverse_proxy web:3000
  }
  # END ONIXBIT DESIGN PREVIEW'''.replace('CONTAINER',sys.argv[3])
Path(sys.argv[2]).write_text(source.replace(needle,block))
PY
docker cp "$candidate" "$proxy:/tmp/onixbit-preview.caddy"
docker exec "$proxy" caddy validate --config /tmp/onixbit-preview.caddy --adapter caddyfile
# Writing in place preserves the existing bind-mounted file inode.
test "$(readlink -f "$APP_DIR/current")" = "$before_release"
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$expected_config"
test "$(docker inspect --format '{{.Image}}' onixbit-site-web-1)" = "$before_image"
test "$(docker inspect --format '{{.State.StartedAt}}' onixbit-site-web-1)" = "$before_started"
changed=1
cat "$candidate" > "$live"
docker exec "$proxy" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
curl -fsS https://onixbit.ru/design/api/health
for mode in dark light auto; do
  curl -fsSL "https://onixbit.ru/$mode/" -o "$target/check-$mode.html"
  grep -q 'onixbitTheme' "$target/check-$mode.html"
done
curl -fsSI https://onixbit.ru/design/ | grep -iq 'x-robots-tag:.*noindex'
test "$(curl -fsS https://onixbit.ru/ | sha256sum | cut -d' ' -f1)" = "$root_before"
test "$(docker inspect --format '{{.Image}}' onixbit-site-web-1)" = "$before_image"
test "$(docker inspect --format '{{.State.StartedAt}}' onixbit-site-web-1)" = "$before_started"
curl -fsS https://onixbit.ru/api/health
curl -fsS https://media.onixbit.ru/healthz >/dev/null
printf '\nPreview published; production HTML, image and start time unchanged.\n'
printf 'RELEASE_ID=%s\nBUILD_ID=%s\nPACKAGE_SHA=%s\nPROXY_SHA=%s\n' "$RELEASE_ID" "$(cat "$target/.next/BUILD_ID")" "$PACKAGE_SHA" "$(sha256sum "$live" | cut -d' ' -f1)"
