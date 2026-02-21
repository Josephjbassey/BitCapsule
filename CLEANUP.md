# BitCapsule Environment Maintenance

To ensure your local environment is clean and correctly synchronized with the latest contract deployments and protocol logic, run the following commands:

## 1. System Purge
Wipe all legacy artifacts, caches, and deployments:

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
Deploy a fresh set of contracts to regtest:

```bash
cd packages/contracts
pnpm exec hardhat deploy --network regtest
```

---
*Note: Ensure 'MNEMONIC' is set in your Hardhat configuration variables before deployment.*
