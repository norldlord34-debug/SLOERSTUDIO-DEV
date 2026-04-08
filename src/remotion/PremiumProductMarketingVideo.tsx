import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  PRODUCT_VIDEO_CONFIGS,
  type ProductVideoId,
} from "./productVideoConfigs";
import { PRODUCT_VIDEO_STORYBOARDS } from "./productVideoStoryboards";

type ProductMarketingVideoProps = {
  productId: ProductVideoId;
};

const FONT_STACK = 'SF Pro Display, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const MONO_STACK = 'SF Mono, IBM Plex Mono, JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace';
const CUT_POINTS = [72, 155, 280, 390, 510, 640, 750, 850];
const AMBIENT_POINTS = [
  { x: 118, y: 86, size: 4, offset: 4 },
  { x: 208, y: 142, size: 3, offset: 12 },
  { x: 354, y: 114, size: 2, offset: 22 },
  { x: 520, y: 86, size: 3, offset: 30 },
  { x: 644, y: 150, size: 4, offset: 16 },
  { x: 778, y: 104, size: 2, offset: 26 },
  { x: 944, y: 138, size: 3, offset: 10 },
  { x: 1088, y: 102, size: 4, offset: 32 },
  { x: 1192, y: 174, size: 2, offset: 18 },
  { x: 170, y: 292, size: 3, offset: 28 },
  { x: 308, y: 242, size: 2, offset: 24 },
  { x: 498, y: 278, size: 4, offset: 14 },
  { x: 690, y: 246, size: 3, offset: 20 },
  { x: 914, y: 288, size: 2, offset: 8 },
  { x: 1138, y: 258, size: 3, offset: 34 },
];

