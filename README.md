# dApp Demo

This repository contains a simple dApp demo that showcases the use of a vault contract for depositing and withdrawing Bitcoin Runes, as well as implementing various use cases like the "Temporal Archive" and "Legacy Protocol".

## Use Cases

### 1. The "Temporal Archive" (Personal Growth)
- **Goal Accountability**: Users lock a message ("I will finish my Python course by June") along with a small amount of BTC. If they stay disciplined, they claim their reward later; it’s financial skin-in-the-game for personal growth.
- **Letter to Future Self**: Storing emotional milestones, photos, or voice notes that only unlock on a specific anniversary or a milestone birthday (e.g., turning 21).

### 2. The "Legacy Protocol" (Inheritance & Security)
- **Digital Will & Testament**: Storing high-value secrets or legal instructions. By using IPFS, you store the document hash on-chain, proving the document existed and wasn't tampered with.
- **The "Dead Man's Switch"**: If a user doesn't "check in" with the app for a year, the vault automatically unlocks for a designated Beneficiary (a family member's wallet address).
- **Patent & IP Protection**: Inventors can "Seal" their designs or lyrics in a vault. If a legal dispute happens later, the blockchain timestamp proves they had the idea first.

### 3. Financial Utilities (DeFi)
- **Forced HODL (Discipline)**: Preventing "paper hands" during market volatility by locking Bitcoin in a vault that physically cannot be opened until a target date.
- **The Panic Button**: An emergency utility that allows users to "Break the Glass" and withdraw funds early, but only by paying a 20% penalty fee that goes back to the Midl treasury.

### 4. Social & Gifting
- **Timed Gifts**: Sending Bitcoin to a friend that they can see in their wallet immediately, but can only "Open" on their wedding day or graduation.
- **Proof of Prediction**: A "Vibe" feature where traders seal a price prediction. When the date arrives, they "Breach" the vault to prove to their followers they were right all along.

## Installation

To install the necessary dependencies for this project, run the following command:

```bash
pnpm install
```

## Development

The repository is a monorepo managed by [pnpm](https://pnpm.io/) and consists of the following packages:

- `contracts`: Contains the smart contracts for the dApp.
- `dapp`: Contains the frontend application that interacts with the smart contracts.

### Compiling and deploying contracts

Please read the [contracts README](packages/contracts/README.md) for instructions on how to compile and deploy the smart contracts.

### Running the dApp

To run the dApp, navigate to the `dapp` package and start the development server:

```bash
cd apps/dapp
pnpm dev
```

### Interacting with the dApp

Once the dApp is running, you can interact with it through your web browser. The dApp allows you to deposit and withdraw Bitcoin Runes from the vault contract.

#### Pre-requisites

Ensure you have Runes in your wallet and they have been added to the MIDL ecosystem.

1. Install the [XVerse wallet](https://xverse.app/) to manage your Runes and connect to the dApp.
2. Get tBTC from the [MIDL Faucet](https://faucet.staging.midl.xyz/).
3. Etch (mint) Runes with [MIDL Token Minter](https://runes.midl.xyz/)

##### Steps to interact with the dApp

1. Open your browser and navigate to `http://localhost:3000`.
2. Connect your wallet (e.g., XVerse).
3. Use the dApp to deposit and withdraw Bitcoin Runes from the vault.
4. You can view the transaction history on [Mempool](http://mempool.staging.midl.xyz) and on the [MIDL Explorer](https://blockscout.staging.midl.xyz/).
