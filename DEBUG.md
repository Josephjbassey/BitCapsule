# BitCapsule Debugging Guide

## 🛠 Common Issues & Solutions

### 1. "Invalid PSBT" in Xverse
**Symptoms**: Wallet opens but shows "Invalid PSBT" or fails to sign.
**Cause**: The transaction intention is missing the `deposit` flag or the `satoshis` value for native BTC funding.
**Solution**:
- Ensure `addTxIntention` includes `deposit: true`.
- Verify `satoshis` is calculated correctly: `BigInt(amountInWei) / BigInt(10**10)`.

### 2. Archive History Not Updating
**Symptoms**: Vault still appears after "Claim" or "Force Crack".
**Cause**: RPC lag or event reconciliation failure.
**Debug Steps**:
- Click the **SYNC** button in the Archive header to force a re-fetch.
- Confirm events via RPC first (`getLogs` for `CapsuleClaimed` / `EarlyWithdrawal`) and use [Blockscout](https://blockscout.staging.midl.xyz) as a secondary check.
- Verify the `fetchHistory` logic in `apps/dapp/src/app/archive/page.tsx` is querying all three event types.

### 3. Wallet Connection Stuck
**Symptoms**: Button says "Connecting..." but nothing happens.
**Cause**: Mismatched network or multiple wallet extensions clashing.
**Solution**:
- Ensure Xverse is set to **Regtest**.
- Refresh the page and wait for the "Auto-Switch" prompt.
- Check Console (F12) for `Connector not found` or `Chain mismatch`.

### 4. TypeScript "args" Property Missing
**Symptoms**: `Property 'args' does not exist on type 'Log'`.
**Cause**: Standard Viem `Log` type is generic.
**Solution**: Use explicit casting: `(log as any).args.id`.

## 🔍 Investigation Tools

- **Local Logs**: The app logs key events to the browser console when `process.env.NODE_ENV === 'development'`.
- **RPC Event Logs (Primary)**: Verify state with direct RPC log queries first; this is the source of truth for archive reconciliation.
- **Explorer (Advisory)**: Use [Blockscout](https://blockscout.staging.midl.xyz/address/0x9e0C86386C8f6B223bE48f6834bEa6011749826E) as a convenience UI, but treat counts as advisory when it reports partial indexing (e.g., '97% Blocks Indexed').
- **Network Tab**: Check for failed RPC calls to `https://rpc.staging.midl.xyz`.

### 5. Network Sync Issues (Mobile/Desktop)
**Symptoms**: App shows "Incompatible Network" or "Switch Network" warning.
**Cause**: Wallet is not on MIDL Regtest (Chain ID 420).
**Solution**:
- The dApp will attempt an **Auto-Sync** on connection.
- If it fails, click the **Switch Network** button in the Navbar.
- On Mobile: Some wallets require you to manually open the wallet app and change the network to Regtest if the auto-switch prompt doesn't appear.
- Verify your chain ID matches **420** and RPC is `https://rpc.staging.midl.xyz`.
