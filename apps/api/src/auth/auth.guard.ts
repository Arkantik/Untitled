import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';
import { auth } from '../lib/auth.js';
import { unauthenticated } from '../common/app.exception.js';
import { IS_PUBLIC_KEY } from './public.decorator.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<FastifyRequest>();
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as Record<string, string>),
    });
    if (!session) throw unauthenticated();
    (req as unknown as Record<string, unknown>).user = session.user;
    return true;
  }
}
