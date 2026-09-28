import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { auth } from '../lib/auth.js';
import { unauthenticated } from '../common/app.exception.js';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as Record<string, string>),
    });
    if (!session) throw unauthenticated();
    (req as unknown as Record<string, unknown>).user = session.user;
    return true;
  }
}
