import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { Pool } from 'pg';
import * as pgSchema from './schema/pg.js';
import * as sqliteSchema from './schema/sqlite.js';

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
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    return drizzlePg({ client: pool, schema: pgSchema });
  }

  const dbPath = process.env.SQLITE_DB_PATH || './data/pulsarr.db';
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  return drizzleSqlite({ client: sqlite, schema: sqliteSchema });
}

export function getSchema() {
  const dialect = getDialect();
  return dialect === 'postgresql' ? pgSchema : sqliteSchema;
}

export { pgSchema, sqliteSchema };
