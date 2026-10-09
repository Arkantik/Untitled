import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { APP_NAME } from '@veypost/shared';
import { cn } from '~/lib/utils';

type ErrorLayoutProps = {
  code: string;
  eyebrow: string;
  title: string;
  description: ReactNode;
  actions: ReactNode;
  children?: ReactNode;
  tone?: 'brand' | 'destructive';
};

function BrandMark() {
  return (
    <Link
      to="/dashboard"
      className="inline-flex items-center gap-2 rounded-md font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <span className="text-[10px] font-bold leading-none">P</span>
      </div>
      <span className="text-[0.95rem]">{APP_NAME}</span>
    </Link>
  );
}

export function ErrorLayout({
  code,
  eyebrow,
  title,
  description,
  actions,
  children,
  tone = 'brand',
}: ErrorLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -top-40 left-1/2 size-144 -translate-x-1/2 rounded-full blur-3xl',
          tone === 'destructive' ? 'bg-destructive/10' : 'bg-primary/10',
        )}
      />

      <header className="relative flex items-center px-6 py-6 sm:px-10">
        <BrandMark />
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-xl text-center">
          <p
            className={cn(
              'font-mono text-xs font-medium tracking-[0.2em] uppercase',
              tone === 'destructive' ? 'text-destructive' : 'text-primary',
            )}
          >
            {eyebrow}
          </p>

          <div className="relative mt-6 flex items-center justify-center">
            <span
              className={cn(
                'text-[7rem] leading-none font-bold tracking-tight tabular-nums select-none sm:text-[9rem]',
                tone === 'destructive' ? 'text-destructive/20' : 'text-primary/20',
              )}
            >
              {code}
            </span>
          </div>

          <h1 className="mt-6 text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-sm text-muted-foreground">
            {description}
          </p>

          {children ? <div className="mt-6">{children}</div> : null}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {actions}
          </div>
        </div>
      </main>
    </div>
  );
}
