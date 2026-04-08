"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const ICON_PATHS: Record<string, { paths: string[]; viewBox: string }> = {
  terminal: {
    viewBox: "0 0 24 24",
    paths: [
      "M4 17l6-5-6-5",
      "M12 19h8",
    ],
  },
  users: {
    viewBox: "0 0 24 24",
    paths: [
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
      "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
      "M22 21v-2a4 4 0 0 0-3-3.87",
      "M16 3.13a4 4 0 0 1 0 7.75",
    ],
  },
  layoutGrid: {
    viewBox: "0 0 24 24",
    paths: [
      "M3 3h7v7H3z",
      "M14 3h7v7h-7z",
      "M14 14h7v7h-7z",
      "M3 14h7v7H3z",
    ],
  },
  mic: {
    viewBox: "0 0 24 24",
    paths: [
      "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z",
      "M19 10v2a7 7 0 0 1-14 0v-2",
      "M12 19v3",
    ],
  },
  database: {
    viewBox: "0 0 24 24",
    paths: [
      "M12 2C6.48 2 2 4.02 2 6.5v11C2 19.98 6.48 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.52 2 12 2z",
      "M2 6.5C2 8.98 6.48 11 12 11s10-2.02 10-4.5",
      "M2 12c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5",
    ],
  },
  command: {
    viewBox: "0 0 24 24",
    paths: [
      "M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z",
    ],
  },
};

const PRODUCT_ICON_MAP: Record<string, string> = {
  SloerSpace: "terminal",
  SloerSwarm: "users",
  SloerCanvas: "layoutGrid",
  SloerVoice: "mic",
  SloerMCP: "database",
  SloerCode: "command",
};

type AnimatedIconProps = {
  name: string;
  size?: number;
  accent?: string;
  className?: string;
  delay?: number;
};

export default function AnimatedIcon({
  name,
  size = 24,
  accent = "#4f8cff",
  className = "",
  delay = 0,
}: AnimatedIconProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const iconKey = PRODUCT_ICON_MAP[name] ?? "terminal";
  const icon = ICON_PATHS[iconKey] ?? ICON_PATHS.terminal;

  return (
    <motion.svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={accent}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label={`${name} icon`}
      whileHover={{ scale: 1.15, rotate: [0, -6, 6, 0] }}
      transition={{ duration: 0.5, ease }}
    >
      {icon.paths.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={
            isInView
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            pathLength: {
              duration: 0.8,
              delay: delay + i * 0.15,
              ease,
            },
            opacity: {
              duration: 0.3,
              delay: delay + i * 0.15,
            },
          }}
        />
      ))}
    </motion.svg>
  );
}

export { PRODUCT_ICON_MAP, ICON_PATHS };
