export const SocialPlatform = {
  X: 'x',
  Bluesky: 'bluesky',
  LinkedIn: 'linkedin',
  Facebook: 'facebook',
  Instagram: 'instagram',
  Threads: 'threads',
  Discord: 'discord',
} as const;

export type SocialPlatform = (typeof SocialPlatform)[keyof typeof SocialPlatform];

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

export type WorkspaceRole = (typeof WorkspaceRole)[keyof typeof WorkspaceRole];

export type AnalyticsRange = '7d' | '14d' | '30d' | '90d';

export type { DashboardPostStats, RecentPost, UpcomingPost, DashboardSummary } from './dashboard.js';

export interface Metric {
  value: number;
  delta: number | null;
}

export interface AnalyticsSummary {
  followers: Metric;
  engagement: Metric;
  posts: Metric;
}

export interface FollowerSeries {
  accountId: string;
  platform: SocialPlatform;
  handle: string;
  current: number;
  series: number[];
}

export interface PostPerformance {
  id: string;
  title: string;
  platforms: SocialPlatform[];
  publishedAt: string;
  engagement: number;
}

export interface PlatformEngagement {
  platform: SocialPlatform;
  likes: number;
  comments: number;
  reposts: number;
  impressions: number | null;
}

export type AccountStatus = 'active' | 'expired' | 'error';

export interface PlatformSummaryItem {
  platform: SocialPlatform;
  postsThisWeek: number;
  engagementThisWeek: number;
}

export interface ConnectedAccount {
  id: string;
  platform: SocialPlatform;
  username: string | null;
  avatarUrl: string | null;
  status: AccountStatus;
  connectedAt: string;
}

export interface PageOption {
  id: string;
  name: string;
  platformType: SocialPlatform;
  avatarUrl: string | null;
}

export interface PendingPagesResult {
  platform: string;
  pages: PageOption[];
}

export interface PostTarget {
  id: string;
  postId: string;
  connectedAccountId: string;
  platform: SocialPlatform;
  status: PostStatus;
  error: string | null;
  publishedAt: string | null;
}

export interface Post {
  id: string;
  workspaceId: string;
  authorId: string;
  content: string;
  status: PostStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostWithTargets extends Post {
  targets: PostTarget[];
}
