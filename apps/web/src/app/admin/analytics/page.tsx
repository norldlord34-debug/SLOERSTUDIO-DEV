import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";
import AdminCharts from "@/components/AdminCharts";

export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/app/dashboard");

  const planDist = [
    { plan: "FREE", _count: { id: 1 } },
    { plan: "STUDIO", _count: { id: 0 } },
    { plan: "ENTERPRISE", _count: { id: 0 } },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 size={20} className="text-[#28e7c5]" />
        <div>
          <h1 className="text-2xl font-bold font-display">Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Platform metrics and growth insights.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-6">
          <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <Users size={14} className="text-[#4f8cff]" /> User Growth — Last 30 Days
          </h2>
          <AdminCharts type="userGrowth" />
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-6">
          <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <Activity size={14} className="text-[#28e7c5]" /> Plan Distribution
          </h2>
          <AdminCharts type="planDist" data={planDist} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-6">
        <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
          <TrendingUp size={14} className="text-[#ffbf62]" /> Monthly Revenue (MRR)
        </h2>
        <AdminCharts type="revenue" />
      </div>
    </div>
  );
}
