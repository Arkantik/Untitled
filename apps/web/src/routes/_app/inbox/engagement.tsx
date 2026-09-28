import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { MessageMultiple01Icon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/inbox/engagement')({
  component: EngagementPage,
});

function EngagementPage() {
  return (
    <EmptyState
      icon={<HugeiconsIcon icon={MessageMultiple01Icon} />}
      title="Engagement"
      description="Replies and mentions across all your connected accounts will appear here."
    />
  );
}
