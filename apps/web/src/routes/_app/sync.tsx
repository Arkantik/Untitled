import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { RepeatIcon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';
import { Button } from '~/components/ui/button';

export const Route = createFileRoute('/_app/sync')({
  component: SyncPage,
});

function SyncPage() {
  return (
    <EmptyState
      icon={<HugeiconsIcon icon={RepeatIcon} />}
      title="Sync pipelines"
      description="Cross-posting automation pipelines between your accounts will appear here."
      action={<Button>Create pipeline</Button>}
    />
  );
}
