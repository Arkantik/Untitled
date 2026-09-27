import { defineConfig } from 'drizzle-kit';

const dialect = process.env.DB_DIALECT || 'sqlite';

export default dialect === 'postgresql'
  ? defineConfig({
      dialect: 'postgresql',
      schema: './src/schema/pg.ts',
      out: './drizzle/pg',
      dbCredentials: {
        url: process.env.DATABASE_URL!,
      },
    })
  : defineConfig({
      dialect: 'sqlite',
      schema: './src/schema/sqlite.ts',
      out: './drizzle/sqlite',
      dbCredentials: {
        url: process.env.SQLITE_DB_PATH || './data/pulsarr.db',
      },
    });
