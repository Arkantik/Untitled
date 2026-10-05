import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { cn } from '~/lib/utils';
import { useCurrentUser } from '~/hooks/use-session';
import { useWorkspaceContext } from '~/contexts/workspace-context';
import { useDashboardSummary } from '~/hooks/use-dashboard-summary';
import { useConnectedAccounts } from '~/hooks/use-connected-accounts';
import { usePlatformSummary } from '~/hooks/use-platform-summary';
import { Card } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { DashboardGreeting } from '~/components/dashboard/dashboard-greeting';
import { DashboardStatTiles } from '~/components/dashboard/dashboard-stat-tiles';
import { DashboardRecentFeed } from '~/components/dashboard/dashboard-recent-feed';
import { DashboardUpcoming } from '~/components/dashboard/dashboard-upcoming';
import { DashboardNoAccounts } from '~/components/dashboard/dashboard-no-accounts';
import { DashboardOnboarding } from '~/components/dashboard/dashboard-onboarding';
import { DashboardComposer } from '~/components/dashboard/dashboard-composer';
import { DashboardAccountsWidget } from '~/components/dashboard/dashboard-accounts-widget';
import { DashboardPlatformStats } from '~/components/dashboard/dashboard-platform-stats';
import {
  DashboardDevToggle,
  MOCK_DASHBOARD_DATA,
  type DevState,
} from '~/components/dashboard/dashboard-dev-toggle';

function AccountsWidgetSkeleton() {
  return (
    <Card className="flex items-center justify-between px-4 py-3">
      <Skeleton className="h-4 w-44" />
      <Skeleton className="h-3 w-12" />
    </Card>
  );
}

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const user = useCurrentUser();
  const { workspaces } = useWorkspaceContext();
  const workspace = workspaces[0];
  const { data: apiData, isLoading: apiLoading } = useDashboardSummary(workspace?.id);
  const { data: accounts, isLoading: accountsLoading } = useConnectedAccounts(workspace?.id);
  const { data: platformData, isLoading: platformLoading } = usePlatformSummary(workspace?.id);

  const [devState, setDevState] = useState<DevState>('api');
  const data = devState === 'api' ? apiData : MOCK_DASHBOARD_DATA[devState];
  const isLoading = devState === 'api' ? apiLoading : false;
  const hasAccounts = data?.hasConnectedAccounts ?? false;

  const hasActivity =
    (data?.recentPosts.length ?? 0) > 0 ||
    (data?.upcomingPosts.length ?? 0) > 0 ||
    (data?.postStats.scheduled ?? 0) > 0 ||
    (data?.postStats.publishedThisWeek ?? 0) > 0 ||
    (data?.postStats.failed ?? 0) > 0;

  const showOnboarding = !isLoading && hasAccounts && !hasActivity;
  const showComposer = !isLoading && hasAccounts;
  const showUpcoming = isLoading || (data?.upcomingPosts.length ?? 0) > 0;

  const onboardingSteps = [
    { id: 'accounts', label: 'Connect a social account', done: hasAccounts },
    { id: 'post', label: 'Schedule your first post', done: hasActivity },
    { id: 'timezone', label: 'Set your timezone', done: false },
    { id: 'team', label: 'Invite a teammate', done: false },
  ];

  return (
    <>
      <div className="space-y-6">
        <DashboardGreeting user={user} hasAccounts={hasAccounts} />
        <DashboardStatTiles data={data?.postStats} isLoading={isLoading} />
        {!hasAccounts && !isLoading && <DashboardNoAccounts />}
        {(hasAccounts || isLoading) && (
          accountsLoading ? (
            <AccountsWidgetSkeleton />
          ) : (
            accounts && <DashboardAccountsWidget accounts={accounts} />
          )
        )}
        {showOnboarding && <DashboardOnboarding steps={onboardingSteps} />}
        {showComposer && <DashboardComposer />}
        <div className={cn('grid gap-6', showUpcoming && 'regular:grid-cols-[1fr_360px]')}>
          <DashboardRecentFeed posts={data?.recentPosts ?? []} isLoading={isLoading} />
          {showUpcoming && (
            <DashboardUpcoming posts={data?.upcomingPosts ?? []} isLoading={isLoading} />
          )}
        </div>
        {(hasAccounts || isLoading) && (
          <DashboardPlatformStats items={platformData ?? []} isLoading={platformLoading || isLoading} />
        )}
      </div>
      <DashboardDevToggle value={devState} onChange={setDevState} />
    </>
  );
}
