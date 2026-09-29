import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useWorkspaceContext } from '~/contexts/workspace-context';
import { WorkspaceCtx } from '~/contexts/workspace-route-context';
import { Skeleton } from '~/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '~/components/ui/card';

export { useWorkspace } from '~/contexts/workspace-route-context';

export const Route = createFileRoute('/_app/workspace/$workspaceId')({
  component: WorkspaceLayout,
});

function WorkspacePageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Card>
        <CardHeader className="space-y-2 border-b border-border">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="space-y-2 border-b border-border">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="pt-5">
          <Skeleton className="h-9 w-32" />
        </CardContent>
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
