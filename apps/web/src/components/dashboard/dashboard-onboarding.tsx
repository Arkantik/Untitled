import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Globe02Icon,
  Calendar03Icon,
  Clock01Icon,
  UserAdd01Icon,
  ArrowRight01Icon,
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
          <svg
            viewBox="0 0 16 16"
            className={cn(
              'size-4 text-muted-foreground transition-transform',
              open && 'rotate-180',
            )}
            fill="none"
            aria-hidden
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
            return (
              <div
                key={step.id}
                className="flex cursor-default items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/30"
              >
                {step.done ? (
                  <div
                    className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    aria-hidden
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M1.5 5l2.5 2.5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  <div
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground"
                    aria-hidden
                  >
                    {StepIcon && <HugeiconsIcon icon={StepIcon} size={10} aria-hidden />}
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
                {isNext && (
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={14}
                    className="shrink-0 text-primary"
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
