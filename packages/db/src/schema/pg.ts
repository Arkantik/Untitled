import { pgTable, text, timestamp, uuid, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'scheduled',
  'publishing',
  'published',
  'failed',
]);

export const workspaceRoleEnum = pgEnum('workspace_role', [
  'owner',
  'admin',
  'editor',
  'viewer',
]);

export const socialPlatformEnum = pgEnum('social_platform', [
  'x',
  'bluesky',
  'linkedin',
  'facebook',
  'instagram',
  'threads',
  'discord',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  image: text('image'),
  emailVerified: boolean('email_verified').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workspaces = pgTable('workspaces', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  stripeCustomerId: text('stripe_customer_id').unique(),
  subscriptionStatus: text('subscription_status').notNull().default('none'),
  plan: text('plan').notNull().default('free'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workspaceMembers = pgTable('workspace_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: workspaceRoleEnum('role').notNull().default('editor'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const connectedAccounts = pgTable('connected_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  platform: socialPlatformEnum('platform').notNull(),
  platformAccountId: text('platform_account_id').notNull(),
  platformUsername: text('platform_username'),
  accessToken: text('access_token').notNull(),
  refreshToken: text('refresh_token'),
  tokenExpiresAt: timestamp('token_expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id),
  content: text('content').notNull(),
  status: postStatusEnum('status').notNull().default('draft'),
  scheduledAt: timestamp('scheduled_at'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const postTargets = pgTable('post_targets', {
  id: uuid('id').defaultRandom().primaryKey(),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  connectedAccountId: uuid('connected_account_id')
    .notNull()
    .references(() => connectedAccounts.id, { onDelete: 'cascade' }),
  platformPostId: text('platform_post_id'),
  status: postStatusEnum('status').notNull().default('draft'),
  error: text('error'),
  publishedAt: timestamp('published_at'),
});

export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces),
  memberships: many(workspaceMembers),
  posts: many(posts),
}));

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  owner: one(users, { fields: [workspaces.ownerId], references: [users.id] }),
  members: many(workspaceMembers),
  connectedAccounts: many(connectedAccounts),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  workspace: one(workspaces, { fields: [posts.workspaceId], references: [workspaces.id] }),
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  targets: many(postTargets),
}));

export const postTargetsRelations = relations(postTargets, ({ one }) => ({
  post: one(posts, { fields: [postTargets.postId], references: [posts.id] }),
  connectedAccount: one(connectedAccounts, {
    fields: [postTargets.connectedAccountId],
    references: [connectedAccounts.id],
  }),
}));
