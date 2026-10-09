import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as pgCore from './schema/pg.js';
import * as pgAuth from './schema/pg-auth.js';
import * as pgBilling from './schema/pg-billing.js';
import * as sqliteCore from './schema/sqlite.js';
import * as sqliteAuth from './schema/sqlite-auth.js';
import * as sqliteBilling from './schema/sqlite-billing.js';

export const pgSchema = { ...pgCore, ...pgAuth, ...pgBilling };
export const sqliteSchema = { ...sqliteCore, ...sqliteAuth, ...sqliteBilling };

export type DbDialect = 'sqlite' | 'postgresql';

export function getDialect(): DbDialect {
  const dialect = process.env.DB_DIALECT || 'sqlite';
  if (dialect !== 'sqlite' && dialect !== 'postgresql') {
    throw new Error(`Unsupported DB_DIALECT: ${dialect}. Use "sqlite" or "postgresql".`);
  }
  return dialect;
}

export function createDb() {
  const dialect = getDialect();

  if (dialect === 'postgresql') {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    return drizzlePg({ client: pool, schema: pgSchema });
  }

  const defaultPath = join(dirname(fileURLToPath(import.meta.url)), '../data/veypost.db');
  const dbPath = process.env.SQLITE_DB_PATH || defaultPath;
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  return drizzleSqlite({ client: sqlite, schema: sqliteSchema });
}

export function getSchema() {
  return getDialect() === 'postgresql' ? pgSchema : sqliteSchema;
}

export type DbClient = ReturnType<typeof createDb>;
