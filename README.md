# BitCapsule // SECURE CHANNEL V.4.1.0

BitCapsule is a cinematic temporal vault protocol built on **MIDL**. Secure Bitcoin and encrypted messages in the future, establishing immutable temporal anchors on both Bitcoin and EVM.

## 🚀 Quick Start (Production/Staging)

### 1. Prerequisites
- **Node.js** (v18+) & **pnpm**
- **Xverse Wallet** (Ensure it is set to **Regtest** in Settings -> Network)

### 2. Environment Setup
Clone and configure the secure channel:
```bash
pnpm install
cp apps/dapp/.env.example apps/dapp/.env.local
```
*Note: The default TimeCapsule address is 0x9e0C...826E on MIDL Regtest.*

### 3. Launch the Protocol
```bash
pnpm --filter @dapp-demo/dapp dev
```
Open [http://localhost:3000](http://localhost:3000) - Neural Sync Initiated.

---

## 🔐 Network Configuration (Important)
To interact with BitCapsule, your wallet must be synced to the **MIDL Regtest** network.
- **Network Name**: MIDL Regtest (appears as Regtest in Xverse)
- **Chain ID**: 420
- **RPC URL**: `https://rpc.staging.midl.xyz`
- **Explorer**: `https://blockscout.staging.midl.xyz`
- **Faucet**: [https://faucet.staging.midl.xyz](https://faucet.staging.midl.xyz)

---

## 🛠 Project Architecture
- `apps/dapp`: Next.js 15+ Frontend with Tailwind CSS v4.
- `packages/contracts`: Solidity protocol logic (Hardhat).

---

## 📜 Deployment
For deploying your own instance of the protocol, see [packages/contracts/DEPLOYMENT.md](./packages/contracts/DEPLOYMENT.md).

## ✨ Core Protocols
- **⏳ TEMPORAL**: Time-locked personal vaults.
- **📜 LEGACY**: Dead Man's Switch for decentralized inheritance.
- **🛡️ HODL**: Disciplinary lockers with a 20% Panic Button fee.
- **🎁 SOCIAL**: Encrypted peer-to-peer temporal gifting.

---
*Built with MIDL SDK. Verified Secure Channel Active.*
