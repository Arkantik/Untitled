import { createFileRoute, redirect } from '@tanstack/react-router';
import { WorkspaceEmptyState } from '~/components/workspace/workspace-empty-state';

export const Route = createFileRoute('/_app/content/posts')({
  beforeLoad: ({ context: { workspaces } }) => {
    const workspaceId = workspaces?.[0]?.id;
    if (workspaceId) {
      throw redirect({ to: '/workspace/$workspaceId/content/posts', params: { workspaceId } });
    }
  },
  component: WorkspaceEmptyState,
});
