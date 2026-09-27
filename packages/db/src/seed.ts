import { createDb, getSchema } from './index.js';

async function seed() {
  const db = createDb();
  const schema = getSchema();

  console.log('Seeding database...');

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
