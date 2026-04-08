export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prismaEdge } from "@/lib/prisma-edge";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const projects = await prismaEdge.project.findMany({
    where: { userId },
    include: { _count: { select: { tasks: true } } },
    orderBy: { updatedAt: "desc" },
    cacheStrategy: { ttl: 30, swr: 120 },
  });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const project = await prismaEdge.project.create({ data: { name: name.trim(), userId } });
  return NextResponse.json({ project }, { status: 201 });
}
