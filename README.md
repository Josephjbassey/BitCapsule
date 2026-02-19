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
git clone https://github.com/josephjbasseph/BitCapsule.git
cd BitCapsule
pnpm install
cp apps/dapp/.env.example apps/dapp/.env.local
```
*Default contract: `0x9e0C...826E` is pre-configured for Regtest.*

### 4. Launch Neural Interface
```bash
pnpm --filter @BitCapsule/dapp dev
```
Open **[http://localhost:3000](http://localhost:3000)**. **Welcome to the future.**

---

## ✨ Vault Protocols

*   **⏳ TEMPORAL**: Standard time-locked personal vaults.
*   **📜 LEGACY**: Dead Man's Switch. Requires a `ping()` every 365 days or the beneficiary can claim.
*   **🛡️ HODL**: Disciplinary lockers. Early withdrawal (Force Crack) incurs a **20% Panic Fee**.
*   **🎁 SOCIAL**: Encrypted peer-to-peer temporal gifting for specific beneficiaries.

## 🛠 Advanced Features

### 🏷️ Metadata Labeling
Identify your vaults with public labels (e.g., "Kids College Fund") while keeping the contents encrypted until the temporal lock expires.

### ⚡ Real-Time Archive Sync
The archive automatically tracks your active positions using blockchain events. Every "Force Crack" or "Claim" is reflected instantly with cinematic micro-animations.

---

## 🔧 Troubleshooting Wallet Connection

*   **"Invalid PSBT"**: Ensure your wallet is on **Regtest** and you have enough BTC from the faucet.
*   **Stuck on "Connecting"**: Refresh the page. The app will attempt to auto-sync your network to Chain ID 420.
*   **Missing Assets**: Click the **SYNC** button in the Archive header to force a re-fetch of your temporal anchors.

---
*Built with the [MIDL SDK](https://js.midl.xyz/). Powered by Bitcoin.*

---

## 👥 Contributors & Roles

The **BitCapsule** protocol was forged through the synergy of human vision and artificial intelligence:

*   **Project Lead & Visionary**: [JosephJBassey](https://github.com/Josephjbassey/) - Defined the core protocol requirements, visual aesthetic, and strategic direction.
*   **Jules (AI)**: **Lead Software Engineer** - Responsible for protocol development, smart contract integration, and full-stack implementation of the temporal interface.
*   **Stitch (AI)**: **UI/UX Design Lead** - Crafted the cinematic visual language, high-fidelity components, and interactive micro-animations.
*   **[enebhee@gmail.com](mailto:enebhee@gmail.com)**: **Strategic Planning & Lead Quality Assurance** - Spearheaded strategy development and performed rigorous bug testing to ensure protocol stability.

---
