export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const [totalUsers, totalProjects, totalTasks, planDist] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.task.count(),
    prisma.user.groupBy({ by: ["plan"], _count: { id: true } }),
  ]);
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, email: true, name: true, plan: true, createdAt: true },
  });
  return NextResponse.json({ totalUsers, totalProjects, totalTasks, planDist, recentUsers });
}
