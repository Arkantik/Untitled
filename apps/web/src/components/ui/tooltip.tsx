import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '~/lib/utils';
import type { ComponentProps } from 'react';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 rounded-md bg-foreground px-2.5 py-1 text-xs text-background shadow-sm',
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}
