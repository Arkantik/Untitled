import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null | undefined;
  createdAt: string;
  updatedAt: string;
}

export const fetchSession = createServerFn().handler(async (): Promise<SessionUser | null> => {
  const req = getRequest();
  const headers = new Headers();
  const cookie = req?.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);

  const apiBase = import.meta.env['INTERNAL_API_URL'] ?? 'http://localhost:3001';
  const res = await fetch(`${apiBase}/api/auth/get-session`, { headers });
  if (!res.ok) return null;
  const data = (await res.json()) as { user?: SessionUser } | null;
  return data?.user ?? null;
});
