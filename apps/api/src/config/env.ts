import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3001),

  DB_DIALECT: z.enum(['sqlite', 'postgresql']).default('sqlite'),
  SQLITE_DB_PATH: z.string().default('./data/veypost.db'),
  DATABASE_URL: z.string().optional(),

  VALKEY_URL: z.string().default('redis://localhost:6379'),

  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRO_PRICE_ID: z.string().optional(),
  BILLING_ENABLED: z.coerce.boolean().default(false),
  APP_URL: z.string().url().default('http://localhost:3000'),
  UPLOAD_DIR: z.string().default('./data/uploads'),

  X_CLIENT_ID: z.string().optional(),
  X_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  THREADS_APP_ID: z.string().optional(),
  THREADS_APP_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | undefined;

export function getEnv(): Env {
  if (!_env) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      console.error('Invalid environment variables:', result.error.format());
      process.exit(1);
    }
    _env = result.data;
  }
  return _env;
}
