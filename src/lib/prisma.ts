import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import { env } from "./env";

const prismaClientSingleton = () => {
  const url = "libsql://prideas-readiescards.aws-eu-west-1.turso.io";
  const authToken = env.TURSO_AUTH_TOKEN;

  console.log("Prisma init - Hardcoded URL");

  if (url && authToken) {
    const libsql = createClient({
      url,
      authToken,
    });
    // @ts-expect-error - PrismaLibSQL type mismatch
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
