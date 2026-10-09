import {
  Injectable,
  Inject,
  NotImplementedException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { badRequest } from '../common/app.exception.js';
import { eq } from 'drizzle-orm';
import { sqliteSchema } from '@veypost/db';
import type { DbClient } from '@veypost/db';
import type { CheckoutInput, PortalInput } from '@veypost/shared';
import { getEnv } from '../config/env.js';
import { STRIPE_GATEWAY, type IStripeGateway } from './stripe/stripe-gateway.interface.js';
import { assertRole } from '../workspaces/workspaces.helpers.js';

const { workspaces, users, billingEvents } = sqliteSchema;

@Injectable()
export class BillingService {
  constructor(
    @Inject('DB') private readonly db: DbClient,
    @Inject(STRIPE_GATEWAY) private readonly stripe: IStripeGateway,
  ) {}

  // Drizzle's dialect union can't be narrowed to a single schema; cast once here.
  private get q() { return this.db as any; }

  async startCheckout(userId: string, dto: CheckoutInput): Promise<{ url: string }> {
    const env = getEnv();
    if (!env.BILLING_ENABLED) throw new NotImplementedException('Billing is not enabled');

    await assertRole(this.q, dto.workspaceId, userId, 'owner');

    const [ws] = await this.q
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, dto.workspaceId))
      .limit(1);
    if (ws.plan === dto.plan) throw badRequest('Already on that plan');

    let customerId: string = ws.stripeCustomerId;
    if (!customerId) {
      const [user] = await this.q
        .select({ email: users.email, name: users.name })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      const customer = await this.stripe.createCustomer({
        email: user.email,
        name: user.name ?? ws.name,
        metadata: { workspaceId: dto.workspaceId },
      });
      customerId = customer.id;
      await this.q
        .update(workspaces)
        .set({ stripeCustomerId: customerId })
        .where(eq(workspaces.id, dto.workspaceId));
    }

    const appUrl = env.APP_URL;
    const subs = await this.stripe.listSubscriptions(customerId);
    const activeSub = subs.find((s) => s.status === 'active' || s.status === 'trialing');

    let url: string;

    if (activeSub && dto.plan === 'free') {
      await this.stripe.cancelSubscription(activeSub.id);
      url = `${appUrl}/workspace/subscription?workspaceId=${dto.workspaceId}`;
    } else if (activeSub && dto.plan === 'pro') {
      const priceId = env.STRIPE_PRO_PRICE_ID;
      if (!priceId) throw new ServiceUnavailableException('Stripe Pro price ID not configured');
      await this.stripe.updateSubscriptionPlan(activeSub.id, priceId);
      url = `${appUrl}/workspace/subscription?workspaceId=${dto.workspaceId}`;
    } else {
      const priceId = env.STRIPE_PRO_PRICE_ID;
      if (!priceId) throw new ServiceUnavailableException('Stripe Pro price ID not configured');
      const session = await this.stripe.createCheckoutSession({
        customerId,
        priceId,
        successUrl: `${appUrl}/workspace/subscription?success=true&workspaceId=${dto.workspaceId}`,
        cancelUrl: `${appUrl}/workspace/subscription?cancel=true&workspaceId=${dto.workspaceId}`,
        metadata: { workspaceId: dto.workspaceId, plan: dto.plan },
      });
      url = session.url ?? `${appUrl}/workspace/subscription`;
    }

    await this.q.insert(billingEvents).values({
      workspaceId: dto.workspaceId,
      type: 'checkout_started',
      previousPlan: ws.plan,
      newPlan: dto.plan,
      detail: JSON.stringify({ customerId }),
    });

    return { url };
  }

  async openPortal(userId: string, dto: PortalInput): Promise<{ url: string }> {
    if (!getEnv().BILLING_ENABLED) throw new NotImplementedException('Billing is not enabled');

    await assertRole(this.q, dto.workspaceId, userId, 'owner');

    const [ws] = await this.q
      .select({ stripeCustomerId: workspaces.stripeCustomerId })
      .from(workspaces)
      .where(eq(workspaces.id, dto.workspaceId))
      .limit(1);
    if (!ws?.stripeCustomerId) throw badRequest('No billing account on this workspace');

    const appUrl = getEnv().APP_URL;
    const session = await this.stripe.createPortalSession({
      customerId: ws.stripeCustomerId,
      returnUrl: `${appUrl}/workspace/subscription?workspaceId=${dto.workspaceId}`,
    });
    return { url: session.url };
  }
}
