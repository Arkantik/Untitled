import { HugeiconsIcon } from '@hugeicons/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { PLATFORM_ICON, PLATFORM_COLOR, PLATFORM_LABEL, PLATFORM_BG } from '~/lib/platforms';
import type { SocialPlatform } from '@pulsarr/shared';

interface Props {
  platforms: SocialPlatform[];
  size?: number;
  variant?: 'inline' | 'avatar';
}

export function PlatformIcons({ platforms, size = 14, variant = 'inline' }: Props) {
  return (
    <TooltipProvider>
      {variant === 'avatar' ? (
        <div className="flex -space-x-1.5">
          {platforms.map((p) => (
            <Tooltip key={p}>
              <TooltipTrigger asChild>
                <div
                  className="flex size-5 shrink-0 items-center justify-center rounded-full ring-1 ring-card"
                  style={{ background: PLATFORM_BG[p] }}
                >
                  <HugeiconsIcon
                    icon={PLATFORM_ICON[p]}
                    size={12}
                    className="text-white"
                    aria-hidden
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">{PLATFORM_LABEL[p]}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      ) : (
        <span className="flex items-center gap-0.5">
          {platforms.map((p) => (
            <Tooltip key={p}>
              <TooltipTrigger asChild>
                <span>
                  <HugeiconsIcon
                    icon={PLATFORM_ICON[p]}
                    size={size}
                    style={{ color: PLATFORM_COLOR[p] }}
                    aria-hidden
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom">{PLATFORM_LABEL[p]}</TooltipContent>
            </Tooltip>
          ))}
        </span>
      )}
    </TooltipProvider>
  );
}
