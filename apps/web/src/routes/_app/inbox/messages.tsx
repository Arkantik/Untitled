import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_app/inbox/messages')({
  beforeLoad: ({ context: { workspaces } }) => {
    const workspaceId = workspaces?.[0]?.id;
    if (workspaceId) {
      throw redirect({ to: '/workspace/$workspaceId/inbox/messages', params: { workspaceId } });
    }
  },
  component: () => null,
});
