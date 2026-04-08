"use client";

import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  className?: string;
  colors?: [string, string, string];
  intensity?: "subtle" | "medium" | "strong";
}

export default function AuroraBackground({
  className,
  colors = ["#4f8cff", "#28e7c5", "#8b5cf6"],
  intensity = "medium",
}: AuroraBackgroundProps) {
  const opacityMap = { subtle: 0.08, medium: 0.14, strong: 0.22 };
  const op = opacityMap[intensity];

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className="absolute left-[10%] top-[5%] h-[40rem] w-[40rem] rounded-full blur-[140px]"
        style={{
          background: colors[0],
          opacity: op,
          animation: "aurora-shift 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute right-[5%] top-[20%] h-[32rem] w-[32rem] rounded-full blur-[160px]"
        style={{
          background: colors[1],
          opacity: op * 0.8,
          animation: "aurora-shift-2 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[10%] left-[30%] h-[36rem] w-[50rem] rounded-full blur-[180px]"
        style={{
          background: colors[2],
          opacity: op * 0.6,
          animation: "aurora-shift-3 20s ease-in-out infinite",
        }}
      />
    </div>
  );
}
