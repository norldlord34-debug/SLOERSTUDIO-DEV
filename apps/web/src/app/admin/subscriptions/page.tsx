import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreditCard, TrendingUp } from "lucide-react";

export default async function AdminSubscriptionsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/app/dashboard");

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <CreditCard size={20} className="text-[#ffbf62]" />
        <div>
          <h1 className="text-2xl font-bold font-display">Subscriptions</h1>
          <p className="text-gray-400 text-sm mt-1">Manage platform subscriptions and billing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "MRR", value: "$0", change: "—", color: "#28e7c5" },
          { label: "Active Subs", value: "0", change: "—", color: "#4f8cff" },
          { label: "Churn Rate", value: "0%", change: "—", color: "#ffbf62" },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/8 bg-white/[0.025]">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-3">{s.label}</p>
            <p className="text-3xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1"><TrendingUp size={10} />{s.change}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.015] overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3.5 border-b border-white/8 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>User</span><span>Plan</span><span>Status</span><span>Period End</span><span>MRR</span>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CreditCard size={24} className="text-gray-600 mb-3" />
          <p className="text-sm text-gray-500">No active subscriptions yet</p>
        </div>
      </div>
    </div>
  );
}
