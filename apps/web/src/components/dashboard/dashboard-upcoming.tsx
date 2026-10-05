import { Link } from '@tanstack/react-router';
import { Card } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { EmptyState } from '~/components/ui/empty-state';
import { PlatformIcons } from '~/components/ui/platform-icons';
import type { UpcomingPost } from '@pulsarr/shared';

function formatDayTime(iso: string): { day: string; time: string } {
  const date = new Date(iso);
  return {
    day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
  };
}

function UpcomingRow({ post }: { post: UpcomingPost }) {
  const { day, time } = formatDayTime(post.scheduledAt);
  return (
    <div className="flex gap-3 border-b border-border py-3 last:border-0">
      <div className="w-9 shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {day}
        </p>
        <p className="text-sm font-medium tabular-nums">{time}</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm">{post.content}</p>
        <div className="mt-1.5">
          <PlatformIcons platforms={post.platforms} variant="avatar" />
        </div>
      </div>
    </div>
  );
}

interface Props {
  posts: UpcomingPost[];
  isLoading: boolean;
}

export function DashboardUpcoming({ posts, isLoading }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Coming up</h2>
        <Link
          to="/content/queue"
          className="pt-px text-xs font-medium text-primary hover:underline"
          aria-label="Open post queue"
        >
          Open queue
        </Link>
      </div>
      <div className="px-4 pb-4 pt-1">
        {isLoading ? (
          [0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3 border-b border-border py-3 last:border-0">
              <div className="w-9 shrink-0 space-y-1">
                <Skeleton className="h-2.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))
        ) : posts.length === 0 ? (
          <EmptyState title="Nothing scheduled" size="sm" />
        ) : (
          posts.map((p) => <UpcomingRow key={p.id} post={p} />)
        )}
      </div>
    </Card>
  );
}
