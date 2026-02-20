# ⚡ BitCapsule: Temporal Setup Guide

Follow these steps to initialize your BitCapsule node and connect to the Temporal Network (MIDL Regtest).

## 1. Network Configuration
Add the **MIDL Regtest** network to your wallet (Xverse, Unisat, or MetaMask):
- **Network Name:** MIDL Regtest
- **RPC URL:** `https://rpc.staging.midl.xyz`
- **Chain ID:** `420`
- **Currency Symbol:** `BTC`
- **Explorer:** `https://blockscout.staging.midl.xyz`

## 2. Refuel (Faucet)
You need testnet BTC to seal vaults.
1. Copy your Bitcoin address (Taproot/Segwit).
2. Visit [https://faucet.staging.midl.xyz](https://faucet.staging.midl.xyz).
3. Request a refuel.

## 3. Deployment (Optional)
If you want to deploy your own TimeCapsule contract:
```bash
cd packages/contracts
pnpm hardhat deploy --network regtest
```
Then update `NEXT_PUBLIC_TIME_CAPSULE_ADDRESS` in `apps/dapp/.env.local`.

## 4. Launching the App
```bash
pnpm install
pnpm --filter @dapp-demo/dapp dev
```

## 5. Protocol Features
- **Temporal Vault:** Basic time-locked savings.
- **Legacy Switch:** Automated inheritance (files metadata + beneficiary).
- **HODL Locker:** 20% "Panic Button" fee for early withdrawal.
- **Social Gift:** P2P transfer locked by time.

---
*BitCapsule OS v1.2.0-stable*
