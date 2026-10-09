import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import type { ApiErrorBody, ErrorCode } from '@veypost/shared';
import { isKnownErrorCode } from '@veypost/shared';
import { AppException } from './app.exception.js';
import { getEnv } from '../config/env.js';

const MASKED_MESSAGE = 'An unexpected error occurred.';

function httpStatusToCode(status: number): ErrorCode {
  if (status === 401) return 'UNAUTHENTICATED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 409) return 'CONFLICT';
  if (status === 422) return 'VALIDATION_ERROR';
  if (status === 402) return 'PREMIUM_REQUIRED';
  if (status === 429) return 'RATE_LIMITED';
  if (status === 400) return 'BAD_REQUEST';
  return 'INTERNAL_SERVER_ERROR';
}

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const reply = host.switchToHttp().getResponse<FastifyReply>();

    if (exception instanceof AppException) {
      const error: ApiErrorBody = {
        code: exception.code,
        message: exception.message,
        statusCode: exception.getStatus(),
        ...(exception.details && { details: exception.details }),
      };
      reply.status(exception.getStatus()).send({ success: false, error });
      return;
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const rawResponse = exception.getResponse();
      const message =
        typeof rawResponse === 'string'
          ? rawResponse
          : typeof (rawResponse as Record<string, unknown>).message === 'string'
            ? ((rawResponse as Record<string, unknown>).message as string)
            : exception.message;
      const rawCode = (rawResponse as Record<string, unknown>).code;
      const code = isKnownErrorCode(rawCode) ? rawCode : httpStatusToCode(statusCode);
      const error: ApiErrorBody = { code, message, statusCode };
      reply.status(statusCode).send({ success: false, error });
      return;
    }

    this.logger.error('Unhandled exception', {
      name: exception instanceof Error ? exception.name : undefined,
      message: exception instanceof Error ? exception.message : String(exception),
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    const { NODE_ENV } = getEnv();
    const message =
      NODE_ENV === 'production'
        ? MASKED_MESSAGE
        : exception instanceof Error
          ? exception.message
          : MASKED_MESSAGE;

    const error: ApiErrorBody = { code: 'INTERNAL_SERVER_ERROR', message, statusCode: 500 };
    reply.status(500).send({ success: false, error });
  }
}
