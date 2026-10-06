import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/dashboard')({
  beforeLoad: ({ context: { workspaces } }) => {
    const workspaceId = workspaces?.[0]?.id;
    if (workspaceId) {
      throw redirect({ to: '/workspace/$workspaceId/dashboard', params: { workspaceId } });
    }
  },
  component: () => null,
});
