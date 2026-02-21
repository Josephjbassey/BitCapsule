import { describe, expect, it } from 'vitest';
import { parseVaultMessage, reconcileArchiveLogs } from '../shared/utils/vault';

describe('parseVaultMessage', () => {
  it('parses serialized JSON metadata payloads', () => {
    const label = 'Heritage Vault';
    const secret = 'Keep it secret, keep it safe';
    const file = { name: 'will.pdf', size: 102456 };
    const amount = '0.5';

    const combined = JSON.stringify({ label, secret, file, amount });
    const parsed = parseVaultMessage(combined);

    expect(parsed.label).toBe(label);
    expect(parsed.secret).toBe(secret);
    expect(parsed.file?.name).toBe(file.name);
    expect(parsed.file?.size).toBe(file.size);
    expect(parsed.origAmount).toBe(amount);
  });
});

describe('reconcileArchiveLogs', () => {
  it('derives active capsules from pre-decoded logs', () => {
    const logs = [
      { eventName: 'CapsuleCreated', args: { id: 1n, owner: '0x1', beneficiary: '0x2', message: '{}' }, blockNumber: 1n, logIndex: 0 },
      { eventName: 'CapsuleCreated', args: { id: 2n, owner: '0x1', beneficiary: '0x2', message: '{}' }, blockNumber: 1n, logIndex: 1 },
      { eventName: 'CapsuleClaimed', args: { id: 2n }, blockNumber: 2n, logIndex: 0 },
    ];

    const active = reconcileArchiveLogs(logs as any[]);

    expect(active).toHaveLength(1);
    expect(active[0]?.args?.id).toBe(1n);
  });

  it('handles ownership transfers', () => {
    const logs = [
      { eventName: 'CapsuleCreated', args: { id: 1n, owner: '0x1', beneficiary: '0x2', message: '{}' }, blockNumber: 1n, logIndex: 0 },
      { eventName: 'CapsuleTransferred', args: { id: 1n, from: '0x1', to: '0x3' }, blockNumber: 2n, logIndex: 0 },
    ];

    const active = reconcileArchiveLogs(logs as any[]);

    expect(active).toHaveLength(1);
    expect(active[0]?.args?.owner).toBe('0x3');
  });
});
