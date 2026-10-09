import { createFileRoute, redirect } from '@tanstack/react-router';
import { WorkspaceEmptyState } from '~/components/workspace/workspace-empty-state';

export const Route = createFileRoute('/_app/sync')({
  beforeLoad: ({ context: { workspaces } }) => {
    const workspaceId = workspaces?.[0]?.id;
    if (workspaceId) {
      throw redirect({ to: '/workspace/$workspaceId/sync', params: { workspaceId } });
    }
  },
  component: WorkspaceEmptyState,
});
