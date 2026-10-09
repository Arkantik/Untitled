import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Sidebar } from '~/components/layout/sidebar';
import { TopBar } from '~/components/layout/top-bar';
import { cn } from '~/lib/utils';
import { WorkspaceProvider } from '~/contexts/workspace-context';
import type { WorkspaceRow } from '~/contexts/workspace-context';
import { fetchSession } from '~/server/session';
import { fetchWorkspaces } from '~/server/workspaces';

export const Route = createFileRoute('/_app')({
  beforeLoad: async () => {
    const user = await fetchSession();
    if (!user) throw redirect({ to: '/login' });
    const workspaces = await fetchWorkspaces().catch((): WorkspaceRow[] => []);
    return { user, workspaces };
  },
  component: AppLayout,
});

function AppLayout() {
  const { workspaces } = Route.useRouteContext();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('veypost-sidebar-collapsed');
      if (stored !== null) setCollapsed(stored === 'true');
    } catch {}
  }, []);

  function handleToggle() {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem('veypost-sidebar-collapsed', String(next));
    } catch {}
  }

  return (
    <WorkspaceProvider initialData={workspaces}>
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
          'relative flex min-w-0 flex-1 flex-col',
          'transition-[margin-left] duration-200 ease-in-out',
          collapsed ? 'regular:ml-16' : 'regular:ml-60',
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-96 overflow-hidden"
          style={{
            maskImage: 'radial-gradient(100% 80% at 50% 0, black 45%, transparent)',
            WebkitMaskImage: 'radial-gradient(100% 80% at 50% 0, black 45%, transparent)',
          }}
        >
          <div className="absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 animate-aura-float-a rounded-full bg-primary opacity-[0.25] blur-[80px]" />
          <div className="absolute top-4 right-1/3 h-56 w-56 animate-aura-float-b rounded-full bg-primary opacity-[0.12] blur-[70px]" />
        </div>

        <TopBar onMobileOpen={() => setMobileOpen(true)} scrolled={scrolled} />

        <main
          className="relative flex-1 overflow-y-auto"
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
        >
          <div className="relative z-10 mx-auto max-w-page px-4 py-6 regular:px-6 regular:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
    </WorkspaceProvider>
  );
}
