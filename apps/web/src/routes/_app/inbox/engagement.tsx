import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/inbox/engagement')({
  beforeLoad: ({ context: { workspaces } }) => {
    const workspaceId = workspaces?.[0]?.id;
    if (workspaceId) {
      throw redirect({ to: '/workspace/$workspaceId/inbox/engagement', params: { workspaceId } });
    }
  },
  component: () => null,
});
