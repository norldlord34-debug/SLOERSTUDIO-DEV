"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
}

export default function Marquee({
  children,
  className,
  speed = 30,
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn("group relative flex overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-8",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{
          animation: `marquee ${speed}s linear infinite${reverse ? " reverse" : ""}`,
        }}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-8",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{
          animation: `marquee ${speed}s linear infinite${reverse ? " reverse" : ""}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
