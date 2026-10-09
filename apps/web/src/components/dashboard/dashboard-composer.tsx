import { useState, forwardRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon, SendHorizontalIcon } from '@hugeicons/core-free-icons';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { PLATFORM_LABEL, PLATFORM_COLOR, PLATFORM_ICON } from '~/lib/platforms';
import { toast } from '~/components/ui/toast';
import { cn } from '~/lib/utils';
import type { SocialPlatform } from '@veypost/shared';

const SHOWN_PLATFORMS: SocialPlatform[] = ['x', 'linkedin', 'facebook', 'instagram', 'threads', 'discord', 'bluesky'];
const COMING_SOON = new Set<SocialPlatform>(['bluesky']);

const PLATFORM_LIMIT: Record<SocialPlatform, number> = {
  x: 280,
  bluesky: 300,
  linkedin: 3000,
  facebook: 63206,
  instagram: 2200,
  threads: 500,
  discord: 2000,
};

export const DashboardComposer = forwardRef<HTMLTextAreaElement>(function DashboardComposer(_, ref) {
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<Set<SocialPlatform>>(
    new Set(['x', 'linkedin'] as SocialPlatform[]),
  );

  function togglePlatform(p: SocialPlatform) {
    setPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) {
        next.delete(p);
      } else {
        next.add(p);
      }
      return next;
    });
  }

  const activeLimits = [...platforms].map((p) => PLATFORM_LIMIT[p]);
  const limit = activeLimits.length > 0 ? Math.min(...activeLimits) : 280;
  const remaining = limit - content.length;
  const pctUsed = content.length / limit;
  const canSubmit = content.trim().length > 0 && remaining >= 0;

  return (
    <Card className="transition-shadow duration-200 focus-within:ring-2 focus-within:ring-primary">
      <div className="p-4 pb-3">
        <textarea
          ref={ref}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? It autosaves as you go."
          rows={3}
          className="lg:min-h-28 w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-2 border-t border-border px-4 py-3" data-testid="composer-footer">
        <div className="flex w-full flex-wrap gap-1.5 compact:w-auto compact:flex-1">
          {SHOWN_PLATFORMS.map((p) => {
            const soon = COMING_SOON.has(p);
            return (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                aria-pressed={platforms.has(p)}
                aria-label={`Toggle ${PLATFORM_LABEL[p]}`}
                disabled={soon}
                className={cn(
                  'relative flex items-center gap-1.5 rounded border border-border px-2.5 py-0.5 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
                  platforms.has(p)
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <HugeiconsIcon
                  icon={PLATFORM_ICON[p]}
                  size={14}
                  aria-hidden
                  style={{ color: PLATFORM_COLOR[p], opacity: platforms.has(p) ? 1 : 0.45 }}
                />
                {PLATFORM_LABEL[p]}
                {soon && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none text-muted-foreground">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex w-full items-center justify-end gap-2 compact:w-auto">
          <span
            className={cn(
              'shrink-0 text-xs tabular-nums',
              pctUsed >= 1 ? 'text-destructive' : pctUsed >= 0.8 ? 'text-warning' : 'text-muted-foreground',
            )}
          >
            {remaining}
          </span>
          <Button
            type="button"
            variant="ghost-outline"
            size="sm"
            disabled={!content.trim()}
            onClick={() => toast.info('Draft saving coming in a future update.')}
          >
            Save draft
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!canSubmit}
            onClick={() => toast.info('Post publishing coming in a future update.')}
          >
            <HugeiconsIcon icon={SendHorizontalIcon} size={14} aria-hidden />
            Publish
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!canSubmit}
            onClick={() => toast.info('Post scheduling coming in a future update.')}
          >
            <HugeiconsIcon icon={Calendar03Icon} size={14} aria-hidden />
            Schedule
          </Button>
        </div>
      </div>
    </Card>
  );
});
