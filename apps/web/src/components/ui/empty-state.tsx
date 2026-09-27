import { cn } from '~/lib/utils';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-border bg-card flex flex-col items-center rounded-md border border-dashed px-6 py-16 text-center',
        className,
      )}
    >
      {icon ? (
        <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-md [&_svg]:size-6">
          {icon}
        </div>
      ) : null}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mt-2 max-w-md text-sm text-pretty">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
