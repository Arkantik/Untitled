import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { Key01Icon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';
import { Button } from '~/components/ui/button';

export const Route = createFileRoute('/_app/workspace/api-keys')({
  component: ApiKeysPage,
});

function ApiKeysPage() {
  return (
    <EmptyState
      icon={<HugeiconsIcon icon={Key01Icon} />}
      title="API keys"
      description="Create and manage API keys to access the Pulsarr REST API."
      action={<Button>Create API key</Button>}
    />
  );
}
