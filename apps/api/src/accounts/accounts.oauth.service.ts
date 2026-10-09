import { Injectable, Inject } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { sqliteSchema } from '@pulsarr/db';
import type { DbClient } from '@pulsarr/db';
import type { SocialPlatform, PageOption } from '@pulsarr/shared';
import { assertMember, assertAccountLimit } from '../workspaces/workspaces.helpers.js';
import { notFound, badRequest } from '../common/app.exception.js';
import { getEnv } from '../config/env.js';
import { setOAuthState, popOAuthState } from './oauth-state.store.js';
import { isOAuthPlatform, buildOAuthUrl, exchangeOAuthCode, generateVerifier } from './platforms/oauth.connector.js';
import { fetchOAuthProfile } from './platforms/profile.fetcher.js';
import { refreshTokenForPlatform } from './platforms/token-refresh.js';
import { fetchLinkedInPages } from './pages/linkedin.pages.js';
import { fetchMetaPages } from './pages/meta.pages.js';
import { setPendingOAuth, popPendingOAuth, peekPendingOAuth } from './pending-oauth.store.js';
import { upsertAccount } from './accounts.helpers.js';

const PAGE_PICKER_PLATFORMS = new Set<string>(['linkedin', 'facebook']);

export interface OAuthCallbackResult {
  workspaceId: string;
  pendingToken?: string;
}

@Injectable()
export class AccountsOAuthService {
  constructor(@Inject('DB') private readonly db: DbClient) {}

  private get q() { return this.db as any; }
  private callbackUrl(p: string) { return `${getEnv().APP_URL}/api/v1/accounts/callback/${p}`; }

  async initiateOAuth(platform: string, workspaceId: string, userId: string): Promise<string> {
    if (!isOAuthPlatform(platform)) throw badRequest(`Unsupported OAuth platform: ${platform}`);
    await assertMember(this.q, workspaceId, userId);
    const state = crypto.randomUUID();
    const verifier = generateVerifier();
    setOAuthState(state, { workspaceId, userId, platform, verifier });
    return buildOAuthUrl(platform, this.callbackUrl(platform), state, verifier);
  }

  async handleOAuthCallback(platform: string, code: string, state: string): Promise<OAuthCallbackResult> {
    if (!isOAuthPlatform(platform)) throw badRequest(`Unsupported OAuth platform: ${platform}`);
    const ctx = popOAuthState(state);
    if (!ctx) throw badRequest('Invalid or expired OAuth state. Please try connecting again.');
    await assertAccountLimit(this.q, ctx.workspaceId);
    const tokens = await exchangeOAuthCode(platform, code, this.callbackUrl(platform), ctx.verifier);
    const tokenExpiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null;

    if (PAGE_PICKER_PLATFORMS.has(platform)) {
      const pages = platform === 'linkedin'
        ? await fetchLinkedInPages(tokens.access_token)
        : await fetchMetaPages(tokens.access_token);
      const pendingToken = crypto.randomUUID();
      setPendingOAuth(pendingToken, { workspaceId: ctx.workspaceId, userId: ctx.userId, platform: platform as 'linkedin' | 'facebook', refreshToken: tokens.refresh_token ?? null, tokenExpiresAt, pages });
      return { workspaceId: ctx.workspaceId, pendingToken };
    }

    const profile = await fetchOAuthProfile(platform, tokens.access_token);
    await upsertAccount(this.q, ctx.workspaceId, profile.platform, {
      platformAccountId: profile.platformAccountId, platformUsername: profile.platformUsername, avatarUrl: profile.avatarUrl,
      accessToken: tokens.access_token, refreshToken: tokens.refresh_token ?? null, tokenExpiresAt,
    });
    return { workspaceId: ctx.workspaceId };
  }

  async refreshAccount(id: string, workspaceId: string, userId: string): Promise<void> {
    await assertMember(this.q, workspaceId, userId);
    const { connectedAccounts } = sqliteSchema;
    const [row] = await this.q
      .select({ platform: connectedAccounts.platform, accessToken: connectedAccounts.accessToken, refreshToken: connectedAccounts.refreshToken })
      .from(connectedAccounts)
      .where(and(eq(connectedAccounts.id, id), eq(connectedAccounts.workspaceId, workspaceId)))
      .limit(1);
    if (!row) throw notFound('Account not found');
    const result = await refreshTokenForPlatform(row.platform as SocialPlatform, row.accessToken, row.refreshToken);
    await this.q.update(connectedAccounts)
      .set({ accessToken: result.accessToken, refreshToken: result.refreshToken, tokenExpiresAt: result.tokenExpiresAt, updatedAt: new Date().toISOString() })
      .where(eq(connectedAccounts.id, id));
  }

  async listPendingPages(token: string, workspaceId: string, userId: string): Promise<{ platform: string; pages: PageOption[] }> {
    await assertMember(this.q, workspaceId, userId);
    const pending = peekPendingOAuth(token);
    if (!pending) throw badRequest('Invalid or expired selection token.');
    return {
      platform: pending.platform,
      pages: pending.pages.map(({ id, name, platformType, avatarUrl }) => ({ id, name, platformType, avatarUrl })),
    };
  }

  async confirmPendingPages(token: string, workspaceId: string, userId: string, selectedIds: string[]): Promise<void> {
    await assertMember(this.q, workspaceId, userId);
    const pending = popPendingOAuth(token);
    if (!pending) throw badRequest('Invalid or expired selection token.');
    for (const id of selectedIds) {
      const page = pending.pages.find((p) => p.id === id);
      if (!page) continue;
      await assertAccountLimit(this.q, workspaceId);
      await upsertAccount(this.q, workspaceId, page.platformType, {
        platformAccountId: page.id, platformUsername: page.name, avatarUrl: page.avatarUrl,
        accessToken: page.accessToken, refreshToken: pending.refreshToken, tokenExpiresAt: pending.tokenExpiresAt,
      });
    }
  }
}
