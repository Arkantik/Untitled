import type { WorkspaceRole } from '@pulsarr/shared';

export interface WorkspaceRow {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  stripeCustomerId: string | null;
  subscriptionStatus: string;
  plan: string;
  timezone: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MemberRow {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  createdAt: string;
}

export interface WorkspaceWithRole extends WorkspaceRow {
  role: WorkspaceRole;
}

export interface MemberWithUser extends MemberRow {
  name: string | null;
  email: string;
}
