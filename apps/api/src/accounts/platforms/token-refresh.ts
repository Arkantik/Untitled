import { getEnv } from '../../config/env.js';
import type { SocialPlatform } from '@veypost/shared';
import { badRequest } from '../../common/app.exception.js';

export interface RefreshResult {
  accessToken: string;
  refreshToken: string | null;
  tokenExpiresAt: string | null;
}

function expiresAt(expiresIn: number | undefined): string | null {
  return expiresIn ? new Date(Date.now() + expiresIn * 1000).toISOString() : null;
}

export async function refreshTokenForPlatform(
  platform: SocialPlatform,
  accessToken: string,
  refreshToken: string | null,
): Promise<RefreshResult> {
  switch (platform) {
    case 'x': return refreshX(refreshToken);
    case 'linkedin': return refreshLinkedIn(refreshToken);
    case 'threads': return refreshThreads(accessToken);
    case 'facebook':
    case 'instagram': return refreshFacebook(accessToken);
    case 'bluesky': return refreshBluesky(refreshToken);
    case 'discord': throw badRequest('Discord webhooks do not expire.');
  }
}

async function refreshX(rt: string | null): Promise<RefreshResult> {
  if (!rt) throw badRequest('No refresh token. Reconnect your X account.');
  const { X_CLIENT_ID: id, X_CLIENT_SECRET: secret } = getEnv();
  if (!id || !secret) throw badRequest('X OAuth is not configured.');
  const res = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: `Basic ${btoa(`${id}:${secret}`)}` },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: rt }).toString(),
  });
  if (!res.ok) throw badRequest('Failed to refresh X token. Please reconnect.');
  const d = await res.json() as { access_token: string; refresh_token?: string; expires_in?: number };
  return { accessToken: d.access_token, refreshToken: d.refresh_token ?? null, tokenExpiresAt: expiresAt(d.expires_in) };
}

async function refreshLinkedIn(rt: string | null): Promise<RefreshResult> {
  if (!rt) throw badRequest('No refresh token. Reconnect your LinkedIn account.');
  const { LINKEDIN_CLIENT_ID: id, LINKEDIN_CLIENT_SECRET: secret } = getEnv();
  if (!id || !secret) throw badRequest('LinkedIn OAuth is not configured.');
  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: rt, client_id: id, client_secret: secret }).toString(),
  });
  if (!res.ok) throw badRequest('Failed to refresh LinkedIn token. Please reconnect.');
  const d = await res.json() as { access_token: string; refresh_token?: string; expires_in?: number };
  return { accessToken: d.access_token, refreshToken: d.refresh_token ?? null, tokenExpiresAt: expiresAt(d.expires_in) };
}

async function refreshThreads(at: string): Promise<RefreshResult> {
  const res = await fetch(`https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=${at}`);
  if (!res.ok) throw badRequest('Failed to refresh Threads token. Please reconnect.');
  const d = await res.json() as { access_token: string; expires_in?: number };
  return { accessToken: d.access_token, refreshToken: null, tokenExpiresAt: expiresAt(d.expires_in) };
}

async function refreshFacebook(at: string): Promise<RefreshResult> {
  const { FACEBOOK_APP_ID: id, FACEBOOK_APP_SECRET: secret } = getEnv();
  if (!id || !secret) throw badRequest('Meta OAuth is not configured.');
  const res = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${id}&client_secret=${secret}&fb_exchange_token=${at}`);
  if (!res.ok) throw badRequest('Failed to refresh Meta token. Please reconnect.');
  const d = await res.json() as { access_token: string; expires_in?: number };
  return { accessToken: d.access_token, refreshToken: null, tokenExpiresAt: expiresAt(d.expires_in) };
}

async function refreshBluesky(rt: string | null): Promise<RefreshResult> {
  if (!rt) throw badRequest('No refresh token. Reconnect your Bluesky account.');
  const res = await fetch('https://bsky.social/xrpc/com.atproto.server.refreshSession', {
    method: 'POST',
    headers: { Authorization: `Bearer ${rt}` },
  });
  if (!res.ok) throw badRequest('Failed to refresh Bluesky session. Please reconnect.');
  const d = await res.json() as { accessJwt: string; refreshJwt: string };
  return { accessToken: d.accessJwt, refreshToken: d.refreshJwt, tokenExpiresAt: null };
}
