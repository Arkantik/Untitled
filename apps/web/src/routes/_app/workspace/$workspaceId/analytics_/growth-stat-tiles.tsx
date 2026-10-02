import { HugeiconsIcon } from '@hugeicons/react';
import { Card } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { useCountUp } from '~/hooks/use-count-up';
import { PLATFORM_ICON, PLATFORM_COLOR } from '~/lib/platforms';
import type { FollowerSeries } from '@pulsarr/shared';

interface Props {
  workspaceId: string;
  total: number;
  totalNew: number;
  best: FollowerSeries | null;
  accountCount: number;
  isLoading: boolean;
}

export function GrowthStatTiles({ workspaceId, total, totalNew, best, accountCount, isLoading }: Props) {
  const animatedTotal = useCountUp(total, `growth-total-${workspaceId}`);
  const animatedNew = useCountUp(totalNew, `growth-new-${workspaceId}`);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 compact:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="mb-1 h-3 w-24" />
            <Skeleton className="mt-1 h-7 w-32" />
            <Skeleton className="mt-0.5 h-3 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 compact:grid-cols-3">
      <Card className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Total followers
        </p>
        <p className="mt-1 truncate text-xl font-bold tabular-nums">
          {animatedTotal.toLocaleString()}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          +{animatedNew.toLocaleString()} this period
        </p>
      </Card>
      <Card className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          New this period
        </p>
        <p className="mt-1 truncate text-xl font-bold tabular-nums">
          +{animatedNew.toLocaleString()}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">across {accountCount} accounts</p>
      </Card>
      <Card className="relative overflow-hidden p-4">
        {best && (
          <div
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full"
            style={{
              background: `color-mix(in srgb, ${PLATFORM_COLOR[best.platform]} 15%, transparent)`,
            }}
          >
            <HugeiconsIcon
              icon={PLATFORM_ICON[best.platform]}
              size={16}
              style={{ color: PLATFORM_COLOR[best.platform] }}
              aria-hidden
            />
          </div>
        )}
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Best account
        </p>
        <p className="mt-1 truncate text-xl font-bold tabular-nums">
          {best ? best.handle : '-'}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {best
            ? `+${(best.current - (best.series[0] ?? best.current)).toLocaleString()} followers`
            : ''}
        </p>
      </Card>
    </div>
  );
}
