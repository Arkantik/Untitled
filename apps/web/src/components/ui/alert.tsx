import { cn } from '~/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
} from '@hugeicons/core-free-icons';
import type { ReactNode } from 'react';

const TONE = {
  error: { box: 'border-destructive/30 bg-destructive/10 text-destructive', Icon: AlertCircleIcon },
  success: { box: 'border-success/30 bg-success/10 text-success', Icon: CheckmarkCircle01Icon },
  info: { box: 'border-primary/40 bg-primary/5 text-primary', Icon: InformationCircleIcon },
} as const;

export function Alert({
  tone = 'info',
  children,
  className,
}: {
  tone?: keyof typeof TONE;
  children: ReactNode;
  className?: string;
}) {
  const { box, Icon } = TONE[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex gap-2.5 rounded-md border px-3 py-2.5 text-sm', box, className)}
    >
      <HugeiconsIcon icon={Icon} className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
