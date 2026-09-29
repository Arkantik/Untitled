import { createContext, useContext } from 'react';
import type { WorkspaceRow } from './workspace-context';

export const WorkspaceCtx = createContext<WorkspaceRow | null>(null);

export function useWorkspace(): WorkspaceRow {
  const ws = useContext(WorkspaceCtx);
  if (!ws) throw new Error('useWorkspace must be used inside a workspace route');
  return ws;
}
