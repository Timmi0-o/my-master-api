#!/bin/sh
set -eu

: "${TURN_EXTERNAL_IP:?TURN_EXTERNAL_IP is required}"
: "${TURN_USERNAME:?TURN_USERNAME is required}"
: "${TURN_PASSWORD:?TURN_PASSWORD is required}"
TURN_REALM="${TURN_REALM:-my-crazy-master.ru}"

# Inside Docker bridge NAT advertise public IP while binding relay on container IP.
TURN_RELAY_IP="$(hostname -i 2>/dev/null | awk '{print $1}')"
if [ -z "${TURN_RELAY_IP}" ]; then
  TURN_RELAY_IP=0.0.0.0
fi

cat >/tmp/turnserver.conf <<EOF
listening-port=3478
listening-ip=0.0.0.0
min-port=49160
max-port=49200
fingerprint
lt-cred-mech
user=${TURN_USERNAME}:${TURN_PASSWORD}
external-ip=${TURN_EXTERNAL_IP}/${TURN_RELAY_IP}
realm=${TURN_REALM}
no-cli
no-multicast-peers
no-tls
no-dtls
log-file=stdout
simple-log
EOF

exec turnserver -c /tmp/turnserver.conf
