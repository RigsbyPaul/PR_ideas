import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const prismaClientSingleton = () => {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (url && authToken) {
    console.log("Initializing Prisma with Turso adapter...");
    const libsql = createClient({
      url,
      authToken,
    });
    // @ts-expect-error - PrismaLibSQL type mismatch
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  console.log("Falling back to standard Prisma Client (no adapter)...");
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
