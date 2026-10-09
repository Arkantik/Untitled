import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon, Alert01Icon } from '@hugeicons/core-free-icons';
import { Card } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { PLATFORM_ICON, PLATFORM_COLOR, PLATFORM_LABEL } from '~/lib/platforms';
import type { ConnectedAccount } from '@veypost/shared';

const STATUS_TONE: Record<ConnectedAccount['status'], 'success' | 'warning' | 'destructive'> = {
  active: 'success',
  expired: 'warning',
  error: 'destructive',
};

const STATUS_LABEL: Record<ConnectedAccount['status'], string> = {
  active: 'Active',
  expired: 'Token expired',
  error: 'Error',
};

function platformBg(p: ConnectedAccount['platform']): string {
  return p === 'x' ? '#0f0f0f' : PLATFORM_COLOR[p];
}

interface Props {
  accounts: ConnectedAccount[];
  workspaceId: string;
}

export function DashboardAccountsWidget({ accounts, workspaceId }: Props) {
  if (accounts.length === 0) return null;

  const hasIssues = accounts.some((a) => a.status !== 'active');

  if (!hasIssues) {
    return (
      <Card className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <HugeiconsIcon
            icon={CheckmarkCircle01Icon}
            size={16}
            className="text-success"
            aria-hidden
          />
          <span>
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected
          </span>
        </div>
        <Link
          to="/workspace/$workspaceId/accounts"
          params={{ workspaceId }}
          className="text-xs text-primary underline-offset-4 hover:underline"
        >
          Manage
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Alert01Icon} size={14} className="text-warning" aria-hidden />
          <h2 className="text-sm font-semibold">Account issues</h2>
        </div>
        <Link
          to="/workspace/$workspaceId/accounts"
          params={{ workspaceId }}
          className="text-xs text-primary underline-offset-4 hover:underline"
        >
          Reconnect
        </Link>
      </div>
      <div className="divide-y divide-border px-4 pb-4">
        {accounts
          .filter((a) => a.status !== 'active')
          .map((account) => (
            <div key={account.id} className="flex items-center gap-3 py-2.5 first:pt-0">
              <div
                className="flex size-6 shrink-0 items-center justify-center rounded-full"
                style={{ background: platformBg(account.platform) }}
                aria-hidden
              >
                <HugeiconsIcon
                  icon={PLATFORM_ICON[account.platform]}
                  size={12}
                  className="text-white"
                />
              </div>
              <span className="flex-1 text-sm">{PLATFORM_LABEL[account.platform]}</span>
              {account.username && (
                <span className="text-xs text-muted-foreground">@{account.username}</span>
              )}
              <Badge tone={STATUS_TONE[account.status]} className="text-xs">
                {STATUS_LABEL[account.status]}
              </Badge>
            </div>
          ))}
      </div>
    </Card>
  );
}
