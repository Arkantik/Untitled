import { betterAuth } from 'better-auth';
import { createAuthMiddleware, APIError } from 'better-auth/api';
import { bearer } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDialect, getSchema } from '@veypost/db';
import { getEnv } from '../config/env.js';
import { db } from './db.js';

const schema = getSchema();
const env = getEnv();
const isProd = env.NODE_ENV === 'production';

const SESSION_TTL = 60 * 60 * 24 * 7;
const SESSION_REFRESH_AGE = 60 * 60 * 24;
const COOKIE_CACHE_MAX_AGE = 60 * 10;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: getDialect() === 'postgresql' ? 'pg' : 'sqlite',
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  plugins: [bearer()],
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        const password = (ctx.body as { password?: string })?.password ?? '';
        if (
          !/[A-Z]/.test(password) ||
          !/[0-9]/.test(password) ||
          !/[^A-Za-z0-9]/.test(password)
        ) {
          throw new APIError('BAD_REQUEST', {
            message:
              'Password must include at least one uppercase letter, one number, and one special character.',
          });
        }
      }
    }),
  },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  session: {
    expiresIn: SESSION_TTL,
    updateAge: SESSION_REFRESH_AGE,
    cookieCache: { enabled: true, maxAge: COOKIE_CACHE_MAX_AGE },
  },
  advanced: {
    defaultCookieAttributes: { sameSite: 'lax', secure: isProd },
  },
});
