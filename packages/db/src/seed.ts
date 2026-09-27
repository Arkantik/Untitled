import { createDb, getSchema } from './index.js';

async function seed() {
  const db = createDb();
  const schema = getSchema();

  console.log('Seeding database...');

  // Seed logic will go here as the project develops

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
