import { Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { sqliteSchema } from '@pulsarr/db';
import type { DbClient } from '@pulsarr/db';
import type { InviteMemberInput, UpdateMemberRoleInput } from '@pulsarr/shared';
import type { MemberRow } from './workspaces.types.js';
import { assertMember, assertRole, assertMemberLimit } from './workspaces.helpers.js';
import { notFound, conflict, badRequest } from '../common/app.exception.js';

const { users, workspaces, workspaceMembers } = sqliteSchema;

@Injectable()
export class WorkspaceMembersService {
  constructor(@Inject('DB') private readonly db: DbClient) {}

  // Drizzle's dialect union can't be narrowed to a single schema; cast once here.
  private get q() { return this.db as any; }

  async listMembers(workspaceId: string, userId: string): Promise<MemberRow[]> {
    await assertMember(this.q, workspaceId, userId);
    const rows = await this.q
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId));
    return rows as MemberRow[];
  }

  async addMember(
    workspaceId: string,
    callerId: string,
    dto: InviteMemberInput,
  ): Promise<MemberRow> {
    await assertRole(this.q, workspaceId, callerId, 'admin');
    await assertMemberLimit(this.q, workspaceId);

    const [target] = await this.q
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, dto.email))
      .limit(1);
    if (!target) throw notFound('No user with that email');

    const [existing] = await this.q
      .select({ id: workspaceMembers.id })
      .from(workspaceMembers)
      .where(
        and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, target.id)),
      )
      .limit(1);
    if (existing) throw conflict('User is already a member');

    const id = crypto.randomUUID();
    await this.q
      .insert(workspaceMembers)
      .values({ id, workspaceId, userId: target.id, role: 'editor' });
    const [row] = await this.q
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.id, id))
      .limit(1);
    return row as MemberRow;
  }

  async updateMemberRole(
    workspaceId: string,
    callerId: string,
    targetUserId: string,
    dto: UpdateMemberRoleInput,
  ): Promise<MemberRow> {
    await assertRole(this.q, workspaceId, callerId, 'admin');

    const [member] = await this.q
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, targetUserId),
        ),
      )
      .limit(1);
    if (!member) throw notFound('Member not found');

    await this.q
      .update(workspaceMembers)
      .set({ role: dto.role })
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, targetUserId),
        ),
      );

    const [updated] = await this.q
      .select()
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, targetUserId),
        ),
      )
      .limit(1);
    return updated as MemberRow;
  }

  async removeMember(workspaceId: string, callerId: string, targetUserId: string): Promise<void> {
    await assertRole(this.q, workspaceId, callerId, 'admin');

    const [ws] = await this.q
      .select({ ownerId: workspaces.ownerId })
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);
    if (ws?.ownerId === targetUserId) throw badRequest('Cannot remove the workspace owner');

    const [member] = await this.q
      .select({ id: workspaceMembers.id })
      .from(workspaceMembers)
      .where(
        and(
          eq(workspaceMembers.workspaceId, workspaceId),
          eq(workspaceMembers.userId, targetUserId),
        ),
      )
      .limit(1);
    if (!member) throw notFound('Member not found');

    await this.q.delete(workspaceMembers).where(eq(workspaceMembers.id, member.id));
  }
}
