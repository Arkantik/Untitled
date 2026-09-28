import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type Stripe from 'stripe';
import { getEnv } from '../../config/env.js';
import type {
  IStripeGateway,
  CreateCustomerParams,
  CreateCheckoutSessionParams,
  CreatePortalSessionParams,
} from './stripe-gateway.interface.js';

@Injectable()
export class StripeGatewayImpl implements IStripeGateway {
  private client: Stripe | null = null;

  private get stripe(): Stripe {
    if (this.client) return this.client;
    const key = getEnv().STRIPE_SECRET_KEY;
    if (!key) throw new ServiceUnavailableException('Stripe is not configured');
    // Dynamic import keeps the `stripe` package out of the module graph until needed.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const StripeClass = require('stripe').default ?? require('stripe');
    this.client = new StripeClass(key, { apiVersion: '2025-06-30.basil' }) as Stripe;
    return this.client;
  }

  async createCustomer(params: CreateCustomerParams) {
    const c = await this.stripe.customers.create({ email: params.email, name: params.name, metadata: params.metadata });
    return { id: c.id };
  }

  async createCheckoutSession(params: CreateCheckoutSessionParams) {
    const s = await this.stripe.checkout.sessions.create({
      customer: params.customerId,
      line_items: [{ price: params.priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
    });
    return { url: s.url };
  }

  async createPortalSession(params: CreatePortalSessionParams) {
    const s = await this.stripe.billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
    return { url: s.url };
  }

  async parseWebhookEvent(payload: string | Buffer, signature: string) {
    const secret = getEnv().STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new ServiceUnavailableException('Stripe webhook secret not configured');
    const event = this.stripe.webhooks.constructEvent(payload, signature, secret);
    return { id: event.id, type: event.type, data: event.data };
  }

  async retrieveSubscription(subscriptionId: string) {
    const sub = await this.stripe.subscriptions.retrieve(subscriptionId);
    return { id: sub.id, status: sub.status, items: sub.items };
  }

  async listSubscriptions(customerId: string) {
    const list = await this.stripe.subscriptions.list({ customer: customerId, limit: 10 });
    return list.data.map((s) => ({ id: s.id, status: s.status }));
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
  }

  async updateSubscriptionPlan(subscriptionId: string, newPriceId: string): Promise<void> {
    const sub = await this.stripe.subscriptions.retrieve(subscriptionId);
    const itemId = (sub.items.data as Array<{ id: string }>)[0]?.id;
    await this.stripe.subscriptions.update(subscriptionId, {
      items: [{ id: itemId, price: newPriceId }],
      proration_behavior: 'always_invoice',
    });
  }
}
