import { createFileRoute } from '@tanstack/react-router';
import { EmptyState } from '~/components/ui/empty-state';
import { Button } from '~/components/ui/button';

export const Route = createFileRoute('/_app/workspace/members')({
  component: WorkspaceMembersPage,
});

function WorkspaceMembersPage() {
  return (
    <EmptyState
      title="Members"
      description="Invite teammates and manage their roles."
      action={<Button>Invite member</Button>}
    />
  );
}
