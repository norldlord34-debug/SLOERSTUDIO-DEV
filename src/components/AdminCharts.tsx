"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";

const COLORS = ["#4f8cff", "#28e7c5", "#ffbf62", "#ff6f96", "#a855f7"];

const MOCK_GROWTH = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  users: Math.floor(Math.random() * 5 + (i > 20 ? 2 : 0)),
}));

type PlanDist = { plan: string; _count: { id: number } };

export default function AdminCharts({
  type,
  data,
}: {
  type: "userGrowth" | "planDist" | "revenue";
  data?: PlanDist[];
}) {
  if (type === "userGrowth") {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={MOCK_GROWTH}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
          <Line type="monotone" dataKey="users" stroke="#4f8cff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (type === "planDist" && data) {
    const pieData = data.map((d) => ({ name: d.plan, value: d._count.id || 0 }));
    return (
      <div className="flex items-center gap-8">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2.5">
          {pieData.map((entry, i) => (
            <div key={entry.name} className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-xs text-gray-400">{entry.name}</span>
              <span className="text-xs font-bold text-white ml-auto">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "revenue") {
    const revenueData = Array.from({ length: 12 }, (_, i) => ({
      month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
      revenue: 0,
    }));
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
          <Bar dataKey="revenue" fill="#28e7c5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return null;
}
