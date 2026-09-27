import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '~/lib/utils';
import type { ComponentProps } from 'react';

export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn('text-card-foreground text-sm font-medium select-none peer-disabled:opacity-50', className)}
      {...props}
    />
  );
}
