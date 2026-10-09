import { badRequest } from '../../common/app.exception.js';

export interface ConnectorResult {
  platformAccountId: string;
  platformUsername: string | null;
  avatarUrl: string | null;
  accessToken: string;
  refreshToken: string | null;
  tokenExpiresAt: null;
}

export async function connectBluesky(
  handle: string,
  appPassword: string,
): Promise<ConnectorResult> {
  const normalized = handle.replace(/^@/, '').trim();

  const resolveRes = await fetch(
    `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(normalized)}`,
  );
  if (!resolveRes.ok) {
    throw badRequest('Could not resolve Bluesky handle. Check it is spelled correctly.');
  }
  const { did } = (await resolveRes.json()) as { did: string };

  const sessionRes = await fetch(
    'https://bsky.social/xrpc/com.atproto.server.createSession',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: normalized, password: appPassword }),
    },
  );
  if (!sessionRes.ok) {
    const err = (await sessionRes.json().catch(() => ({}))) as { message?: string };
    throw badRequest(
      err.message ?? 'Invalid handle or app password. Use an app password from Bluesky → Settings → App Passwords.',
    );
  }
  const session = (await sessionRes.json()) as {
    did: string;
    handle: string;
    accessJwt: string;
    refreshJwt: string;
  };

  const profileRes = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(did)}`,
  );
  const profile = profileRes.ok
    ? ((await profileRes.json()) as { avatar?: string })
    : {};

  return {
    platformAccountId: did,
    platformUsername: session.handle ?? normalized,
    avatarUrl: (profile as { avatar?: string }).avatar ?? null,
    accessToken: session.accessJwt,
    refreshToken: session.refreshJwt,
    tokenExpiresAt: null,
  };
}
