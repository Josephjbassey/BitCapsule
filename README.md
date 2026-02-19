# ₿itCapsule: Temporal Protocol

BitCapsule is a cinematic temporal vault protocol built on **MIDL**. Secure Bitcoin and encrypted messages in the future, establishing immutable temporal anchors on both Bitcoin and EVM.

> "Time is the ultimate currency. Lock it. Store it. Transmit it."

## 🚀 Quick Start (Zero to Hero)

Follow these 4 steps to establish your temporal link:

### 1. Prerequisites
*   **Node.js** (v20 or higher)
*   **pnpm** (Install via `npm install -g pnpm`)
*   **Xverse Wallet** (Browser Extension)

### 2. Configure Your Wallet (CRITICAL)
BitCapsule operates on the **MIDL Regtest** network. You MUST switch your wallet:
1.  Open **Xverse**.
2.  Go to **Settings** -> **Network**.
3.  Select **Regtest**.
4.  Get testnet BTC from the [MIDL Faucet](https://faucet.staging.midl.xyz).

### 3. Setup the Project
```bash
git clone https://github.com/midl-xyz/dapp-demo.git
cd dapp-demo
pnpm install
cp apps/dapp/.env.example apps/dapp/.env.local
```
*Note: The default contract is pre-configured. Ensure `NEXT_PUBLIC_TIME_CAPSULE_ADDRESS` in `.env.local` matches the deployed contract (default: `0x9e0C...826E`).*

### 4. Launch Neural Interface
```bash
pnpm --filter @dapp-demo/dapp dev
```
Open **[http://localhost:3000](http://localhost:3000)**. **Welcome to the future.**

---

## ✨ Vault Protocols

*   **⏳ TEMPORAL**: Standard time-locked personal vaults.
*   **📜 LEGACY**: Dead Man's Switch. Requires a `ping()` every 365 days or the beneficiary can claim. Includes IPFS metadata archiving.
*   **🛡️ HODL**: Disciplinary lockers. Early withdrawal (Force Crack/Panic) incurs a **20% Protocol Fee**.
*   **🎁 SOCIAL**: Encrypted peer-to-peer temporal gifting for specific beneficiaries. Supports EVM and Bitcoin addresses.

## 🛠 Advanced Features

### 🏷️ Metadata Labeling
Identify your vaults with public labels (e.g., "Kids College Fund") while keeping the contents encrypted until the temporal lock expires.

### ⚡ Cinematic UI & Micro-Animations
Experience the protocol through a high-fidelity terminal interface. Every interaction features tactile feedback, from the slow-crawling protocol load bars to holographic card hover effects.

---

## 🔧 Troubleshooting Wallet Connection

*   **"Invalid PSBT"**: This usually means your wallet is on the wrong network or lacks sufficient BTC. Switch to **Regtest** and use the faucet.
*   **Stuck on "Connecting"**: Use the **"Initialize Network"** button on the connect screen to force a network sync with Xverse.
*   **Sync Issues**: Click the **SYNC** button in the Archive header to re-fetch your temporal anchors from the blockchain.

---

## 👥 Contributors & Roles

The **BitCapsule** protocol was forged through the synergy of human vision and artificial intelligence:

*   **Project Lead & Visionary**: [The User] - Defined the core protocol requirements, visual aesthetic, and strategic direction.
*   **Jules (AI)**: **Lead Software Engineer** - Responsible for protocol development, smart contract integration, and full-stack implementation of the temporal interface.
*   **Stitch (AI)**: **UI/UX Design Lead** - Crafted the cinematic visual language, high-fidelity components, and interactive micro-animations.
*   **enebhee**: **Strategic Planning & Lead Quality Assurance** - Spearheaded strategy development and performed rigorous bug testing to ensure protocol stability.

---
*Built with the [MIDL SDK](https://js.midl.xyz/). Powered by Bitcoin.*
