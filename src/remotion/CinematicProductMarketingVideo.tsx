import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ReactNode } from "react";
import {
  PRODUCT_VIDEO_CONFIGS,
  type ProductVideoId,
} from "./productVideoConfigs";
import { PRODUCT_VIDEO_STORYBOARDS } from "./productVideoStoryboards";

type ProductMarketingVideoProps = {
  productId: ProductVideoId;
};

const FONT_STACK = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const MONO_STACK = 'IBM Plex Mono, JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace';
const PARTICLES = [
  { left: 104, top: 110, size: 4, offset: 0 },
  { left: 250, top: 172, size: 3, offset: 8 },
  { left: 468, top: 96, size: 2, offset: 16 },
  { left: 684, top: 132, size: 3, offset: 24 },
  { left: 840, top: 182, size: 2, offset: 12 },
  { left: 1036, top: 104, size: 4, offset: 28 },
  { left: 1186, top: 152, size: 3, offset: 20 },
  { left: 210, top: 288, size: 2, offset: 10 },
  { left: 392, top: 236, size: 3, offset: 18 },
  { left: 566, top: 280, size: 4, offset: 22 },
  { left: 758, top: 262, size: 3, offset: 14 },
  { left: 1106, top: 250, size: 2, offset: 26 },
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

function getSceneOpacity(frame: number, duration: number, fadeIn = 14, fadeOut = 20) {
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

function SloerMark({ size, accent, frame }: { size: number; accent: string; frame: number }) {
  const wobble = interpolate(Math.sin(frame / 18), [-1, 1], [-5, 5]);
  const glow = interpolate(Math.sin(frame / 22), [-1, 1], [0.75, 1.06]);

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        transform: `rotate(${wobble}deg) scale(${glow})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size * 0.24,
          background: "linear-gradient(135deg, #ffbf62 0%, #f59e0b 28%, #38bdf8 72%, #2563eb 100%)",
          boxShadow: `0 0 ${size * 0.74}px ${hexToRgba(accent, 0.22)}`,
          transform: "rotate(8deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: size * 0.15,
          borderRadius: size * 0.18,
          background: "rgba(6,6,8,0.96)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: size * 0.22,
          top: size * 0.2,
          width: size * 0.24,
          height: size * 0.56,
          borderRadius: size * 0.08,
          background: "linear-gradient(180deg, #ffd76d 0%, #f59e0b 100%)",
          clipPath: "polygon(0 0, 100% 18%, 88% 54%, 100% 100%, 12% 82%, 0 38%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: size * 0.2,
          top: size * 0.2,
          width: size * 0.24,
          height: size * 0.56,
          borderRadius: size * 0.08,
          background: "linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)",
          clipPath: "polygon(10% 0, 100% 18%, 100% 62%, 88% 100%, 0 82%, 18% 42%)",
        }}
      />
    </div>
  );
}

function AmbientBackground({
  accent,
  secondary,
  frame,
}: {
  accent: string;
  secondary: string;
  frame: number;
}) {
  const auraX = interpolate(Math.sin(frame / 54), [-1, 1], [34, 66]);
  const auraY = interpolate(Math.cos(frame / 48), [-1, 1], [24, 62]);
  const streakShift = interpolate(Math.sin(frame / 26), [-1, 1], [-36, 36]);
  const gridShift = interpolate(frame, [0, 900], [0, 80], { extrapolateRight: "clamp" });

  return (
    <>
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at center, rgba(10,12,19,0.96) 0%, #040405 58%, #010102 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${auraX}% ${auraY}%, ${hexToRgba(accent, 0.22)} 0%, transparent 34%), radial-gradient(circle at 78% 22%, ${hexToRgba(secondary, 0.12)} 0%, transparent 22%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -120 + streakShift,
          right: -120 - streakShift,
          top: 76,
          height: 6,
          background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.15)} 16%, ${hexToRgba(accent, 0.5)} 45%, ${hexToRgba(accent, 0.18)} 74%, transparent)`,
          filter: "blur(7px)",
          opacity: 0.94,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -140 - streakShift * 0.4,
          right: -140 + streakShift * 0.4,
          top: 82,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.72)} 42%, transparent)`,
          opacity: 0.82,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -140,
          right: -140,
          bottom: -196,
          height: 420,
          transform: `perspective(1100px) rotateX(74deg) translateY(${gridShift * 0.16}px) scale(1.16)`,
          backgroundImage: `linear-gradient(${hexToRgba(accent, 0.17)} 1px, transparent 1px), linear-gradient(90deg, ${hexToRgba(accent, 0.16)} 1px, transparent 1px)`,
          backgroundSize: "74px 74px",
          opacity: 0.46,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 220,
          background: `linear-gradient(180deg, transparent 0%, ${hexToRgba(accent, 0.08)} 72%, ${hexToRgba(accent, 0.16)} 100%)`,
          opacity: 0.9,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 2px, transparent 4px)",
          mixBlendMode: "screen",
          opacity: 0.12,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at center, transparent 52%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0.78) 100%)",
        }}
      />
      {PARTICLES.map((particle) => {
        const driftX = interpolate(Math.sin((frame + particle.offset * 8) / 24), [-1, 1], [-18, 18]);
        const driftY = interpolate(Math.cos((frame + particle.offset * 7) / 18), [-1, 1], [-8, 8]);
        const glow = interpolate(Math.sin((frame + particle.offset * 5) / 16), [-1, 1], [0.3, 1]);

        return (
          <div
            key={`${particle.left}-${particle.top}`}
            style={{
              position: "absolute",
              left: particle.left + driftX,
              top: particle.top + driftY,
              width: particle.size,
              height: particle.size,
              borderRadius: 999,
              background: accent,
              opacity: glow * 0.6,
              boxShadow: `0 0 18px ${hexToRgba(accent, 0.34)}`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 4,
          background: `linear-gradient(90deg, ${hexToRgba(accent, 0.72)}, ${hexToRgba(secondary, 0.72)})`,
          opacity: 0.9,
        }}
      />
    </>
  );
}

function ChipLabel({ text, accent, frame }: { text: string; accent: string; frame: number }) {
  const glow = interpolate(Math.sin(frame / 18), [-1, 1], [0.82, 1.06]);

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 18px",
        borderRadius: 12,
        border: `1px solid ${hexToRgba(accent, 0.44)}`,
        background: hexToRgba(accent, 0.1),
        boxShadow: `0 0 26px ${hexToRgba(accent, 0.18)}`,
        transform: `scale(${glow})`,
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: 999, background: accent, boxShadow: `0 0 18px ${hexToRgba(accent, 0.45)}` }} />
      <div style={{ fontFamily: MONO_STACK, fontSize: 20, color: accent }}>{text}</div>
    </div>
  );
}

function IntroLogoScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const opacity = getSceneOpacity(frame, 120, 12, 28);
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 110, mass: 0.7 } });
  const markEnter = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 130 } });
  const { prefix, suffix } = splitProductName(config.name);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
      }}
    >
      <div style={{ position: "absolute", left: 124, top: 182, display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ transform: `translateY(${interpolate(markEnter, [0, 1], [18, 0])}px)` }}>
          <SloerMark size={94} accent={config.accent} frame={frame} />
        </div>
        <div>
          <div style={{ fontFamily: FONT_STACK, fontSize: 66, fontWeight: 750, letterSpacing: -2.8 }}>
            <span style={{ color: "#ffffff" }}>{prefix}</span>
            <span style={{ color: config.accent }}>{suffix}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 18, letterSpacing: 3.4, textTransform: "uppercase", color: hexToRgba(config.accent, 0.84) }}>{config.tag}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function StatementScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const storyboard = PRODUCT_VIDEO_STORYBOARDS[productId];
  const opacity = getSceneOpacity(frame, 170, 14, 24);
  const base = spring({ frame, fps, config: { damping: 16, stiffness: 105 } });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: -10 }}>
        {storyboard.statementLines.map((line, index) => {
          const lineProgress = spring({
            frame: frame - index * 5,
            fps,
            config: { damping: 16, stiffness: 120 },
          });

          return (
            <div
              key={line}
              style={{
                fontFamily: FONT_STACK,
                fontSize: storyboard.statementLines.length > 1 ? 72 : 78,
                fontWeight: 820,
                letterSpacing: -3.4,
                lineHeight: 0.95,
                textTransform: "uppercase",
                color: "#ffffff",
                transform: `translateY(${interpolate(lineProgress, [0, 1], [32 + index * 8, 0])}px) scale(${interpolate(lineProgress, [0, 1], [0.98, 1])})`,
                filter: `blur(${interpolate(1 - lineProgress, [0, 1], [0, 10])}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
        <div
          style={{
            marginTop: 28,
            transform: `translateY(${interpolate(base, [0, 1], [18, 0])}px)`,
          }}
        >
          <ChipLabel text={storyboard.chip} accent={config.accent} frame={frame} />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function DemoPanelFrame({
  accent,
  frame,
  children,
}: {
  accent: string;
  frame: number;
  children: ReactNode;
}) {
  const sweepX = interpolate(frame % 90, [0, 90], [-220, 560]);

  return (
    <div
      style={{
        position: "relative",
        width: 510,
        height: 230,
        borderRadius: 22,
        border: `1px solid ${hexToRgba(accent, 0.48)}`,
        background: "rgba(8,8,12,0.8)",
        boxShadow: `0 0 56px ${hexToRgba(accent, 0.18)}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 20% 18%, ${hexToRgba(accent, 0.12)}, transparent 34%), rgba(6,7,10,0.92)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 2px, transparent 4px)",
          opacity: 0.08,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${sweepX}px) skewX(-24deg)`,
          width: 160,
          background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.08)}, transparent)`,
        }}
      />
      {children}
    </div>
  );
}

function SpaceDemoPanel({ frame, accent }: { frame: number; accent: string }) {
  const activePane = Math.floor((frame / 18) % 4);

  return (
    <DemoPanelFrame accent={accent} frame={frame}>
      <div style={{ position: "relative", zIndex: 2, padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 7 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((color) => (
              <div key={color} style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
            ))}
          </div>
          <div style={{ fontFamily: MONO_STACK, fontSize: 12, color: hexToRgba(accent, 0.82) }}>layout / 4 panes</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          {['PANE_1', 'PANE_2', 'PANE_3', 'PANE_4'].map((pane, index) => {
            const pulse = interpolate(Math.sin((frame + index * 14) / 16), [-1, 1], [0.98, 1.02]);
            const isActive = activePane === index;

            return (
              <div
                key={pane}
                style={{
                  height: 76,
                  borderRadius: 14,
                  padding: 12,
                  border: `1px solid ${isActive ? hexToRgba(accent, 0.72) : "rgba(255,255,255,0.08)"}`,
                  background: isActive ? hexToRgba(accent, 0.12) : "rgba(255,255,255,0.025)",
                  boxShadow: isActive ? `0 0 24px ${hexToRgba(accent, 0.22)}` : "none",
                  transform: `scale(${isActive ? pulse : 1})`,
                }}
              >
                <div style={{ fontFamily: MONO_STACK, fontSize: 12, color: isActive ? accent : "rgba(255,255,255,0.56)" }}>{pane}</div>
                <div style={{ marginTop: 14, height: 3, width: `${52 + index * 12}%`, borderRadius: 999, background: isActive ? accent : "rgba(255,255,255,0.16)" }} />
                <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
                  {[0, 1, 2].map((cell) => (
                    <div key={cell} style={{ flex: 1, height: 4, borderRadius: 999, background: isActive ? hexToRgba(accent, 0.5) : "rgba(255,255,255,0.12)" }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DemoPanelFrame>
  );
}

function VoiceDemoPanel({ frame, accent }: { frame: number; accent: string }) {
  const fullText = "Hey, build me a Next.js app with authentication, Stripe payments, and a user dashboard";
  const typedLength = Math.max(18, Math.floor(interpolate(frame, [0, 110], [0, fullText.length], { extrapolateRight: "clamp" })));
  const visibleText = fullText.slice(0, typedLength);
  const progress = interpolate(frame % 90, [0, 90], [0.1, 1], { extrapolateRight: "clamp" });

  return (
    <DemoPanelFrame accent={accent} frame={frame}>
      <div style={{ position: "relative", zIndex: 2, padding: 18 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "7px 14px", borderRadius: 999, border: `1px solid ${hexToRgba(accent, 0.4)}`, background: hexToRgba(accent, 0.08) }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: accent, boxShadow: `0 0 18px ${hexToRgba(accent, 0.45)}` }} />
          <div style={{ fontFamily: MONO_STACK, fontSize: 11, color: "white" }}>Processing...</div>
        </div>
        <div style={{ marginTop: 16, borderRadius: 14, border: `1px solid ${hexToRgba(accent, 0.28)}`, background: "rgba(255,255,255,0.04)", padding: 16 }}>
          <div style={{ fontFamily: FONT_STACK, fontSize: 22, fontWeight: 600, lineHeight: 1.35, color: "white" }}>{visibleText}</div>
          <div style={{ marginTop: 14, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 999, background: accent, boxShadow: `0 0 24px ${hexToRgba(accent, 0.36)}` }} />
          </div>
          <div style={{ marginTop: 12, fontFamily: MONO_STACK, fontSize: 11, color: hexToRgba(accent, 0.82) }}>+ injecting into active app</div>
        </div>
      </div>
    </DemoPanelFrame>
  );
}

function SwarmDemoPanel({ frame, accent }: { frame: number; accent: string }) {
  const activeRow = Math.floor((frame / 20) % 4);
  const rows = [
    ["API schema", "Builder", "RUNNING"],
    ["Auth review", "Reviewer", "CHECKING"],
    ["Context map", "Scout", "SYNCED"],
    ["Release pass", "Coordinator", "READY"],
  ];

  return (
    <DemoPanelFrame accent={accent} frame={frame}>
      <div style={{ position: "relative", zIndex: 2, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: MONO_STACK, fontSize: 12, color: hexToRgba(accent, 0.76) }}>
          <div>swarm / active / 4 agents</div>
          <div>persistent PTY</div>
        </div>
        <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
          {rows.map((row, index) => {
            const isActive = activeRow === index;

            return (
              <div
                key={row[0]}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 0.7fr 0.5fr",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: `1px solid ${isActive ? hexToRgba(accent, 0.68) : "rgba(255,255,255,0.08)"}`,
                  background: isActive ? hexToRgba(accent, 0.11) : "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ fontFamily: FONT_STACK, fontSize: 17, fontWeight: 650, color: "white" }}>{row[0]}</div>
                <div style={{ fontFamily: MONO_STACK, fontSize: 12, color: "rgba(255,255,255,0.58)" }}>{row[1]}</div>
                <div style={{ justifySelf: "end", padding: "6px 9px", borderRadius: 999, border: `1px solid ${hexToRgba(accent, 0.35)}`, background: hexToRgba(accent, 0.12), fontFamily: MONO_STACK, fontSize: 10, color: accent }}>{row[2]}</div>
              </div>
            );
          })}
        </div>
      </div>
    </DemoPanelFrame>
  );
}

function CanvasDemoPanel({ frame, accent, secondary, tertiary }: { frame: number; accent: string; secondary: string; tertiary: string }) {
  const orbit = interpolate(Math.sin(frame / 20), [-1, 1], [-10, 10]);
  const cards = [
    { left: 34, top: 44, color: accent, title: "Research" },
    { left: 300, top: 30, color: secondary, title: "Builder" },
    { left: 166, top: 124, color: tertiary, title: "Review" },
  ];

  return (
    <DemoPanelFrame accent={accent} frame={frame}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.24 }} />
      <svg viewBox="0 0 510 230" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <path d="M130 90 C 180 70, 230 84, 318 84" stroke={hexToRgba(accent, 0.42)} strokeWidth="2" strokeDasharray="6 8" fill="none" />
        <path d="M356 128 C 320 132, 278 144, 234 164" stroke={hexToRgba(secondary, 0.4)} strokeWidth="2" strokeDasharray="6 8" fill="none" />
      </svg>
      {cards.map((card, index) => (
        <div
          key={card.title}
          style={{
            position: "absolute",
            left: card.left,
            top: card.top + (index % 2 === 0 ? orbit : -orbit * 0.9),
            width: index === 2 ? 176 : 144,
            padding: 12,
            borderRadius: 16,
            border: `1px solid ${hexToRgba(card.color, 0.38)}`,
            background: "rgba(8,8,12,0.72)",
            boxShadow: `0 0 30px ${hexToRgba(card.color, 0.16)}`,
          }}
        >
          <div style={{ fontFamily: FONT_STACK, fontSize: 16, fontWeight: 700, color: card.color }}>{card.title}</div>
          <div style={{ marginTop: 8, fontFamily: MONO_STACK, fontSize: 11, color: "rgba(255,255,255,0.56)" }}>{index === 0 ? "mapping topology" : index === 1 ? "spawning threads" : "checking overlap zones"}</div>
        </div>
      ))}
    </DemoPanelFrame>
  );
}

function McpDemoPanel({ frame, accent }: { frame: number; accent: string }) {
  const pulse = interpolate(Math.sin(frame / 16), [-1, 1], [0.8, 1.1]);

  return (
    <DemoPanelFrame accent={accent} frame={frame}>
      <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 18, height: "100%" }}>
        {[
          ["KANBAN", "WORKFLOWS"],
          ["SHARED", "CONTEXT"],
        ].map(([title, subtitle], index) => (
          <div
            key={title}
            style={{
              borderRadius: 16,
              border: `1px solid ${hexToRgba(accent, 0.42)}`,
              background: index === 1 ? hexToRgba(accent, 0.08) : "rgba(255,255,255,0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: index === 1 ? `0 0 36px ${hexToRgba(accent, 0.14)}` : "none",
            }}
          >
            <div style={{ fontFamily: FONT_STACK, fontSize: 28, fontWeight: 820, color: "white" }}>{title}</div>
            <div style={{ marginTop: 10, fontFamily: MONO_STACK, fontSize: 11, color: accent }}>{subtitle}</div>
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 14,
            height: 14,
            borderRadius: 999,
            background: accent,
            transform: `translate(-50%, -50%) scale(${pulse})`,
            boxShadow: `0 0 30px ${hexToRgba(accent, 0.44)}`,
          }}
        />
      </div>
    </DemoPanelFrame>
  );
}

function CodeDemoPanel({ frame, accent }: { frame: number; accent: string }) {
  const activeLine = Math.floor((frame / 16) % 6);
  const files = [
    "src/",
    "app/",
    "products/voice.ts",
    "components/dashboard.tsx",
    "prompts/handbook.txt",
    "package.json",
  ];

  return (
    <DemoPanelFrame accent={accent} frame={frame}>
      <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 18, padding: 16, height: "100%" }}>
        <div style={{ borderRadius: 16, border: `1px solid ${hexToRgba(accent, 0.22)}`, background: "rgba(255,255,255,0.03)", padding: 14 }}>
          <div style={{ fontFamily: MONO_STACK, fontSize: 11, color: "rgba(255,255,255,0.48)" }}>my-saas/</div>
          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            {files.map((file, index) => (
              <div
                key={file}
                style={{
                  borderRadius: 10,
                  padding: "7px 10px",
                  background: activeLine === index ? hexToRgba(accent, 0.14) : "transparent",
                  border: `1px solid ${activeLine === index ? hexToRgba(accent, 0.36) : "transparent"}`,
                  fontFamily: MONO_STACK,
                  fontSize: 11,
                  color: activeLine === index ? "white" : "rgba(255,255,255,0.62)",
                }}
              >
                {file}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderRadius: 16, border: `1px solid ${hexToRgba(accent, 0.2)}`, background: "rgba(255,255,255,0.025)", padding: 14 }}>
          <div style={{ display: "grid", gap: 10 }}>
            {[0, 1, 2, 3, 4].map((line) => (
              <div key={line} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 18, fontFamily: MONO_STACK, fontSize: 11, color: "rgba(255,255,255,0.36)" }}>{line + 1}</div>
                <div style={{ flex: 1, height: 8, borderRadius: 999, background: line % 2 === 0 ? hexToRgba(accent, 0.45) : "rgba(255,255,255,0.16)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoPanelFrame>
  );
}

function DemoPanelScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const storyboard = PRODUCT_VIDEO_STORYBOARDS[productId];
  const opacity = getSceneOpacity(frame, 200, 16, 24);
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });

  const renderVisual = () => {
    switch (config.mode) {
      case "workspace":
        return <SpaceDemoPanel frame={frame} accent={config.accent} />;
      case "voice":
        return <VoiceDemoPanel frame={frame} accent={config.accent} />;
      case "swarm":
        return <SwarmDemoPanel frame={frame} accent={config.accent} />;
      case "canvas":
        return <CanvasDemoPanel frame={frame} accent={config.accent} secondary={config.secondaryAccent} tertiary={config.tertiaryAccent} />;
      case "orbit":
        return <McpDemoPanel frame={frame} accent={config.accent} />;
      case "cli":
      default:
        return <CodeDemoPanel frame={frame} accent={config.accent} />;
    }
  };

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateX(${interpolate(enter, [0, 1], [-44, 0])}px) translateY(${interpolate(enter, [0, 1], [22, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
      }}
    >
      <div style={{ position: "absolute", left: 78, top: 292 }}>{renderVisual()}</div>
      <div style={{ position: "absolute", left: 88, top: 540, fontFamily: FONT_STACK, fontSize: 25, fontWeight: 760, letterSpacing: -0.8, color: "white" }}>{storyboard.demoCaption}</div>
    </AbsoluteFill>
  );
}

function GhostWords({ words, accent, frame }: { words: string[]; accent: string; frame: number }) {
  const line = `${words.join(" · ")} · ${words.join(" · ")}`;
  const drift = interpolate(Math.sin(frame / 34), [-1, 1], [-44, 44]);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24, overflow: "hidden" }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          style={{
            marginLeft: index === 1 ? -120 + drift : -20 - drift * 0.5,
            fontFamily: FONT_STACK,
            fontSize: 64,
            fontWeight: 820,
            letterSpacing: -2.8,
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            color: "transparent",
            WebkitTextStroke: `1px ${hexToRgba(accent, 0.16)}`,
            opacity: 0.7,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

function ClaimCardScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const storyboard = PRODUCT_VIDEO_STORYBOARDS[productId];
  const opacity = getSceneOpacity(frame, 210, 16, 26);
  const enter = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 105 } });
  const breathe = interpolate(Math.sin(frame / 26), [-1, 1], [0.99, 1.02]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <GhostWords words={storyboard.ghostWords} accent={config.accent} frame={frame} />
      <div
        style={{
          position: "absolute",
          left: 760,
          top: 240,
          width: 380,
          padding: "22px 26px",
          borderRadius: 22,
          border: `1px solid ${hexToRgba(config.accent, 0.48)}`,
          background: "rgba(10,10,14,0.82)",
          boxShadow: `0 0 48px ${hexToRgba(config.accent, 0.18)}`,
          transform: `translateY(${interpolate(enter, [0, 1], [20, 0])}px) scale(${breathe})`,
        }}
      >
        {storyboard.claimTopLines.map((line) => (
          <div key={line} style={{ fontFamily: FONT_STACK, fontSize: 26, fontWeight: 760, lineHeight: 1.02, textTransform: "uppercase", color: "white" }}>
            {line}
          </div>
        ))}
        <div style={{ marginTop: 10 }}>
          {storyboard.claimBottomLines.map((line) => (
            <div key={line} style={{ fontFamily: FONT_STACK, fontSize: 40, fontWeight: 840, lineHeight: 0.96, letterSpacing: -1.8, textTransform: "uppercase", color: config.accent, textShadow: `0 0 34px ${hexToRgba(config.accent, 0.2)}` }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function OutroSloganScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const storyboard = PRODUCT_VIDEO_STORYBOARDS[productId];
  const opacity = getSceneOpacity(frame, 150, 12, 22);
  const enter = spring({ frame, fps, config: { damping: 15, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", left: 92, top: 510, transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)` }}>
        <div style={{ fontFamily: FONT_STACK, fontSize: 62, fontWeight: 820, letterSpacing: -2.6, color: "white", textTransform: "uppercase" }}>{storyboard.outroPrimary}</div>
        <div style={{ marginTop: 8, fontFamily: FONT_STACK, fontSize: 62, fontWeight: 820, letterSpacing: -2.6, color: config.accent, textTransform: "uppercase", textShadow: `0 0 28px ${hexToRgba(config.accent, 0.16)}` }}>{storyboard.outroAccent}</div>
      </div>
    </AbsoluteFill>
  );
}

