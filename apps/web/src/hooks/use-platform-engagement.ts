import type { AnalyticsRange, PlatformEngagement } from '@veypost/shared';

const MOCK: Record<AnalyticsRange, PlatformEngagement[]> = {
  '7d': [
    { platform: 'x', likes: 841, comments: 134, reposts: 312, impressions: 28400 },
    { platform: 'bluesky', likes: 612, comments: 89, reposts: 201, impressions: null },
    { platform: 'linkedin', likes: 398, comments: 72, reposts: 54, impressions: 12100 },
    { platform: 'instagram', likes: 654, comments: 41, reposts: 0, impressions: null },
  ],
  '14d': [
    { platform: 'x', likes: 1802, comments: 287, reposts: 634, impressions: 54200 },
    { platform: 'bluesky', likes: 1109, comments: 178, reposts: 412, impressions: null },
    { platform: 'linkedin', likes: 742, comments: 141, reposts: 98, impressions: 23800 },
    { platform: 'instagram', likes: 1203, comments: 88, reposts: 0, impressions: null },
  ],
  '30d': [
    { platform: 'x', likes: 4102, comments: 621, reposts: 1340, impressions: 112000 },
    { platform: 'bluesky', likes: 2341, comments: 389, reposts: 891, impressions: null },
    { platform: 'linkedin', likes: 1621, comments: 312, reposts: 201, impressions: 49000 },
    { platform: 'instagram', likes: 2490, comments: 178, reposts: 0, impressions: null },
    { platform: 'threads', likes: 876, comments: 134, reposts: 67, impressions: null },
  ],
  '90d': [
    { platform: 'x', likes: 10241, comments: 1821, reposts: 3892, impressions: 312000 },
    { platform: 'bluesky', likes: 6102, comments: 989, reposts: 2341, impressions: null },
    { platform: 'linkedin', likes: 4891, comments: 892, reposts: 601, impressions: 134000 },
    { platform: 'instagram', likes: 6234, comments: 489, reposts: 0, impressions: null },
    { platform: 'threads', likes: 2341, comments: 389, reposts: 201, impressions: null },
    { platform: 'facebook', likes: 1102, comments: 212, reposts: 89, impressions: null },
  ],
};

export function usePlatformEngagement(_workspaceId: string, range: AnalyticsRange) {
  return { data: MOCK[range] as PlatformEngagement[], isLoading: false };
}
