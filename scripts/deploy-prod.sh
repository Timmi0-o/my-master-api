#!/usr/bin/env bash
# Сборка production-образа API локально и выкат на VPS.
#
# Usage:
#   ./scripts/deploy-prod.sh
#   DEPLOY_SSH_PASSWORD='...' ./scripts/deploy-prod.sh
#
# Env (optional):
#   DEPLOY_HOST              default: 157.22.196.76
#   DEPLOY_USER              default: root
#   DEPLOY_DIR               default: /var/www/www-root/data/my-master-api
#   DEPLOY_COMPOSE_FILE      default: docker-compose.prod.yml
#   DEPLOY_IMAGE             default: my-master-api-app:latest
#   DEPLOY_SSH_PASSWORD      password auth via sshpass / SSH_ASKPASS
#   DEPLOY_SKIP_BUILD=1      не пересобирать образ, залить текущий local tag
#   DEPLOY_SYNC_COMPOSE=1    также залить docker-compose.prod.yml
#   DEPLOY_SKIP_ENV_SYNC=1   не обновлять mailer/APP_WEB_URL в remote .env
#   DEPLOY_SKIP_PRUNE=1      не чистить dangling-образы на сервере
#   DEPLOY_HEALTH_PATH       default: /v1/search?q=test
#   DEPLOY_APP_PORT          default: 8567
#   PROD_APP_WEB_URL         default: https://my-crazy-master.ru

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

DEPLOY_HOST="${DEPLOY_HOST:-157.22.196.76}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_DIR="${DEPLOY_DIR:-/var/www/www-root/data/my-master-api}"
DEPLOY_COMPOSE_FILE="${DEPLOY_COMPOSE_FILE:-docker-compose.prod.yml}"
DEPLOY_IMAGE="${DEPLOY_IMAGE:-my-master-api-app:latest}"
DEPLOY_HEALTH_PATH="${DEPLOY_HEALTH_PATH:-/v1/search?q=test}"
DEPLOY_APP_PORT="${DEPLOY_APP_PORT:-8567}"
PROD_APP_WEB_URL="${PROD_APP_WEB_URL:-https://my-crazy-master.ru}"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"
TAR_LOCAL="${TMPDIR:-/tmp}/my-master-api-app.tar.gz"
COMPOSE_BIN="${DEPLOY_COMPOSE_BIN:-/usr/local/bin/docker-compose}"
ENV_PATCH_LOCAL=""

SSH_PREFIX=()
SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30)
ASKPASS_FILE=""

log() {
  printf '==> %s\n' "$*"
}

die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "нужна команда: $1"
}

require_cmd docker
require_cmd ssh
require_cmd scp
require_cmd gzip

cleanup() {
  if [[ -n "$ASKPASS_FILE" && -f "$ASKPASS_FILE" ]]; then
    rm -f "$ASKPASS_FILE"
  fi
  rm -f "$TAR_LOCAL"
  if [[ -n "$ENV_PATCH_LOCAL" && -f "$ENV_PATCH_LOCAL" ]]; then
    rm -f "$ENV_PATCH_LOCAL"
  fi
}
trap cleanup EXIT

