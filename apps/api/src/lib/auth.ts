import { betterAuth } from 'better-auth';
import { bearer } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDialect, getSchema } from '@pulsarr/db';
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
  emailAndPassword: { enabled: true },
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
