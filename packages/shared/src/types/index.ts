export const SocialPlatform = {
  X: 'x',
  Bluesky: 'bluesky',
  LinkedIn: 'linkedin',
  Facebook: 'facebook',
  Instagram: 'instagram',
  Threads: 'threads',
  Discord: 'discord',
} as const;

export type SocialPlatform =
  (typeof SocialPlatform)[keyof typeof SocialPlatform];

export const PostStatus = {
  Draft: 'draft',
  Scheduled: 'scheduled',
  Publishing: 'publishing',
  Published: 'published',
  Failed: 'failed',
} as const;

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];

export const WorkspaceRole = {
  Owner: 'owner',
  Admin: 'admin',
  Editor: 'editor',
  Viewer: 'viewer',
} as const;

export type WorkspaceRole =
  (typeof WorkspaceRole)[keyof typeof WorkspaceRole];
