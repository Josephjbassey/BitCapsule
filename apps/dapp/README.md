# BitCapsule DApp

This is the frontend for BitCapsule, a temporal vault application built on the MIDL ecosystem.

## Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env.local` and ensure `NEXT_PUBLIC_TIME_CAPSULE_ADDRESS` is set.
   ```bash
   cp .env.example .env.local
   ```

3. **Run Development Server**:
   ```bash
   pnpm dev
   ```

## Wallet Integration

BitCapsule uses `@midl/satoshi-kit` for wallet connections. It supports:
- **Xverse**: (Recommended) Full support for Bitcoin and EVM transactions.
- **UniSat**: Supported for Bitcoin-compatible operations.
- **Leather**: Supported for Bitcoin-compatible operations.

### Network Configuration (Regtest)
The DApp is configured to use the **MIDL Regtest** network.
- **RPC**: `https://rpc.staging.midl.xyz`
- **Chain ID**: `420`
- **Explorer**: `https://blockscout.staging.midl.xyz`

## Tech Stack
- **Next.js 15+** (App Router)
- **Tailwind CSS v4**
- **Wagmi & TanStack Query**
- **@midl/satoshi-kit & @midl/executor-react**
