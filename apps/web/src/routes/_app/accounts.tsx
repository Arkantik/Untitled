import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserMultiple02Icon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';
import { Button } from '~/components/ui/button';

export const Route = createFileRoute('/_app/accounts')({
  component: AccountsPage,
});

function AccountsPage() {
  return (
    <EmptyState
      icon={<HugeiconsIcon icon={UserMultiple02Icon} />}
      title="Connected accounts"
      description="Connect your social media accounts to start publishing."
      action={<Button>Connect an account</Button>}
    />
  );
}
