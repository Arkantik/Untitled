import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useWorkspaceContext } from '~/contexts/workspace-context';
import { WorkspaceCtx } from '~/contexts/workspace-route-context';
import { Skeleton } from '~/components/ui/skeleton';
import { Card } from '~/components/ui/card';

export { useWorkspace } from '~/contexts/workspace-route-context';

export const Route = createFileRoute('/_app/workspace/$workspaceId')({
  component: WorkspaceLayout,
});

function StatCardSkeleton() {
  return (
    <Card className="p-5">
      <Skeleton className="mb-2 h-3 w-24" />
      <Skeleton className="mb-2.5 h-8 w-28" />
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  );
}

function WorkspacePageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-3 compact:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <Card className="p-4">
        <Skeleton className="mb-3 h-3.5 w-28" />
        <Skeleton className="h-45 w-full" />
      </Card>
    </div>
  );
}

function WorkspaceLayout() {
  const { workspaceId } = Route.useParams();
  const { workspaces, isLoading } = useWorkspaceContext();
  const navigate = useNavigate();
  const workspace = workspaces.find((w) => w.id === workspaceId) ?? null;

  useEffect(() => {
    if (!isLoading && !workspace) {
      navigate({ to: '/dashboard' });
    }
  }, [isLoading, workspace]);

  if (isLoading || !workspace) return <WorkspacePageSkeleton />;

  return (
    <WorkspaceCtx.Provider value={workspace}>
      <Outlet />
    </WorkspaceCtx.Provider>
  );
}
