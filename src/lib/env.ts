import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  OPENAI_API_KEY: z.string().min(1),
  AGENTMAIL_TOKEN: z.string().min(1),
  ADMIN_SECRET: z.string().min(1),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AGENTMAIL_TOKEN: process.env.AGENTMAIL_TOKEN,
  ADMIN_SECRET: process.env.ADMIN_SECRET,
});
