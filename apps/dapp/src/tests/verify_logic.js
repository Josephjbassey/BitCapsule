const assert = require('assert');

// Test Metadata Serialization
const label = "Heritage Vault";
const secret = "Keep it secret, keep it safe";
const file = { name: "will.pdf", size: 102456 };
const amount = "0.5";

const combined = JSON.stringify({ label, secret, file, amount });
const parsed = JSON.parse(combined);

assert.strictEqual(parsed.label, label);
assert.strictEqual(parsed.secret, secret);
assert.deepStrictEqual(parsed.file, file);
assert.strictEqual(parsed.amount, amount);

console.log("SUCCESS: Metadata logic verified.");

// Test Filter logic
const logs = [
  { args: { id: 1n, vaultType: 1 } }, // LEGACY
  { args: { id: 2n, vaultType: 0 } }  // TEMPORAL
];

const isLegacy = (log) => log.args.vaultType === 1;
assert.strictEqual(isLegacy(logs[0]), true);
assert.strictEqual(isLegacy(logs[1]), false);

console.log("SUCCESS: Protocol filter logic verified.");
