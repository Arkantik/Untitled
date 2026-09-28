export const PlanTier = {
  Free: 'free',
  Pro: 'pro',
} as const;

export type PlanTier = (typeof PlanTier)[keyof typeof PlanTier];

export const SubscriptionStatus = {
  None: 'none',
  Active: 'active',
  Trialing: 'trialing',
  PastDue: 'past_due',
  Canceled: 'canceled',
} as const;

export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export interface PlanLimits {
  displayName: string;
  maxMembers: number;
  maxConnectedAccounts: number;
  maxScheduledPosts: number;
}

export const PLAN_TIERS: Record<PlanTier, PlanLimits> = {
  free: {
    displayName: 'Free',
    maxMembers: 3,
    maxConnectedAccounts: 3,
    maxScheduledPosts: 30,
  },
  pro: {
    displayName: 'Pro',
    maxMembers: 10,
    maxConnectedAccounts: 10,
    maxScheduledPosts: 500,
  },
};
