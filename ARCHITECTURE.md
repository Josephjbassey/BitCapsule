# BitCapsule Technical Architecture

## 1. Metadata Serialization (The "Label" Hack)

Since the `TimeCapsule` contract only has a `message` string field, we implement a protocol-level metadata standard to support labels, hidden payloads, and file metadata.

### Pseudocode: Creating a Vault
```typescript
function createVault(label, secret, file, unlockTime, amount) {
  // 1. Serialize metadata
  const messagePayload = JSON.stringify({
    label: label || "Unnamed Vault",
    secret: secret,
    file: file ? { name: file.name, size: file.size } : null,
    amount: amount // Stored for display upon reveal
  });

  // 2. Prepare transaction
  const intent = {
    method: "createCapsule",
    args: [
      TOKEN_ZERO,
      amount,
      unlockTime,
      beneficiary,
      vaultType,
      messagePayload
    ],
    deposit: true,
    satoshis: amount / 10**10
  };

  return broadcast(intent);
}
```

## 2. Event Reconciliation (Temporal Sync)

The UI reconciles state on-client by fetching all lifecycle logs.

### Pseudocode: Syncing Archive
```typescript
async function fetchActiveVaults(userAddress) {
  const [created, claimed, withdrawn] = await Promise.all([
    getLogs("CapsuleCreated", { owner: userAddress }),
    getLogs("CapsuleClaimed", { owner: userAddress }),
    getLogs("EarlyWithdrawal", { owner: userAddress })
  ]);

  const terminatedIds = new Set([
    ...claimed.map(l => l.args.id.toString()),
    ...withdrawn.map(l => l.args.id.toString())
  ]);

  return created.filter(l => !terminatedIds.has(l.args.id.toString()));
}
```

## 3. Protocol Restrictions (Breach Protection)

- **LEGACY Vaults**: These represent inheritance/heritage. To ensure the integrity of the temporal bridge, **Early Withdrawal (Panic)** is strictly disallowed for these vaults. They can only be accessed after the unlock timestamp or through the Dead Man's Switch (LEGACY claim) protocol.
- **SOCIAL Vaults**: Labeled as "Temporal Gifting". The message is treated as a "Temporal Greeting" and revealed to the beneficiary upon successful claim.

## 4. Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS v4 (Cinematic Theme)
- **Web3**:
  - `@midl/satoshi-kit`: Connection and Network management.
  - `@midl/executor-react`: Intent-based transaction broadcasting.
  - `viem/wagmi`: Blockchain data fetching and log parsing.
- **Contract**: `TimeCapsule.sol` (deployed on MIDL Regtest).
