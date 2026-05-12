import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const prismaClientSingleton = () => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Only use the adapter if we have real Turso credentials
  const isTurso = url && url !== "undefined" && url !== "" && 
                  authToken && authToken !== "undefined" && authToken !== "";

  if (isTurso) {
    try {
      // Prisma 7 pattern: Pass the config directly to the adapter constructor
      // @ts-ignore - Bypass internal type mismatch if any
      const adapter = new PrismaLibSql({
        url: url.trim(),
        authToken: authToken.trim(),
      });
      return new PrismaClient({ adapter });
    } catch (e) {
      console.error("Prisma Singleton: Error creating Turso adapter", e);
    }
  }

  // Fallback for local development
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
