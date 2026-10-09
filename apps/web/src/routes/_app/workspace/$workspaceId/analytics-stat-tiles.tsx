import { HugeiconsIcon } from '@hugeicons/react';
import { TrendingUpIcon, TrendingDownIcon } from '@hugeicons/core-free-icons';
import { Card } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import { useAnalyticsSummary } from '~/hooks/use-analytics-summary';
import { useCountUp } from '~/hooks/use-count-up';
import type { AnalyticsRange, Metric } from '@veypost/shared';

function DeltaChip({ delta }: { delta: number | null }) {
  if (delta === null) return null;
  const positive = delta >= 0;
  return (
    <Badge tone={positive ? 'success' : 'destructive'}>
      <HugeiconsIcon icon={positive ? TrendingUpIcon : TrendingDownIcon} size={14} aria-hidden />
      {positive ? '+' : ''}
      {delta.toLocaleString()}
    </Badge>
  );
}

function StatTile({ label, metric, period }: { label: string; metric: Metric; period: string }) {
  const count = useCountUp(metric.value, `stat-${label}`);
  return (
    <Card className="p-5">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mb-2.5 font-variant-numeric text-3xl font-bold tabular-nums leading-none">
        {count.toLocaleString()}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <DeltaChip delta={metric.delta} />
        <span className="text-xs text-muted-foreground">{period}</span>
      </div>
    </Card>
  );
}

function StatTileSkeleton() {
  return (
    <Card className="p-5">
      <Skeleton className="mb-2 h-3 w-24" />
      <Skeleton className="mb-2.5 h-8 w-28" />
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  );
}

const LABEL: Record<AnalyticsRange, string> = {
  '7d': 'vs prev 7d',
  '14d': 'vs prev 14d',
  '30d': 'vs prev 30d',
  '90d': 'vs prev 90d',
};

interface Props {
  workspaceId: string;
  range: AnalyticsRange;
}

export function AnalyticsStatTiles({ workspaceId, range }: Props) {
  const { data, isLoading } = useAnalyticsSummary(workspaceId, range);
  const period = LABEL[range];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 regular:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <StatTileSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 regular:grid-cols-3">
      <StatTile label="Total followers" metric={data.followers} period={period} />
      <StatTile label="Engagement" metric={data.engagement} period="likes Â· comments Â· reposts" />
      <StatTile label="Posts published" metric={data.posts} period={period} />
    </div>
  );
}
