import { betterAuth } from 'better-auth';
import { bearer } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDialect, getSchema } from '@pulsarr/db';
import { getEnv } from '../config/env.js';
import { db } from './db.js';

const schema = getSchema();
const env = getEnv();

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
});
