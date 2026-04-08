"use client";

import { useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Area, AreaChart,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT = {
  cobalt: "#4f8cff",
  teal: "#28e7c5",
  amber: "#ffbf62",
  pink: "#ff6f96",
  violet: "#8b5cf6",
} as const;

const CHART_COLORS = [ACCENT.cobalt, ACCENT.teal, ACCENT.amber, ACCENT.pink, ACCENT.violet];

const MOCK_GROWTH = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  users: Math.floor(Math.random() * 5 + (i > 20 ? 2 : 0)),
}));

type PlanDist = { plan: string; _count: { id: number } };

type TooltipEntry = {
  name?: string;
  value?: number;
  color?: string;
};

type AnimatedTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  accentColor?: string;
};

function AnimatedTooltipContent({ active, payload, label, accentColor }: AnimatedTooltipProps) {
  return (
    <AnimatePresence>
      {active && payload && payload.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.92, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 4, scale: 0.95, filter: "blur(4px)" }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/10 px-4 py-3 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          style={{
            background: "linear-gradient(180deg, rgba(18,18,22,0.96), rgba(10,10,14,0.98))",
            backdropFilter: "blur(16px)",
            boxShadow: `0 0 24px ${accentColor ?? ACCENT.cobalt}18, 0 16px 48px rgba(0,0,0,0.5)`,
          }}
        >
          {label && (
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
              {label}
            </p>
          )}
          {payload.map((entry: TooltipEntry) => (
            <div key={entry.name} className="flex items-center gap-2.5">
              <motion.span
                className="h-2 w-2 rounded-full"
                style={{ background: entry.color ?? accentColor ?? ACCENT.cobalt }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-xs text-gray-400">{entry.name}</span>
              <span className="ml-auto text-sm font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChartWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function UserGrowthChart() {
  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={MOCK_GROWTH}>
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT.cobalt} stopOpacity={0.28} />
              <stop offset="95%" stopColor={ACCENT.cobalt} stopOpacity={0.02} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "var(--font-jetbrains-mono, monospace)" }}
            tickLine={false}
            axisLine={false}
            interval={6}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "var(--font-jetbrains-mono, monospace)" }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            content={<AnimatedTooltipContent accentColor={ACCENT.cobalt} />}
            cursor={{
              stroke: ACCENT.cobalt,
              strokeWidth: 1,
              strokeDasharray: "4 4",
              strokeOpacity: 0.3,
            }}
          />
          <Area
            type="monotone"
            dataKey="users"
            stroke={ACCENT.cobalt}
            strokeWidth={2.5}
            fill="url(#growthGradient)"
            filter="url(#glow)"
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

function PlanDistChart({ data }: { data: PlanDist[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const pieData = data.map((d) => ({ name: d.plan, value: d._count.id || 0 }));
  const total = pieData.reduce((sum, entry) => sum + entry.value, 0);

  const onPieEnter = useCallback((_: unknown, index: number) => setActiveIndex(index), []);
  const onPieLeave = useCallback(() => setActiveIndex(null), []);

  return (
    <ChartWrapper className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
      <div className="relative">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <defs>
              {CHART_COLORS.map((color, i) => (
                <filter key={color} id={`pieGlow${i}`}>
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.4" />
                </filter>
              ))}
            </defs>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={activeIndex !== null ? 82 : 76}
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationDuration={800}
              animationEasing="ease-out"
              stroke="none"
            >
              {pieData.map((_, i) => (
                <Cell
                  key={i}
                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                  opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                  filter={activeIndex === i ? `url(#pieGlow${i % CHART_COLORS.length})` : undefined}
                  style={{ transition: "opacity 0.3s ease, filter 0.3s ease" }}
                />
              ))}
            </Pie>
            <Tooltip content={<AnimatedTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <p className="text-2xl font-bold text-white">{total}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Total</p>
          </motion.div>
        </div>
      </div>
      <div className="grid gap-3 sm:py-2">
        {pieData.map((entry, i) => (
          <motion.div
            key={entry.name}
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 backdrop-blur-sm"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
            whileHover={{
              backgroundColor: "rgba(255,255,255,0.06)",
              borderColor: `${CHART_COLORS[i % CHART_COLORS.length]}44`,
              scale: 1.02,
            }}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{ cursor: "pointer" }}
          >
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{
                background: CHART_COLORS[i % CHART_COLORS.length],
                boxShadow: `0 0 8px ${CHART_COLORS[i % CHART_COLORS.length]}40`,
              }}
            />
            <span className="text-xs text-gray-400">{entry.name}</span>
            <span className="ml-auto text-xs font-bold text-white">{entry.value}</span>
          </motion.div>
        ))}
      </div>
    </ChartWrapper>
  );
}

function RevenueChart() {
  const revenueData = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    revenue: 0,
  }));

  return (
    <ChartWrapper>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={revenueData} barCategoryGap="20%">
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT.teal} stopOpacity={1} />
              <stop offset="100%" stopColor={ACCENT.teal} stopOpacity={0.5} />
            </linearGradient>
            <filter id="barGlow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={ACCENT.teal} floodOpacity="0.25" />
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "var(--font-jetbrains-mono, monospace)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "var(--font-jetbrains-mono, monospace)" }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            content={<AnimatedTooltipContent accentColor={ACCENT.teal} />}
            cursor={{
              fill: "rgba(40,231,197,0.06)",
              radius: 6,
            }}
          />
          <Bar
            dataKey="revenue"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            filter="url(#barGlow)"
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export default function AdminCharts({
  type,
  data,
}: {
  type: "userGrowth" | "planDist" | "revenue";
  data?: PlanDist[];
}) {
  if (type === "userGrowth") return <UserGrowthChart />;
  if (type === "planDist" && data) return <PlanDistChart data={data} />;
  if (type === "revenue") return <RevenueChart />;
  return null;
}
