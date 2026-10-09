import { createFileRoute, redirect } from '@tanstack/react-router';
import { WorkspaceEmptyState } from '~/components/workspace/workspace-empty-state';

export const Route = createFileRoute('/_app/accounts')({
  beforeLoad: ({ context: { workspaces } }) => {
    const workspaceId = workspaces?.[0]?.id;
    if (workspaceId) {
      throw redirect({ to: '/workspace/$workspaceId/accounts', params: { workspaceId } });
    }
  },
  component: WorkspaceEmptyState,
});
