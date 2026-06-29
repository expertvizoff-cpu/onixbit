#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/onixbit-site}"
APP_NAME="${APP_NAME:-onixbit-site}"
RELEASE_SHA="${1:-}"

if [ -z "$RELEASE_SHA" ]; then
  echo "Использование: ./deploy/rollback.sh <release_sha>" >&2
  echo "Доступные релизы:" >&2
  ls -1 "$APP_DIR/releases" >&2 || true
  exit 1
fi

RELEASE_DIR="$APP_DIR/releases/$RELEASE_SHA"

if [ ! -d "$RELEASE_DIR" ]; then
  echo "Релиз не найден: $RELEASE_DIR" >&2
  exit 1
fi

ln -sfn "$RELEASE_DIR" "$APP_DIR/current"
cd "$APP_DIR/current"

docker compose -p "$APP_NAME" --env-file .env up -d --build --remove-orphans
docker compose -p "$APP_NAME" --env-file .env up -d --force-recreate caddy
docker builder prune -af
docker image prune -af
echo "Откат выполнен на релиз $RELEASE_SHA"
