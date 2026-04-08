import { PrismaClient } from "@prisma/client";
import { env } from "./env";

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

function createPrismaClient() {
  return new PrismaClient({
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    errorFormat: env.NODE_ENV === "development" ? "pretty" : "minimal",
    ...(env.DATABASE_URL ? { datasources: { db: { url: env.DATABASE_URL } } } : {}),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export default prisma;
