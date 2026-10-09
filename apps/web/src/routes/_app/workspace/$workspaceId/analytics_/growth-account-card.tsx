import { lazy, Suspense } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Card } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import { PLATFORM_ICON, PLATFORM_COLOR } from '~/lib/platforms';
import type { FollowerSeries } from '@veypost/shared';

const LazyAreaChart = lazy(() =>
  import('../analytics-area-chart').then((m) => ({ default: m.AreaChartWidget })),
);

export function AccountCard({ acc }: { acc: FollowerSeries }) {
  const delta = acc.current - (acc.series[0] ?? acc.current);
  const pct = ((delta / (acc.series[0] ?? acc.current)) * 100).toFixed(1);
  const peak = Math.max(...acc.series);
  const days = acc.series.length;
  const color = PLATFORM_COLOR[acc.platform];

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <HugeiconsIcon
          icon={PLATFORM_ICON[acc.platform]}
          size={16}
          style={{ color }}
          className="shrink-0"
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{acc.handle}</span>
        <span className="shrink-0 text-sm font-bold tabular-nums">
          {acc.current.toLocaleString()}
        </span>
        <Badge tone={delta >= 0 ? 'success' : 'destructive'} className="shrink-0">
          {delta >= 0 ? '+' : ''}
          {delta.toLocaleString()}
        </Badge>
      </div>
      <div className="px-1 pt-3 pb-2">
        <Suspense fallback={<Skeleton className="mx-3 h-18 w-full" />}>
          <LazyAreaChart series={acc.series} gradientId={`fg-${acc.accountId}`} />
        </Suspense>
      </div>
      <div className="flex border-t border-border">
        {[
          { label: 'Growth', val: `${delta >= 0 ? '+' : ''}${pct}%` },
          { label: 'Peak', val: peak.toLocaleString() },
          { label: 'Per day', val: `+${Math.round(delta / days).toLocaleString()}` },
        ].map(({ label, val }, i, arr) => (
          <div
            key={label}
            className={`flex-1 px-4 py-2.5 text-center ${i < arr.length - 1 ? 'border-r border-border' : ''}`}
          >
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="text-[13px] font-semibold tabular-nums">{val}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
