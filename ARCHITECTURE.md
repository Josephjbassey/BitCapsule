# BitCapsule Technical Architecture

## 1. Metadata Serialization (The "Label" Hack)

Since the `TimeCapsule` contract only has a `message` string field, we implement a protocol-level metadata standard to support labels and hidden payloads.

### Pseudocode: Creating a Vault
```typescript
function createVault(label, secret, unlockTime, amount) {
  // 1. Serialize metadata
  const messagePayload = JSON.stringify({
    label: label || "Unnamed Vault",
    secret: secret
  });

  // 2. Prepare transaction
  const intent = {
    method: "createCapsule",
    args: [
      TOKEN_ZERO,
      amount,
      unlockTime,
      beneficiary,
      VaultType.TEMPORAL,
      messagePayload // Serialized string
    ],
    deposit: true, // BTC funding required
    satoshis: amount / 10**10
  };

  return broadcast(intent);
}
```

## 2. Event Reconciliation (Temporal Sync)

The UI must reflect the current state of the blockchain. Since vaults aren't "deleted" from the event history, we reconcile them on the client.

### Pseudocode: Syncing Archive
```typescript
async function fetchActiveVaults(userAddress) {
  // 1. Fetch all lifecycle logs
  const [created, claimed, withdrawn] = await Promise.all([
    getLogs("CapsuleCreated", { owner: userAddress }),
    getLogs("CapsuleClaimed", { owner: userAddress }),
    getLogs("EarlyWithdrawal", { owner: userAddress })
  ]);

  // 2. Identify terminated vault IDs
  const terminatedIds = new Set([
    ...claimed.map(l => l.args.id.toString()),
    ...withdrawn.map(l => l.args.id.toString())
  ]);

  // 3. Filter for active positions
  const activeVaults = created.filter(l =>
    !terminatedIds.has(l.args.id.toString())
  );

  return activeVaults;
}
```

## 3. Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4 (Cinematic Theme)
- **Web3**:
  - `@midl/satoshi-kit`: Connection and Network management.
  - `@midl/executor-react`: Intent-based transaction broadcasting.
  - `viem/wagmi`: Blockchain data fetching and log parsing.
- **Contract**: `TimeCapsule.sol` (deployed on MIDL Regtest).

## 4. Security Protocols

- **AES-256 Simulation**: While the payload is stored on-chain, the UI simulates a neural-link encryption state.
- **Panic Mechanism**: HODL vaults enforce discipline via a 20% protocol fee for early unlocking.
- **Dead Man's Switch**: LEGACY vaults monitor the `lastPing` timestamp. If > 365 days, the protocol allows beneficiary claims.
