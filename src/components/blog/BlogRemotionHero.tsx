"use client";

import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const TEAL = "#28e7c5";

export function BlogHeroComposition({ title, accent }: { title: string; accent: string }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  const titleY = spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 120 } }) * 30 - 30;
  const lineWidth = interpolate(frame, [25, 55], [0, 100], { extrapolateRight: "clamp" });
  const gridOpacity = interpolate(frame, [0, 20], [0, 0.15], { extrapolateRight: "clamp" });
  const glowScale = interpolate(frame, [0, 60], [0.8, 1.2], { extrapolateRight: "clamp" });
  const shimmer = interpolate(frame, [0, 90], [-200, 200], { extrapolateRight: "clamp" });

  const words = title.split(" ");
  const firstHalf = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const secondHalf = words.slice(Math.ceil(words.length / 2)).join(" ");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050505",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Perspective grid */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%) perspective(600px) rotateX(60deg)",
          width: "200%",
          height: "60%",
          opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(${accent}40 1px, transparent 1px),
            linear-gradient(90deg, ${accent}40 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}30, transparent 70%)`,
          transform: `scale(${glowScale})`,
          filter: "blur(80px)",
        }}
      />

      {/* Top light streak */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: shimmer,
          width: "40%",
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      {/* Title */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 52,
            fontWeight: 800,
            textAlign: "center",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            color: "#ffffff",
            maxWidth: 900,
            textTransform: "uppercase",
          }}
        >
          {firstHalf}
        </div>
        <div
          style={{
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: 52,
            fontWeight: 800,
            textAlign: "center",
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            background: `linear-gradient(90deg, ${accent}, ${TEAL})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            maxWidth: 900,
            textTransform: "uppercase",
          }}
        >
          {secondHalf}
        </div>
      </div>

      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          height: 2,
          width: `${lineWidth}%`,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          zIndex: 1,
        }}
      />

      {/* SloerStudio chip */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" }),
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: accent,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        SloerStudio Blog
      </div>
    </AbsoluteFill>
  );
}
