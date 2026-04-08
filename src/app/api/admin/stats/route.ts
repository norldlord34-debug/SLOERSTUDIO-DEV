export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prismaEdge } from "@/lib/prisma-edge";

const SWR_TTL = 60;
const SWR_STALE = 300;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cache = { cacheStrategy: { ttl: SWR_TTL, swr: SWR_STALE } } as const;

  const [totalUsers, totalProjects, totalTasks, planDist] = await Promise.all([
    prismaEdge.user.count(cache),
    prismaEdge.project.count(cache),
    prismaEdge.task.count(cache),
    prismaEdge.user.groupBy({ by: ["plan"], _count: { id: true }, ...cache }),
  ]);
  const recentUsers = await prismaEdge.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, email: true, name: true, plan: true, createdAt: true },
    ...cache,
  });
  return NextResponse.json(
    { totalUsers, totalProjects, totalTasks, planDist, recentUsers },
    { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" } },
  );
}
