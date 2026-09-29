import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '~/lib/utils';

const root = cva('flex flex-col items-center text-center', {
  variants: {
    size: {
      sm: 'py-8 gap-3',
      md: 'py-12 gap-4',
      lg: 'py-20 gap-5',
    },
  },
  defaultVariants: { size: 'md' },
});

const iconWrap = cva(
  'flex shrink-0 items-center justify-center rounded-2xl border border-border',
  {
    variants: {
      size: {
        sm: 'h-10 w-10',
        md: 'h-14 w-14',
        lg: 'h-[72px] w-[72px]',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

const titleSize = cva('font-semibold text-foreground', {
  variants: {
    size: { sm: 'text-sm', md: 'text-sm', lg: 'text-base' },
  },
  defaultVariants: { size: 'md' },
});

interface Props extends VariantProps<typeof root> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, size, className }: Props) {
  return (
    <div className={cn(root({ size }), className)}>
      {icon && (
        <div
          className={iconWrap({ size })}
          style={{
            background:
              'linear-gradient(145deg, color-mix(in srgb, var(--color-primary) 12%, transparent), color-mix(in srgb, var(--color-primary) 5%, transparent))',
          }}
        >
          {icon}
        </div>
      )}

      <div className="space-y-1.5">
        <p className={titleSize({ size })}>{title}</p>
        {description && (
          <p className="max-w-65 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}
