"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShineCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function ShineCard({ children, className, glowColor = "#4f8cff" }: ShineCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], [3, -3]);
  const rotateY = useTransform(springX, [0, 1], [-3, 3]);

  const gradientX = useTransform(springX, [0, 1], [0, 100]);
  const gradientY = useTransform(springY, [0, 1], [0, 100]);
  const glowBg = useMotionTemplate`radial-gradient(circle at ${gradientX}% ${gradientY}%, ${glowColor}15, transparent 60%)`;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-white/[0.12]",
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: glowBg,
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          animation: "shine-sweep 2s ease-in-out infinite",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
          width: "40%",
          height: "100%",
        }}
        aria-hidden="true"
      />
      <div className="relative z-0">{children}</div>
    </motion.div>
  );
}
