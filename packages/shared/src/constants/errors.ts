export const ERROR_CODES = [
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'BAD_REQUEST',
  'VALIDATION_ERROR',
  'PREMIUM_REQUIRED',
  'LIMIT_EXCEEDED',
  'RATE_LIMITED',
  'INTERNAL_SERVER_ERROR',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

const CODES: ReadonlySet<string> = new Set(ERROR_CODES);

export function isKnownErrorCode(code: unknown): code is ErrorCode {
  return typeof code === 'string' && CODES.has(code);
}

export interface ApiErrorBody {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
}
