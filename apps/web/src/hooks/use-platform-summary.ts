import { useApiQuery } from './use-api-query';
import type { PlatformSummaryItem } from '@pulsarr/shared';

export function usePlatformSummary(workspaceId: string | undefined) {
  return useApiQuery<PlatformSummaryItem[]>(
    ['analytics', 'platform-summary', workspaceId],
    `/api/v1/analytics/platform-summary?workspaceId=${workspaceId}`,
    { enabled: !!workspaceId },
  );
}
