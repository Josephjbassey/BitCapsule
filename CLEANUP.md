# BitCapsule Environment Maintenance

To ensure your local environment is clean and correctly synchronized with the latest contract deployments and protocol logic, run the following commands:

## 1. System Purge
Wipe all legacy artifacts, caches, and deployments.

**⚠️ Warning:** This step deletes the committed `./deployments` directory which contains the dApp's current contract addresses and ABIs. After purging, you **must** re-run the deployment and commit the newly generated artifacts back to the repository so the frontend remains in sync.

```bash
cd packages/contracts
rm -rf ./artifacts ./cache ./deployments
pnpm exec hardhat clean --network regtest
```

## 2. Refresh Dependencies
Ensure the workspace links and SDK overrides are correctly applied:

```bash
pnpm install
```

## 3. Deployment
Deploy a fresh set of contracts to regtest and update the artifacts:

```bash
cd packages/contracts
pnpm exec hardhat deploy --network regtest
# IMPORTANT: Commit the new files in packages/contracts/deployments to the repo!
```

---
*Note: `hardhat.config.ts` uses a default regtest/test mnemonic if the 'MNEMONIC' variable is not set. Setting 'MNEMONIC' via `npx hardhat vars set MNEMONIC` is only required if you need to override the default for custom or non-test accounts. Deployments will function on regtest with the default mnemonic out-of-the-box.*
