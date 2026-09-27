import { createFileRoute } from '@tanstack/react-router';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/settings/connections')({
  component: ConnectionsSettingsPage,
});

function ConnectionsSettingsPage() {
  return (
    <EmptyState
      title="Connections"
      description="Manage your linked OAuth providers and sign-in methods."
    />
  );
}
