import { Link } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { Globe02Icon } from '@hugeicons/core-free-icons';
import { Card } from '~/components/ui/card';
import { EmptyState } from '~/components/ui/empty-state';

export function DashboardNoAccounts() {
  return (
    <Card>
      <EmptyState
        size="md"
        icon={<HugeiconsIcon icon={Globe02Icon} size={22} aria-hidden />}
        title="No accounts connected yet"
        description="Connect a social account to start composing and scheduling posts from this workspace."
        action={
          <Link
            to="/accounts"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Connect an account
          </Link>
        }
      />
    </Card>
  );
}
