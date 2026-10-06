import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { BubbleChatIcon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/workspace/$workspaceId/inbox/messages')({
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <EmptyState
      icon={<HugeiconsIcon icon={BubbleChatIcon} />}
      title="Messages"
      description="Direct messages from your connected accounts will appear here."
    />
  );
}
