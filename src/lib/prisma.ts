import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
  // Use process.env directly for the singleton to avoid circular dependencies with env.ts
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  console.log("Prisma Singleton Check:", {
    hasUrl: !!url,
    hasToken: !!authToken,
    env: process.env.NODE_ENV
  });

  if (url && url !== "undefined" && authToken && authToken !== "undefined") {
    try {
      const libsql = createClient({
        url,
        authToken,
      });
      // @ts-expect-error - PrismaLibSQL type mismatch
      const adapter = new PrismaLibSQL(libsql);
      return new PrismaClient({ adapter });
    } catch (e) {
      console.error("Failed to initialize Turso adapter:", e);
    }
  }

  // Fallback to standard client - Prisma 7 will look at prisma.config.ts
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
