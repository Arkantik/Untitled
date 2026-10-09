import { lazy, Suspense, useMemo } from 'react';
import { Card } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { usePlatformEngagement } from '~/hooks/use-platform-engagement';
import { PLATFORM_LABEL, PLATFORM_COLOR } from '~/lib/platforms';
import type { AnalyticsRange, PlatformEngagement } from '@veypost/shared';

const LazyBarChart = lazy(() =>
  import('./analytics-bar-chart').then((m) => ({ default: m.BarChartWidget })),
);

interface LegendProps {
  items: { label: string; color: string }[];
}

function Legend({ items }: LegendProps) {
  return (
    <div className="mt-3 flex flex-wrap gap-3 border-t border-border pt-3">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-sm" style={{ background: item.color }} aria-hidden />
          {item.label}
        </span>
      ))}
    </div>
  );
}

const SERIES_COLORS = {
  likes: 'var(--color-primary)',
  comments: 'var(--color-warning)',
  reposts: 'var(--color-success)',
};

const LEGEND_ITEMS = [
  { label: 'Likes', color: SERIES_COLORS.likes },
  { label: 'Comments', color: SERIES_COLORS.comments },
  { label: 'Reposts', color: SERIES_COLORS.reposts },
];

const ROW_WIDTHS = ['w-4/5', 'w-3/5', 'w-11/12', 'w-2/3', 'w-3/4', 'w-1/2'];

function BreakdownSkeletonRows() {
  return (
    <>
      <div className="space-y-3">
        {ROW_WIDTHS.map((width, i) => (
          <div key={i} className="flex h-6 items-center">
            <div className="w-18 shrink-0">
              <Skeleton className="h-3 w-10" />
            </div>
            <Skeleton className={`h-6 ${width}`} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 border-t border-border pt-3">
        {LEGEND_ITEMS.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm" style={{ background: item.color }} aria-hidden />
            <Skeleton className="h-3 w-10" />
          </span>
        ))}
      </div>
    </>
  );
}

interface Props {
  workspaceId: string;
  range: AnalyticsRange;
}

export function AnalyticsPlatformBreakdown({ workspaceId, range }: Props) {
  const { data, isLoading } = usePlatformEngagement(workspaceId, range);

  const rows = useMemo(
    () =>
      data.map((row) => ({
        label: PLATFORM_LABEL[row.platform],
        dotColor: PLATFORM_COLOR[row.platform],
        likes: row.likes,
        comments: row.comments,
        reposts: row.reposts,
      })),
    [data],
  );

  return (
    <div>
      <p className="mb-1 text-sm font-semibold">Engagement by platform</p>
      <p className="mb-3 text-xs text-muted-foreground">Across the selected period</p>
      <Card className="p-5">
        {isLoading ? (
          <BreakdownSkeletonRows />
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No engagement data for this period.</p>
        ) : (
          <>
            <Suspense
              fallback={
                <div className="space-y-2.5">
                  {data.map((row) => (
                    <div key={row.platform} className="flex items-center gap-3">
                      <span className="w-16 shrink-0 text-xs text-muted-foreground">
                        {PLATFORM_LABEL[row.platform]}
                      </span>
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-3 w-8 shrink-0" />
                    </div>
                  ))}
                </div>
              }
            >
              <LazyBarChart
                chartKey={`platform-breakdown-${workspaceId}`}
                rows={rows}
              />
            </Suspense>
            <Legend items={LEGEND_ITEMS} />
          </>
        )}
      </Card>
    </div>
  );
}

export type { PlatformEngagement };
