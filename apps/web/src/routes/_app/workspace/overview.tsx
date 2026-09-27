import { createFileRoute } from '@tanstack/react-router';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/workspace/overview')({
  component: WorkspaceOverviewPage,
});

function WorkspaceOverviewPage() {
  return (
    <EmptyState
      title="Workspace overview"
      description="Manage your workspace name, photo, and timezone."
    />
  );
}
