import { z } from 'zod';
export * from './auth.schema.js';
export * from './workspace.schema.js';
export * from './billing.schema.js';
import { SocialPlatform, PostStatus } from '../types/index.js';

export const connectDiscordSchema = z.object({
  workspaceId: z.string().min(1),
  webhookUrl: z.string().url(),
});
export type ConnectDiscordInput = z.infer<typeof connectDiscordSchema>;

export const connectBlueskySchema = z.object({
  workspaceId: z.string().min(1),
  handle: z.string().min(1),
  appPassword: z.string().min(1),
});
export type ConnectBlueskyInput = z.infer<typeof connectBlueskySchema>;

export const confirmPagesSchema = z.object({
  selectedIds: z.array(z.string().min(1)).min(1),
});
export type ConfirmPagesInput = z.infer<typeof confirmPagesSchema>;

export const createPostSchema = z.object({
  content: z.string().min(1).max(10000),
  platforms: z
    .array(z.enum([
      SocialPlatform.X,
      SocialPlatform.Bluesky,
      SocialPlatform.LinkedIn,
      SocialPlatform.Facebook,
      SocialPlatform.Instagram,
      SocialPlatform.Threads,
      SocialPlatform.Discord,
    ]))
    .min(1),
  scheduledAt: z.iso.datetime().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
