# Task Proposals from Codebase Review (Revised v2)

## 1) Logic error task
**Task:** Fix `parseRevealedData` so zero amounts are preserved instead of being dropped by falsey checks.

- **Where found:** `apps/dapp/src/shared/utils/vault.ts` uses `amount = data.amount || amount;`.
- **Why this is a logic error:** If `data.amount` is numeric `0`, the expression falls back to the previous value, which misrepresents the revealed payload.
- **Suggested implementation:** Replace falsey fallback with nullish fallback (e.g., `amount = data.amount ?? amount`) and add a regression test for `0`.

## 2) "Fix all bugs" task
**Task:** Execute a focused stabilization pass and fix all currently reproducible bugs found in this sweep.

- **Where found:**
  - `packages/contracts/contracts/TimeCapsule.sol` currently restricts `claim()` to owner-only, conflicting with SOCIAL beneficiary semantics.
  - `README_SETUP.md` uses `pnpm --filter @dapp-demo/dapp dev`, while the main README uses `@BitCapsule/dapp`.
  - Explorer-driven validation can be misleading while Blockscout shows: **"97% Blocks Indexed – We're indexing this chain right now. Some of the counts may be inaccurate."**
- **Definition of done (all known bugs from this sweep):**
  1. SOCIAL beneficiary can claim after unlock (without breaking TEMPORAL/HODL/LEGACY behavior).
  2. Setup docs command matches the actual workspace package name.
  3. Archive/debug validation does not rely on potentially inaccurate explorer counts during partial indexing (prefer event logs/RPC verification in-app).
  4. Add/adjust tests validating the corrected behavior.

## 3) Code comment/documentation discrepancy task
**Task:** Correct and clarify explorer guidance in docs to reflect partial-indexing caveats and consistent naming (`Blockscout`, not misspellings such as `blocksout`).

- **Where found:** `DEBUG.md` references Blockscout for verification but does not mention temporary indexing inaccuracies.
- **Why:** The explorer itself can report incomplete indexing, so docs should explicitly instruct maintainers to treat explorer counts as advisory until indexing is complete.

## 4) Test improvement task
**Task:** Replace script-style assertions in `apps/dapp/src/tests/logic.test.ts` with a structured test suite and add explicit edge-case coverage.

- **Where found:** test file runs assertions at module top-level, without test case boundaries.
- **Why this should be improved:** Failures are harder to localize and CI output is less actionable.
- **Suggested additional cases:**
  - `parseVaultMessage` handles non-JSON legacy payloads.
  - `parseRevealedData` handles plain-text event messages.
  - `parseRevealedData` preserves `amount: 0`.
  - Archive reconciliation remains correct even if explorer counts are stale/incomplete (simulate by relying only on event logs).
