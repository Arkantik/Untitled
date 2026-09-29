import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';

vi.mock('../lib/auth.js', () => ({ auth: { api: { getSession: vi.fn() } } }));
vi.mock('../common/app.exception.js', () => ({
  unauthenticated: () => new UnauthorizedException('Not authenticated'),
}));

import { auth } from '../lib/auth.js';
import { AuthGuard } from './auth.guard.js';

const mockGetSession = vi.mocked(auth.api.getSession);

function makeReflector(isPublic: boolean) {
  return { getAllAndOverride: vi.fn().mockReturnValue(isPublic) } as any;
}

function makeContext(headers: Record<string, string> = {}) {
  const req = { headers };
  return {
    getHandler: vi.fn(),
    getClass: vi.fn(),
    switchToHttp: () => ({ getRequest: () => req }),
    _req: req,
  } as any;
}

describe('AuthGuard', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('passes through without hitting better-auth when route is @Public()', async () => {
    const guard = new AuthGuard(makeReflector(true));
    const ctx = makeContext();
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect(mockGetSession).not.toHaveBeenCalled();
  });

  it('attaches session user to request and returns true when session is valid', async () => {
    const fakeUser = { id: 'u1', name: 'Alice', email: 'alice@example.com' };
    mockGetSession.mockResolvedValue({ user: fakeUser, session: {} } as any);

    const guard = new AuthGuard(makeReflector(false));
    const ctx = makeContext({ cookie: 'session=abc' });
    const result = await guard.canActivate(ctx);

    expect(result).toBe(true);
    expect((ctx._req as any).user).toEqual(fakeUser);
  });

  it('throws UnauthorizedException when no session exists', async () => {
    mockGetSession.mockResolvedValue(null);

    const guard = new AuthGuard(makeReflector(false));
    const ctx = makeContext();

    await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws when better-auth rejects the session (expired token)', async () => {
    mockGetSession.mockRejectedValue(new Error('Session expired'));

    const guard = new AuthGuard(makeReflector(false));
    const ctx = makeContext();

    await expect(guard.canActivate(ctx)).rejects.toThrow();
  });
});
