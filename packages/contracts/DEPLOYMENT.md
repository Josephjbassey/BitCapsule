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

---

## 3. Deployment

### Step C: Clean Previous Deployments (Optional)
If you've deployed before and want a fresh start:
```bash
rm -rf ./deployments
```

### Step D: Deploy to Regtest
```bash
pnpm exec hardhat deploy --network regtest
```

### Step E: Verify (Optional)
To verify your contract source code on the block explorer:
```bash
pnpm exec hardhat verify --network regtest <CONTRACT_ADDRESS>
```

---

## 4. Update the Frontend

Once your contracts are deployed, you must update the dApp to point to your new `TimeCapsule` address.

1.  Find the `TimeCapsule` address in the deployment logs (or in `deployments/TimeCapsule.json`).
2.  Open `apps/dapp/.env.local`.
3.  Update the `NEXT_PUBLIC_TIME_CAPSULE_ADDRESS` variable:
    ```env
    NEXT_PUBLIC_TIME_CAPSULE_ADDRESS=0xYourNewContractAddress
    ```
4.  Rebuild or restart your dApp.

---
**Note**: If you see an error like "No Hardhat config file found", ensure you are running the command from inside the `packages/contracts` folder.
