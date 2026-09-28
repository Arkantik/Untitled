import { createFileRoute } from '@tanstack/react-router';
import { EmptyState } from '~/components/ui/empty-state';

export const Route = createFileRoute('/_app/profile/notifications')({
  component: NotificationsSettingsPage,
});

function NotificationsSettingsPage() {
  return (
    <EmptyState
      title="Notifications"
      description="Control when you receive in-app and email notifications."
    />
  );
}
