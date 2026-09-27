import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3001),

  DB_DIALECT: z.enum(['sqlite', 'postgresql']).default('sqlite'),
  SQLITE_DB_PATH: z.string().default('./data/pulsarr.db'),
  DATABASE_URL: z.string().optional(),

  VALKEY_URL: z.string().optional(),

  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),
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
