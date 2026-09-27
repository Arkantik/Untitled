import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '~/lib/utils';
import type { ComponentProps } from 'react';

export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'group focus-visible:ring-ring peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'bg-card pointer-events-none block h-4 w-4 rounded-full shadow-sm',
          'transition-[transform,width] duration-100 ease-out',
          'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
          'motion-safe:group-active:w-5 motion-safe:group-active:data-[state=checked]:translate-x-3',
        )}
      />
    </SwitchPrimitive.Root>
  );
}
