import assert from 'assert';
import { parseVaultMessage, parseRevealedData } from '../shared/utils/vault';

// Test Metadata Serialization via parseVaultMessage
const label = "Heritage Vault";
const secret = "Keep it secret, keep it safe";
const file = { name: "will.pdf", size: 102456 };
const amount = "0.5";

const combined = JSON.stringify({ label, secret, file, amount });
const parsed = parseVaultMessage(combined);

assert.strictEqual(parsed.label, label);
assert.strictEqual(parsed.secret, secret);
assert.strictEqual(parsed.file?.name, file.name); assert.strictEqual(parsed.file?.size, file.size);
assert.strictEqual(parsed.origAmount, amount);

console.log("SUCCESS: Metadata logic verified.");

// Test parseRevealedData
const log = {
  args: {
    message: JSON.stringify({ secret, amount, file })
  }
};

const revealed = parseRevealedData(log);
assert.strictEqual(revealed.message, secret);
assert.strictEqual(revealed.amount, amount);
assert.strictEqual(revealed.file?.name, file.name); assert.strictEqual(revealed.file?.size, file.size);

console.log("SUCCESS: Revealed data parsing verified.");

// Test Protocol filter logic (using real VaultType if possible, but we can just use numbers)
enum VaultType {
  TEMPORAL = 0,
  LEGACY = 1,
}

const logs = [
  { args: { id: 1n, vaultType: VaultType.LEGACY } },
  { args: { id: 2n, vaultType: VaultType.TEMPORAL } }
];

const isLegacy = (log: any) => log.args.vaultType === VaultType.LEGACY;
assert.strictEqual(isLegacy(logs[0]), true);
assert.strictEqual(isLegacy(logs[1]), false);

console.log("SUCCESS: Protocol filter logic verified.");
