import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { sqliteSchema } from '@veypost/db';
import type { DbClient } from '@veypost/db';
import type { ConnectedAccount } from '@veypost/shared';
import { assertMember, assertAccountLimit } from '../workspaces/workspaces.helpers.js';
import { connectDiscord } from './platforms/discord.connector.js';
import { connectBluesky } from './platforms/bluesky.connector.js';
import { upsertAccount, deriveStatus } from './accounts.helpers.js';

@Injectable()
export class AccountsService {
  constructor(@Inject('DB') private readonly db: DbClient) {}

  private get q() { return this.db as any; }

  async listAccounts(workspaceId: string, userId: string): Promise<ConnectedAccount[]> {
    await assertMember(this.q, workspaceId, userId);
    const rows = await this.q
      .select({
        id: sqliteSchema.connectedAccounts.id,
        platform: sqliteSchema.connectedAccounts.platform,
        username: sqliteSchema.connectedAccounts.platformUsername,
        avatarUrl: sqliteSchema.connectedAccounts.avatarUrl,
        tokenExpiresAt: sqliteSchema.connectedAccounts.tokenExpiresAt,
        createdAt: sqliteSchema.connectedAccounts.createdAt,
      })
      .from(sqliteSchema.connectedAccounts)
      .where(eq(sqliteSchema.connectedAccounts.workspaceId, workspaceId));
    return rows.map((r: any) => ({
      id: r.id,
      platform: r.platform,
      username: r.username,
      avatarUrl: r.avatarUrl,
      status: deriveStatus(r.tokenExpiresAt),
      connectedAt: r.createdAt,
    }));
  }

  async removeAccount(id: string, workspaceId: string, userId: string): Promise<void> {
    await assertMember(this.q, workspaceId, userId);
    const [row] = await this.q
      .select({ id: sqliteSchema.connectedAccounts.id })
      .from(sqliteSchema.connectedAccounts)
      .where(and(eq(sqliteSchema.connectedAccounts.id, id), eq(sqliteSchema.connectedAccounts.workspaceId, workspaceId)));
    if (!row) throw new NotFoundException('Account not found');
    await this.q.delete(sqliteSchema.connectedAccounts).where(eq(sqliteSchema.connectedAccounts.id, id));
  }

  async connectDiscord(workspaceId: string, userId: string, webhookUrl: string): Promise<void> {
    await assertMember(this.q, workspaceId, userId);
    await assertAccountLimit(this.q, workspaceId);
    await upsertAccount(this.q, workspaceId, 'discord', await connectDiscord(webhookUrl));
  }

  async connectBluesky(workspaceId: string, userId: string, handle: string, appPassword: string): Promise<void> {
    await assertMember(this.q, workspaceId, userId);
    await assertAccountLimit(this.q, workspaceId);
    await upsertAccount(this.q, workspaceId, 'bluesky', await connectBluesky(handle, appPassword));
  }
}
