"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, TrendingUp, Activity, CreditCard, Mail, Calendar, RefreshCw, ArrowUpRight, Lock } from "lucide-react";
import AdminCharts from "@/components/AdminCharts";

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";
const GREEN = "#84cc16";

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

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  // null on server — set after mount to avoid hydration mismatch
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Client-side auth guard — redirect if not admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/admin");
      return;
    }
    if (status === "authenticated") {
      const role = (session?.user as { role?: string })?.role;
      if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        router.replace("/app/dashboard");
      }
    }
  }, [status, session, router]);

  async function fetchStats() {
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
  }

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as { role?: string })?.role;
      if (role === "ADMIN" || role === "SUPER_ADMIN") fetchStats();
    }
  }, [status]);

  const planDistForChart = stats?.planDist ?? [
    { plan: "FREE", _count: { id: 0 } },
    { plan: "STUDIO", _count: { id: 0 } },
    { plan: "ENTERPRISE", _count: { id: 0 } },
  ];

  const studioCount = planDistForChart.find(p => p.plan === "STUDIO")?._count?.id ?? 0;
  const enterpriseCount = planDistForChart.find(p => p.plan === "ENTERPRISE")?._count?.id ?? 0;
  const paidCount = studioCount + enterpriseCount;
  const mrr = (studioCount * 16) + (enterpriseCount * 40);

  // Guard: show nothing while session is loading or redirecting
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Lock size={20} className="text-amber-400" />
        </div>
        <p className="text-sm text-gray-500">
          {status === "loading" ? "Verifying access..." : "Redirecting to login..."}
        </p>
      </div>
    );
  }
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Lock size={20} className="text-red-400" />
        </div>
        <p className="text-sm text-gray-500">Access denied — redirecting...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Super Admin · Overview</p>
          <h1 className="text-2xl font-bold font-display">Subscriber Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time platform data — users, subscriptions, revenue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {mounted && lastRefresh && (
            <p className="text-[10px] text-gray-600" suppressHydrationWarning>
              Updated {lastRefresh.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/8 hover:bg-white/10 transition-colors text-gray-300 disabled:opacity-50"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", value: stats?.totalUsers ?? "—", icon: Users, color: COBALT, sub: "registered accounts" },
          { label: "Paid Subscribers", value: paidCount, icon: CreditCard, color: TEAL, sub: `Studio + Enterprise` },
          { label: "Est. MRR", value: `$${mrr}`, icon: TrendingUp, color: GREEN, sub: "monthly recurring" },
          { label: "Projects Created", value: stats?.totalProjects ?? "—", icon: Activity, color: AMBER, sub: "across all users" },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/8 bg-white/[0.025]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{s.label}</span>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <p className="text-3xl font-bold font-display" style={{ color: s.color }}>
              {loading ? <span className="animate-pulse text-gray-600">—</span> : s.value}
            </p>
            <p className="text-[10px] text-gray-600 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-6">
          <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <Users size={13} style={{ color: COBALT }} /> User Growth — Last 30 Days
          </h2>
          <AdminCharts type="userGrowth" />
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-6">
          <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <CreditCard size={13} style={{ color: TEAL }} /> Plan Distribution
          </h2>
          <AdminCharts type="planDist" data={planDistForChart} />
        </div>
      </div>

      {/* Recent Signups — with emails */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.015] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Mail size={13} className="text-gray-400" /> Recent Signups
          </h2>
          <Link href="/admin/users" className="flex items-center gap-1 text-xs text-[#4f8cff] hover:underline">
            View all users <ArrowUpRight size={11} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading subscriber data...</div>
        ) : !stats?.recentUsers?.length ? (
          <div className="p-8 text-center text-sm text-gray-500">No subscribers yet.</div>
        ) : (
          <div>
            {/* Table header */}
            <div className="grid grid-cols-[auto_1fr_100px_120px_100px] gap-4 px-6 py-3 border-b border-white/5 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
              <span className="w-8" />
              <span>Email / Name</span>
              <span>Plan</span>
              <span>Joined</span>
              <span>Actions</span>
            </div>
            {stats.recentUsers.map((u) => (
              <div key={u.id} className="grid grid-cols-[auto_1fr_100px_120px_100px] gap-4 px-6 py-3.5 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02] transition-colors">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-[#4f8cff]/15 border border-[#4f8cff]/25 flex items-center justify-center text-[11px] font-bold text-[#4f8cff]">
                  {(u.name ?? u.email)[0].toUpperCase()}
                </div>
                {/* Email + name */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{u.name ?? "—"}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                {/* Plan badge */}
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit"
                  style={{ color: PLAN_COLOR[u.plan] ?? "#6b7280", borderColor: `${PLAN_COLOR[u.plan] ?? "#6b7280"}40`, background: `${PLAN_COLOR[u.plan] ?? "#6b7280"}12` }}
                >
                  {u.plan}
                </span>
                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar size={11} />
                  {new Date(u.createdAt).toLocaleDateString()}
                </div>
                {/* Actions */}
                <Link href={`/admin/users?highlight=${u.id}`} className="text-xs text-[#4f8cff] hover:underline">
                  Manage →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
