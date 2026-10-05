import { Injectable, Inject } from '@nestjs/common';
import { eq, and, gte, count } from 'drizzle-orm';
import { sqliteSchema } from '@pulsarr/db';
import type { DbClient } from '@pulsarr/db';
import type { PlatformSummaryItem } from '@pulsarr/shared';
import { assertMember } from '../workspaces/workspaces.helpers.js';

@Injectable()
export class AnalyticsService {
  constructor(@Inject('DB') private readonly db: DbClient) {}

  private get q() { return this.db as any; }

  async getPlatformSummary(workspaceId: string, userId: string): Promise<PlatformSummaryItem[]> {
    await assertMember(this.q, workspaceId, userId);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const rows: { platform: string; postsThisWeek: number }[] = await this.q
      .select({
        platform: sqliteSchema.connectedAccounts.platform,
        postsThisWeek: count(sqliteSchema.postTargets.id),
      })
      .from(sqliteSchema.connectedAccounts)
      .leftJoin(
        sqliteSchema.postTargets,
        and(
          eq(sqliteSchema.postTargets.connectedAccountId, sqliteSchema.connectedAccounts.id),
          eq(sqliteSchema.postTargets.status, 'published'),
          gte(sqliteSchema.postTargets.publishedAt, weekAgo),
        ),
      )
      .where(eq(sqliteSchema.connectedAccounts.workspaceId, workspaceId))
      .groupBy(sqliteSchema.connectedAccounts.platform);

    return rows.map((r) => ({
      platform: r.platform as PlatformSummaryItem['platform'],
      postsThisWeek: r.postsThisWeek,
      engagementThisWeek: 0,
    }));
  }
}
