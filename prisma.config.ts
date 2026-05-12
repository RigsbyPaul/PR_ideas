import { defineConfig } from '@prisma/config';

// Prisma 7 requires a valid URL even if an adapter is used during runtime.
// On Vercel, we use the Turso URL. Locally, we use the SQLite file.
const databaseUrl = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL || 'file:./dev.db';

export default defineConfig({
  datasource: {
    url: databaseUrl,
  },
});
