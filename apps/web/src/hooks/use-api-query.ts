import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { apiFetch, type ApiError } from '../lib/api-client';

export function useApiQuery<TData>(
  key: QueryKey,
  url: string,
  options?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<TData, ApiError>({
    queryKey: key,
    queryFn: () => apiFetch<TData>(url),
    ...options,
  });
}
