import { defineConfig } from '@prisma/config';

// Robust check for environment variables, handling literal "undefined" strings
const getDbUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  const tursoUrl = process.env.TURSO_DATABASE_URL;

  if (envUrl && envUrl !== 'undefined' && envUrl !== '') {
    return envUrl;
  }
  if (tursoUrl && tursoUrl !== 'undefined' && tursoUrl !== '') {
    return tursoUrl;
  }
  return 'file:./dev.db';
};

export default defineConfig({
  datasource: {
    url: getDbUrl(),
  },
});
