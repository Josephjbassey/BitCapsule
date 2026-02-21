# Task Proposals from Codebase Review (Revised)

## 1) Logic error task
**Task:** Fix `parseRevealedData` so zero amounts are preserved instead of being dropped by falsey checks.

- **Where found:** `apps/dapp/src/shared/utils/vault.ts` uses `amount = data.amount || amount;`.
- **Why this is a logic error:** If `data.amount` is numeric `0`, the expression falls back to the previous value, which misrepresents the revealed payload.
- **Suggested implementation:** Replace falsey fallback with nullish fallback (e.g., `amount = data.amount ?? amount`) and add a regression test for `0`.

## 2) "Fix all bugs" task
**Task:** Execute a focused bug-sweep and fix all currently reproducible defects in vault claim authorization and setup-command docs mismatch in one stabilization pass.

- **Where found:**
  - `packages/contracts/contracts/TimeCapsule.sol` currently restricts `claim()` to owner-only, conflicting with SOCIAL beneficiary semantics.
  - `README_SETUP.md` uses `pnpm --filter @dapp-demo/dapp dev`, while the main README uses `@BitCapsule/dapp`.
- **Definition of done (all known bugs from this sweep):**
  1. SOCIAL beneficiary can claim after unlock (without breaking TEMPORAL/HODL/LEGACY behavior).
  2. Setup docs command matches the actual workspace package name.
  3. Add/adjust tests validating the corrected behavior.

## 3) Code comment/documentation discrepancy task
**Task:** Correct the SOCIAL vault wording in architecture docs from “Temporal Greeting” to “Temporal Gifting” for terminology consistency.

- **Where found:** `ARCHITECTURE.md` protocol restrictions section.
- **Why:** Product/docs terminology elsewhere uses “temporal gifting,” so this line is inconsistent and confusing.

## 4) Test improvement task
**Task:** Replace script-style assertions in `apps/dapp/src/tests/logic.test.ts` with a structured test-suite and add explicit edge-case cases.

- **Where found:** test file runs assertions at module top-level, without test case boundaries.
- **Why this should be improved:** Failures are harder to localize and CI output is less actionable.
- **Suggested additional cases:**
  - `parseVaultMessage` handles non-JSON legacy payloads.
  - `parseRevealedData` handles plain-text event messages.
  - `parseRevealedData` preserves `amount: 0`.
