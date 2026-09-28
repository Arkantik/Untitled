import { createDb, type DbClient } from '@pulsarr/db';

export const db: DbClient = createDb();
