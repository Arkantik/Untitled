import { Injectable } from '@nestjs/common';
import type {
  IStripeGateway,
  CreateCustomerParams,
  CreateCheckoutSessionParams,
  CreatePortalSessionParams,
} from './stripe-gateway.interface.js';

@Injectable()
export class FakeStripeGateway implements IStripeGateway {
  async createCustomer(_params: CreateCustomerParams) {
    return { id: `cus_fake_${crypto.randomUUID().slice(0, 8)}` };
  }

  async createCheckoutSession(_params: CreateCheckoutSessionParams) {
    return { url: 'https://fake.stripe.com/checkout' };
  }

  async createPortalSession(_params: CreatePortalSessionParams) {
    return { url: 'https://fake.stripe.com/portal' };
  }

  async parseWebhookEvent(payload: string | Buffer, _signature: string) {
    const raw = typeof payload === 'string' ? payload : payload.toString('utf8');
    const event = JSON.parse(raw) as { id?: string; type: string; data: unknown };
    return { id: event.id ?? crypto.randomUUID(), type: event.type, data: event.data };
  }

  async retrieveSubscription(subscriptionId: string) {
    return { id: subscriptionId, status: 'active', items: { data: [] } };
  }

  async listSubscriptions(_customerId: string) {
    return [];
  }

  async cancelSubscription(_subscriptionId: string): Promise<void> {}

  async updateSubscriptionPlan(_subscriptionId: string, _newPriceId: string): Promise<void> {}
}
