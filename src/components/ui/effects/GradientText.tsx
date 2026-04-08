"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

export default function GradientText({
  children,
  className,
  colors = ["#ffffff", "#4f8cff", "#28e7c5", "#ffffff"],
  speed = 4,
  as: Tag = "span",
}: GradientTextProps) {
  return (
    <Tag
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
        backgroundSize: "300% 100%",
        animation: `gradient-text ${speed}s ease infinite`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </Tag>
  );
}
