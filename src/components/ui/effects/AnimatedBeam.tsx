"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBeamProps {
  className?: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  width?: number;
  delay?: number;
  curvature?: number;
}

export default function AnimatedBeam({
  className,
  from,
  to,
  color = "#4f8cff",
  width = 1.5,
  delay = 0,
  curvature = 40,
}: AnimatedBeamProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 - curvature;
  const d = `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`;

  return (
    <svg
      ref={ref}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke={`${color}20`} strokeWidth={width} />
      {inView && (
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.3, delay },
          }}
        />
      )}
      {inView && (
        <motion.circle
          r={3}
          fill={color}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            delay: delay + 1.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <animateMotion dur="2s" repeatCount="indefinite" begin={`${delay + 1.2}s`} path={d} />
        </motion.circle>
      )}
    </svg>
  );
}
