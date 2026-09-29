import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useWorkspace } from '~/contexts/workspace-route-context';
import { useWorkspaceMembers } from '~/hooks/use-workspaces';
import { InviteSection } from './members-invite';
import { MemberList } from './members-list';
import { RolePermissionsCard } from './members-roles';
import { MemberDialogs } from './members-dialogs';
import type { MemberWithUser } from '~/contexts/workspace-context';
import type { SessionUser } from '~/server/session';

export const Route = createFileRoute('/_app/workspace/$workspaceId/members')({
  component: WorkspaceMembersPage,
});

export type DialogState =
  | { kind: 'change-role'; member: MemberWithUser }
  | { kind: 'transfer'; member: MemberWithUser }
  | { kind: 'remove'; member: MemberWithUser }
  | null;

function WorkspaceMembersPage() {
  const workspace = useWorkspace();
  const { user } = Route.useRouteContext() as { user: SessionUser };
  const { data: members = [], isLoading } = useWorkspaceMembers(workspace.id);
  const [dialog, setDialog] = useState<DialogState>(null);

  const currentMember = members.find((m) => m.userId === user.id);
  const isOwner = currentMember?.role === 'owner';
  const isOwnerOrAdmin = isOwner || currentMember?.role === 'admin';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Members</h1>
        <p className="text-sm text-muted-foreground">Manage who has access to this workspace.</p>
      </div>

      <InviteSection
        workspaceId={workspace.id}
        isOwnerOrAdmin={isOwnerOrAdmin}
        isLoading={isLoading}
      />
      <MemberList
        members={members}
        currentUserId={user.id}
        isOwner={isOwner}
        isLoading={isLoading}
        onChangeRole={(m) => setDialog({ kind: 'change-role', member: m })}
        onTransfer={(m) => setDialog({ kind: 'transfer', member: m })}
        onRemove={(m) => setDialog({ kind: 'remove', member: m })}
      />
      <MemberDialogs
        dialog={dialog}
        onClose={() => setDialog(null)}
        workspaceId={workspace.id}
      />
      <RolePermissionsCard />
    </div>
  );
}
