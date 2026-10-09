import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { writeFile, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import { sqliteSchema } from '@veypost/db';
import type { DbClient } from '@veypost/db';
import type { CreateWorkspaceInput, UpdateWorkspaceInput } from '@veypost/shared';
import type { WorkspaceRow } from './workspaces.types.js';
import { assertMember, assertRole } from './workspaces.helpers.js';
import { notFound, conflict, badRequest } from '../common/app.exception.js';
import { getEnv } from '../config/env.js';

const { workspaces, workspaceMembers } = sqliteSchema;

function isUniqueViolation(e: unknown): boolean {
  return e instanceof Error && /unique/i.test(e.message);
}

@Injectable()
export class WorkspacesService {
  constructor(@Inject('DB') private readonly db: DbClient) {}

  private get q() { return this.db as any; }
  private get avatarDir() { return resolve(process.cwd(), getEnv().UPLOAD_DIR, 'workspace-avatars'); }

  private static readonly ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

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

  async uploadAvatar(id: string, userId: string, dto: { data: string; mimetype: string }): Promise<{ avatarUrl: string }> {
    await assertRole(this.q, id, userId, 'admin');
    if (!WorkspacesService.ACCEPTED.includes(dto.mimetype)) throw badRequest('Only JPG, PNG, and WebP files are accepted.');

    const base64 = dto.data.includes(',') ? dto.data.split(',')[1] : dto.data;
    if (!base64) throw badRequest('Invalid image data.');
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length > 2 * 1024 * 1024) throw badRequest('File must be under 2 MB.');

    const ext = dto.mimetype.split('/')[1].replace('jpeg', 'jpg');
    const filename = `${id}.${ext}`;
    await writeFile(resolve(this.avatarDir, filename), buffer);

    const avatarUrl = `/static/workspace-avatars/${filename}`;
    await this.q.update(workspaces).set({ avatarUrl, updatedAt: new Date().toISOString() }).where(eq(workspaces.id, id));
    return { avatarUrl };
  }

  async removeAvatar(id: string, userId: string): Promise<void> {
    await assertRole(this.q, id, userId, 'admin');
    const [ws] = await this.q.select({ avatarUrl: workspaces.avatarUrl }).from(workspaces).where(eq(workspaces.id, id)).limit(1);
    if (ws?.avatarUrl?.startsWith('/static/workspace-avatars/')) {
      const filename = ws.avatarUrl.split('/').pop()!;
      await unlink(resolve(this.avatarDir, filename)).catch(() => {});
    }
    await this.q.update(workspaces).set({ avatarUrl: null, updatedAt: new Date().toISOString() }).where(eq(workspaces.id, id));
  }
}
