"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Lock,
  Mail,
  RefreshCw,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
// AdminCharts moved to @charts parallel route slot for async loading

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";
const GREEN = "#84cc16";
const ease = [0.22, 1, 0.36, 1] as const;

const PLAN_COLOR: Record<string, string> = {
  FREE: "#6b7280",
  STUDIO: COBALT,
  ENTERPRISE: TEAL,
};

type Stats = {
  totalUsers: number;
  totalProjects: number;
  totalTasks: number;
  planDist: { plan: string; _count: { id: number } }[];
  recentUsers: { id: string; email: string; name?: string; plan: string; createdAt: string }[];
};

function MetricCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string | number;
  sub: string;
  color: string;
  icon: LucideIcon;
  loading: boolean;
}) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.01 }} className="sloer-panel rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl border" style={{ background: `${color}16`, borderColor: `${color}30`, color }}>
          <Icon size={15} />
        </div>
      </div>
      <p className="mt-4 font-display text-4xl font-bold" style={{ color }}>
        {loading ? <span className="animate-pulse text-gray-600">—</span> : value}
      </p>
      <p className="mt-2 text-xs leading-6 text-gray-500">{sub}</p>
    </motion.div>
  );
}

function SignalRow({
  title,
  value,
  desc,
  color,
}: {
  title: string;
  value: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{title}</p>
        <span className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color, borderColor: `${color}35`, background: `${color}12` }}>
          {value}
        </span>
      </div>
      <p className="mt-2 text-xs leading-6 text-gray-500">{desc}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  // null on server — set after mount to avoid hydration mismatch
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const role = ((session?.user as { role?: string } | undefined)?.role ?? "").toUpperCase();

  useEffect(() => { setMounted(true); }, []);

  // Client-side auth guard — redirect if not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/admin");
      return;
    }
    if (status === "authenticated" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      router.replace("/app/dashboard");
    }
  }, [status, role, router]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    } catch {
      // fallback handled by null check
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && (role === "ADMIN" || role === "SUPER_ADMIN")) {
      void fetchStats();
    }
  }, [status, role, fetchStats]);

  const planDistForChart = stats?.planDist ?? [
    { plan: "FREE", _count: { id: 0 } },
    { plan: "STUDIO", _count: { id: 0 } },
    { plan: "ENTERPRISE", _count: { id: 0 } },
  ];

  const studioCount = planDistForChart.find((p) => p.plan === "STUDIO")?._count?.id ?? 0;
  const enterpriseCount = planDistForChart.find((p) => p.plan === "ENTERPRISE")?._count?.id ?? 0;
  const paidCount = studioCount + enterpriseCount;
  const totalUsers = stats?.totalUsers ?? 0;
  const paidRate = totalUsers > 0 ? Math.round((paidCount / totalUsers) * 100) : 0;
  const mrr = (studioCount * 16) + (enterpriseCount * 40);

  // Guard: show nothing while session is loading or redirecting
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex h-full min-h-[480px] flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[24px] border border-amber-500/20 bg-amber-500/10 text-amber-400">
          <Lock size={22} />
        </div>
        <p className="text-sm text-gray-500">
          {status === "loading" ? "Verifying control plane access..." : "Redirecting to login..."}
        </p>
      </div>
    );
  }

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return (
      <div className="flex h-full min-h-[480px] flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[24px] border border-red-500/20 bg-red-500/10 text-red-400">
          <Lock size={22} />
        </div>
        <p className="text-sm text-gray-500">Access denied — redirecting...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 xl:p-10">
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
        {/* Header */}
        <div className="mb-10 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div>
            <span className="sloer-pill inline-flex">Control Plane // Overview</span>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl xl:text-[4.6rem] xl:leading-[0.96]">
              Company control,
              <span className="block bg-gradient-to-r from-white via-[#ffbf62] to-[#4f8cff] bg-clip-text text-transparent">made legible.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-gray-300">
              This is the operating overview for the business system behind SloerStudio: user growth, subscriptions, revenue shape, and the governance layer that turns the product into a real company platform.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button onClick={() => void fetchStats()} disabled={loading} className="sloer-button-primary disabled:opacity-50">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                <span>{loading ? "Refreshing..." : "Refresh signals"}</span>
              </button>
              <Link href="/admin/users" className="sloer-button-secondary">
                <span>Open user governance</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div className="sloer-panel rounded-[34px] p-5 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-white/8 bg-black/20 p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Active role</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="font-display text-3xl font-bold text-white">{role}</p>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ffbf62]/30 bg-[#ffbf62]/12 text-[#ffbf62]">
                    <Shield size={16} />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-gray-400">This layer is for governance, subscriptions, analytics, and the business-facing surfaces of the product ecosystem.</p>
              </div>
              <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Last refresh</p>
                <p className="mt-4 font-display text-3xl font-bold text-white" suppressHydrationWarning>
                  {mounted && lastRefresh ? lastRefresh.toLocaleTimeString() : "Waiting"}
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-400">Live data reads from the admin stats API and updates the pulse of the control plane.</p>
              </div>
            </div>

            <div className="mt-4 rounded-[28px] border border-white/8 bg-black/20 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Control signals</p>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-gray-300">Live snapshot</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <SignalRow title="Paid conversion" value={`${paidRate}%`} desc="Share of users on Studio or Enterprise." color={TEAL} />
                <SignalRow title="Revenue pulse" value={`$${mrr}`} desc="Estimated monthly recurring revenue from paid plans." color={GREEN} />
                <SignalRow title="Platform scope" value={`${stats?.totalProjects ?? 0}`} desc="Projects created across the user base." color={AMBER} />
              </div>
            </div>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total users" value={stats?.totalUsers ?? "—"} sub="Registered accounts across the platform." color={COBALT} icon={Users} loading={loading} />
          <MetricCard label="Paid subscribers" value={paidCount} sub="Studio + Enterprise layers." color={TEAL} icon={CreditCard} loading={loading} />
          <MetricCard label="Est. MRR" value={`$${mrr}`} sub="Current monthly recurring estimate." color={GREEN} icon={TrendingUp} loading={loading} />
          <MetricCard label="Projects created" value={stats?.totalProjects ?? "—"} sub="Delivery streams generated so far." color={AMBER} icon={Activity} loading={loading} />
        </div>

        {/* Charts row — loaded via @charts parallel route slot for async rendering */}

        {/* Recent Signups — with emails */}
        <div className="overflow-hidden rounded-[34px] border border-white/8 bg-white/[0.015]">
          <div className="flex flex-col gap-4 border-b border-white/8 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Mail size={13} className="text-gray-400" /> Recent signups
              </h2>
              <p className="mt-1 text-[11px] text-gray-500">Most recent entries into the company system.</p>
            </div>
            <Link href="/admin/users" className="inline-flex items-center gap-2 text-xs text-[#4f8cff] transition-colors hover:text-white">
              View all users <ArrowUpRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">Loading subscriber data...</div>
          ) : !stats?.recentUsers?.length ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[24px] border border-white/8 bg-white/[0.03] text-[#4f8cff]">
                <Sparkles size={20} />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">No subscribers yet.</p>
              <p className="mt-2 text-sm text-gray-500">The control plane will populate as the company layer starts acquiring users.</p>
            </div>
          ) : (
            <div>
              {/* Table header */}
              <div className="hidden grid-cols-[auto_1fr_110px_130px_110px] gap-4 border-b border-white/5 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-600 md:grid">
                <span className="w-10" />
                <span>Email / Name</span>
                <span>Plan</span>
                <span>Joined</span>
                <span>Actions</span>
              </div>
              {stats.recentUsers.map((u) => (
                <div key={u.id} className="border-b border-white/5 px-5 py-4 last:border-0 md:grid md:grid-cols-[auto_1fr_110px_130px_110px] md:items-center md:gap-4 md:px-6 md:py-3.5 md:hover:bg-white/[0.02]">
                  <div className="flex items-start gap-4 md:contents">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4f8cff]/25 bg-[#4f8cff]/15 text-[11px] font-bold text-[#4f8cff]">
                      {(u.name ?? u.email)[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1 md:min-w-0">
                      {/* Email + name */}
                      <p className="truncate text-sm font-medium text-white">{u.name ?? "—"}</p>
                      <p className="truncate text-xs text-gray-400">{u.email}</p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 md:hidden">
                        {/* Plan badge */}
                        <span
                          className="w-fit rounded-full border px-2 py-0.5 text-[10px] font-bold"
                          style={{ color: PLAN_COLOR[u.plan] ?? "#6b7280", borderColor: `${PLAN_COLOR[u.plan] ?? "#6b7280"}40`, background: `${PLAN_COLOR[u.plan] ?? "#6b7280"}12` }}
                        >
                          {u.plan}
                        </span>
                        {/* Date */}
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={11} />
                          {new Date(u.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Plan badge */}
                  <span
                    className="hidden w-fit rounded-full border px-2 py-0.5 text-[10px] font-bold md:inline-flex"
                    style={{ color: PLAN_COLOR[u.plan] ?? "#6b7280", borderColor: `${PLAN_COLOR[u.plan] ?? "#6b7280"}40`, background: `${PLAN_COLOR[u.plan] ?? "#6b7280"}12` }}
                  >
                    {u.plan}
                  </span>
                  {/* Date */}
                  <div className="hidden items-center gap-1.5 text-xs text-gray-500 md:flex">
                    <Calendar size={11} />
                    {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                  {/* Actions */}
                  <Link href={`/admin/users?highlight=${u.id}`} className="mt-3 inline-flex text-xs text-[#4f8cff] transition-colors hover:text-white md:mt-0">
                    Manage →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
