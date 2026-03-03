#!/usr/bin/env bash
set -euo pipefail

SERVER_IP="${SERVER_IP:-${1:-}}"
REMOTE_USER="${REMOTE_USER:-ceumass}"
REMOTE_APP_DIR="${REMOTE_APP_DIR:-/var/www/cmm-react}"
ARCHIVE_NAME="${ARCHIVE_NAME:-app.zip}"

if [[ -z "${SERVER_IP}" ]]; then
  echo "Usage: SERVER_IP=<ip> $0"
  echo "   or: $0 <ip>"
  exit 1
fi

if command -v npm >/dev/null 2>&1; then
  NPM_BIN="$(command -v npm)"
elif [[ -x "/home/pablo/.nvm/versions/node/v22.17.0/bin/npm" ]]; then
  NPM_BIN="/home/pablo/.nvm/versions/node/v22.17.0/bin/npm"
else
  echo "Error: npm not found in PATH and fallback npm binary not available."
  exit 1
fi

echo "Building app with: ${NPM_BIN}"
"${NPM_BIN}" run build

echo "Creating archive: ${ARCHIVE_NAME}"
rm -f "${ARCHIVE_NAME}"
zip -rq "${ARCHIVE_NAME}" dist/

echo "Uploading archive to ${REMOTE_USER}@${SERVER_IP}:/tmp/"
scp "${ARCHIVE_NAME}" "${REMOTE_USER}@${SERVER_IP}:/tmp/"

echo "Deploying on remote host..."
ssh "${REMOTE_USER}@${SERVER_IP}" <<EOF
set -euo pipefail
cd "${REMOTE_APP_DIR}"
mv "/tmp/${ARCHIVE_NAME}" "./${ARCHIVE_NAME}"
rm -rf dist/
unzip -oq "${ARCHIVE_NAME}"
EOF

echo "Deployment completed successfully."

