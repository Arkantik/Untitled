import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useApiQuery } from '~/hooks/use-api-query';

export interface WorkspaceRow {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  plan: string;
  subscriptionStatus: string;
  timezone: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MemberWithUser {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  createdAt: string;
  name: string | null;
  email: string;
}

interface WorkspaceContextValue {
  workspaces: WorkspaceRow[];
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  workspaces: [],
  isLoading: false,
});

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { data: workspaces = [], isLoading } = useApiQuery<WorkspaceRow[]>(
    ['workspaces'],
    '/api/v1/workspaces',
  );

  const value = useMemo(
    () => ({ workspaces, isLoading }),
    [workspaces, isLoading],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  return useContext(WorkspaceContext);
}
