import { eq, and } from 'drizzle-orm';
import { sqliteSchema } from '@pulsarr/db';
import type { ConnectedAccount, SocialPlatform } from '@pulsarr/shared';

export interface UpsertData {
  platformAccountId: string;
  platformUsername: string | null;
  avatarUrl: string | null;
  accessToken: string;
  refreshToken: string | null;
  tokenExpiresAt: string | null;
}

export interface StoredPageOption {
  id: string;
  name: string;
  platformType: SocialPlatform;
  avatarUrl: string | null;
  accessToken: string;
}

export function deriveStatus(tokenExpiresAt: string | null): ConnectedAccount['status'] {
  if (!tokenExpiresAt) return 'active';
  return new Date(tokenExpiresAt) < new Date() ? 'expired' : 'active';
}

export async function upsertAccount(
  db: any,
  workspaceId: string,
  platform: SocialPlatform,
  data: UpsertData,
): Promise<void> {
  const { connectedAccounts } = sqliteSchema;
  const existing = await db
    .select({ id: connectedAccounts.id })
    .from(connectedAccounts)
    .where(and(
      eq(connectedAccounts.workspaceId, workspaceId),
      eq(connectedAccounts.platform, platform),
      eq(connectedAccounts.platformAccountId, data.platformAccountId),
    ))
    .limit(1);

  const now = new Date().toISOString();
  if (existing[0]) {
    await db.update(connectedAccounts)
      .set({ platformUsername: data.platformUsername, avatarUrl: data.avatarUrl, accessToken: data.accessToken, refreshToken: data.refreshToken, tokenExpiresAt: data.tokenExpiresAt, updatedAt: now })
      .where(eq(connectedAccounts.id, existing[0].id));
  } else {
    await db.insert(connectedAccounts).values({ workspaceId, platform, ...data });
  }
}
