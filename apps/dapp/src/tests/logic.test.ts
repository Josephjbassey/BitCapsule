import { describe, expect, it } from 'vitest';
import { parseRevealedData, parseVaultMessage, reconcileArchiveLogs } from '../shared/utils/vault';

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


  it('preserves zero amount metadata in vault payloads', () => {
    const combined = JSON.stringify({
      label: 'Zero Vault',
      secret: 'Zero is valid',
      amount: 0,
    });

    const parsed = parseVaultMessage(combined);

    expect(parsed.origAmount).toBe(0);
  });
  it('falls back for malformed JSON messages', () => {
    const malformed = '{"label":"Broken Vault", "secret": "oops"';

    const parsed = parseVaultMessage(malformed);

    expect(parsed.label).toBe('Archive Record');
    expect(parsed.secret).toBe(malformed);
    expect(parsed.file).toBeNull();
    expect(parsed.origAmount).toBeNull();
  });
});

describe('parseRevealedData', () => {
  it('parses secret payloads from JSON event messages', () => {
    const log = {
      args: {
        message: JSON.stringify({
          secret: 'Decoded payload',
          amount: '1.25',
          file: { name: 'seed.txt', size: 128 },
        }),
      },
    };

    const revealed = parseRevealedData(log as any);

    expect(revealed.message).toBe('Decoded payload');
    expect(revealed.amount).toBe('1.25');
    expect(revealed.file?.name).toBe('seed.txt');
    expect(revealed.file?.size).toBe(128);
  });

  it('returns plain-text messages when log.args.message is not JSON', () => {
    const log = {
      args: {
        message: 'plain text payload',
      },
    };

    const revealed = parseRevealedData(log as any);

    expect(revealed.message).toBe('plain text payload');
    expect(revealed.amount).toBe('---');
    expect(revealed.file).toBeNull();
  });

  it('treats numeric zero amount as a valid amount', () => {
    const log = {
      args: {
        amount: 2_000_000_000_000_000_000n,
        message: JSON.stringify({
          secret: 'zero numeric amount payload',
          amount: 0,
        }),
      },
    };

    const revealed = parseRevealedData(log as any);

    expect(revealed.message).toBe('zero numeric amount payload');
    expect(revealed.amount).toBe(0);
  });

  it('treats string zero amount as a valid amount', () => {
    const log = {
      args: {
        message: JSON.stringify({
          secret: 'zero string amount payload',
          amount: '0',
        }),
      },
    };

    const revealed = parseRevealedData(log as any);

    expect(revealed.message).toBe('zero string amount payload');
    expect(revealed.amount).toBe('0');
  });
});


describe('reconcileArchiveLogs', () => {
  it('derives active capsules from on-chain event logs without explorer counts', () => {
    const createdLogs = [
      { args: { id: 1n } },
      { args: { id: 2n } },
      { args: { id: 3n } },
    ];

    const claimedLogs = [{ args: { id: 2n } }];
    const withdrawnLogs = [{ args: { id: 3n } }];

    const active = reconcileArchiveLogs(createdLogs as any[], claimedLogs as any[], withdrawnLogs as any[]);

    expect(active).toHaveLength(1);
    expect(active[0]?.args?.id).toBe(1n);
  });
});
