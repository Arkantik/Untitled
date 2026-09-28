import { createFileRoute } from '@tanstack/react-router';
import { InviteSection } from './members-invite';
import { MemberList } from './members-list';
import { PendingInvitations, RolePermissionsCard } from './members-roles';

export const Route = createFileRoute('/_app/workspace/members')({
  component: WorkspaceMembersPage,
});

export type Member = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
};

export type Invitation = {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  sentAt: string;
};

const CURRENT_USER_ID = '1';

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Jeremy ArkantiK', email: 'jeremy@pulsarr.app', role: 'owner' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@pulsarr.app', role: 'admin' },
  { id: '3', name: 'Marcus Johnson', email: 'marcus@agency.io', role: 'editor' },
  { id: '4', name: 'Priya Patel', email: 'priya@designco.com', role: 'viewer' },
];

const MOCK_INVITATIONS: Invitation[] = [
  { id: '1', email: 'alex.morgan@startup.io', role: 'editor', sentAt: '2 days ago' },
  { id: '2', email: 'design@freelance.co', role: 'viewer', sentAt: '5 days ago' },
];

const currentRole = MOCK_MEMBERS.find((m) => m.id === CURRENT_USER_ID)?.role;
const isOwnerOrAdmin = currentRole === 'owner' || currentRole === 'admin';

function WorkspaceMembersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Members</h1>
        <p className="text-sm text-muted-foreground">Manage who has access to this workspace.</p>
      </div>

      <InviteSection isOwnerOrAdmin={isOwnerOrAdmin} />
      <MemberList members={MOCK_MEMBERS} currentUserId={CURRENT_USER_ID} />
      {MOCK_INVITATIONS.length > 0 && (
        <PendingInvitations invitations={MOCK_INVITATIONS} />
      )}
      <RolePermissionsCard />
    </div>
  );
}
