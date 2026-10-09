import { HugeiconsIcon } from '@hugeicons/react';
import { LinkBackwardIcon, ReloadIcon } from '@hugeicons/core-free-icons';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { PLATFORM_ICON, PLATFORM_BG, PLATFORM_LABEL } from '~/lib/platforms';
import { toast } from '~/components/ui/toast';
import { useRefreshAccount } from '~/hooks/use-connected-accounts';
import type { ConnectedAccount } from '@veypost/shared';

interface Props {
  account: ConnectedAccount;
  workspaceId: string;
  onDisconnect: (account: ConnectedAccount) => void;
  onReconnect: (account: ConnectedAccount) => void;
}

export function AccountCard({ account, workspaceId, onDisconnect, onReconnect }: Props) {
  const initial = account.username?.[0]?.toUpperCase() ?? '?';
  const needsAttention = account.status !== 'active';
  const { mutate: refresh, isPending: isRefreshing } = useRefreshAccount(workspaceId);

  function handleReconnect() {
    refresh(account.id, {
      onSuccess: () => toast.success(`${PLATFORM_LABEL[account.platform]} reconnected.`),
      onError: () => onReconnect(account),
    });
  }

  return (
    <Card
      className={cn(
        'flex items-center gap-3 p-4',
        needsAttention && 'border-destructive/50',
      )}
    >
      <div className="relative size-10 shrink-0">
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-border">
          {account.avatarUrl ? (
            <img src={account.avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-muted-foreground">{initial}</span>
          )}
        </div>
        <div
          className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-card"
          style={{ background: PLATFORM_BG[account.platform] }}
          aria-hidden
        >
          <HugeiconsIcon icon={PLATFORM_ICON[account.platform]} size={11} className="text-white" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'size-2 shrink-0 rounded-full',
              needsAttention ? 'bg-destructive' : 'bg-success',
            )}
            aria-hidden
          />
          <span className="truncate text-sm font-medium">
            {account.username ? `@${account.username}` : PLATFORM_LABEL[account.platform]}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {PLATFORM_LABEL[account.platform]}
          {needsAttention && ' Â· Needs reconnection'}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {needsAttention && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            onClick={handleReconnect}
          >
            <HugeiconsIcon icon={ReloadIcon} size={13} aria-hidden />
            Reconnect
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          aria-label={`Disconnect ${PLATFORM_LABEL[account.platform]}${account.username ? ` @${account.username}` : ''}`}
          onClick={() => onDisconnect(account)}
        >
          <HugeiconsIcon icon={LinkBackwardIcon} size={16} aria-hidden />
          Disconnect
        </Button>
      </div>
    </Card>
  );
}
