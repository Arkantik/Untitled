import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useWorkspace } from '~/contexts/workspace-route-context';
import { useUpdateWorkspace, useDeleteWorkspace } from '~/hooks/use-workspaces';
import { IdentityCard } from './overview-identity-card';
import { DeleteWorkspaceCard, LeaveWorkspaceCard } from './overview-danger-zone';
import type { SessionUser } from '~/server/session';

export const Route = createFileRoute('/_app/workspace/$workspaceId/overview')({
  component: WorkspaceOverviewPage,
});

function WorkspaceOverviewPage() {
  const navigate = useNavigate();
  const workspace = useWorkspace();
  const { user } = Route.useRouteContext() as { user: SessionUser };
  const updateWorkspace = useUpdateWorkspace(workspace.id);
  const deleteWorkspace = useDeleteWorkspace();
  const isOwner = user.id === workspace.ownerId;

  function handleSave(name: string, timezone: string, avatarUrl?: string | null) {
    updateWorkspace.mutate({ name, timezone, ...(avatarUrl !== undefined && { avatarUrl }) });
  }

  function handleDelete() {
    deleteWorkspace.mutate(workspace.id, {
      onSuccess: () => navigate({ to: '/dashboard' }),
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Workspace settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your workspace preferences, team, and integrations.
        </p>
      </div>

      <IdentityCard
        key={workspace.id}
        initialName={workspace.name}
        initialTimezone={workspace.timezone ?? 'UTC'}
        initialAvatarUrl={workspace.avatarUrl ?? null}
        onSave={handleSave}
        isSaving={updateWorkspace.isPending}
      />

      {isOwner ? (
        <DeleteWorkspaceCard
          workspaceName={workspace.name}
          onDelete={handleDelete}
          isDeleting={deleteWorkspace.isPending}
        />
      ) : (
        <LeaveWorkspaceCard workspaceName={workspace.name} />
      )}
    </div>
  );
}
