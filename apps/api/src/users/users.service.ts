import { Injectable, Inject } from '@nestjs/common';
import { eq, count } from 'drizzle-orm';
import { writeFile, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { FastifyRequest } from 'fastify';
import { sqliteSchema } from '@pulsarr/db';
import type { DbClient } from '@pulsarr/db';
import { getEnv } from '../config/env.js';
import { auth } from '../lib/auth.js';
import { notFound, badRequest, forbidden } from '../common/app.exception.js';

const { users, workspaces, workspaceMembers, posts } = sqliteSchema;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

@Injectable()
export class UsersService {
  constructor(@Inject('DB') private readonly db: DbClient) {}

  private get q() { return this.db as any; }
  private get uploadDir() { return resolve(process.cwd(), getEnv().UPLOAD_DIR, 'avatars'); }

  async findMe(userId: string) {
    const [user] = await this.q
      .select({ id: users.id, email: users.email, name: users.name, avatarUrl: users.avatarUrl, image: users.image, notificationPreferences: users.notificationPreferences })
      .from(users).where(eq(users.id, userId)).limit(1);
    if (!user) throw notFound('User not found');
    return { ...user, notificationPreferences: this.parsePrefs(user.notificationPreferences) };
  }

  async updateProfile(userId: string, dto: { name?: string }) {
    if (dto.name) {
      await this.q.update(users).set({ name: dto.name, updatedAt: new Date() }).where(eq(users.id, userId));
    }
    return this.findMe(userId);
  }

  async uploadAvatar(userId: string, dto: { data: string; mimetype: string }) {
    if (!ACCEPTED.includes(dto.mimetype)) throw badRequest('Only JPG, PNG, and WebP files are accepted.');

    const base64 = dto.data.includes(',') ? dto.data.split(',')[1] : dto.data;
    if (!base64) throw badRequest('Invalid image data.');
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length > 2 * 1024 * 1024) throw badRequest('File must be under 2 MB.');

    const ext = dto.mimetype.split('/')[1].replace('jpeg', 'jpg');
    const filename = `${userId}.${ext}`;
    await writeFile(resolve(this.uploadDir, filename), buffer);

    const avatarUrl = `/static/avatars/${filename}`;
    await this.q.update(users).set({ avatarUrl, image: avatarUrl, updatedAt: new Date() }).where(eq(users.id, userId));
    return { avatarUrl };
  }

  async removeAvatar(userId: string) {
    const [user] = await this.q.select({ avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, userId)).limit(1);
    if (user?.avatarUrl?.startsWith('/static/avatars/')) {
      const filename = user.avatarUrl.split('/').pop()!;
      await unlink(resolve(this.uploadDir, filename)).catch(() => {});
    }
    await this.q.update(users).set({ avatarUrl: null, image: null, updatedAt: new Date() }).where(eq(users.id, userId));
  }

  async changePassword(dto: { currentPassword: string; newPassword: string }, req: FastifyRequest) {
    const headers = new Headers(req.headers as Record<string, string>);
    try {
      await auth.api.changePassword({ body: { currentPassword: dto.currentPassword, newPassword: dto.newPassword, revokeOtherSessions: false }, headers });
    } catch (e: any) {
      throw badRequest(e?.body?.message ?? 'Current password is incorrect.');
    }
  }

  async updateNotifications(userId: string, dto: { postPublished: boolean; workspaceActivity: boolean }) {
    const json = JSON.stringify(dto);
    await this.q.update(users).set({ notificationPreferences: json, updatedAt: new Date() }).where(eq(users.id, userId));
    return { notificationPreferences: dto };
  }

  async deleteAccount(userId: string, req: FastifyRequest) {
    const owned = await this.q.select({ id: workspaces.id, name: workspaces.name })
      .from(workspaces).where(eq(workspaces.ownerId, userId));

    for (const ws of owned) {
      const [{ value }] = await this.q.select({ value: count() }).from(workspaceMembers).where(eq(workspaceMembers.workspaceId, ws.id));
      if (value > 1) throw forbidden(`Transfer ownership of "${ws.name}" before deleting your account.`);
    }

    await this.q.delete(posts).where(eq(posts.authorId, userId));
    await this.q.delete(users).where(eq(users.id, userId));

    const headers = new Headers(req.headers as Record<string, string>);
    await auth.api.signOut({ headers }).catch(() => {});
  }

  private parsePrefs(raw: string | null) {
    if (!raw) return { postPublished: true, workspaceActivity: true };
    try { return JSON.parse(raw); } catch { return { postPublished: true, workspaceActivity: true }; }
  }
}
