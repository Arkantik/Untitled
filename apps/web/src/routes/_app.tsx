import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Sidebar } from '~/components/layout/sidebar';
import { TopBar } from '~/components/layout/top-bar';
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
    } catch {}
  }, []);

  function handleToggle() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem('pulsarr-sidebar-collapsed', String(next));
    } catch {}
  }

  return (
    <div className="flex min-h-screen bg-background">
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/40 regular:hidden',
          'transition-opacity duration-200 ease-in-out',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

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
        <TopBar onMobileOpen={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 regular:px-6 regular:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
