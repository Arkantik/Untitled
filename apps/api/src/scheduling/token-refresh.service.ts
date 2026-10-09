import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { eq, lte, and, isNotNull, notInArray } from 'drizzle-orm';
import { sqliteSchema } from '@veypost/db';
import type { DbClient } from '@veypost/db';
import type { SocialPlatform } from '@veypost/shared';
import { refreshTokenForPlatform } from '../accounts/platforms/token-refresh.js';

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const NO_REFRESH_PLATFORMS: SocialPlatform[] = ['discord'];

@Injectable()
export class TokenRefreshService {
  private readonly logger = new Logger(TokenRefreshService.name);

  constructor(@Inject('DB') private readonly db: DbClient) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sweepExpiringTokens(): Promise<void> {
    const { connectedAccounts } = sqliteSchema;
    const threshold = new Date(Date.now() + SIX_HOURS_MS).toISOString();

    const rows = await (this.db as any)
      .select({
        id: connectedAccounts.id,
        platform: connectedAccounts.platform,
        accessToken: connectedAccounts.accessToken,
        refreshToken: connectedAccounts.refreshToken,
      })
      .from(connectedAccounts)
      .where(
        and(
          isNotNull(connectedAccounts.tokenExpiresAt),
          lte(connectedAccounts.tokenExpiresAt, threshold),
          notInArray(connectedAccounts.platform, NO_REFRESH_PLATFORMS),
        ),
      );

    if (rows.length === 0) return;

    this.logger.log(`Refreshing ${rows.length} expiring token(s)`);

    const succeeded: string[] = [];
    const failed: { id: string; reason: string }[] = [];

    for (const row of rows) {
      try {
        const result = await refreshTokenForPlatform(
          row.platform as SocialPlatform,
          row.accessToken,
          row.refreshToken,
        );
        await (this.db as any)
          .update(connectedAccounts)
          .set({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            tokenExpiresAt: result.tokenExpiresAt,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(connectedAccounts.id, row.id));
        succeeded.push(row.id);
      } catch (err) {
        failed.push({ id: row.id, reason: err instanceof Error ? err.message : String(err) });
      }
    }

    if (succeeded.length > 0) this.logger.log(`Refreshed ${succeeded.length} token(s).`);
    if (failed.length > 0) this.logger.warn(`Failed to refresh ${failed.length} token(s): ${failed.map((f) => `${f.id} (${f.reason})`).join(', ')}`);
  }
}
