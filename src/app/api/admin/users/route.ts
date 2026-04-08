export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prismaEdge } from "@/lib/prisma-edge";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = 20;
  const where = search ? { OR: [{ email: { contains: search } }, { name: { contains: search } }] } : {};
  const cache = { cacheStrategy: { ttl: 30, swr: 120 } } as const;
  const [users, total] = await Promise.all([
    prismaEdge.user.findMany({
      where,
      select: { id: true, email: true, name: true, role: true, plan: true, createdAt: true, lastLoginAt: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      ...cache,
    }),
    prismaEdge.user.count({ where, ...cache }),
  ]);
  return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, role, plan } = await req.json();
  const user = await prismaEdge.user.update({ where: { id }, data: { role, plan } });
  return NextResponse.json({ user });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await req.json();
  await prismaEdge.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
