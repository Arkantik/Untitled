import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon } from '@hugeicons/core-free-icons';
import { APP_NAME } from '@pulsarr/shared';
import { Sidebar } from '~/components/layout/sidebar';
import { cn } from '~/lib/utils';

export const Route = createFileRoute('/_app')({
  component: AppLayout,
});

function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pulsarr-sidebar-collapsed');
      if (stored !== null) setCollapsed(stored === 'true');
    } catch {
      // localStorage unavailable — leave default
    }
  }, []);

  function handleToggle() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem('pulsarr-sidebar-collapsed', String(next));
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile backdrop — closes sidebar on tap outside */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 regular:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          'transition-[margin-left] duration-200 ease-in-out',
          collapsed ? 'regular:ml-16' : 'regular:ml-60',
        )}
      >
        {/* Mobile top bar — hidden on desktop */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b border-border bg-card px-4 regular:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:transition-transform [&_svg]:duration-120 [&_svg]:ease-out [&:hover_svg]:scale-110 [&:hover_svg]:-rotate-6"
          >
            <HugeiconsIcon icon={Menu01Icon} className="size-5" aria-hidden />
          </button>
          <span className="ml-3 text-sm font-semibold tracking-tight">{APP_NAME}</span>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 regular:px-6 regular:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
