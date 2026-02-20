const { keccak256, encodePacked, toHex } = require('viem');

const errors = [
  'InvalidAmount()',
  'Unauthorized()',
  'NotExpired()',
  'AlreadyWithdrawn()',
  'Inactive()',
  'InvalidVaultType()'
];

errors.forEach(err => {
  const selector = keccak256(Buffer.from(err)).substring(0, 10);
  console.log(`${err}: ${selector}`);
});
