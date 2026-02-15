# BitCapsule: Cinematic Temporal Vaults on Bitcoin

BitCapsule is a next-generation dApp built on the MIDL ecosystem, allowing users to secure Bitcoin and messages in temporal vaults. Whether for personal growth, legacy planning, or social gifting, BitCapsule leverages Bitcoin's security and MIDL's execution layer to provide a cinematic Web3 experience.

## 🚀 Quick Start (Zero to Hero)

### 1. Prerequisites
- **Node.js** (v18+)
- **pnpm** (`npm install -g pnpm`)
- **Xverse Wallet** (or UniSat/Leather) browser extension.

### 2. Installation
```bash
pnpm install
```

### 3. Environment Setup
Copy the example environment file and ensure the contract addresses are correct:
```bash
cp apps/dapp/.env.example apps/dapp/.env.local
```

### 4. Running the Development Server
```bash
pnpm --filter @dapp-demo/dapp dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Wallet Setup (Regtest)
To use BitCapsule in the staging/regtest environment:
1. Open your **Xverse Wallet**.
2. Go to **Settings** -> **Network** -> **Change Network**.
3. Select **Regtest** (or the MIDL Staging network if configured).
4. Get test tokens from the [MIDL Faucet](https://faucet.staging.midl.xyz/).

---

## 🛠 Project Structure
This is a monorepo managed by `pnpm`:
- `apps/dapp`: Next.js frontend using Tailwind CSS v4, Wagmi, and `@midl/satoshi-kit`.
- `packages/contracts`: Solidity smart contracts (TimeCapsule, Vault) deployed on the MIDL EVM.

---

## ✨ Features & Use Cases

### ⏳ Temporal Vaults (Personal Growth)
Lock a message and BTC for your future self. Use it for goal accountability or as a digital time capsule.

### 📜 Legacy Protocol (Inheritance)
Designated beneficiaries can claim the vault if the owner doesn't "check in" (ping) for 365 days. A decentralized "Dead Man's Switch".

### 🛡️ Forced HODL (Discipline)
Lock your assets to prevent "paper hands". If you absolutely must withdraw early, a 20% "Panic Button" fee applies.

### 🎁 Social Gifting
Send timed gifts to friends' EVM addresses. They can see the gift but can only open it after the unlock date.

---

## 🎨 Design & UX
BitCapsule features a **cinematic cyberpunk UI** with:
- **Responsive Layout**: Works on desktop and mobile.
- **Micro-Animations**: Subtle glows, hover scales, and fluid transitions.
- **Robust Wallet Connection**: Support for Xverse, UniSat, and Leather wallets via `@midl/satoshi-kit`.
- **Temporal Sync Overlay**: Real-time feedback during transaction signing and broadcasting.

---

## 📖 Learn More
- [MIDL Documentation](https://js.midl.xyz/)
- [SatoshiKit Guide](https://js.midl.xyz/satoshi-kit/)
