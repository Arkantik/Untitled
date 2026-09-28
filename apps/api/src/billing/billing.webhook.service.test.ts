import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ServiceUnavailableException, BadRequestException } from '@nestjs/common';

vi.mock('../config/env.js', () => ({ getEnv: vi.fn() }));

import { getEnv } from '../config/env.js';
import { BillingWebhookService } from './billing.webhook.service.js';

const mockGetEnv = vi.mocked(getEnv);

function makeStripe(eventResult: { id: string; type: string; data: unknown }) {
  return { parseWebhookEvent: vi.fn().mockResolvedValue(eventResult) };
}

function makeDb(existingEventId: string | null = null) {
  let insertedEventId: string | null = null;
  let updatedPlan: string | null = null;
  let updatedStatus: string | null = null;

  const db: any = {
    select: () => db,
    from: () => db,
    where: () => db,
    limit: () => {
      if (insertedEventId === null) {
        return Promise.resolve(existingEventId ? [{ id: existingEventId }] : []);
      }
      return Promise.resolve([{ id: 'ws-1', plan: 'free' }]);
    },
    insert: () => ({ values: vi.fn().mockResolvedValue(undefined) }),
    update: () => ({
      set: (vals: any) => {
        updatedPlan = vals.plan ?? null;
        updatedStatus = vals.subscriptionStatus ?? null;
        return { where: vi.fn().mockResolvedValue(undefined) };
      },
    }),
    _results: () => ({ updatedPlan, updatedStatus }),
  };
  return db;
}

describe('BillingWebhookService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('throws 503 when BILLING_ENABLED is false', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: false } as any);
    const svc = new BillingWebhookService({} as any, {} as any);
    await expect(svc.handleWebhook('{}', '')).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it('processes checkout.session.completed when billing is enabled', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: true } as any);
    const eventData = {
      object: {
        id: 'cs_001',
        metadata: { workspaceId: 'ws-123', plan: 'pro' },
        subscription: 'sub_001',
      },
    };
    const stripe = makeStripe({ id: 'evt_001', type: 'checkout.session.completed', data: eventData });
    const db = makeDb(null);
    const svc = new BillingWebhookService(db, stripe as any);

    await expect(svc.handleWebhook('{}', 'sig')).resolves.toBeUndefined();
  });

  it('skips duplicate events (idempotency)', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: true } as any);
    const stripe = makeStripe({ id: 'evt_dup', type: 'checkout.session.completed', data: {} });
    const db = makeDb('evt_dup');
    const svc = new BillingWebhookService(db, stripe as any);

    await expect(svc.handleWebhook('{}', 'sig')).resolves.toBeUndefined();
    expect(stripe.parseWebhookEvent).toHaveBeenCalledOnce();
  });

  it('returns 400 when signature verification fails', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: true } as any);
    const stripe = { parseWebhookEvent: vi.fn().mockRejectedValue(new Error('No signatures found')) };
    const db = makeDb(null);
    const svc = new BillingWebhookService(db, stripe as any);
    await expect(svc.handleWebhook('{}', 'bad-sig')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('ignores unknown event types without error', async () => {
    mockGetEnv.mockReturnValue({ BILLING_ENABLED: true } as any);
    const stripe = makeStripe({ id: 'evt_unknown', type: 'payment_intent.created', data: {} });
    const db = makeDb(null);
    const svc = new BillingWebhookService(db, stripe as any);

    await expect(svc.handleWebhook('{}', 'sig')).resolves.toBeUndefined();
  });
});
