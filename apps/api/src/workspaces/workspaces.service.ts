import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { sqliteSchema } from '@pulsarr/db';
import type { DbClient } from '@pulsarr/db';
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from '@pulsarr/shared';
import type { WorkspaceRow } from './workspaces.types.js';
import { assertMember, assertRole } from './workspaces.helpers.js';
import { notFound, conflict } from '../common/app.exception.js';

const { workspaces, workspaceMembers } = sqliteSchema;

function isUniqueViolation(e: unknown): boolean {
  return e instanceof Error && /unique/i.test(e.message);
}

@Injectable()
export class WorkspacesService {
  constructor(@Inject('DB') private readonly db: DbClient) {}

  // Drizzle's dialect union can't be narrowed to a single schema; cast once here.
  private get q() { return this.db as any; }

  async create(userId: string, dto: CreateWorkspaceInput): Promise<WorkspaceRow> {
    const id = crypto.randomUUID();
    const slug = dto.slug ?? dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + id.slice(0, 6);
    try {
      await this.q.insert(workspaces).values({ id, ...dto, slug, ownerId: userId });
    } catch (e) {
      if (isUniqueViolation(e)) throw conflict('Slug already taken');
      throw e;
    }
    await this.q.insert(workspaceMembers).values({
      id: crypto.randomUUID(),
      workspaceId: id,
      userId,
      role: 'owner',
    });
    const [row] = await this.q.select().from(workspaces).where(eq(workspaces.id, id)).limit(1);
    return row as WorkspaceRow;
  }

  async findAllForUser(userId: string): Promise<WorkspaceRow[]> {
    const rows = await this.q
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        ownerId: workspaces.ownerId,
        timezone: workspaces.timezone,
        avatarUrl: workspaces.avatarUrl,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt,
      })
      .from(workspaces)
      .innerJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(eq(workspaceMembers.userId, userId));
    return rows as WorkspaceRow[];
  }

  async findOne(id: string, userId: string): Promise<WorkspaceRow> {
    await assertMember(this.q, id, userId);
    const [row] = await this.q.select().from(workspaces).where(eq(workspaces.id, id)).limit(1);
    if (!row) throw notFound('Workspace not found');
    return row as WorkspaceRow;
  }

  async update(id: string, userId: string, dto: UpdateWorkspaceInput): Promise<WorkspaceRow> {
    await assertRole(this.q, id, userId, 'admin');
    try {
      await this.q
        .update(workspaces)
        .set({ ...dto, updatedAt: new Date().toISOString() })
        .where(eq(workspaces.id, id));
    } catch (e) {
      if (isUniqueViolation(e)) throw conflict('Slug already taken');
      throw e;
    }
    const [row] = await this.q.select().from(workspaces).where(eq(workspaces.id, id)).limit(1);
    return row as WorkspaceRow;
  }

  async remove(id: string, userId: string): Promise<void> {
    await assertRole(this.q, id, userId, 'owner');
    await this.q.delete(workspaces).where(eq(workspaces.id, id));
  }
}
