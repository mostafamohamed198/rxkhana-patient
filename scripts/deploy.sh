#!/bin/bash
# Builds the production bundle and syncs it into the rxkhana-api nginx patient volume.
#
# Usage: ./scripts/deploy.sh [path-to-rxkhana-api]
# Defaults to ../api (sibling checkout on the server).
set -e

cd "$(dirname "$0")/.."

API_DIR="${1:-../api}"
PATIENT_DIST="$API_DIR/nginx/patient"

echo "==> Installing dependencies"
npm ci

echo "==> Building production bundle"
VITE_API_BASE_URL=https://api.rxkhana.com npm run build

echo "==> Syncing dist/ -> $PATIENT_DIST"
mkdir -p "$PATIENT_DIST"
rsync -a --delete dist/ "$PATIENT_DIST/"

echo "==> Reloading nginx"
(cd "$API_DIR" && docker compose -f docker-compose.prod.yml exec nginx nginx -s reload)

echo "==> Done."
