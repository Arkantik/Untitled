import { useQueryClient } from '@tanstack/react-query';
import { useApiQuery } from './use-api-query';
import { useApiMutation } from './use-api-mutation';
import type { ConnectedAccount } from '@pulsarr/shared';

export function useConnectedAccounts(workspaceId: string | undefined) {
  return useApiQuery<ConnectedAccount[]>(
    ['accounts', workspaceId],
    `/api/v1/accounts?workspaceId=${workspaceId}`,
    { enabled: !!workspaceId },
  );
}

export function useDisconnectAccount(workspaceId: string) {
  const qc = useQueryClient();
  return useApiMutation<void, string>(
    'DELETE',
    (id) => `/api/v1/accounts/${id}?workspaceId=${workspaceId}`,
    {
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: ['accounts', workspaceId] });
        void qc.invalidateQueries({ queryKey: ['dashboard', 'summary', workspaceId] });
      },
    },
  );
}

export function useConnectDiscord(workspaceId: string) {
  const qc = useQueryClient();
  return useApiMutation<void, { webhookUrl: string }>(
    'POST',
    '/api/v1/accounts/connect/discord',
    {
      extractBody: (vars) => ({ ...vars, workspaceId }),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: ['accounts', workspaceId] });
      },
    },
  );
}

export function useConnectBluesky(workspaceId: string) {
  const qc = useQueryClient();
  return useApiMutation<void, { handle: string; appPassword: string }>(
    'POST',
    '/api/v1/accounts/connect/bluesky',
    {
      extractBody: (vars) => ({ ...vars, workspaceId }),
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: ['accounts', workspaceId] });
      },
    },
  );
}

export function useRefreshAccount(workspaceId: string) {
  const qc = useQueryClient();
  return useApiMutation<void, string>(
    'POST',
    (id) => `/api/v1/accounts/${id}/refresh?workspaceId=${workspaceId}`,
    {
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: ['accounts', workspaceId] });
      },
    },
  );
}

export function useListPendingPages(workspaceId: string, token: string | null) {
  return useApiQuery<{ platform: string; pages: import('@pulsarr/shared').PageOption[] }>(
    ['pending-pages', token],
    `/api/v1/accounts/pending/${token}?workspaceId=${workspaceId}`,
    { enabled: !!token },
  );
}

export function useConfirmPendingPages(workspaceId: string, token: string) {
  const qc = useQueryClient();
  return useApiMutation<void, { selectedIds: string[] }>(
    'POST',
    `/api/v1/accounts/pending/${token}?workspaceId=${workspaceId}`,
    {
      onSuccess: () => {
        void qc.invalidateQueries({ queryKey: ['accounts', workspaceId] });
      },
    },
  );
}
