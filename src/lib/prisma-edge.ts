import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrismaEdge = globalThis as typeof globalThis & {
  prismaEdge?: ReturnType<typeof createEdgeClient>;
};

function createEdgeClient() {
  return new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());
}

export const prismaEdge =
  globalForPrismaEdge.prismaEdge ?? createEdgeClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrismaEdge.prismaEdge = prismaEdge;
}

export default prismaEdge;
