import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { workspaces } from './sqlite.js';

export const billingEvents = sqliteTable('billing_events', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  previousPlan: text('previous_plan'),
  newPlan: text('new_plan'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  detail: text('detail').notNull().default(''),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export const processedStripeEvents = sqliteTable('processed_stripe_events', {
  id: text('id').primaryKey(),
  createdAt: text('created_at')
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});
