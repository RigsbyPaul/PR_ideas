import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url && url !== "undefined" && authToken && authToken !== "undefined") {
    try {
      const libsql = createClient({
        url: url.trim(),
        authToken: authToken.trim(),
      });
      // @ts-ignore - Bypass type mismatch between libsql client and prisma adapter
      const adapter = new PrismaLibSQL(libsql);
      return new PrismaClient({ adapter });
    } catch (e) {
      console.error("Prisma Singleton: Error creating Turso adapter", e);
    }
  }

  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
