import type { SocialPlatform } from '@pulsarr/shared';

interface OAuthState {
  workspaceId: string;
  userId: string;
  platform: SocialPlatform;
  verifier: string;
  expiresAt: number;
}

const store = new Map<string, OAuthState>();

const TTL_MS = 10 * 60 * 1000;

export function setOAuthState(
  stateKey: string,
  data: Omit<OAuthState, 'expiresAt'>,
): void {
  store.set(stateKey, { ...data, expiresAt: Date.now() + TTL_MS });
}

export function popOAuthState(stateKey: string): OAuthState | null {
  const entry = store.get(stateKey);
  if (!entry) return null;
  store.delete(stateKey);
  if (entry.expiresAt < Date.now()) return null;
  return entry;
}

export function peekOAuthState(stateKey: string): OAuthState | null {
  const entry = store.get(stateKey);
  if (!entry || entry.expiresAt < Date.now()) return null;
  return entry;
}
