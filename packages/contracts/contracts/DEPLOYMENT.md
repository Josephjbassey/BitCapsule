# BitCapsule Smart Contract Deployment Guide

This guide will walk you through the process of deploying the BitCapsule smart contracts (TimeCapsule and Vault) to the MIDL Regtest network.

## 1. Prerequisites

- **Node.js** (v18+)
- **pnpm** (`npm install -g pnpm`)
- **A Mnemonic Phrase**: You will need a 12 or 24-word seed phrase. You can generate one using a wallet like Xverse or MetaMask, or use a tool like [iancoleman.io/bip39/](https://iancoleman.io/bip39/) (offline is safer).

## 2. Wallet Setup for Deployment

For deployment, you don't necessarily need a browser extension, but it's helpful to have your account imported into **Xverse** (recommended) or **MetaMask** to view your balance and verify deployment.

1.  **Get a Mnemonic**: Ensure you have a mnemonic that has some **Regtest BTC** on the MIDL network.
2.  **Get Test Tokens**: Use the [MIDL Faucet](https://faucet.staging.midl.xyz/) to fund your address.
    - Note: The deployer address is derived from the first account of your mnemonic (index 0).

## 3. Environment Configuration

The deployment process uses Hardhat's secure variable storage. Set your mnemonic by running:

```bash
npx hardhat vars set MNEMONIC
```
*You will be prompted to enter your seed phrase securely.*

## 4. Install Dependencies

Navigate to the contracts package and install dependencies:

```bash
cd packages/contracts
pnpm install
```

## 5. Deploy the Contracts

Before deploying, it's recommended to clean old deployment artifacts:

```bash
rm -rf ./deployments
```

Run the deployment command:

```bash
pnpm hardhat deploy --network regtest
```

### What happens during deployment?
- **Vault.sol** is deployed first.
- **TimeCapsule.sol** is deployed second, using the Vault's address (or treasury address) in its constructor.
- Deployment details (ABI and addresses) are saved to the `deployments/` directory.

## 6. Post-Deployment: Update the dApp

Once your contracts are deployed, you need to tell the frontend where to find them.

1.  Copy the address of the newly deployed `TimeCapsule` contract from the console output.
2.  Open `apps/dapp/.env.local`.
3.  Update the `NEXT_PUBLIC_TIME_CAPSULE_ADDRESS` variable:
    ```env
    NEXT_PUBLIC_TIME_CAPSULE_ADDRESS=0xYourNewContractAddress
    ```
4.  Restart your dApp development server.

## 7. Verification (Optional)

To verify your contract source code on the block explorer:

```bash
pnpm hardhat verify --network regtest <CONTRACT_ADDRESS>
```

---
**Note**: Deployment to `regtest` is intended for development and testing. For production, the process is similar but requires a different network configuration and real assets.
