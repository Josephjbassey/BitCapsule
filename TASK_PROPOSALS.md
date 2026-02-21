# Task Proposals from Codebase Review

## 1) Typo fix task
**Task:** Fix the wording typo/inconsistency `Temporal Greeting` → `Temporal Gifting` in the SOCIAL vault architecture note so the term matches the rest of the product language.

- **Where found:** `ARCHITECTURE.md` in the protocol restrictions section.
- **Why:** The project consistently uses “temporal gifting” elsewhere, so “Temporal Greeting” appears to be an accidental typo.

## 2) Bug fix task
**Task:** Fix SOCIAL vault claiming logic in `TimeCapsule.sol` so beneficiaries can claim SOCIAL capsules after unlock (not just owners).

- **Where found:** `claim(uint256 id)` currently requires `msg.sender == capsule.owner` for all non-legacy types.
- **Why this is a bug:** `createCapsule` requires a beneficiary for `SOCIAL`, and docs describe SOCIAL as beneficiary-oriented gifting, but the current claim path blocks beneficiary claims.
- **Suggested approach:** Branch claim authorization by vault type (e.g., beneficiary for SOCIAL, owner for TEMPORAL/HODL, legacy remains in `claimLegacy`).

## 3) Comment/documentation discrepancy task
**Task:** Align setup docs with the actual package name by replacing `pnpm --filter @dapp-demo/dapp dev` with `pnpm --filter @BitCapsule/dapp dev`.

- **Where found:** `README_SETUP.md` launch step.
- **Why:** `README.md` uses the `@BitCapsule/dapp` filter, so setup docs currently send users to a non-matching command.

## 4) Test improvement task
**Task:** Convert `apps/dapp/src/tests/logic.test.ts` from script-style assertions into a proper test-runner suite and add edge-case coverage.

- **Where found:** The file executes assertions at module load with no `describe/it` structure.
- **Why this should be improved:** Current tests are brittle and don’t clearly report per-case failures.
- **Suggested new cases:**
  - `parseVaultMessage` with invalid JSON fallback.
  - `parseRevealedData` when `log.args.message` is plain text.
  - Zero-value amount handling (`0` or `"0"`) to catch falsey-value regressions.
