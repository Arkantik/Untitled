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
