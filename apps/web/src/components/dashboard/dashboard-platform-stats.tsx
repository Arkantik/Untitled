import { HugeiconsIcon } from '@hugeicons/react';
import { Card } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { PLATFORM_ICON, PLATFORM_COLOR, PLATFORM_LABEL } from '~/lib/platforms';
import { cn } from '~/lib/utils';
import type { PlatformSummaryItem } from '@pulsarr/shared';

function platformBg(p: PlatformSummaryItem['platform']): string {
  return p === 'x' ? '#0f0f0f' : PLATFORM_COLOR[p];
}

interface Props {
  items: PlatformSummaryItem[];
  isLoading: boolean;
}

export function DashboardPlatformStats({ items, isLoading }: Props) {
  const sorted = [...items].sort((a, b) => b.postsThisWeek - a.postsThisWeek);

  return (
    <Card>
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-semibold">Platforms this week</h2>
      </div>
      <div className="divide-y divide-border px-4 pb-4">
        {isLoading ? (
          [0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 first:pt-0">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-3.5 w-24" />
              <div className="ml-auto flex gap-4">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          ))
        ) : sorted.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">No platforms connected</p>
        ) : (
          sorted.map((item) => {
            const muted = item.postsThisWeek === 0;
            return (
              <div
                key={item.platform}
                className={cn('flex items-center gap-3 py-2.5 first:pt-0', muted && 'opacity-50')}
              >
                <div
                  className="flex size-6 shrink-0 items-center justify-center rounded-full"
                  style={{ background: platformBg(item.platform) }}
                  aria-hidden
                >
                  <HugeiconsIcon icon={PLATFORM_ICON[item.platform]} size={12} className="text-white" />
                </div>
                <span className="flex-1 text-sm">{PLATFORM_LABEL[item.platform]}</span>
                <div className="flex items-center gap-4 text-xs tabular-nums text-muted-foreground">
                  <span title="Posts this week">{item.postsThisWeek} posts</span>
                  <span title="Engagement this week">{item.engagementThisWeek} eng.</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
