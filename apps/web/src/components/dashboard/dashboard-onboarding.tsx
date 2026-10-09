import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Globe02Icon,
  Calendar03Icon,
  Clock01Icon,
  UserAdd01Icon,
  ArrowRight01Icon,
  Tick01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons';
import { Card } from '~/components/ui/card';
import { cn } from '~/lib/utils';
import type { IconSvgElement } from '@hugeicons/react';

const STEP_ICONS: Record<string, IconSvgElement> = {
  accounts: Globe02Icon,
  post: Calendar03Icon,
  timezone: Clock01Icon,
  team: UserAdd01Icon,
};

export interface OnboardingStep {
  id: string;
  label: string;
  done: boolean;
  href?: string;
  onAction?: () => void;
}

interface Props {
  steps: OnboardingStep[];
}

export function DashboardOnboarding({ steps }: Props) {
  const [open, setOpen] = useState(true);
  const done = steps.filter((s) => s.done).length;
  const total = steps.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const nextIdx = steps.findIndex((s) => !s.done);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/40"
        aria-expanded={open}
      >
        <div>
          <p className="font-semibold">Finish setting up</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            A few steps to get the most out of your workspace.
          </p>
        </div>
        <div className="ml-4 flex shrink-0 items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {done} / {total}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')}
            aria-hidden
          />
        </div>
      </button>

      <div className="h-1 overflow-hidden bg-muted">
        <div
          className="h-full bg-primary transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {open && (
        <div className="py-1">
          {steps.map((step, idx) => {
            const isNext = idx === nextIdx;
            const StepIcon = STEP_ICONS[step.id];
            const isClickable = !step.done && (!!step.href || !!step.onAction);
            const rowClass = cn(
              'flex items-center gap-3 px-4 py-2.5 transition-colors',
              isClickable
                ? 'cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                : 'cursor-default hover:bg-muted/30',
            );
            const inner = (
              <>
                {step.done ? (
                  <div
                    className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    aria-hidden
                  >
                    <HugeiconsIcon icon={Tick01Icon} size={12} aria-hidden />
                  </div>
                ) : (
                  <div
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground"
                    aria-hidden
                  >
                    {StepIcon && <HugeiconsIcon icon={StepIcon} size={12} aria-hidden />}
                  </div>
                )}
                <span
                  className={cn(
                    'flex-1 text-sm',
                    step.done && 'text-muted-foreground line-through',
                    isNext && 'font-medium',
                  )}
                >
                  {step.label}
                </span>
                {!step.done && (
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={14}
                    className={cn(
                      'shrink-0',
                      isClickable ? 'text-primary' : 'text-muted-foreground/40',
                    )}
                    aria-hidden
                  />
                )}
              </>
            );
            if (step.onAction) {
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={step.onAction}
                  className={cn(rowClass, 'w-full text-left')}
                >
                  {inner}
                </button>
              );
            }
            return isClickable ? (
              <Link key={step.id} to={step.href} className={rowClass}>
                {inner}
              </Link>
            ) : (
              <div key={step.id} className={rowClass}>
                {inner}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
