import { HttpException } from '@nestjs/common';
import type { z } from 'zod';
import type { ErrorCode } from '@veypost/shared';

const STATUS: Record<ErrorCode, number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  VALIDATION_ERROR: 422,
  PREMIUM_REQUIRED: 402,
  LIMIT_EXCEEDED: 429,
  RATE_LIMITED: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export class AppException extends HttpException {
  readonly code: ErrorCode;
  readonly details?: Record<string, unknown>;

  constructor(code: ErrorCode, message: string, details?: Record<string, unknown>) {
    super(message, STATUS[code]);
    this.code = code;
    this.details = details;
  }
}

export function unauthenticated(message = 'Not authenticated'): AppException {
  return new AppException('UNAUTHENTICATED', message);
}

export function forbidden(message = 'Not authorized'): AppException {
  return new AppException('FORBIDDEN', message);
}

export function notFound(message = 'Not found'): AppException {
  return new AppException('NOT_FOUND', message);
}

export function conflict(message: string, details?: Record<string, unknown>): AppException {
  return new AppException('CONFLICT', message, details);
}

export function badRequest(message: string, details?: Record<string, unknown>): AppException {
  return new AppException('BAD_REQUEST', message, details);
}

export function validationError(issues: z.core.$ZodIssue[]): AppException {
  const fields = issues.map((i) => ({ path: i.path.join('.') || 'root', message: i.message }));
  return new AppException('VALIDATION_ERROR', 'Validation failed', { fields });
}

export function premiumRequired(message = 'This feature requires a paid plan.'): AppException {
  return new AppException('PREMIUM_REQUIRED', message);
}

export function limitExceeded(message: string, limit: number, current?: number): AppException {
  return new AppException('LIMIT_EXCEEDED', message, { limit, current });
}

export function rateLimited(message: string, retryAfter: number): AppException {
  return new AppException('RATE_LIMITED', message, { retryAfter });
}
