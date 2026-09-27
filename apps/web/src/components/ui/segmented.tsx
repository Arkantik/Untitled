import { cn } from '~/lib/utils';
import type { ReactNode } from 'react';

export type SegmentedOption<T extends string> = {
  value: T;
  label: ReactNode;
  disabled?: boolean;
};

type SegmentedProps<T extends string> = {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedProps<T>) {
  const enabled = options.filter((option) => !option.disabled);

  function move(delta: number) {
    if (enabled.length === 0) return;
    const currentIndex = enabled.findIndex((option) => option.value === value);
    const next = enabled[(currentIndex + delta + enabled.length) % enabled.length];
    if (next) onChange(next.value);
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('border-input flex overflow-hidden rounded-md border', className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={option.disabled}
            tabIndex={option.disabled ? -1 : selected ? 0 : -1}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                move(1);
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                move(-1);
              }
            }}
            className={cn(
              'focus-visible:ring-ring flex flex-1 items-center justify-center gap-1.5 border-l px-2 py-2 text-xs font-medium whitespace-nowrap transition-colors first:border-l-0 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset border-border',
              selected && 'bg-primary/12 text-primary',
              !selected &&
                !option.disabled &&
                'text-muted-foreground hover:bg-muted active:bg-accent cursor-pointer',
              option.disabled && 'text-muted-foreground/55 bg-muted/40 cursor-not-allowed',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
