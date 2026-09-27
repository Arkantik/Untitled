import { z } from 'zod';
import { SocialPlatform, PostStatus } from '../types/index.js';

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
  scheduledAt: z.string().datetime().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
