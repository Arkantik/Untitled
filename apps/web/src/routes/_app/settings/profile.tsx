import { createFileRoute } from '@tanstack/react-router';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/settings/profile')({
  component: ProfileSettingsPage,
});

function ProfileSettingsPage() {
  return (
    <EmptyState title="Profile" description="Update your name, email address, and profile photo." />
  );
}
