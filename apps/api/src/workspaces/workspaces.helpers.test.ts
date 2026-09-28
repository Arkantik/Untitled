import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/env.js', () => ({ getEnv: vi.fn() }));

import { getEnv } from '../config/env.js';
import { assertMemberLimit, assertAccountLimit } from './workspaces.helpers.js';

const mockGetEnv = vi.mocked(getEnv);

function makeQ(planValue: string, itemCount: number) {
  let callIndex = 0;
  const q: any = {
    select: () => q,
    from: () => q,
    where: () => q,
    limit: () => {
      callIndex++;
      if (callIndex === 1) return Promise.resolve([{ plan: planValue }]);
      return Promise.resolve([{ n: itemCount }]);
    },
  };
  return q;
}

describe('assertMemberLimit', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('skips when BILLING_ENABLED is false', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: false } as any);
    const q = makeQ('free', 100);
    await expect(assertMemberLimit(q, 'ws-1')).resolves.toBeUndefined();
  });

  it('allows adding a member when count is below the limit', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: true } as any);
    const q = makeQ('free', 2);
    await expect(assertMemberLimit(q, 'ws-1')).resolves.toBeUndefined();
  });

  it('blocks when member count equals the free plan limit (3)', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: true } as any);
    const q = makeQ('free', 3);
    await expect(assertMemberLimit(q, 'ws-1')).rejects.toMatchObject({
      code: 'LIMIT_EXCEEDED',
    });
  });

  it('allows members below the pro plan limit', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: true } as any);
    const q = makeQ('pro', 9);
    await expect(assertMemberLimit(q, 'ws-1')).resolves.toBeUndefined();
  });

  it('blocks when pro plan member count reaches the limit (10)', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: true } as any);
    const q = makeQ('pro', 10);
    await expect(assertMemberLimit(q, 'ws-1')).rejects.toMatchObject({
      code: 'LIMIT_EXCEEDED',
    });
  });
});

describe('assertAccountLimit', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('skips when BILLING_ENABLED is false', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: false } as any);
    const q = makeQ('free', 100);
    await expect(assertAccountLimit(q, 'ws-1')).resolves.toBeUndefined();
  });

  it('blocks when connected account count equals the free plan limit (3)', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: true } as any);
    const q = makeQ('free', 3);
    await expect(assertAccountLimit(q, 'ws-1')).rejects.toMatchObject({
      code: 'LIMIT_EXCEEDED',
    });
  });

  it('allows accounts below the limit', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: true } as any);
    const q = makeQ('free', 2);
    await expect(assertAccountLimit(q, 'ws-1')).resolves.toBeUndefined();
  });
});
