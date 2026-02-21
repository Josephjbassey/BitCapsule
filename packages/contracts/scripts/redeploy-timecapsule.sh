#!/usr/bin/env bash
set -euo pipefail

# Redeploy TimeCapsule (immutable contract) and optionally update dApp env.
# Usage:
#   ./packages/contracts/scripts/redeploy-timecapsule.sh
#   ./packages/contracts/scripts/redeploy-timecapsule.sh --network regtest --reset --update-env

NETWORK="regtest"
UPDATE_ENV="false"
RESET="true"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --network)
      NETWORK="${2:?missing network name}"
      shift 2
      ;;
    --update-env)
      UPDATE_ENV="true"
      shift
      ;;
    --reset)
      RESET="true"
      shift
      ;;
    --no-reset)
      RESET="false"
      shift
      ;;
    -h|--help)
      cat <<'USAGE'
Redeploy TimeCapsule and print the new address.

Options:
  --network <name>   Hardhat network to deploy to (default: regtest)
  --reset            Force redeployment (default behavior)
  --no-reset         Disable forced redeployment and allow idempotent deploy
  --update-env       Also write NEXT_PUBLIC_TIME_CAPSULE_ADDRESS to apps/dapp/.env.local
  -h, --help         Show this help
USAGE
      exit 0
      ;;
    *)
      echo "Unknown arg: $1" >&2
      exit 1
      ;;
  esac
done

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
CONTRACTS_DIR="$ROOT_DIR/packages/contracts"
DEPLOYMENT_FILE="$CONTRACTS_DIR/deployments/TimeCapsule.json"
DAPP_ENV_FILE="$ROOT_DIR/apps/dapp/.env.local"

cd "$CONTRACTS_DIR"

echo "[1/3] Redeploying TimeCapsule on network '$NETWORK'..."
DEPLOY_CMD=(pnpm exec hardhat deploy --network "$NETWORK")
if [[ "$RESET" == "true" ]]; then
  DEPLOY_CMD+=(--reset)
fi
"${DEPLOY_CMD[@]}"

if [[ ! -f "$DEPLOYMENT_FILE" ]]; then
  echo "Deployment file not found: $DEPLOYMENT_FILE" >&2
  exit 1
fi

NEW_ADDRESS="$(node -e "const fs=require('fs');const f=process.argv[1];const d=JSON.parse(fs.readFileSync(f,'utf8'));if(!d.address){process.exit(2)};process.stdout.write(d.address);" "$DEPLOYMENT_FILE")"

echo "[2/3] New TimeCapsule address: $NEW_ADDRESS"

echo "[3/3] Next steps:"
echo "  - Update app config to use this address"
echo "  - Keep existing capsules on old contract (immutable), new capsules on new contract"

if [[ "$UPDATE_ENV" == "true" ]]; then
  mkdir -p "$(dirname "$DAPP_ENV_FILE")"
  if [[ -f "$DAPP_ENV_FILE" ]]; then
    if rg -q '^NEXT_PUBLIC_TIME_CAPSULE_ADDRESS=' "$DAPP_ENV_FILE"; then
      perl -0pi -e "s#^NEXT_PUBLIC_TIME_CAPSULE_ADDRESS=.*#NEXT_PUBLIC_TIME_CAPSULE_ADDRESS=$NEW_ADDRESS#m" "$DAPP_ENV_FILE"
    else
      printf '\nNEXT_PUBLIC_TIME_CAPSULE_ADDRESS=%s\n' "$NEW_ADDRESS" >> "$DAPP_ENV_FILE"
    fi
  else
    printf 'NEXT_PUBLIC_TIME_CAPSULE_ADDRESS=%s\n' "$NEW_ADDRESS" > "$DAPP_ENV_FILE"
  fi

  echo "Updated: $DAPP_ENV_FILE"
fi