function CloseScene({ productId }: { productId: ProductVideoId }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const storyboard = PRODUCT_VIDEO_STORYBOARDS[productId];
  const opacity = getSceneOpacity(frame, 180, 16, 16);
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const chipEnter = spring({ frame: frame - 12, fps, config: { damping: 16, stiffness: 110 } });

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: "absolute", left: "50%", top: 254, transform: `translateX(-50%) translateY(${interpolate(enter, [0, 1], [26, 0])}px)` }}>
        <SloerMark size={86} accent={config.accent} frame={frame} />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 374,
          transform: `translateX(-50%) translateY(${interpolate(chipEnter, [0, 1], [18, 0])}px)`,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "11px 18px",
          borderRadius: 12,
          border: `1px solid ${hexToRgba(config.accent, 0.34)}`,
          background: hexToRgba(config.accent, 0.08),
          boxShadow: `0 0 30px ${hexToRgba(config.accent, 0.14)}`,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: 999, background: config.accent }} />
        <div style={{ fontFamily: MONO_STACK, fontSize: 19, color: "white" }}>{storyboard.closeChip}</div>
      </div>
    </AbsoluteFill>
  );
}

export function ProductMarketingVideo({ productId }: ProductMarketingVideoProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const cameraX = interpolate(Math.sin(frame / 46), [-1, 1], [-10, 10]);
  const cameraY = interpolate(Math.cos(frame / 40), [-1, 1], [-8, 8]);
  const zoom = interpolate(Math.sin(frame / 120), [-1, 1], [1, 1.035]);
  const overallOpacity = interpolate(frame, [0, 18, durationInFrames - 16, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#030304", color: "white", fontFamily: FONT_STACK, opacity: overallOpacity }}>
      <AmbientBackground accent={config.accent} secondary={config.secondaryAccent} frame={frame} />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${cameraX}px, ${cameraY}px) scale(${zoom})` }}>
        <Sequence from={0} durationInFrames={120}>
          <IntroLogoScene productId={productId} />
        </Sequence>
        <Sequence from={88} durationInFrames={170}>
          <StatementScene productId={productId} />
        </Sequence>
        <Sequence from={250} durationInFrames={200}>
          <DemoPanelScene productId={productId} />
        </Sequence>
        <Sequence from={430} durationInFrames={210}>
          <ClaimCardScene productId={productId} />
        </Sequence>
        <Sequence from={620} durationInFrames={150}>
          <OutroSloganScene productId={productId} />
        </Sequence>
        <Sequence from={720} durationInFrames={180}>
          <CloseScene productId={productId} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
}
