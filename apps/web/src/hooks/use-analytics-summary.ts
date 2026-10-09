import type { AnalyticsRange, AnalyticsSummary } from '@veypost/shared';

const MOCK: Record<AnalyticsRange, AnalyticsSummary> = {
  '7d': {
    followers: { value: 23451, delta: 312 },
    engagement: { value: 3241, delta: -89 },
    posts: { value: 7, delta: 1 },
  },
  '14d': {
    followers: { value: 23451, delta: 698 },
    engagement: { value: 6904, delta: 201 },
    posts: { value: 14, delta: 2 },
  },
  '30d': {
    followers: { value: 23451, delta: 1847 },
    engagement: { value: 14892, delta: -423 },
    posts: { value: 31, delta: 8 },
  },
  '90d': {
    followers: { value: 23451, delta: 4102 },
    engagement: { value: 41230, delta: 3819 },
    posts: { value: 87, delta: 21 },
  },
};

export function useAnalyticsSummary(_workspaceId: string, range: AnalyticsRange) {
  return { data: MOCK[range] as AnalyticsSummary, isLoading: false };
}
