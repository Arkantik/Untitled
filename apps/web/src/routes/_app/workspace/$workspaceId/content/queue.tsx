import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/workspace/$workspaceId/content/queue')({
  component: QueuePage,
});

function QueuePage() {
  return (
    <EmptyState
      icon={<HugeiconsIcon icon={Clock01Icon} />}
      title="Queue"
      description="Your weekly posting schedule slots will appear here."
    />
  );
}
