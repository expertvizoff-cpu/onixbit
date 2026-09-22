#!/usr/bin/env bash
# Read-only snapshot. No file, config, container or network-route mutations.
set -euo pipefail
[[ "${APP_DIR:-}" =~ ^/[A-Za-z0-9_./-]+$ && "$APP_DIR" != / && "$APP_DIR" != *'/../'* ]]
release=20260922-cases-9775e5ad44
expected_build=r5I6PGeUlEKxzkv3tiWDs
preview="onixbit-design-$release"
proxy=onixbit-site-caddy-1
production=onixbit-site-web-1
live="$APP_DIR/current/Caddyfile"
base="$APP_DIR/previews/$release"
host_sha="$(sha256sum "$live" | cut -d' ' -f1)"
container_sha="$(docker exec "$proxy" sha256sum /etc/caddy/Caddyfile | cut -d' ' -f1)"
host_inode="$(stat -Lc '%d:%i' "$live")"
container_inode="$(docker exec "$proxy" stat -Lc '%d:%i' /etc/caddy/Caddyfile)"
build="$(cat "$base/.next/BUILD_ID")"
root_sha="$(curl --connect-timeout 3 --max-time 20 -fsS https://onixbit.ru/ | sha256sum | cut -d' ' -f1)"
test "$host_sha" = "$container_sha"
test "$host_inode" = "$container_inode"
test "$build" = "$expected_build"
test "$(docker inspect --format '{{.State.Running}}' "$preview")" = true
test "$(grep -Fc "reverse_proxy $preview:3000" "$live")" = 1
curl --connect-timeout 3 --max-time 15 -fsS https://onixbit.ru/design/api/health >/dev/null
curl --connect-timeout 3 --max-time 15 -fsS https://media.onixbit.ru/healthz >/dev/null
test "$(docker inspect --format '{{.State.Running}}' "$production")" = true
printf 'ONIXBIT_PREVIEW_STATE=RELEASE_ID:%s,BUILD_ID:%s,PROXY_SHA_BASE64:%s,ROOT_SHA_BASE64:%s,HOST_INODE:%s,CONTAINER_INODE:%s\n' \
  "$release" "$build" "$(printf '%s' "$host_sha" | base64 | tr -d '\n')" "$(printf '%s' "$root_sha" | base64 | tr -d '\n')" "$host_inode" "$container_inode"
