import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/profile/security')({
  beforeLoad: () => {
    throw redirect({ to: '/profile/settings', search: { tab: 'security' } });
  },
  component: () => null,
});
