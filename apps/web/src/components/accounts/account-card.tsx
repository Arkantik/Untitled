import { HugeiconsIcon } from '@hugeicons/react';
import { LinkBackwardIcon } from '@hugeicons/core-free-icons';
import { Card } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { PLATFORM_ICON, PLATFORM_COLOR, PLATFORM_LABEL } from '~/lib/platforms';
import type { ConnectedAccount } from '@pulsarr/shared';

const STATUS_BADGE: Record<
  ConnectedAccount['status'],
  { label: string; tone: 'success' | 'warning' | 'destructive' }
> = {
  active: { label: 'Active', tone: 'success' },
  expired: { label: 'Token expired', tone: 'warning' },
  error: { label: 'Error', tone: 'destructive' },
};

interface Props {
  account: ConnectedAccount;
  onDisconnect: (account: ConnectedAccount) => void;
}

export function AccountCard({ account, onDisconnect }: Props) {
  const icon = PLATFORM_ICON[account.platform];
  const color = account.platform === 'x' ? '#0f0f0f' : PLATFORM_COLOR[account.platform];
  const label = PLATFORM_LABEL[account.platform];
  const badge = STATUS_BADGE[account.status];

  return (
    <Card className="flex items-center gap-4 p-4">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
        style={{ background: color }}
        aria-hidden
      >
        <HugeiconsIcon icon={icon} size={20} className="text-white" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{label}</span>
          <Badge tone={badge.tone} className="text-xs">
            {badge.label}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {account.username ? `@${account.username}` : 'No username on record'}
        </p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="shrink-0 text-muted-foreground hover:text-destructive"
        aria-label={`Disconnect ${label}${account.username ? ` @${account.username}` : ''}`}
        onClick={() => onDisconnect(account)}
      >
        <HugeiconsIcon icon={LinkBackwardIcon} size={16} aria-hidden />
        Disconnect
      </Button>
    </Card>
  );
}
