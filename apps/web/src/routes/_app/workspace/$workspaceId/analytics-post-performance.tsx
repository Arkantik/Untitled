import { Card } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import { usePostPerformance } from '~/hooks/use-post-performance';
import type { AnalyticsRange, PostPerformance, SocialPlatform } from '@pulsarr/shared';

const PLATFORM_DOT_COLOR: Record<SocialPlatform, string> = {
  x: '#000000',
  bluesky: '#1d9bf0',
  linkedin: '#2867b2',
  facebook: '#1877f2',
  instagram: '#e1306c',
  threads: '#a8a8a8',
  discord: '#5865f2',
};

function PlatformDots({ platforms }: { platforms: SocialPlatform[] }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {platforms.map((p) => (
        <span
          key={p}
          className="h-1.25 w-1.25 rounded-full"
          style={{ background: PLATFORM_DOT_COLOR[p] }}
        />
      ))}
    </span>
  );
}

function PostRow({
  post,
  rank,
  variant,
}: {
  post: PostPerformance;
  rank: number;
  variant: 'good' | 'muted';
}) {
  const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex min-w-0 items-center gap-2.5 border-b border-border px-4 py-2.5 last:border-b-0 hover:bg-muted">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
          variant === 'good' ? 'bg-success/12 text-success' : 'bg-muted text-muted-foreground'
        }`}
      >
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px]">{post.title}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <PlatformDots platforms={post.platforms} />
          <span className="text-[11px] text-muted-foreground">{date}</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <span className="block text-[13px] font-semibold tabular-nums">
          {post.engagement.toLocaleString()}
        </span>
        <span className="text-[10px] text-muted-foreground">engagement</span>
      </div>
    </div>
  );
}

function PostListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 border-b border-border px-4 py-2.5 last:border-b-0"
        >
          <Skeleton className="h-5 w-5 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
          <Skeleton className="h-5 w-10" />
        </div>
      ))}
    </>
  );
}

interface Props {
  workspaceId: string;
  range: AnalyticsRange;
}

export function AnalyticsPostPerformance({ workspaceId, range }: Props) {
  const { data, isLoading } = usePostPerformance(workspaceId, range);

  const sorted = [...data].sort((a, b) => b.engagement - a.engagement);
  const multiCard = sorted.length >= 10;
  const best = sorted.slice(0, 5);
  const worst = sorted.slice(-5).reverse();

  return (
    <div>
      <p className="mb-1 text-sm font-semibold">Post performance</p>
      <p className="mb-3 text-xs text-muted-foreground">Ranked by total engagement for the selected period</p>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 regular:grid-cols-2">
          {[0, 1].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="border-b border-border px-4 py-3">
                <Skeleton className="h-4 w-28" />
              </div>
              <PostListSkeleton />
            </Card>
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts published in this period.</p>
      ) : multiCard ? (
        <div className="grid grid-cols-1 gap-3 regular:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="text-[13px] font-semibold">Best performing</span>
              <Badge tone="success">top 5</Badge>
            </div>
            {best.map((p, i) => (
              <PostRow key={p.id} post={p} rank={i + 1} variant="good" />
            ))}
          </Card>
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="text-[13px] font-semibold">Needs attention</span>
              <Badge tone="neutral">bottom 5</Badge>
            </div>
            {worst.map((p, i) => (
              <PostRow key={p.id} post={p} rank={sorted.length - i} variant="muted" />
            ))}
          </Card>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <span className="text-[13px] font-semibold">Posts by engagement</span>
          </div>
          {sorted.map((p, i) => (
            <PostRow key={p.id} post={p} rank={i + 1} variant="good" />
          ))}
        </Card>
      )}
    </div>
  );
}
