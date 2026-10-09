import {
  Injectable,
  Inject,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { sqliteSchema } from '@veypost/db';
import type { DbClient } from '@veypost/db';
import { getEnv } from '../config/env.js';
import { STRIPE_GATEWAY, type IStripeGateway } from './stripe/stripe-gateway.interface.js';

const { workspaces, billingEvents, processedStripeEvents } = sqliteSchema;

interface CheckoutSessionData {
  object: {
    id: string;
    subscription?: string | null;
    metadata?: { workspaceId?: string; plan?: string } | null;
  };
}

interface SubscriptionData {
  object: { id: string; customer: string; status: string };
}

@Injectable()
export class BillingWebhookService {
  constructor(
    @Inject('DB') private readonly db: DbClient,
    @Inject(STRIPE_GATEWAY) private readonly stripe: IStripeGateway,
  ) {}

  // Drizzle's dialect union can't be narrowed to a single schema; cast once here.
  private get q() { return this.db as any; }

  async handleWebhook(rawBody: Buffer | string, signature: string): Promise<void> {
    if (!getEnv().BILLING_ENABLED) throw new ServiceUnavailableException('Billing is not enabled');

    let event: { id: string; type: string; data: unknown };
    try {
      event = await this.stripe.parseWebhookEvent(rawBody, signature);
    } catch (err: unknown) {
      if (err instanceof ServiceUnavailableException) throw err;
      throw new BadRequestException('Webhook signature verification failed');
    }

    const [existing] = await this.q
      .select({ id: processedStripeEvents.id })
      .from(processedStripeEvents)
      .where(eq(processedStripeEvents.id, event.id))
      .limit(1);
    if (existing) return;

    await this.q.insert(processedStripeEvents).values({ id: event.id });

    switch (event.type) {
      case 'checkout.session.completed':
        await this.onCheckoutCompleted(event.data as CheckoutSessionData);
        break;
      case 'customer.subscription.updated':
        await this.onSubscriptionUpdated(event.data as SubscriptionData);
        break;
      case 'customer.subscription.deleted':
        await this.onSubscriptionDeleted(event.data as SubscriptionData);
        break;
    }
  }

  private async onCheckoutCompleted(data: CheckoutSessionData): Promise<void> {
    const session = data.object;
    const workspaceId: string | undefined = session.metadata?.workspaceId;
    const plan: string = session.metadata?.plan ?? 'pro';
    if (!workspaceId) return;

    await this.q
      .update(workspaces)
      .set({ plan, subscriptionStatus: 'active' })
      .where(eq(workspaces.id, workspaceId));

    await this.q.insert(billingEvents).values({
      workspaceId,
      type: 'checkout_completed',
      newPlan: plan,
      stripeSubscriptionId: session.subscription ?? null,
      detail: JSON.stringify({ sessionId: session.id }),
    });
  }

  private async onSubscriptionUpdated(data: SubscriptionData): Promise<void> {
    const sub = data.object;
    const [ws] = await this.q
      .select({ id: workspaces.id, plan: workspaces.plan })
      .from(workspaces)
      .where(eq(workspaces.stripeCustomerId, sub.customer))
      .limit(1);
    if (!ws) return;

    await this.q
      .update(workspaces)
      .set({ subscriptionStatus: sub.status })
      .where(eq(workspaces.id, ws.id));

    await this.q.insert(billingEvents).values({
      workspaceId: ws.id,
      type: 'subscription_updated',
      newPlan: ws.plan,
      stripeSubscriptionId: sub.id,
      detail: JSON.stringify({ status: sub.status }),
    });
  }

  private async onSubscriptionDeleted(data: SubscriptionData): Promise<void> {
    const sub = data.object;
    const [ws] = await this.q
      .select({ id: workspaces.id, plan: workspaces.plan })
      .from(workspaces)
      .where(eq(workspaces.stripeCustomerId, sub.customer))
      .limit(1);
    if (!ws) return;

    await this.q
      .update(workspaces)
      .set({ plan: 'free', subscriptionStatus: 'canceled' })
      .where(eq(workspaces.id, ws.id));

    await this.q.insert(billingEvents).values({
      workspaceId: ws.id,
      type: 'subscription_canceled',
      previousPlan: ws.plan,
      newPlan: 'free',
      stripeSubscriptionId: sub.id,
      detail: JSON.stringify({}),
    });
  }
}
