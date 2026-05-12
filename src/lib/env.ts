import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  TURSO_DATABASE_URL: z.string().optional(),
  TURSO_AUTH_TOKEN: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  AGENTMAIL_TOKEN: z.string().optional(),
  ADMIN_SECRET: z.string().optional(),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AGENTMAIL_TOKEN: process.env.AGENTMAIL_TOKEN,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
});
