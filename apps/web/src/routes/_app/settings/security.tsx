import { createFileRoute } from '@tanstack/react-router';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/settings/security')({
  component: SecuritySettingsPage,
});

function SecuritySettingsPage() {
  return (
    <EmptyState
      title="Security"
      description="Manage your password, two-factor authentication, and passkeys."
    />
  );
}