function hexToRgba(hex: string, alpha: number) {
  const sanitized = hex.replace("#", "");
  const normalized = sanitized.length === 3
    ? sanitized.split("").map((char) => char + char).join("")
    : sanitized;
  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function splitProductName(name: string) {
  if (!name.startsWith("Sloer")) {
    return { prefix: name, suffix: "" };
  }

  return {
    prefix: "Sloer",
    suffix: name.slice(5),
  };
}

function sceneOpacity(frame: number, duration: number, fadeIn = 10, fadeOut = 16) {
  const enter = interpolate(frame, [0, fadeIn], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const exit = interpolate(frame, [duration - fadeOut, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return enter * exit;
}

function revealMask(frame: number, start = 0, width = 100) {
  return interpolate(frame - start, [0, 20], [width, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

function SloerMark({ size, accent, frame }: { size: number; accent: string; frame: number }) {
  const tilt = interpolate(Math.sin(frame / 16), [-1, 1], [-4, 4]);
  const scale = interpolate(Math.sin(frame / 24), [-1, 1], [0.96, 1.04]);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `rotate(${tilt}deg) scale(${scale})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size * 0.26,
          background: "linear-gradient(135deg, #ffcb66 0%, #f59e0b 24%, #41c8ff 62%, #2563eb 100%)",
          boxShadow: `0 0 ${size * 0.72}px ${hexToRgba(accent, 0.22)}`,
          transform: "rotate(8deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: size * 0.16,
          borderRadius: size * 0.18,
          background: "rgba(5, 6, 10, 0.92)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: size * 0.2,
          top: size * 0.18,
          width: size * 0.28,
          height: size * 0.58,
          borderRadius: size * 0.08,
          background: "linear-gradient(180deg, #ffe087 0%, #f59e0b 100%)",
          clipPath: "polygon(0 0, 100% 16%, 84% 48%, 100% 100%, 10% 86%, 0 42%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: size * 0.18,
          top: size * 0.18,
          width: size * 0.28,
          height: size * 0.58,
          borderRadius: size * 0.08,
          background: "linear-gradient(180deg, #7dd3fc 0%, #2563eb 100%)",
          clipPath: "polygon(8% 0, 100% 16%, 100% 64%, 88% 100%, 0 82%, 16% 40%)",
        }}
      />
    </div>
  );
}

function AccentBar({ accent, width, frame }: { accent: string; width: number; frame: number }) {
  const pulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.82, 1]);
  const shimmer = interpolate(frame % 60, [0, 60], [-width, width * 2]);

  return (
    <div
      style={{
        position: "relative",
        width,
        height: 4,
        borderRadius: 999,
        background: accent,
        boxShadow: `0 0 18px ${hexToRgba(accent, 0.34)}, 0 0 40px ${hexToRgba(accent, 0.12)}`,
        opacity: pulse,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: shimmer,
          width: width * 0.4,
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          borderRadius: 999,
        }}
      />
    </div>
  );
}

function PerimeterGlow({
  accent,
  secondary,
  frame,
  borderRadius = 28,
  intensity = 1,
}: {
  accent: string;
  secondary: string;
  frame: number;
  borderRadius?: number;
  intensity?: number;
}) {
  const rotation = interpolate(frame, [0, 900], [0, 360]);
  const pulse = interpolate(Math.sin(frame / 20), [-1, 1], [0.6, 1]) * intensity;

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: -2,
          borderRadius: borderRadius + 2,
          background: `conic-gradient(from ${rotation}deg, ${hexToRgba(accent, 0.7 * pulse)}, ${hexToRgba(secondary, 0.5 * pulse)}, transparent, ${hexToRgba(accent, 0.4 * pulse)}, ${hexToRgba(secondary, 0.7 * pulse)}, transparent, ${hexToRgba(accent, 0.6 * pulse)})`,
          filter: `blur(${6 * intensity}px)`,
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: borderRadius + 1,
          background: `conic-gradient(from ${rotation + 180}deg, ${hexToRgba(accent, 0.4 * pulse)}, transparent, ${hexToRgba(secondary, 0.3 * pulse)}, transparent)`,
          filter: `blur(${12 * intensity}px)`,
          opacity: 0.5,
        }}
      />
    </>
  );
}

function AppleTextReveal({
  text,
  frame,
  startFrame = 0,
  fontSize = 76,
  fontWeight = 860,
  color = "white",
  letterSpacing = -3.8,
}: {
  text: string;
  frame: number;
  startFrame?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  letterSpacing?: number;
}) {
  const localFrame = frame - startFrame;
  const progress = interpolate(localFrame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const blur = interpolate(progress, [0, 1], [16, 0]);
  const y = interpolate(progress, [0, 1], [30, 0]);
  const scale = interpolate(progress, [0, 1], [0.95, 1]);

  return (
    <div
      style={{
        fontSize,
        fontWeight,
        lineHeight: 0.94,
        letterSpacing,
        textTransform: "uppercase" as const,
        color,
        transform: `translateY(${y}px) scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity: progress,
      }}
    >
      {text}
    </div>
  );
}

function MetaChip({
  label,
  accent,
  frame,
  filled = false,
}: {
  label: string;
  accent: string;
  frame: number;
  filled?: boolean;
}) {
  const glow = interpolate(Math.sin(frame / 22), [-1, 1], [0.92, 1.04]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderRadius: 14,
        border: `1px solid ${hexToRgba(accent, filled ? 0.48 : 0.34)}`,
        background: filled ? hexToRgba(accent, 0.12) : "rgba(255,255,255,0.03)",
        boxShadow: filled ? `0 0 34px ${hexToRgba(accent, 0.16)}` : "none",
        transform: `scale(${glow})`,
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: 999, background: accent, boxShadow: `0 0 18px ${hexToRgba(accent, 0.4)}` }} />
      <div style={{ fontFamily: MONO_STACK, fontSize: 14, color: filled ? accent : "rgba(255,255,255,0.82)" }}>{label}</div>
    </div>
  );
}

function AmbientField({
  accent,
  secondary,
  frame,
}: {
  accent: string;
  secondary: string;
  frame: number;
}) {
  const centerX = interpolate(Math.sin(frame / 58), [-1, 1], [38, 64]);
  const centerY = interpolate(Math.cos(frame / 46), [-1, 1], [22, 66]);
  const streak = interpolate(Math.sin(frame / 24), [-1, 1], [-44, 44]);
  const gridShift = interpolate(frame, [0, 900], [0, 96], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(circle at center, rgba(10,12,18,0.98) 0%, #050507 58%, #020203 100%)" }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${centerX}% ${centerY}%, ${hexToRgba(accent, 0.24)} 0%, transparent 26%), radial-gradient(circle at 78% 20%, ${hexToRgba(secondary, 0.16)} 0%, transparent 18%), radial-gradient(circle at 20% 76%, ${hexToRgba(accent, 0.08)} 0%, transparent 18%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -200 + streak,
          right: -200 - streak,
          top: 74,
          height: 8,
          background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.18)} 18%, ${hexToRgba(accent, 0.62)} 46%, ${hexToRgba(accent, 0.16)} 70%, transparent)`,
          filter: "blur(7px)",
          opacity: 0.95,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -180 - streak * 0.3,
          right: -180 + streak * 0.3,
          top: 80,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.72)} 48%, transparent)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -180,
          right: -180,
          bottom: -210,
          height: 440,
          transform: `perspective(1200px) rotateX(76deg) translateY(${gridShift * 0.16}px) scale(1.18)`,
          backgroundImage: `linear-gradient(${hexToRgba(accent, 0.17)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(accent, 0.17)} 1px, transparent 1px)`,
          backgroundSize: "70px 70px",
          opacity: 0.48,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 2px, transparent 4px)",
          opacity: 0.1,
          mixBlendMode: "screen",
        }}
      />
      {AMBIENT_POINTS.map((point) => {
        const dx = interpolate(Math.sin((frame + point.offset * 3) / 22), [-1, 1], [-16, 16]);
        const dy = interpolate(Math.cos((frame + point.offset * 5) / 18), [-1, 1], [-8, 8]);
        const op = interpolate(Math.sin((frame + point.offset * 7) / 16), [-1, 1], [0.26, 0.92]);

        return (
          <div
            key={`${point.x}-${point.y}`}
            style={{
              position: "absolute",
              left: point.x + dx,
              top: point.y + dy,
              width: point.size,
              height: point.size,
              borderRadius: 999,
              background: accent,
              opacity: op,
              boxShadow: `0 0 18px ${hexToRgba(accent, 0.34)}`,
            }}
          />
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.34) 76%, rgba(0,0,0,0.82) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: `linear-gradient(90deg, ${hexToRgba(accent, 0.76)}, ${hexToRgba(secondary, 0.72)})` }} />
    </>
  );
}

function CutOverlays({ accent, frame }: { accent: string; frame: number }) {
  return (
    <>
      {CUT_POINTS.map((point) => {
        const local = frame - point;
        const opacity = interpolate(local, [-4, 0, 8, 16], [0, 0.85, 0.32, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const slashX = interpolate(local, [0, 16], [-280, 1460], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.exp),
        });

        return (
          <AbsoluteFill key={point} style={{ pointerEvents: "none", opacity }}>
            <div style={{ position: "absolute", inset: 0, background: `rgba(255,255,255,${opacity * 0.06})`, mixBlendMode: "screen" }} />
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 160,
                transform: `translateX(${slashX}px) skewX(-18deg)`,
                background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.28)}, rgba(255,255,255,0.38), transparent)`,
                filter: "blur(12px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 10,
                background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.48)}, transparent)`,
                opacity: 0.8,
              }}
            />
          </AbsoluteFill>
        );
      })}
    </>
  );
}

function FrameChrome({ accent, secondary, frame, children }: { accent: string; secondary?: string; frame: number; children: ReactNode }) {
  const wipe = revealMask(frame, 0, 100);
  const breathe = interpolate(Math.sin(frame / 22), [-1, 1], [0.992, 1.008]);
  const sweep = interpolate(frame % 90, [0, 90], [-240, 920]);

  return (
    <div
      style={{
        position: "relative",
        width: 920,
        height: 468,
        borderRadius: 28,
        transform: `scale(${breathe})`,
        clipPath: `inset(0 ${wipe}% 0 0 round 28px)`,
      }}
    >
      <PerimeterGlow accent={accent} secondary={secondary ?? accent} frame={frame} borderRadius={28} intensity={0.8} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          overflow: "hidden",
          border: `1px solid ${hexToRgba(accent, 0.36)}`,
          boxShadow: `0 0 80px ${hexToRgba(accent, 0.18)}, 0 42px 120px rgba(0,0,0,0.52), inset 0 1px 0 ${hexToRgba(accent, 0.12)}`,
          background: "rgba(7,8,12,0.94)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 18% 16%, ${hexToRgba(accent, 0.12)}, transparent 28%), radial-gradient(circle at 82% 84%, ${hexToRgba(secondary ?? accent, 0.06)}, transparent 22%), rgba(6,7,10,0.92)` }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 2px, transparent 4px)", opacity: 0.08 }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, width: 200, transform: `translateX(${sweep}px) skewX(-16deg)`, background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.06)}, rgba(255,255,255,0.03), transparent)` }} />
        <div style={{ position: "absolute", left: 18, top: 14, display: "flex", gap: 8, zIndex: 2 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
            <div key={color} style={{ width: 9, height: 9, borderRadius: 999, background: color, boxShadow: `0 0 6px ${color}44` }} />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

function WorkspaceSurface({ frame, accent }: { frame: number; accent: string }) {
  const active = Math.floor((frame / 14) % 4);

  return (
    <div style={{ position: "absolute", inset: 0, padding: 26 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
        <div style={{ fontFamily: MONO_STACK, fontSize: 14, color: hexToRgba(accent, 0.82) }}>~/workspace/launch --layout 4</div>
        <MetaChip label="persistent PTY" accent={accent} frame={frame} />
      </div>
      <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {['pane_1', 'pane_2', 'pane_3', 'pane_4'].map((pane, index) => {
          const isActive = active === index;
          const pulse = interpolate(Math.sin((frame + index * 7) / 10), [-1, 1], [0.99, 1.02]);

          return (
            <div
              key={pane}
              style={{
                height: 158,
                borderRadius: 18,
                padding: 16,
                border: `1px solid ${isActive ? hexToRgba(accent, 0.64) : "rgba(255,255,255,0.08)"}`,
                background: isActive ? hexToRgba(accent, 0.11) : "rgba(255,255,255,0.025)",
                boxShadow: isActive ? `0 0 36px ${hexToRgba(accent, 0.18)}` : "none",
                transform: `scale(${isActive ? pulse : 1})`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: MONO_STACK, fontSize: 12, color: isActive ? accent : "rgba(255,255,255,0.54)" }}>{pane}</div>
                <div style={{ width: 58, height: 3, borderRadius: 999, background: isActive ? accent : "rgba(255,255,255,0.12)" }} />
              </div>
              <div style={{ marginTop: 16, fontFamily: MONO_STACK, fontSize: 13, color: "white", lineHeight: 1.7 }}>
                <div>{index === 0 ? "$ npm run dev" : index === 1 ? "$ claude --project ./web" : index === 2 ? "$ open preview" : "$ tail runtime.log"}</div>
                <div style={{ color: "rgba(255,255,255,0.52)" }}>{index === 0 ? "port 3000 active" : index === 1 ? "context hydrated" : index === 2 ? "browser synced" : "session ordered"}</div>
              </div>
              <div style={{ marginTop: 18, display: "grid", gap: 8 }}>
                {[0, 1, 2].map((line) => (
                  <div key={line} style={{ height: 5, borderRadius: 999, background: line === 0 && isActive ? accent : "rgba(255,255,255,0.12)", width: `${80 - line * 18}%` }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VoiceSurface({ frame, accent }: { frame: number; accent: string }) {
  const prompt = "Hey, build me a Next.js app with auth, Stripe billing, and a user dashboard";
  const typed = Math.max(22, Math.floor(interpolate(frame, [0, 120], [0, prompt.length], { extrapolateRight: "clamp" })));
  const bars = Array.from({ length: 18 }).map((_, index) => 36 + ((index * 17) % 64));

  return (
    <div style={{ position: "absolute", inset: 0, padding: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
        <MetaChip label="local whisper.rs" accent={accent} frame={frame} filled />
        <div style={{ fontFamily: MONO_STACK, fontSize: 13, color: hexToRgba(accent, 0.84) }}>Ctrl + Space // live inject</div>
      </div>
      <div style={{ marginTop: 28, borderRadius: 24, border: `1px solid ${hexToRgba(accent, 0.3)}`, background: "rgba(255,255,255,0.04)", padding: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 14px", borderRadius: 999, background: hexToRgba(accent, 0.1), border: `1px solid ${hexToRgba(accent, 0.38)}` }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: accent, boxShadow: `0 0 18px ${hexToRgba(accent, 0.42)}` }} />
          <div style={{ fontFamily: MONO_STACK, fontSize: 12, color: "white" }}>processing speech</div>
        </div>
        <div style={{ marginTop: 20, fontSize: 32, lineHeight: 1.28, fontWeight: 650, letterSpacing: -1, color: "white" }}>{prompt.slice(0, typed)}</div>
        <div style={{ marginTop: 18, display: "flex", alignItems: "flex-end", gap: 6, height: 94 }}>
          {bars.map((height, index) => {
            const dynamicHeight = interpolate(Math.sin((frame + index * 3) / 8), [-1, 1], [Math.max(18, height * 0.4), height]);

            return <div key={index} style={{ flex: 1, height: dynamicHeight, borderRadius: 999, background: index % 2 === 0 ? accent : hexToRgba(accent, 0.45), boxShadow: `0 0 20px ${hexToRgba(accent, 0.16)}` }} />;
          })}
        </div>
      </div>
    </div>
  );
}

function SwarmSurface({ frame, accent }: { frame: number; accent: string }) {
  const active = Math.floor((frame / 18) % 4);
  const rows = [
    ["API schema", "Builder", "RUNNING"],
    ["Auth review", "Reviewer", "CHECKING"],
    ["Context map", "Scout", "SYNCED"],
    ["Release pass", "Coordinator", "READY"],
  ] as const;

  return (
    <div style={{ position: "absolute", inset: 0, padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
        <div style={{ fontFamily: MONO_STACK, fontSize: 14, color: hexToRgba(accent, 0.82) }}>mission.launch(team=4)</div>
        <MetaChip label="role-aware execution" accent={accent} frame={frame} />
      </div>
      <div style={{ marginTop: 26, display: "grid", gap: 14 }}>
        {rows.map((row, index) => {
          const isActive = active === index;
          return (
            <div
              key={row[0]}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr 0.6fr",
                gap: 16,
                alignItems: "center",
                borderRadius: 18,
                padding: "16px 18px",
                border: `1px solid ${isActive ? hexToRgba(accent, 0.7) : "rgba(255,255,255,0.08)"}`,
                background: isActive ? hexToRgba(accent, 0.11) : "rgba(255,255,255,0.03)",
                boxShadow: isActive ? `0 0 40px ${hexToRgba(accent, 0.14)}` : "none",
              }}
            >
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "white", letterSpacing: -1 }}>{row[0]}</div>
                <div style={{ marginTop: 6, fontFamily: MONO_STACK, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>persistent session attached</div>
              </div>
              <div style={{ fontFamily: MONO_STACK, fontSize: 13, color: hexToRgba(accent, 0.84) }}>{row[1]}</div>
              <div style={{ justifySelf: "end", padding: "8px 12px", borderRadius: 999, border: `1px solid ${hexToRgba(accent, 0.38)}`, background: hexToRgba(accent, 0.12), fontFamily: MONO_STACK, fontSize: 11, color: accent }}>{row[2]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CanvasSurface({ frame, accent, secondary, tertiary }: { frame: number; accent: string; secondary: string; tertiary: string }) {
  const drift = interpolate(Math.sin(frame / 18), [-1, 1], [-12, 12]);
  const cards = [
    { left: 70, top: 92, color: accent, title: "Research", width: 220 },
    { left: 564, top: 62, color: secondary, title: "Builder", width: 224 },
    { left: 336, top: 244, color: tertiary, title: "Review", width: 240 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
        <div style={{ fontFamily: MONO_STACK, fontSize: 14, color: hexToRgba(accent, 0.82) }}>canvas.open(topology=live)</div>
        <MetaChip label="spatial runtime" accent={accent} frame={frame} filled />
      </div>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", opacity: 0.18 }} />
      <svg viewBox="0 0 920 468" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M182 172 C 260 150, 320 160, 565 140" stroke={hexToRgba(accent, 0.34)} strokeWidth="3" strokeDasharray="10 10" fill="none" />
        <path d="M676 184 C 620 200, 560 234, 474 304" stroke={hexToRgba(secondary, 0.32)} strokeWidth="3" strokeDasharray="10 10" fill="none" />
      </svg>
      {cards.map((card, index) => (
        <div
          key={card.title}
          style={{
            position: "absolute",
            left: card.left,
            top: card.top + (index % 2 === 0 ? drift : -drift * 0.9),
            width: card.width,
            padding: 18,
            borderRadius: 20,
            border: `1px solid ${hexToRgba(card.color, 0.42)}`,
            background: "rgba(8,8,12,0.78)",
            boxShadow: `0 0 42px ${hexToRgba(card.color, 0.14)}`,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 760, color: card.color }}>{card.title}</div>
          <div style={{ marginTop: 10, fontFamily: MONO_STACK, fontSize: 13, color: "rgba(255,255,255,0.56)" }}>{index === 0 ? "mapping topology" : index === 1 ? "spawning live threads" : "merging overlap zones"}</div>
          <div style={{ marginTop: 16, height: 4, width: `${68 + index * 8}%`, borderRadius: 999, background: card.color }} />
        </div>
      ))}
    </div>
  );
}

function McpSurface({ frame, accent, secondary }: { frame: number; accent: string; secondary: string }) {
  const pulse = interpolate(Math.sin(frame / 12), [-1, 1], [0.84, 1.14]);
  const nodes = [
    { left: 152, top: 148, label: "KANBAN", color: accent },
    { left: 612, top: 146, label: "WORKFLOWS", color: secondary },
    { left: 244, top: 284, label: "SHARED", color: secondary },
    { left: 526, top: 288, label: "CONTEXT", color: accent },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, padding: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
        <div style={{ fontFamily: MONO_STACK, fontSize: 14, color: hexToRgba(accent, 0.84) }}>mcp.sloerstudio.ai</div>
        <MetaChip label="shared context layer" accent={accent} frame={frame} />
      </div>
      <svg viewBox="0 0 920 468" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M240 196 C 320 210, 390 220, 460 234" stroke={hexToRgba(accent, 0.4)} strokeWidth="3" fill="none" />
        <path d="M686 194 C 610 204, 544 214, 460 234" stroke={hexToRgba(secondary, 0.34)} strokeWidth="3" fill="none" />
        <path d="M334 322 C 380 296, 424 268, 460 234" stroke={hexToRgba(accent, 0.3)} strokeWidth="3" fill="none" />
        <path d="M594 324 C 546 298, 506 268, 460 234" stroke={hexToRgba(secondary, 0.3)} strokeWidth="3" fill="none" />
      </svg>
      {nodes.map((node) => (
        <div
          key={node.label}
          style={{
            position: "absolute",
            left: node.left,
            top: node.top,
            width: 160,
            padding: "18px 16px",
            borderRadius: 18,
            border: `1px solid ${hexToRgba(node.color, 0.42)}`,
            background: "rgba(8,8,12,0.8)",
            boxShadow: `0 0 34px ${hexToRgba(node.color, 0.14)}`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 820, color: "white" }}>{node.label}</div>
          <div style={{ marginTop: 10, fontFamily: MONO_STACK, fontSize: 11, color: node.color }}>synced</div>
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 438,
          top: 214,
          width: 44,
          height: 44,
          borderRadius: 999,
          background: accent,
          transform: `scale(${pulse})`,
          boxShadow: `0 0 40px ${hexToRgba(accent, 0.34)}`,
        }}
      />
    </div>
  );
}

function CodeSurface({ frame, accent }: { frame: number; accent: string }) {
  const active = Math.floor((frame / 16) % 6);
  const files = ["src/", "app/", "products/voice.ts", "components/dashboard.tsx", "prompts/handbook.txt", "package.json"];

  return (
    <div style={{ position: "absolute", inset: 0, padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8 }}>
        <div style={{ fontFamily: MONO_STACK, fontSize: 14, color: hexToRgba(accent, 0.84) }}>~/code/ship</div>
        <MetaChip label="full codebase awareness" accent={accent} frame={frame} filled />
      </div>
      <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "0.92fr 1.08fr", gap: 20 }}>
        <div style={{ borderRadius: 20, border: `1px solid ${hexToRgba(accent, 0.24)}`, background: "rgba(255,255,255,0.03)", padding: 18, height: 334 }}>
          <div style={{ fontFamily: MONO_STACK, fontSize: 12, color: "rgba(255,255,255,0.44)" }}>my-saas/</div>
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {files.map((file, index) => (
              <div
                key={file}
                style={{
                  borderRadius: 12,
                  padding: "9px 12px",
                  border: `1px solid ${active === index ? hexToRgba(accent, 0.36) : "transparent"}`,
                  background: active === index ? hexToRgba(accent, 0.12) : "transparent",
                  fontFamily: MONO_STACK,
                  fontSize: 12,
                  color: active === index ? "white" : "rgba(255,255,255,0.6)",
                }}
              >
                {file}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderRadius: 20, border: `1px solid ${hexToRgba(accent, 0.24)}`, background: "rgba(255,255,255,0.025)", padding: 18, height: 334 }}>
          <div style={{ display: "grid", gap: 14 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((line) => (
              <div key={line} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 20, fontFamily: MONO_STACK, fontSize: 11, color: "rgba(255,255,255,0.34)" }}>{line + 1}</div>
                <div style={{ height: 10, borderRadius: 999, width: `${78 - line * 7}%`, background: line % 2 === 0 ? hexToRgba(accent, 0.52) : "rgba(255,255,255,0.14)" }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, display: "grid", gap: 10 }}>
            {["command-native control", "programmable launch paths", "serious speed"].map((item) => (
              <div key={item} style={{ borderRadius: 14, border: `1px solid ${hexToRgba(accent, 0.2)}`, padding: "10px 12px", fontFamily: MONO_STACK, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSurface({
  productId,
  frame,
}: {
  productId: ProductVideoId;
  frame: number;
}) {
  const config = PRODUCT_VIDEO_CONFIGS[productId];

  switch (config.mode) {
    case "workspace":
      return <WorkspaceSurface frame={frame} accent={config.accent} />;
    case "voice":
      return <VoiceSurface frame={frame} accent={config.accent} />;
    case "swarm":
      return <SwarmSurface frame={frame} accent={config.accent} />;
    case "canvas":
      return <CanvasSurface frame={frame} accent={config.accent} secondary={config.secondaryAccent} tertiary={config.tertiaryAccent} />;
    case "orbit":
      return <McpSurface frame={frame} accent={config.accent} secondary={config.secondaryAccent} />;
    case "cli":
    default:
      return <CodeSurface frame={frame} accent={config.accent} />;
  }
}

function IntroIdentityScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const opacity = sceneOpacity(frame, 112, 8, 18);
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const mark = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 140 } });
  const { prefix, suffix } = splitProductName(config.name);

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", left: 88, top: 168, display: "flex", alignItems: "center", gap: 24, transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)` }}>
        <div style={{ transform: `scale(${interpolate(mark, [0, 1], [0.86, 1])})` }}>
          <SloerMark size={88} accent={config.accent} frame={frame} />
        </div>
        <div>
          <div style={{ fontSize: 68, fontWeight: 760, letterSpacing: -2.8 }}>
            <span style={{ color: "white" }}>{prefix}</span>
            <span style={{ color: config.accent }}>{suffix}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: hexToRgba(config.accent, 0.84) }}>{config.tag}</div>
          <div style={{ marginTop: 18 }}>
            <AccentBar accent={config.accent} width={182} frame={frame} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function ManifestoScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const storyboard = PRODUCT_VIDEO_STORYBOARDS[productId];
  const opacity = sceneOpacity(frame, 120, 8, 16);
  const chip = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: -8 }}>
        {storyboard.statementLines.map((line, index) => (
          <AppleTextReveal
            key={line}
            text={line}
            frame={frame}
            startFrame={index * 6}
            fontSize={storyboard.statementLines.length > 1 ? 76 : 88}
            color="white"
            letterSpacing={-3.8}
          />
        ))}
        <div style={{ marginTop: 26, transform: `translateY(${interpolate(chip, [0, 1], [16, 0])}px)`, opacity: interpolate(chip, [0, 1], [0, 1]) }}>
          <MetaChip label={storyboard.chip} accent={config.accent} frame={frame} filled />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function HeroDemoScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const storyboard = PRODUCT_VIDEO_STORYBOARDS[productId];
  const opacity = sceneOpacity(frame, 170, 10, 18);
  const enter = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", left: 72, top: 142, transform: `translateY(${interpolate(enter, [0, 1], [22, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})` }}>
        <FrameChrome accent={config.accent} secondary={config.secondaryAccent} frame={frame}>
          <ProductSurface productId={productId} frame={frame} />
        </FrameChrome>
      </div>
      <div style={{ position: "absolute", right: 78, top: 166, width: 228, display: "grid", gap: 14 }}>
        {config.stats.map((stat, index) => {
          const local = spring({ frame: frame - index * 6, fps, config: { damping: 16, stiffness: 110 } });
          return (
            <div
              key={stat.label}
              style={{
                borderRadius: 20,
                border: `1px solid ${hexToRgba(config.accent, 0.18)}`,
                background: "rgba(9,10,14,0.8)",
                padding: "16px 18px",
                transform: `translateX(${interpolate(local, [0, 1], [18 + index * 5, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 11, letterSpacing: 2.4, textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>{stat.label}</div>
              <div style={{ marginTop: 10, fontSize: 24, fontWeight: 760, lineHeight: 1.05, letterSpacing: -1, color: "white" }}>{stat.value}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 84, bottom: 92 }}>
        <div style={{ fontSize: 28, fontWeight: 760, letterSpacing: -1.2, color: "white", textTransform: "uppercase" }}>{storyboard.demoCaption}</div>
      </div>
    </AbsoluteFill>
  );
}

function FeatureMontageScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const storyboard = PRODUCT_VIDEO_STORYBOARDS[productId];
  const opacity = sceneOpacity(frame, 160, 8, 14);
  const line = `${storyboard.ghostWords.join(" · ")} · ${storyboard.ghostWords.join(" · ")}`;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 26, overflow: "hidden", opacity: 0.44 }}>
        {Array.from({ length: 4 }).map((_, index) => {
          const drift = interpolate(Math.sin((frame + index * 8) / 20), [-1, 1], [-44, 44]);
          return (
            <div
              key={index}
              style={{
                marginLeft: index % 2 === 0 ? -120 + drift : -30 - drift,
                fontSize: 72,
                fontWeight: 840,
                letterSpacing: -2.8,
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                color: "transparent",
                WebkitTextStroke: `1px ${hexToRgba(config.accent, 0.14)}`,
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 112, display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 20 }}>
        {config.webHighlights.slice(0, 3).map((highlight, index) => {
          const enter = spring({ frame: frame - index * 6, fps, config: { damping: 15, stiffness: 110 } });
          return (
            <div
              key={highlight}
              style={{
                position: "relative",
                borderRadius: 22,
                transform: `translateY(${interpolate(enter, [0, 1], [40 + index * 12, 0])}px)`,
              }}
            >
              <PerimeterGlow accent={config.accent} secondary={config.secondaryAccent} frame={frame + index * 30} borderRadius={22} intensity={0.5} />
              <div
                style={{
                  position: "relative",
                  borderRadius: 22,
                  border: `1px solid ${hexToRgba(config.accent, 0.24)}`,
                  background: "rgba(9,10,14,0.88)",
                  padding: "20px 20px 22px",
                  boxShadow: `0 20px 60px ${hexToRgba(config.accent, 0.1)}, inset 0 1px 0 ${hexToRgba(config.accent, 0.08)}`,
                }}
              >
                <div style={{ fontSize: 11, letterSpacing: 2.2, textTransform: "uppercase", color: hexToRgba(config.accent, 0.84) }}>feature_{index + 1}</div>
                <div style={{ marginTop: 14, fontSize: 28, fontWeight: 740, lineHeight: 1.1, letterSpacing: -1.2, color: "white" }}>{highlight}</div>
                <div style={{ marginTop: 16 }}>
                  <AccentBar accent={config.accent} width={112} frame={frame + index * 6} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

function ClaimScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const storyboard = PRODUCT_VIDEO_STORYBOARDS[productId];
  const opacity = sceneOpacity(frame, 160, 10, 18);
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const cardScale = interpolate(Math.sin(frame / 18), [-1, 1], [0.992, 1.012]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", left: 68, top: 182, transform: `translateX(${interpolate(enter, [0, 1], [-34, 0])}px)` }}>
        <AppleTextReveal
          text={storyboard.ghostWords[0] ?? config.name}
          frame={frame}
          startFrame={0}
          fontSize={96}
          fontWeight={860}
          color="transparent"
          letterSpacing={-4.2}
        />
        <div style={{ marginTop: 12 }}>
          <AppleTextReveal
            text={storyboard.ghostWords[1] ?? config.tag}
            frame={frame}
            startFrame={6}
            fontSize={96}
            fontWeight={860}
            color="transparent"
            letterSpacing={-4.2}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 92,
          top: 210,
          width: 460,
          borderRadius: 26,
          transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px) scale(${cardScale})`,
        }}
      >
        <PerimeterGlow accent={config.accent} secondary={config.secondaryAccent} frame={frame} borderRadius={26} intensity={0.7} />
        <div
          style={{
            position: "relative",
            padding: "26px 28px 30px",
            borderRadius: 26,
            border: `1px solid ${hexToRgba(config.accent, 0.36)}`,
            background: "rgba(10,10,14,0.88)",
            boxShadow: `0 0 60px ${hexToRgba(config.accent, 0.18)}, inset 0 1px 0 ${hexToRgba(config.accent, 0.1)}`,
          }}
        >
          {storyboard.claimTopLines.map((line, i) => (
            <AppleTextReveal key={line} text={line} frame={frame} startFrame={4 + i * 4} fontSize={28} fontWeight={760} color="white" letterSpacing={-1} />
          ))}
          <div style={{ marginTop: 10 }}>
            {storyboard.claimBottomLines.map((line, i) => (
              <AppleTextReveal
                key={line}
                text={line}
                frame={frame}
                startFrame={12 + i * 6}
                fontSize={52}
                fontWeight={860}
                color={config.accent}
                letterSpacing={-2}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function SloganScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const storyboard = PRODUCT_VIDEO_STORYBOARDS[productId];
  const opacity = sceneOpacity(frame, 170, 8, 16);
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", left: 74, top: 504, transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)` }}>
        <AppleTextReveal text={storyboard.outroPrimary} frame={frame} startFrame={0} fontSize={74} color="white" letterSpacing={-3.4} />
        <div style={{ marginTop: 4 }}>
          <AppleTextReveal text={storyboard.outroAccent} frame={frame} startFrame={8} fontSize={74} color={config.accent} letterSpacing={-3.4} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 86, top: 136, width: 280, display: "grid", gap: 12 }}>
        {config.stats.map((stat, index) => (
          <div key={stat.label} style={{ borderRadius: 18, border: `1px solid ${hexToRgba(config.accent, 0.2)}`, background: "rgba(10,10,14,0.78)", padding: "14px 16px" }}>
            <div style={{ fontSize: 10, letterSpacing: 2.2, textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>{stat.label}</div>
            <div style={{ marginTop: 8, fontSize: 22, fontWeight: 760, lineHeight: 1.06, letterSpacing: -1, color: index === 0 ? config.accent : "white" }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

function EndScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const storyboard = PRODUCT_VIDEO_STORYBOARDS[productId];
  const opacity = sceneOpacity(frame, 190, 10, 12);
  const mark = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const chip = spring({ frame: frame - 12, fps, config: { damping: 14, stiffness: 110 } });
  const { prefix, suffix } = splitProductName(config.name);

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", left: "50%", top: 170, transform: `translateX(-50%) scale(${interpolate(mark, [0, 1], [0.84, 1])})` }}>
        <SloerMark size={92} accent={config.accent} frame={frame} />
      </div>
      <div style={{ position: "absolute", left: "50%", top: 292, transform: `translateX(-50%)` }}>
        <div style={{ fontSize: 62, fontWeight: 760, letterSpacing: -2.4 }}>
          <span style={{ color: "white" }}>{prefix}</span>
          <span style={{ color: config.accent }}>{suffix}</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: 382, transform: `translateX(-50%) translateY(${interpolate(chip, [0, 1], [18, 0])}px)` }}>
        <MetaChip label={storyboard.closeChip} accent={config.accent} frame={frame} filled />
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: 96, transform: "translateX(-50%)", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 920 }}>
        {config.webHighlights.slice(0, 3).map((item, index) => (
          <MetaChip key={item} label={item} accent={index === 1 ? config.secondaryAccent : config.accent} frame={frame + index * 8} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

export function ProductMarketingVideo({ productId }: ProductMarketingVideoProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const cameraX = interpolate(Math.sin(frame / 42), [-1, 1], [-10, 10]);
  const cameraY = interpolate(Math.cos(frame / 34), [-1, 1], [-8, 8]);
  const zoom = interpolate(Math.sin(frame / 120), [-1, 1], [1, 1.04]);
  const globalOpacity = interpolate(frame, [0, 12, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#030304", color: "white", fontFamily: FONT_STACK, opacity: globalOpacity }}>
      <AmbientField accent={config.accent} secondary={config.secondaryAccent} frame={frame} />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${cameraX}px, ${cameraY}px) scale(${zoom})` }}>
        <Sequence from={0} durationInFrames={100}>
          <IntroIdentityScene productId={productId} />
        </Sequence>
        <Sequence from={62} durationInFrames={110}>
          <ManifestoScene productId={productId} />
        </Sequence>
        <Sequence from={148} durationInFrames={160}>
          <HeroDemoScene productId={productId} />
        </Sequence>
        <Sequence from={272} durationInFrames={140}>
          <FeatureMontageScene productId={productId} />
        </Sequence>
        <Sequence from={386} durationInFrames={148}>
          <ClaimScene productId={productId} />
        </Sequence>
        <Sequence from={508} durationInFrames={158}>
          <SloganScene productId={productId} />
        </Sequence>
        <Sequence from={640} durationInFrames={160}>
          <FeatureMontageScene productId={productId} />
        </Sequence>
        <Sequence from={740} durationInFrames={160}>
          <EndScene productId={productId} />
        </Sequence>
      </div>
      <CutOverlays accent={config.accent} frame={frame} />
    </AbsoluteFill>
  );
}
