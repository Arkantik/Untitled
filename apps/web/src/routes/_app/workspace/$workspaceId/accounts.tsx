import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { HugeiconsIcon } from '@hugeicons/react';
import { Globe02Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { EmptyState } from '~/components/ui/empty-state';
import { Skeleton } from '~/components/ui/skeleton';
import { Alert } from '~/components/ui/alert';
import { Button } from '~/components/ui/button';
import { toast } from '~/components/ui/toast';
import { apiFetch } from '~/lib/api-client';
import { PLATFORM_LABEL } from '~/lib/platforms';
import { useConnectedAccounts, useDisconnectAccount } from '~/hooks/use-connected-accounts';
import { AccountCard } from '~/components/accounts/account-card';
import { AccountDisconnectDialog } from '~/components/accounts/account-disconnect-dialog';
import { AddAccountSection } from '~/components/accounts/add-account-section';
import { DiscordConnectDialog } from '~/components/accounts/discord-connect-dialog';
import { PagePickerDialog } from '~/components/accounts/page-picker-dialog';
import type { ConnectedAccount, SocialPlatform } from '@pulsarr/shared';

const searchSchema = z.object({
  connected: z.string().optional(),
  error: z.string().optional(),
  pick: z.string().optional(),
  platform: z.string().optional(),
});

export const Route = createFileRoute('/_app/workspace/$workspaceId/accounts')({
  validateSearch: searchSchema.parse,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.prefetchQuery({
      queryKey: ['accounts', params.workspaceId],
      queryFn: () =>
        apiFetch<ConnectedAccount[]>(`/api/v1/accounts?workspaceId=${params.workspaceId}`),
    });
  },
  component: AccountsPage,
});

function AccountsPage() {
  const { workspaceId } = Route.useParams();
  const { connected, error, pick, platform } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: accounts, isLoading, isError } = useConnectedAccounts(workspaceId);
  const { mutate: disconnect, isPending } = useDisconnectAccount(workspaceId);
  const [toDisconnect, setToDisconnect] = useState<ConnectedAccount | null>(null);
  const [errorDismissed, setErrorDismissed] = useState(false);
  const [discordOpen, setDiscordOpen] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(pick ?? null);

  useEffect(() => {
    if (connected) {
      const label = PLATFORM_LABEL[connected as SocialPlatform] ?? connected;
      toast.success(`${label} account connected.`);
      void navigate({ search: {}, replace: true });
    } else if (error) {
      if (error !== 'connect_cancelled') {
        toast.error('Failed to connect account. Check the credentials and try again.');
      }
      void navigate({ search: {}, replace: true });
    } else if (pick) {
      setPendingToken(pick);
      void navigate({ search: {}, replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleReconnect(account: ConnectedAccount) {
    if (account.platform === 'discord') { setDiscordOpen(true); return; }
    const oauthPlatform = account.platform === 'instagram' ? 'facebook' : account.platform;
    window.location.href = `/api/v1/accounts/connect/${oauthPlatform}?workspaceId=${workspaceId}`;
  }

  const connectedCount = accounts?.filter((a) => a.status === 'active').length ?? 0;
  const needsAttention = accounts?.filter((a) => a.status !== 'active').length ?? 0;

  function handleConfirmDisconnect(id: string) {
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
          Workspace-owned social accounts shared by every member.
        </p>
      </div>

      <AddAccountSection workspaceId={workspaceId} onOpenDiscord={() => setDiscordOpen(true)} />

      {isError && !errorDismissed && (
        <Alert tone="error">
          <div className="flex items-center justify-between gap-2">
            <span>Failed to load connected accounts. Refresh the page to try again.</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="-mr-1 size-6 shrink-0 text-destructive hover:text-destructive"
              aria-label="Dismiss error"
              onClick={() => setErrorDismissed(true)}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} aria-hidden />
            </Button>
          </div>
        </Alert>
      )}

      {accounts && accounts.length > 0 && (
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-success" aria-hidden />
            <span className="text-muted-foreground">{connectedCount} connected</span>
          </span>
          {needsAttention > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-destructive" aria-hidden />
              <span className="text-muted-foreground">{needsAttention} needs attention</span>
            </span>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 regular:grid-cols-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-18 rounded-md" />
          ))}
        </div>
      ) : !accounts || accounts.length === 0 ? (
        <EmptyState
          size="md"
          icon={<HugeiconsIcon icon={Globe02Icon} size={22} aria-hidden />}
          title="No accounts connected"
          description="Add a social account above to start composing and scheduling posts."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 regular:grid-cols-2">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              workspaceId={workspaceId}
              onDisconnect={setToDisconnect}
              onReconnect={handleReconnect}
            />
          ))}
        </div>
      )}

      <AccountDisconnectDialog
        account={toDisconnect}
        isPending={isPending}
        onConfirm={handleConfirmDisconnect}
        onClose={() => setToDisconnect(null)}
      />

      <DiscordConnectDialog
        workspaceId={workspaceId}
        open={discordOpen}
        onClose={() => setDiscordOpen(false)}
      />

      <PagePickerDialog
        workspaceId={workspaceId}
        token={pendingToken}
        onClose={() => setPendingToken(null)}
      />
    </div>
  );
}
