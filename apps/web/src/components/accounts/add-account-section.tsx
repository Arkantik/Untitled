import { HugeiconsIcon } from '@hugeicons/react';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { PLATFORM_ICON, PLATFORM_COLOR, PLATFORM_LABEL } from '~/lib/platforms';
import { toast } from '~/components/ui/toast';
import type { SocialPlatform } from '@pulsarr/shared';

const PLATFORMS: SocialPlatform[] = [
  'x',
  'bluesky',
  'linkedin',
  'facebook',
  'instagram',
  'threads',
  'discord',
];

export function AddAccountSection() {
  function handleAdd(platform: SocialPlatform) {
    toast.info(`${PLATFORM_LABEL[platform]} OAuth coming in a future update.`);
  }

  return (
    <Card className="p-4">
      <p className="mb-3 text-sm font-semibold">Connect an account</p>
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p) => {
          const color = p === 'x' ? '#0f0f0f' : PLATFORM_COLOR[p];
          return (
            <Button
              key={p}
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleAdd(p)}
            >
              <span
                className="flex size-5 items-center justify-center rounded-full"
                style={{ background: color }}
                aria-hidden
              >
                <HugeiconsIcon icon={PLATFORM_ICON[p]} size={12} className="text-white" />
              </span>
              {PLATFORM_LABEL[p]}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
