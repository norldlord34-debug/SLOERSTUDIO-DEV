"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  duration = 1.5,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const step = value / (duration * 60);
    let raf: number;

    function tick() {
      start += step;
      if (start >= value) {
        setDisplay(value);
        return;
      }
      setDisplay(Math.floor(start));
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("tabular-nums", className)}
    >
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
