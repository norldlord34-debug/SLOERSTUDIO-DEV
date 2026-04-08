"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Users, CreditCard, Building2, Workflow } from "lucide-react";
import { AdminChartsRowSkeleton } from "@/components/ui/Skeleton";

const AdminCharts = dynamic(() => import("@/components/AdminCharts"), {
  ssr: false,
  loading: () => <div className="h-[220px] animate-pulse rounded-2xl bg-white/[0.04]" />,
});

type PlanDist = { plan: string; _count: { id: number } };

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";

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
        <span
          className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color, borderColor: `${color}35`, background: `${color}12` }}
        >
          {value}
        </span>
      </div>
      <p className="mt-2 text-xs leading-6 text-gray-500">{desc}</p>
    </div>
  );
}

export default function AdminChartsSlot() {
  const { data: session, status } = useSession();
  const role = ((session?.user as { role?: string } | undefined)?.role ?? "").toUpperCase();
  const [planDist, setPlanDist] = useState<PlanDist[]>([
    { plan: "FREE", _count: { id: 0 } },
    { plan: "STUDIO", _count: { id: 0 } },
    { plan: "ENTERPRISE", _count: { id: 0 } },
  ]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        if (data.planDist) setPlanDist(data.planDist);
        if (data.totalTasks != null) setTotalTasks(data.totalTasks);
      }
    } catch {
      // fallback to defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && (role === "ADMIN" || role === "SUPER_ADMIN")) {
      void fetchChartData();
    }
  }, [status, role, fetchChartData]);

  if (status !== "authenticated" || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return null;
  }

  if (loading) {
    return <AdminChartsRowSkeleton />;
  }

  const studioCount = planDist.find((p) => p.plan === "STUDIO")?._count?.id ?? 0;
  const enterpriseCount = planDist.find((p) => p.plan === "ENTERPRISE")?._count?.id ?? 0;

  return (
    <div className="mb-10 grid gap-6 xl:grid-cols-[0.82fr_0.82fr_0.54fr]">
      <div className="sloer-panel rounded-[34px] p-6">
        <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-white">
          <Users size={13} style={{ color: COBALT }} aria-hidden="true" /> User growth — last 30 days
        </h2>
        <AdminCharts type="userGrowth" />
      </div>
      <div className="sloer-panel rounded-[34px] p-6">
        <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-white">
          <CreditCard size={13} style={{ color: TEAL }} aria-hidden="true" /> Plan distribution
        </h2>
        <AdminCharts type="planDist" data={planDist} />
      </div>
      <div className="sloer-panel rounded-[34px] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#4f8cff]/30 bg-[#4f8cff]/12 text-[#4f8cff]"
            aria-hidden="true"
          >
            <Building2 size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Company pulse</h2>
            <p className="text-[11px] text-gray-500">Operator summary for the control plane.</p>
          </div>
        </div>
        <div className="space-y-3">
          <SignalRow title="Studio" value={`${studioCount}`} desc="Users on the core paid operating layer." color={COBALT} />
          <SignalRow title="Enterprise" value={`${enterpriseCount}`} desc="Higher-control customers on the scale layer." color={TEAL} />
          <SignalRow title="Execution depth" value={`${totalTasks}`} desc="Total tasks registered across the platform." color={AMBER} />
        </div>
        <div className="mt-5 rounded-[24px] border border-white/8 bg-black/20 p-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#28e7c5]/30 bg-[#28e7c5]/12 text-[#28e7c5]"
              aria-hidden="true"
            >
              <Workflow size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Next review lens</p>
              <p className="mt-2 text-xs leading-6 text-gray-500">
                Use subscriptions and user governance together to understand monetization pressure, upgrade paths, and operational health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
