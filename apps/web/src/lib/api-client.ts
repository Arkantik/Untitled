import type { ApiErrorResponse, ErrorCode } from '@pulsarr/shared';

export class ApiError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    const body = (await res.json()) as ApiErrorResponse;
    const { code, message, statusCode, details } = body.error;
    return new ApiError(code, message, statusCode, details);
  } catch {
    return new ApiError('INTERNAL_SERVER_ERROR', 'An unexpected error occurred.', res.status);
  }
}

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  });

  if (!res.ok) throw await parseError(res);
  return res.json() as Promise<T>;
}
