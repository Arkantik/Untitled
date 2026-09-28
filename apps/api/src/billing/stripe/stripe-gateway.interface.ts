export const STRIPE_GATEWAY = 'STRIPE_GATEWAY';

export interface CreateCustomerParams {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}

export interface CreateCheckoutSessionParams {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CreatePortalSessionParams {
  customerId: string;
  returnUrl: string;
}

export interface IStripeGateway {
  createCustomer(params: CreateCustomerParams): Promise<{ id: string }>;
  createCheckoutSession(params: CreateCheckoutSessionParams): Promise<{ url: string | null }>;
  createPortalSession(params: CreatePortalSessionParams): Promise<{ url: string }>;
  parseWebhookEvent(payload: string | Buffer, signature: string): Promise<{ id: string; type: string; data: unknown }>;
  retrieveSubscription(subscriptionId: string): Promise<{ id: string; status: string; items: unknown }>;
  listSubscriptions(customerId: string): Promise<Array<{ id: string; status: string }>>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  updateSubscriptionPlan(subscriptionId: string, newPriceId: string): Promise<void>;
}
