"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  color?: string;
  colorTo?: string;
  delay?: number;
}

export default function BorderBeam({
  className,
  size = 80,
  duration = 6,
  color = "#4f8cff",
  colorTo = "#28e7c5",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", className)}
      aria-hidden="true"
    >
      <div
        className="absolute h-full w-full rounded-[inherit]"
        style={{
          background: `conic-gradient(from 0deg, transparent 60%, ${color}, ${colorTo}, transparent 100%)`,
          mask: `
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0)
          `,
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
          animation: `border-spin ${duration}s linear ${delay}s infinite`,
        }}
      />
    </div>
  );
}
