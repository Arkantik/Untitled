import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserCheck01Icon, Key01Icon, Notification01Icon } from '@hugeicons/core-free-icons';
import { cn } from '~/lib/utils';
import { ProfilePanel } from './settings-profile';
import { SecurityPanel } from './settings-security';
import { NotificationsPanel } from './settings-notifications';

const VALID_TABS = ['profile', 'security', 'notifications'] as const;
type SettingsTab = (typeof VALID_TABS)[number];

export const Route = createFileRoute('/_app/profile/settings')({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: (VALID_TABS.includes(search.tab as SettingsTab) ? search.tab : 'profile') as SettingsTab,
  }),
  component: ProfileSettingsPage,
});

const TABS = [
  { id: 'profile' as const, label: 'Profile', icon: UserCheck01Icon },
  { id: 'security' as const, label: 'Security', icon: Key01Icon },
  { id: 'notifications' as const, label: 'Notifications', icon: Notification01Icon },
] as const;

function ProfileSettingsPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  function setTab(next: SettingsTab) {
    void navigate({ search: { tab: next }, replace: true });
  }

  return (
    <div>
      <nav
        className="flex gap-6 overflow-x-auto border-b border-border scrollbar-none"
        aria-label="Settings sections"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex shrink-0 items-center gap-1.5 h-11 px-0.5 -mb-px border-b-2',
              'text-sm font-medium transition-colors duration-120 ease-out',
              'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
              tab === t.id
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground',
            )}
          >
            <HugeiconsIcon icon={t.icon} className="size-3.75" aria-hidden />
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === 'profile' && <ProfilePanel />}
        {tab === 'security' && <SecurityPanel />}
        {tab === 'notifications' && <NotificationsPanel />}
      </div>
    </div>
  );
}
