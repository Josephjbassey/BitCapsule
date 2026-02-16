# ₿itCapsule: Temporal Protocol

BitCapsule is a cinematic temporal vault protocol built on **MIDL**. Secure Bitcoin and encrypted messages in the future, establishing immutable temporal anchors on both Bitcoin and EVM.

> "Time is the ultimate currency. Lock it. Store it. Transmit it."

## 🚀 Zero to Hero: Getting Started

### 1. Prerequisites
- **Node.js** (v20+) & **pnpm**
- **Xverse Wallet** installed in your browser.

### 2. Wallet Configuration
To interact with BitCapsule, you must configure Xverse for the **MIDL Regtest** network:
1. Open Xverse Settings.
2. Go to **Network**.
3. Select **Regtest**.
4. Fund your address using the [MIDL Faucet](https://faucet.staging.midl.xyz).

### 3. Rapid Deployment
Clone and configure the secure channel:
```bash
git clone https://github.com/midl-xyz/dapp-demo.git
cd dapp-demo
pnpm install
cp apps/dapp/.env.example apps/dapp/.env.local
```
*Note: The system uses 0x9e0C...826E on MIDL Regtest by default.*

### 4. Initiate Interface
```bash
pnpm --filter @dapp-demo/dapp dev
```
Open [http://localhost:3000](http://localhost:3000) - **Neural Sync Initiated.**

---

## ✨ Core Protocols

- **⏳ TEMPORAL**: Standard time-locked personal vaults.
- **📜 LEGACY**: Dead Man's Switch. Requires a `ping()` every 365 days or the beneficiary can claim.
- **🛡️ HODL**: Disciplinary lockers. Early withdrawal (Force Crack) incurs a **20% Panic Fee**.
- **🎁 SOCIAL**: Encrypted peer-to-peer temporal gifting for specific beneficiaries.

## 🛠 Advanced Features

### 🏷️ Vault Labeling
BitCapsule now supports **Metadata Labeling**. When creating a vault, you can provide a public label (visible in the archive) while keeping the actual payload encrypted until the unlock timestamp is reached.

### ⚡ Temporal Sync (Archive)
The archive automatically tracks your active positions.
- **Active Vaults**: View all your locked and ready-to-claim vaults.
- **Real-time Updates**: The interface polls for contract events to ensure your "Force Crack" or "Claim" actions are reflected immediately.
- **Micro-animations**: Every interaction is met with haptic-like visual feedback.

---

## 🔐 Network Technical Specifications
- **Network Name**: MIDL Regtest
- **Chain ID**: 420
- **Currency**: BTC
- **RPC**: `https://rpc.staging.midl.xyz`
- **Explorer**: [https://blockscout.staging.midl.xyz](https://blockscout.staging.midl.xyz)

---
*Built with the MIDL SDK. Powered by Bitcoin.*
