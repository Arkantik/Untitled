import type { AnalyticsRange, PostPerformance, SocialPlatform } from '@veypost/shared';

const MOCK: PostPerformance[] = [
  {
    id: 'p1',
    title: 'Introducing Veypost: schedule once, publish everywhere',
    platforms: ['x', 'bluesky', 'linkedin'] as SocialPlatform[],
    publishedAt: '2026-09-28',
    engagement: 4821,
  },
  {
    id: 'p2',
    title: 'How we built real-time scheduling with BullMQ',
    platforms: ['x', 'linkedin'] as SocialPlatform[],
    publishedAt: '2026-09-24',
    engagement: 3102,
  },
  {
    id: 'p3',
    title: 'Open source announcement: Apache 2.0',
    platforms: ['x', 'bluesky', 'threads'] as SocialPlatform[],
    publishedAt: '2026-09-20',
    engagement: 2744,
  },
  {
    id: 'p4',
    title: 'Discord community is now live, come say hi',
    platforms: ['x', 'discord'] as SocialPlatform[],
    publishedAt: '2026-09-17',
    engagement: 2198,
  },
  {
    id: 'p5',
    title: 'v0.2 ships with team workspaces',
    platforms: ['x', 'bluesky', 'linkedin'] as SocialPlatform[],
    publishedAt: '2026-09-14',
    engagement: 1934,
  },
  {
    id: 'p6',
    title: 'Behind the design: our indigo palette',
    platforms: ['x', 'instagram'] as SocialPlatform[],
    publishedAt: '2026-09-11',
    engagement: 1421,
  },
  {
    id: 'p7',
    title: 'Weekly tip: use the queue to batch your content',
    platforms: ['x', 'bluesky'] as SocialPlatform[],
    publishedAt: '2026-09-09',
    engagement: 1087,
  },
  {
    id: 'p8',
    title: 'Threads integration is now generally available',
    platforms: ['threads', 'instagram'] as SocialPlatform[],
    publishedAt: '2026-09-07',
    engagement: 876,
  },
  {
    id: 'p9',
    title: 'How we handle rate limits across 7 platforms',
    platforms: ['linkedin'] as SocialPlatform[],
    publishedAt: '2026-09-04',
    engagement: 643,
  },
  {
    id: 'p10',
    title: 'Facebook pages support: behind-the-scenes',
    platforms: ['facebook'] as SocialPlatform[],
    publishedAt: '2026-09-02',
    engagement: 312,
  },
  {
    id: 'p11',
    title: 'September content calendar: planning for growth',
    platforms: ['x'] as SocialPlatform[],
    publishedAt: '2026-09-01',
    engagement: 201,
  },
];

const CUTOFF_DAYS: Record<AnalyticsRange, number> = { '7d': 7, '14d': 14, '30d': 30, '90d': 90 };

export function usePostPerformance(_workspaceId: string, range: AnalyticsRange) {
  const cutoff = new Date('2026-09-30');
  cutoff.setDate(cutoff.getDate() - CUTOFF_DAYS[range]);
  const data = MOCK.filter((p) => new Date(p.publishedAt) >= cutoff);
  return { data, isLoading: false };
}
