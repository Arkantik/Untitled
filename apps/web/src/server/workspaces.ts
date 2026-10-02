import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import type { WorkspaceRow } from '~/contexts/workspace-context';

export const fetchWorkspaces = createServerFn().handler(async (): Promise<WorkspaceRow[]> => {
  const req = getRequest();
  const headers = new Headers();
  const cookie = req?.headers.get('cookie');
  if (cookie) headers.set('cookie', cookie);

  const apiBase = import.meta.env['INTERNAL_API_URL'] ?? 'http://localhost:3001';
  const res = await fetch(`${apiBase}/api/v1/workspaces`, { headers });
  if (!res.ok) return [];
  return res.json() as Promise<WorkspaceRow[]>;
});
