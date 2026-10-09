import { eq, and, count } from 'drizzle-orm';
import { sqliteSchema, type DbClient } from '@veypost/db';
import { PLAN_TIERS, type PlanTier } from '@veypost/shared';
import { getEnv } from '../config/env.js';
import type { MemberRow } from './workspaces.types.js';
import { notFound, forbidden, limitExceeded } from '../common/app.exception.js';

const { workspaces, workspaceMembers, connectedAccounts } = sqliteSchema;

export const ROLE_RANK = { viewer: 0, editor: 1, admin: 2, owner: 3 } as const;

export async function assertMember(
  q: DbClient,
  workspaceId: string,
  userId: string,
): Promise<MemberRow> {
  // Drizzle's dialect union can't be narrowed to a single schema; cast once here.
  const db = q as any;
  const [ws] = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);
  if (!ws) throw notFound('Workspace not found');
  const [member] = await db
    .select()
    .from(workspaceMembers)
    .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId)))
    .limit(1);
  if (!member) throw forbidden('You are not a member of this workspace');
  return member as MemberRow;
}

export async function assertRole(
  q: DbClient,
  workspaceId: string,
  userId: string,
  minRole: 'owner' | 'admin',
): Promise<MemberRow> {
  const member = await assertMember(q, workspaceId, userId);
  if (ROLE_RANK[member.role] < ROLE_RANK[minRole]) throw forbidden('Insufficient role');
  return member;
}

export async function assertMemberLimit(q: DbClient, workspaceId: string): Promise<void> {
  if (!getEnv().BILLING_ENABLED) return;
  const db = q as any;
  const [ws] = await db
    .select({ plan: workspaces.plan })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);
  if (!ws) return;
  const limit = PLAN_TIERS[ws.plan as PlanTier]?.maxMembers ?? Infinity;
  const [row] = await db
    .select({ n: count() })
    .from(workspaceMembers)
    .where(eq(workspaceMembers.workspaceId, workspaceId))
    .limit(1);
  const current = Number(row?.n ?? 0);
  if (current >= limit) throw limitExceeded('Member limit reached for your plan', limit, current);
}

export async function assertAccountLimit(q: DbClient, workspaceId: string): Promise<void> {
  if (!getEnv().BILLING_ENABLED) return;
  const db = q as any;
  const [ws] = await db
    .select({ plan: workspaces.plan })
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);
  if (!ws) return;
  const limit = PLAN_TIERS[ws.plan as PlanTier]?.maxConnectedAccounts ?? Infinity;
  const [row] = await db
    .select({ n: count() })
    .from(connectedAccounts)
    .where(eq(connectedAccounts.workspaceId, workspaceId))
    .limit(1);
  const current = Number(row?.n ?? 0);
  if (current >= limit)
    throw limitExceeded('Connected account limit reached for your plan', limit, current);
}
