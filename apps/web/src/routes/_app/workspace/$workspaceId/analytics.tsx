import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { BarChartIcon } from '@hugeicons/core-free-icons';
import { useWorkspace } from '~/contexts/workspace-route-context';
import { Segmented } from '~/components/ui/segmented';
import { EmptyState } from '~/components/ui/empty-state';
import { Button } from '~/components/ui/button';
import { useFollowerGrowth } from '~/hooks/use-follower-growth';
import { AnalyticsStatTiles } from './analytics-stat-tiles';
import { AnalyticsFollowerGrowth } from './analytics-follower-growth';
import { AnalyticsPostPerformance } from './analytics-post-performance';
import { AnalyticsPlatformBreakdown } from './analytics-platform-breakdown';
import type { AnalyticsRange } from '@veypost/shared';

const VALID_RANGES = ['7d', '14d', '30d', '90d'] as const;

export const Route = createFileRoute('/_app/workspace/$workspaceId/analytics')({
  validateSearch: (search: Record<string, unknown>) => ({
    range: (VALID_RANGES.includes(search.range as AnalyticsRange)
      ? search.range
      : '30d') as AnalyticsRange,
  }),
  component: AnalyticsPage,
});

const RANGE_OPTIONS = [
  { value: '7d' as const, label: '7d' },
  { value: '14d' as const, label: '14d' },
  { value: '30d' as const, label: '30d' },
  { value: '90d' as const, label: '90d' },
];

function AnalyticsPage() {
  const workspace = useWorkspace();
  const { range } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  function setRange(newRange: AnalyticsRange) {
    navigate({ search: { range: newRange }, replace: true });
  }

  const { data: growth, isLoading: growthLoading } = useFollowerGrowth(workspace.id, range);
  const hasNoAccounts = !growthLoading && growth.length === 0;

  if (hasNoAccounts) {
    return (
      <EmptyState
        icon={<HugeiconsIcon icon={BarChartIcon} size={28} aria-hidden />}
        title="No accounts connected"
        description="Connect a social account to start tracking follower growth and engagement."
        action={
          <Button asChild>
            <Link to="/workspace/$workspaceId/accounts" params={{ workspaceId: workspace.id }}>Connect an account</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Follower growth and post engagement for {workspace.name}.
          </p>
        </div>
        <Segmented options={RANGE_OPTIONS} value={range} onChange={setRange} label="Time range" />
      </div>

      <AnalyticsStatTiles workspaceId={workspace.id} range={range} />

      <AnalyticsFollowerGrowth workspaceId={workspace.id} range={range} />
      <AnalyticsPostPerformance workspaceId={workspace.id} range={range} />
      <AnalyticsPlatformBreakdown workspaceId={workspace.id} range={range} />
    </div>
  );
}
