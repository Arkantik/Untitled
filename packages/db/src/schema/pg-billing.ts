import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { workspaces } from './pg.js';

export const billingEvents = pgTable('billing_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  previousPlan: text('previous_plan'),
  newPlan: text('new_plan'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  detail: text('detail').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const processedStripeEvents = pgTable('processed_stripe_events', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
