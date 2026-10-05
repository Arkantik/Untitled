import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { Globe02Icon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';
import { Skeleton } from '~/components/ui/skeleton';
import { toast } from '~/components/ui/toast';
import { useWorkspaceContext } from '~/contexts/workspace-context';
import { useConnectedAccounts, useDisconnectAccount } from '~/hooks/use-connected-accounts';
import { AccountCard } from '~/components/accounts/account-card';
import { AccountDisconnectDialog } from '~/components/accounts/account-disconnect-dialog';
import { AddAccountSection } from '~/components/accounts/add-account-section';
import type { ConnectedAccount } from '@pulsarr/shared';

export const Route = createFileRoute('/_app/accounts')({
  component: AccountsPage,
});

function AccountsPage() {
  const { workspaces } = useWorkspaceContext();
  const workspace = workspaces[0];
  const { data: accounts, isLoading } = useConnectedAccounts(workspace?.id);
  const { mutate: disconnect, isPending } = useDisconnectAccount(workspace?.id ?? '');
  const [toDisconnect, setToDisconnect] = useState<ConnectedAccount | null>(null);

  function handleConfirm(id: string) {
    disconnect(id, {
      onSuccess: () => {
        toast.success('Account disconnected.');
        setToDisconnect(null);
      },
      onError: () => toast.error('Failed to disconnect account.'),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Connected accounts</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the social accounts this workspace publishes to.
        </p>
      </div>

      <AddAccountSection />

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-18 rounded-lg" />
          ))}
        </div>
      ) : !accounts || accounts.length === 0 ? (
        <EmptyState
          size="md"
          icon={<HugeiconsIcon icon={Globe02Icon} size={22} aria-hidden />}
          title="No accounts connected yet"
          description="Add a social account above to start composing and scheduling posts."
        />
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onDisconnect={setToDisconnect}
            />
          ))}
        </div>
      )}

      <AccountDisconnectDialog
        account={toDisconnect}
        isPending={isPending}
        onConfirm={handleConfirm}
        onClose={() => setToDisconnect(null)}
      />
    </div>
  );
}
