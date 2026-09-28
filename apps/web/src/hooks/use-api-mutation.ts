import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { apiFetch, type ApiError } from '../lib/api-client';

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Options<TData, TVariables> = Omit<
  UseMutationOptions<TData, ApiError, TVariables>,
  'mutationFn'
> & {
  extractBody?: (vars: TVariables) => unknown;
};

export function useApiMutation<TData, TVariables = void>(
  method: HttpMethod,
  url: string | ((vars: TVariables) => string),
  options?: Options<TData, TVariables>,
) {
  const { extractBody, ...mutationOptions } = options ?? {};

  return useMutation<TData, ApiError, TVariables>({
    mutationFn: (vars) => {
      const resolvedUrl = typeof url === 'function' ? url(vars) : url;
      const hasBody = method !== 'DELETE';
      const body = hasBody ? (extractBody ? extractBody(vars) : vars) : undefined;
      return apiFetch<TData>(resolvedUrl, {
        method,
        ...(body !== undefined && { body: JSON.stringify(body) }),
      });
    },
    ...mutationOptions,
  });
}
