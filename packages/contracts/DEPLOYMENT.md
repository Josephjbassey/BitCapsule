# BitCapsule Smart Contract Deployment Guide

This guide will walk you through the process of deploying the BitCapsule smart contracts (TimeCapsule and Vault) to the MIDL Regtest network.

## 1. Prerequisites

- **Node.js** (v18+)
- **pnpm** (`npm install -g pnpm`)
- **A Mnemonic Phrase**: You will need a 12 or 24-word seed phrase.

## 2. Setup Procedure

**IMPORTANT**: All following commands must be executed within the `packages/contracts` directory.

```bash
cd packages/contracts
```

### Step A: Install Dependencies
```bash
pnpm install
```

### Step B: Configure Wallet Mnemonic
Set your mnemonic as a Hardhat configuration variable. This is stored securely on your local machine.

```bash
pnpm exec hardhat vars set MNEMONIC
```
*When prompted, paste your 12 or 24-word seed phrase.*

### Step C: Verify Your Addresses
To see the addresses for your `deployer` and `treasury` wallets (derived from your mnemonic):

```bash
pnpm exec hardhat list-accounts
```
- **deployer**: Used to pay for deployment gas.
- **treasury**: Receives protocol fees (20% panic withdrawal fee).

---

## 3. Deployment

### Step D: Clean Previous Deployments (Optional)
If you've deployed before and want a fresh start, or if you want to see the deployment logs again:
```bash
rm -rf ./deployments
```

### Step E: Deploy to Regtest
```bash
pnpm exec hardhat deploy --network regtest
```

**Note on Output**: Hardhat-deploy is idempotent. If the bytecode hasn't changed, it won't redeploy. Use the `---reset` flag to force a redeployment:
```bash
pnpm exec hardhat deploy --network regtest --reset
```

### Step F: Verify (Optional)
To verify your contract source code on the block explorer:
```bash
pnpm exec hardhat verify --network regtest <CONTRACT_ADDRESS>
```

---

## 4. Update the Frontend

Once your contracts are deployed, you must update the dApp to point to your new `TimeCapsule` address.

1.  Find the `TimeCapsule` address in the deployment logs (or in `deployments/regtest/TimeCapsule.json`).
2.  Open `apps/dapp/.env.local`.
3.  Update the `NEXT_PUBLIC_TIME_CAPSULE_ADDRESS` variable:
    ```env
    NEXT_PUBLIC_TIME_CAPSULE_ADDRESS=0xYourNewContractAddress
    ```
4.  Rebuild or restart your dApp.

---
**Troubleshooting**:
- **"No Hardhat config file found"**: Ensure you are running the command from inside the `packages/contracts` folder.
- **Address "undefined" is invalid**: This usually means `namedAccounts` in `hardhat.config.ts` is misconfigured. Ensure you are using the latest version of the config.
