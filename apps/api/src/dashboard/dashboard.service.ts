import { Injectable, Inject } from '@nestjs/common';
import { eq, and, count, gte, inArray, desc, asc } from 'drizzle-orm';
import { sqliteSchema } from '@pulsarr/db';
import type { DbClient } from '@pulsarr/db';
import type { DashboardSummary, RecentPost, UpcomingPost, SocialPlatform } from '@pulsarr/shared';
import { assertMember } from '../workspaces/workspaces.helpers.js';

const { posts, postTargets, connectedAccounts } = sqliteSchema;

@Injectable()
export class DashboardService {
  constructor(@Inject('DB') private readonly db: DbClient) {}

  private get q() { return this.db as any; }

  async getSummary(workspaceId: string, userId: string): Promise<DashboardSummary> {
    await assertMember(this.q, workspaceId, userId);

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [[scheduledRow], [failedRow], [publishedRow], [accountsRow]] = await Promise.all([
      this.q.select({ n: count() }).from(posts).where(and(eq(posts.workspaceId, workspaceId), eq(posts.status, 'scheduled'))),
      this.q.select({ n: count() }).from(posts).where(and(eq(posts.workspaceId, workspaceId), eq(posts.status, 'failed'))),
      this.q.select({ n: count() }).from(posts).where(and(eq(posts.workspaceId, workspaceId), eq(posts.status, 'published'), gte(posts.publishedAt, weekAgo))),
      this.q.select({ n: count() }).from(connectedAccounts).where(eq(connectedAccounts.workspaceId, workspaceId)),
    ]);

    const [recentPosts, upcomingPosts] = await Promise.all([
      this.fetchRecentPosts(workspaceId),
      this.fetchUpcomingPosts(workspaceId),
    ]);

    return {
      postStats: {
        scheduled: Number(scheduledRow?.n ?? 0),
        publishedThisWeek: Number(publishedRow?.n ?? 0),
        failed: Number(failedRow?.n ?? 0),
      },
      recentPosts,
      upcomingPosts,
      hasConnectedAccounts: Number(accountsRow?.n ?? 0) > 0,
    };
  }

  private async fetchRecentPosts(workspaceId: string): Promise<RecentPost[]> {
    const rows = await this.q
      .select({ id: posts.id, content: posts.content, status: posts.status, publishedAt: posts.publishedAt })
      .from(posts)
      .where(and(eq(posts.workspaceId, workspaceId), inArray(posts.status, ['published', 'failed'])))
      .orderBy(desc(posts.publishedAt))
      .limit(5);

    if (rows.length === 0) return [];

    const platforms = await this.fetchPlatformsForPosts(rows.map((r: any) => r.id));
    return rows.map((r: any) => ({
      id: r.id,
      content: r.content,
      status: r.status as 'published' | 'failed',
      platforms: platforms.get(r.id) ?? [],
      publishedAt: r.publishedAt ?? new Date().toISOString(),
    }));
  }

  private async fetchUpcomingPosts(workspaceId: string): Promise<UpcomingPost[]> {
    const rows = await this.q
      .select({ id: posts.id, content: posts.content, scheduledAt: posts.scheduledAt })
      .from(posts)
      .where(and(eq(posts.workspaceId, workspaceId), eq(posts.status, 'scheduled')))
      .orderBy(asc(posts.scheduledAt))
      .limit(3);

    if (rows.length === 0) return [];

    const platforms = await this.fetchPlatformsForPosts(rows.map((r: any) => r.id));
    return rows.map((r: any) => ({
      id: r.id,
      content: r.content,
      platforms: platforms.get(r.id) ?? [],
      scheduledAt: r.scheduledAt ?? new Date().toISOString(),
    }));
  }

  private async fetchPlatformsForPosts(postIds: string[]): Promise<Map<string, SocialPlatform[]>> {
    const rows = await this.q
      .select({ postId: postTargets.postId, platform: connectedAccounts.platform })
      .from(postTargets)
      .innerJoin(connectedAccounts, eq(connectedAccounts.id, postTargets.connectedAccountId))
      .where(inArray(postTargets.postId, postIds));

    const map = new Map<string, SocialPlatform[]>();
    for (const row of rows) {
      const list = map.get(row.postId) ?? [];
      list.push(row.platform as SocialPlatform);
      map.set(row.postId, list);
    }
    return map;
  }
}
