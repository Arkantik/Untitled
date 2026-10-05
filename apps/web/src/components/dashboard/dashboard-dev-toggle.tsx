// TODO: Remove this component when the dashboard is fully implemented.
// This is a temporary development toggle for testing different states of the dashboard without needing to manipulate the backend or database.

import { cn } from '~/lib/utils';
import type { DashboardSummary } from '@pulsarr/shared';

export type DevState = 'api' | 'no-accounts' | 'no-posts' | 'with-posts';

const now = Date.now();

export const MOCK_DASHBOARD_DATA: Record<Exclude<DevState, 'api'>, DashboardSummary> = {
  'no-accounts': {
    postStats: { scheduled: 0, publishedThisWeek: 0, failed: 0 },
    recentPosts: [],
    upcomingPosts: [],
    hasConnectedAccounts: false,
  },
  'no-posts': {
    postStats: { scheduled: 0, publishedThisWeek: 0, failed: 0 },
    recentPosts: [],
    upcomingPosts: [],
    hasConnectedAccounts: true,
  },
  'with-posts': {
    postStats: { scheduled: 3, publishedThisWeek: 12, failed: 1 },
    recentPosts: [
      {
        id: 'r1',
        content: 'Just launched our new feature, check it out and let us know what you think!',
        status: 'published',
        platforms: ['x', 'bluesky'],
        publishedAt: new Date(now - 2 * 3600000).toISOString(),
      },
      {
        id: 'r2',
        content: 'Behind the scenes look at our team working remotely across time zones.',
        status: 'published',
        platforms: ['instagram', 'threads'],
        publishedAt: new Date(now - 5 * 3600000).toISOString(),
      },
      {
        id: 'r3',
        content: 'Failed to post this update due to rate limiting on the primary account.',
        status: 'failed',
        platforms: ['x'],
        publishedAt: new Date(now - 86400000).toISOString(),
      },
    ],
    upcomingPosts: [
      {
        id: 'u1',
        content: 'Weekly roundup: our best content from this week and what to expect next.',
        platforms: ['x', 'linkedin', 'bluesky'],
        scheduledAt: new Date(now + 2 * 3600000).toISOString(),
      },
      {
        id: 'u2',
        content: 'Product update coming this Friday, stay tuned for something exciting!',
        platforms: ['x', 'instagram'],
        scheduledAt: new Date(now + 86400000).toISOString(),
      },
    ],
    hasConnectedAccounts: true,
  },
};

const LABELS: Record<DevState, string> = {
  api: 'Api',
  'no-accounts': 'No accounts',
  'no-posts': 'No posts',
  'with-posts': 'With posts',
};

interface Props {
  value: DevState;
  onChange: (state: DevState) => void;
}

export function DashboardDevToggle({ value, onChange }: Props) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-1 rounded-lg border border-border bg-card p-1 shadow-lg">
      {(Object.keys(LABELS) as DevState[]).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={cn(
            'rounded px-2.5 py-1 text-xs font-medium transition-colors',
            value === s
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted',
          )}
        >
          {LABELS[s]}
        </button>
      ))}
    </div>
  );
}
