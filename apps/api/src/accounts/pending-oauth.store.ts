import type { StoredPageOption } from './accounts.helpers.js';

interface PendingOAuth {
  workspaceId: string;
  userId: string;
  platform: 'linkedin' | 'facebook';
  refreshToken: string | null;
  tokenExpiresAt: string | null;
  pages: StoredPageOption[];
  expiresAt: number;
}

const store = new Map<string, PendingOAuth>();
const TTL_MS = 15 * 60 * 1000;

export function setPendingOAuth(token: string, data: Omit<PendingOAuth, 'expiresAt'>): void {
  store.set(token, { ...data, expiresAt: Date.now() + TTL_MS });
}

export function popPendingOAuth(token: string): PendingOAuth | null {
  const entry = store.get(token);
  if (!entry) return null;
  store.delete(token);
  if (entry.expiresAt < Date.now()) return null;
  return entry;
}

export function peekPendingOAuth(token: string): PendingOAuth | null {
  const entry = store.get(token);
  if (!entry || entry.expiresAt < Date.now()) return null;
  return entry;
}