# Читает KEY=value из локального .env (без export, с поддержкой кавычек).
read_dotenv_value() {
  local key="$1"
  local file="${2:-.env}"
  local line raw

  [[ -f "$file" ]] || return 1

  line="$(grep -E "^${key}=" "$file" | tail -n 1 || true)"
  [[ -n "$line" ]] || return 1

  raw="${line#*=}"
  raw="${raw%$'\r'}"

  if [[ "$raw" =~ ^\".*\"$ ]]; then
    raw="${raw:1:${#raw}-2}"
  elif [[ "$raw" =~ ^\'.*\'$ ]]; then
    raw="${raw:1:${#raw}-2}"
  fi

  printf '%s' "$raw"
}

quote_env_value() {
  local value="$1"
  if [[ "$value" =~ [[:space:]#\"\'] ]]; then
    value="${value//\\/\\\\}"
    value="${value//\"/\\\"}"
    printf '"%s"' "$value"
  else
    printf '%s' "$value"
  fi
}

build_mailer_env_patch() {
  local mail_host mail_port mail_user mail_pass mail_from app_web_url

  mail_host="$(read_dotenv_value MAIL_HOST)" \
    || die "в локальном .env нет MAIL_HOST"
  mail_port="$(read_dotenv_value MAIL_PORT)" \
    || die "в локальном .env нет MAIL_PORT"
  mail_user="$(read_dotenv_value MAIL_USER)" \
    || die "в локальном .env нет MAIL_USER"
  mail_pass="$(read_dotenv_value MAIL_PASS)" \
    || die "в локальном .env нет MAIL_PASS"
  mail_from="$(read_dotenv_value MAIL_FROM)" \
    || die "в локальном .env нет MAIL_FROM"

  app_web_url="${PROD_APP_WEB_URL%/}"

  ENV_PATCH_LOCAL="$(mktemp)"
  {
    printf 'APP_WEB_URL=%s\n' "$(quote_env_value "$app_web_url")"
    printf 'MAIL_HOST=%s\n' "$(quote_env_value "$mail_host")"
    printf 'MAIL_PORT=%s\n' "$(quote_env_value "$mail_port")"
    printf 'MAIL_USER=%s\n' "$(quote_env_value "$mail_user")"
    printf 'MAIL_PASS=%s\n' "$(quote_env_value "$mail_pass")"
    printf 'MAIL_FROM=%s\n' "$(quote_env_value "$mail_from")"
  } >"$ENV_PATCH_LOCAL"
}

setup_ssh_auth() {
  if [[ -z "${DEPLOY_SSH_PASSWORD:-}" ]]; then
    return 0
  fi

  if command -v sshpass >/dev/null 2>&1; then
    export SSHPASS="$DEPLOY_SSH_PASSWORD"
    SSH_PREFIX=(sshpass -e)
    SSH_OPTS+=(-o PreferredAuthentications=password -o PubkeyAuthentication=no)
    return 0
  fi

  ASKPASS_FILE="$(mktemp)"
  {
    printf '%s\n' '#!/bin/sh'
    printf "printf '%%s\\n' %q\n" "$DEPLOY_SSH_PASSWORD"
  } >"$ASKPASS_FILE"
  chmod 700 "$ASKPASS_FILE"
  export DISPLAY="${DISPLAY:-}"
  export SSH_ASKPASS="$ASKPASS_FILE"
  export SSH_ASKPASS_REQUIRE=force
  SSH_OPTS+=(-o PreferredAuthentications=password -o PubkeyAuthentication=no)
}

run_ssh() {
  if ((${#SSH_PREFIX[@]} > 0)); then
    "${SSH_PREFIX[@]}" ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"
  else
    ssh "${SSH_OPTS[@]}" "$REMOTE" "$@"
  fi
}

run_scp() {
  if ((${#SSH_PREFIX[@]} > 0)); then
    "${SSH_PREFIX[@]}" scp "${SSH_OPTS[@]}" "$@"
  else
    scp "${SSH_OPTS[@]}" "$@"
  fi
}

setup_ssh_auth

if [[ "${DEPLOY_SKIP_BUILD:-0}" != "1" ]]; then
  log "Build ${DEPLOY_IMAGE}"
  docker build --target=production -t "$DEPLOY_IMAGE" .
else
  log "Skip build (DEPLOY_SKIP_BUILD=1), use existing ${DEPLOY_IMAGE}"
  docker image inspect "$DEPLOY_IMAGE" >/dev/null 2>&1 \
    || die "локальный образ не найден: ${DEPLOY_IMAGE}"
fi

log "Pack image → ${TAR_LOCAL}"
docker save "$DEPLOY_IMAGE" | gzip -1 >"$TAR_LOCAL"
ls -lh "$TAR_LOCAL"

log "Upload image to ${REMOTE}"
run_scp "$TAR_LOCAL" "${REMOTE}:/tmp/my-master-api-app.tar.gz"

if [[ "${DEPLOY_SYNC_COMPOSE:-0}" == "1" ]]; then
  [[ -f "$DEPLOY_COMPOSE_FILE" ]] || die "нет файла ${DEPLOY_COMPOSE_FILE}"
  log "Upload ${DEPLOY_COMPOSE_FILE}"
  run_scp "$DEPLOY_COMPOSE_FILE" "${REMOTE}:${DEPLOY_DIR}/${DEPLOY_COMPOSE_FILE}"
fi

if [[ "${DEPLOY_SKIP_ENV_SYNC:-0}" != "1" ]]; then
  log "Sync mailer env → ${REMOTE}:${DEPLOY_DIR}/.env (APP_WEB_URL=${PROD_APP_WEB_URL%/})"
  build_mailer_env_patch
  run_scp "$ENV_PATCH_LOCAL" "${REMOTE}:/tmp/my-master-api-mailer.env.patch"
fi

log "Load image and recreate app on server"
# shellcheck disable=SC2087
run_ssh bash -s <<EOF
set -euo pipefail

SKIP_PRUNE=$(printf '%q' "${DEPLOY_SKIP_PRUNE:-0}")
SKIP_ENV_SYNC=$(printf '%q' "${DEPLOY_SKIP_ENV_SYNC:-0}")
DEPLOY_DIR_Q=$(printf '%q' "$DEPLOY_DIR")
COMPOSE_FILE_Q=$(printf '%q' "$DEPLOY_COMPOSE_FILE")
COMPOSE_BIN_Q=$(printf '%q' "$COMPOSE_BIN")
APP_PORT_Q=$(printf '%q' "$DEPLOY_APP_PORT")
HEALTH_PATH_Q=$(printf '%q' "$DEPLOY_HEALTH_PATH")

prune_dangling_images() {
  if [ "\$SKIP_PRUNE" = "1" ]; then
    return 0
  fi
  echo "==> Docker image prune (dangling)"
  docker image prune -f
  df -h / | tail -n 1 || true
}

upsert_env_file() {
  local target="\$1"
  local patch="\$2"
  local tmp key

  touch "\$target"
  tmp="\$(mktemp)"
  cp "\$target" "\$tmp"

  while IFS= read -r line || [ -n "\$line" ]; do
    [ -n "\$line" ] || continue
    key="\${line%%=*}"
    grep -vE "^\$\{key\}=" "\$tmp" >"\${tmp}.next" || true
    mv "\${tmp}.next" "\$tmp"
    printf '%s\n' "\$line" >>"\$tmp"
  done <"\$patch"

  mv "\$tmp" "\$target"
  rm -f "\$patch"
  echo "==> Updated mailer keys in \$target"
}

# Освобождаем место до load: на маленьком VPS tar (~300MB+) иначе не влезет.
prune_dangling_images

gunzip -c /tmp/my-master-api-app.tar.gz | docker load
rm -f /tmp/my-master-api-app.tar.gz

cd "\$DEPLOY_DIR_Q"

if [ "\$SKIP_ENV_SYNC" != "1" ]; then
  upsert_env_file "\$DEPLOY_DIR_Q/.env" /tmp/my-master-api-mailer.env.patch
fi

if [ -x "\$COMPOSE_BIN_Q" ]; then
  COMPOSE="\$COMPOSE_BIN_Q"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE=docker-compose
else
  COMPOSE='docker compose'
fi

\$COMPOSE -f "\$COMPOSE_FILE_Q" up -d --force-recreate --no-deps app

# После recreate старый :latest становится <none> — подчищаем.
prune_dangling_images

sleep 8
docker ps --filter name=my-master-api-app --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}'
echo '---LOGS---'
docker logs --tail=40 my-master-api-app 2>&1 || true
echo '---HEALTH---'
curl -sS -o /dev/null -w 'local:%{http_code}\n' --max-time 10 \
  "http://127.0.0.1:\${APP_PORT_Q}\${HEALTH_PATH_Q}" || true
EOF

log "Done: ${DEPLOY_IMAGE} → ${REMOTE}"
