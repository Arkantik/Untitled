import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery } from './use-api-query';
import { useApiMutation } from './use-api-mutation';
import { toast } from '~/components/ui/toast';
import type { MemberWithUser, WorkspaceRow } from '~/contexts/workspace-context';

export function useCreateWorkspace(onSuccess?: (ws: WorkspaceRow) => void) {
  const qc = useQueryClient();
  return useApiMutation<WorkspaceRow, { name: string }>('POST', '/api/v1/workspaces', {
    onSuccess: (ws) => {
      qc.setQueryData<WorkspaceRow[]>(['workspaces'], (prev) => [...(prev ?? []), ws]);
      qc.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success(`Workspace "${ws.name}" created.`);
      onSuccess?.(ws);
    },
  });
}

export function useWorkspaceMembers(workspaceId: string | null | undefined) {
  return useApiQuery<MemberWithUser[]>(
    ['workspaces', workspaceId, 'members'],
    `/api/v1/workspaces/${workspaceId}/members`,
    { enabled: !!workspaceId },
  );
}

export function useUpdateWorkspace(workspaceId: string) {
  const qc = useQueryClient();
  return useApiMutation<WorkspaceRow, { name?: string; timezone?: string; avatarUrl?: string | null }>('PATCH', `/api/v1/workspaces/${workspaceId}`, {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace updated.');
    },
  });
}

export function useDeleteWorkspace() {
  const qc = useQueryClient();
  return useApiMutation<void, string>('DELETE', (id) => `/api/v1/workspaces/${id}`, {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace deleted.');
    },
  });
}

export function useInviteMember(workspaceId: string) {
  const qc = useQueryClient();
  return useApiMutation<MemberWithUser, { email: string; role: 'admin' | 'editor' | 'viewer' }>(
    'POST',
    `/api/v1/workspaces/${workspaceId}/members`,
    {
      onSuccess: (member) => {
        qc.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] });
        toast.success(`Invitation sent to ${member.email}.`);
      },
    },
  );
}

export function useUpdateMemberRole(workspaceId: string) {
  const qc = useQueryClient();
  return useApiMutation<unknown, { userId: string; role: 'admin' | 'editor' | 'viewer' }>(
    'PATCH',
    (v) => `/api/v1/workspaces/${workspaceId}/members/${v.userId}`,
    {
      extractBody: (v) => ({ role: v.role }),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] });
        toast.success('Role updated.');
      },
    },
  );
}

export function useRemoveMember(workspaceId: string) {
  const qc = useQueryClient();
  return useApiMutation<void, string>(
    'DELETE',
    (userId) => `/api/v1/workspaces/${workspaceId}/members/${userId}`,
    {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ['workspaces', workspaceId, 'members'] });
        toast.success('Member removed.');
      },
    },
  );
}
