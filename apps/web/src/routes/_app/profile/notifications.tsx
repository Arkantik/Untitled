import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/profile/notifications')({
  beforeLoad: () => {
    throw redirect({ to: '/profile/settings', search: { tab: 'notifications' } });
  },
  component: () => null,
});
