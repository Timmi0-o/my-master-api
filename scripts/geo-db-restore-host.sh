#!/usr/bin/env sh
set -eu

# Run geo dump restore from the host via the postgres compose service.
# Usage (from my-master-api/):
#   npm run geo:db:restore:host -- --truncate

ROOT_DIR="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

CONTAINER="${GEO_DB_DOCKER_CONTAINER:-my-master-api-postgres}"
DUMP_PATH="${GEO_DUMP_PATH:-prisma/dumps/geo.dump}"

if [ ! -f "$DUMP_PATH" ]; then
  echo "Dump not found: $DUMP_PATH" >&2
  echo "Copy from tourgis: cp /path/to/geo-service/prisma/dumps/geo.dump prisma/dumps/" >&2
  exit 1
fi

if ! docker inspect -f '{{.State.Running}}' "$CONTAINER" >/dev/null 2>&1; then
  echo "Postgres container \"$CONTAINER\" is not running." >&2
  echo "Start it: docker compose up -d postgres" >&2
  exit 1
fi

# Ensure DATABASE_URL points at published host port when running on the host.
export GEO_DB_PG_MODE=docker
export GEO_DB_DOCKER_CONTAINER="$CONTAINER"

if [ -z "${DATABASE_URL:-}" ] && [ -f .env ]; then
  # shellcheck disable=SC1091
  set -a
  . ./.env
  set +a
fi

if [ -z "${DATABASE_URL:-}" ]; then
  export DATABASE_URL="postgresql://app:app@127.0.0.1:5432/my_master_api?schema=public"
fi

# Host-side URL often uses localhost while compose service is published on 5432.
case "$DATABASE_URL" in
  *'@postgres:'*|*'@postgres/'*)
    export DATABASE_URL="$(printf '%s' "$DATABASE_URL" | sed 's/@postgres:/@127.0.0.1:/g')"
    ;;
esac

exec npx ts-node -r tsconfig-paths/register prisma/scripts/db/geo-db-restore.ts "$@"
