#!/usr/bin/env bash
set -euo pipefail
umask 022
[[ "$RELEASE_ID" =~ ^[a-z0-9-]+$ ]]
bundle="/tmp/onixbit-preview-${RELEASE_ID}.tgz"
target="$APP_DIR/previews/$RELEASE_ID"
container="onixbit-design-$RELEASE_ID"
proxy=onixbit-site-caddy-1
live="$APP_DIR/current/Caddyfile"
backup="$APP_DIR/preview-backups/Caddyfile-$RELEASE_ID"
candidate="$target/Caddyfile.preview"
expected_config=aa0d794414b2a38273cf9a7557f5d54b2063e09dec09a2a6bc03e6de184ae94e
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$expected_config"
test "$(sha256sum "$backup" | cut -d' ' -f1)" = "$expected_config"
test "$(sha256sum "$bundle" | cut -d' ' -f1)" = "$PACKAGE_SHA"
test "$(cat "$target/.next/BUILD_ID")" = "$EXPECTED_BUILD_ID"
test -f "$candidate"
test "$(docker inspect --format '{{.State.Running}}' "$container")" = false
before_image="$(docker inspect --format '{{.Image}}' onixbit-site-web-1)"
before_started="$(docker inspect --format '{{.State.StartedAt}}' onixbit-site-web-1)"
before_release="$(readlink -f "$APP_DIR/current")"
before_proxy_image="$(docker inspect --format '{{.Image}}' "$proxy")"
test "$(docker image inspect caddy:2-alpine --format '{{.Id}}')" = "$before_proxy_image"
root_before="$(curl -fsS https://onixbit.ru/ | sha256sum | cut -d' ' -f1)"
compose=(docker compose -p onixbit-site --project-directory "$APP_DIR/current" -f "$APP_DIR/current/docker-compose.yml")
# Do not print the complete Compose config or container environment.
python3 - "$APP_DIR" <<'PY'
import json,subprocess,sys
from pathlib import Path
app=Path(sys.argv[1]); current=app/'current'
cfg=json.loads(subprocess.check_output(['docker','compose','-p','onixbit-site','--project-directory',str(current),'-f',str(current/'docker-compose.yml'),'config','--format','json']))
old=json.loads(subprocess.check_output(['docker','inspect','onixbit-site-caddy-1']))[0]
c=cfg['services']['caddy']; env=dict(x.split('=',1) for x in old['Config']['Env'] if '=' in x)
assert c['image']=='caddy:2-alpine'
assert c['environment']['DOMAIN']==env['DOMAIN']=='onixbit.ru'
assert c['environment']['ACME_EMAIL']==env['ACME_EMAIL']
assert cfg['networks']['default']['name']=='onixbit-site_default'
assert set(c['networks'])==set(['default'])
ports={(str(p['target']),str(p['published']),p.get('protocol','tcp')) for p in c['ports']}
assert ports=={('80','80','tcp'),('443','443','tcp')}
volumes={v['target']:v for v in c['volumes']}
assert set(volumes)=={'/etc/caddy/Caddyfile','/data','/config'}
assert Path(volumes['/etc/caddy/Caddyfile']['source']).resolve()==(current/'Caddyfile').resolve()
assert volumes['/etc/caddy/Caddyfile']['read_only'] is True
for destination,key in [('/data','caddy_data'),('/config','caddy_config')]:
 assert cfg['volumes'][key]['name']==next(m['Name'] for m in old['Mounts'] if m['Destination']==destination)
print('Proxy recreation preflight: same image tag, host, ports, network and persistent volumes')
PY
changed=0
started=0
rollback() {
  code=$?
  if [ "$code" -ne 0 ]; then
    set +e
    restore_ok=1
    if [ "$changed" -eq 1 ]; then
      cat "$backup" > "$live" || restore_ok=0
      "${compose[@]}" up -d --no-deps --no-build --pull never --force-recreate caddy || restore_ok=0
    fi
    if [ "$started" -eq 1 ]; then docker stop "$container" >/dev/null || restore_ok=0; fi
    curl --connect-timeout 3 --max-time 8 --retry 10 --retry-all-errors --retry-delay 1 --retry-max-time 60 -fsS https://onixbit.ru/api/health || restore_ok=0
    test "$(sha256sum "$live" | cut -d' ' -f1)" = "$expected_config" || restore_ok=0
    test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$expected_config" || restore_ok=0
    if [ "$restore_ok" -eq 1 ]; then
      echo 'Retry failed; original proxy configuration and root health verified restored.'
    else
      echo 'ROLLBACK_FAILED: proxy restoration requires attention.' >&2
    fi
  fi
  exit "$code"
}
trap rollback EXIT
docker start "$container" >/dev/null
started=1
for attempt in $(seq 1 30); do
  if docker exec "$container" node -e 'fetch("http://127.0.0.1:3000/design/api/health").then(async r=>{if(!r.ok||!(await r.json()).ok)process.exit(1)}).catch(()=>process.exit(1))'; then break; fi
  if [ "$attempt" -eq 30 ]; then exit 1; fi
  sleep 2
done
docker exec "$container" node -e '
  if(process.arch!=="x64")throw Error("Preview bundle requires x64");
  const fs=require("fs"),file="/app/.next/cache/preview-write-probe";
  fs.writeFileSync(file,"ok");fs.unlinkSync(file);
  require("sharp")({create:{width:2,height:2,channels:3,background:{r:255,g:0,b:0}}})
    .resize(1,1).png().toBuffer().then(b=>{if(!b.length)process.exit(1);console.log("Image and cache preflight passed")})
    .catch(e=>{console.error(e.message);process.exit(1)});
'
docker cp "$candidate" "$proxy:/tmp/onixbit-preview.caddy"
docker exec "$proxy" caddy validate --config /tmp/onixbit-preview.caddy --adapter caddyfile
test "$(readlink -f "$APP_DIR/current")" = "$before_release"
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$expected_config"
test "$(docker inspect --format '{{.Image}}' onixbit-site-web-1)" = "$before_image"
test "$(docker inspect --format '{{.State.StartedAt}}' onixbit-site-web-1)" = "$before_started"
changed=1
cat "$candidate" > "$live"
"${compose[@]}" up -d --no-deps --no-build --pull never --force-recreate caddy
for attempt in $(seq 1 30); do
  if curl --connect-timeout 3 --max-time 8 -fsS https://onixbit.ru/design/api/health; then break; fi
  if [ "$attempt" -eq 30 ]; then exit 1; fi
  sleep 2
done
test "$(stat -Lc '%d:%i' "$live")" = "$(docker exec "$proxy" stat -Lc '%d:%i' /etc/caddy/Caddyfile)"
candidate_sha="$(sha256sum "$candidate" | cut -d' ' -f1)"
test "$(sha256sum "$live" | cut -d' ' -f1)" = "$candidate_sha"
test "$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)" = "$candidate_sha"
test "$(docker inspect --format '{{.Image}}' "$proxy")" = "$before_proxy_image"
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
printf '\nPreview published; production HTML, application image and application start time unchanged.\n'
printf 'RELEASE_ID=%s\nBUILD_ID=%s\nPACKAGE_SHA=%s\nPROXY_SHA=%s\n' "$RELEASE_ID" "$EXPECTED_BUILD_ID" "$PACKAGE_SHA" "$candidate_sha"
