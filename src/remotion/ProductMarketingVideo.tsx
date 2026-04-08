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

type ProductMarketingVideoProps = {
  productId: ProductVideoId;
};

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

function OrbitNode({
  frame,
  delay,
  x,
  y,
  size,
  color,
}: {
  frame: number;
  delay: number;
  x: number;
  y: number;
  size: number;
  color: string;
}) {
  const enter = spring({ frame: frame - delay, fps: 30, config: { damping: 18, stiffness: 120 } });
  const scale = interpolate(enter, [0, 1], [0.6, 1]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: 999,
        background: `radial-gradient(circle, ${hexToRgba(color, 0.75)} 0%, ${hexToRgba(color, 0.2)} 65%, transparent 100%)`,
        border: `1px solid ${hexToRgba(color, 0.36)}`,
        boxShadow: `0 0 48px ${hexToRgba(color, 0.34)}`,
        opacity,
        transform: `scale(${scale})`,
      }}
    />
  );
}

function WorkspaceVisual({ frame, accent, secondary, tertiary }: { frame: number; accent: string; secondary: string; tertiary: string }) {
  const shift = interpolate(frame % 120, [0, 60, 120], [0, 14, 0], { extrapolateRight: "clamp" });
  const terminalColors = [accent, secondary, tertiary, "#8b5cf6"];

  return (
    <div style={{ position: "relative", width: 470, height: 320 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 32,
          background: "rgba(10, 12, 19, 0.94)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 30px 120px rgba(0,0,0,0.42)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: 20 }}>
          {terminalColors.map((color, index) => (
            <div
              key={color}
              style={{
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                padding: 16,
                transform: `translateY(${index % 2 === 0 ? shift : shift * -0.7}px)`,
              }}
            >
              <div style={{ fontFamily: "monospace", fontSize: 13, color }}>{`~/workspace $ ${index === 0 ? "launch --layout 8" : index === 1 ? "claude --project ./web" : index === 2 ? "browser open localhost:3000" : "history tail"}`}</div>
              <div style={{ marginTop: 10, fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{index === 0 ? "assigning operators" : index === 1 ? "runtime active" : index === 2 ? "preview synced" : "sequence ordered"}</div>
              <div style={{ marginTop: 14, height: 3, borderRadius: 999, background: hexToRgba(color, 0.8) }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VoiceVisual({ frame, accent, secondary, tertiary }: { frame: number; accent: string; secondary: string; tertiary: string }) {
  const bars = [30, 52, 70, 96, 82, 64, 90, 108, 86, 60, 44, 36];

  return (
    <div style={{ position: "relative", width: 470, height: 320 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 32,
          background: `radial-gradient(circle at top, ${hexToRgba(accent, 0.24)} 0%, rgba(8,8,10,0.96) 60%)`,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: `0 24px 100px ${hexToRgba(accent, 0.2)}`,
          padding: 28,
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <div
            style={{
              width: 72,
              height: 72,
              margin: "0 auto",
              borderRadius: 999,
              border: `1px solid ${hexToRgba(accent, 0.4)}`,
              background: hexToRgba(accent, 0.14),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            ●
          </div>
          <div style={{ marginTop: 18, fontSize: 40, fontWeight: 700 }}>{"SloerVoice"}</div>
          <div style={{ marginTop: 10, fontSize: 18, color: "rgba(255,255,255,0.7)" }}>Local inference // instant recovery</div>
        </div>
        <div style={{ marginTop: 34, display: "flex", alignItems: "flex-end", gap: 10, height: 118 }}>
          {bars.map((height, index) => {
            const animatedHeight = interpolate(
              Math.sin((frame + index * 3) / 10),
              [-1, 1],
              [Math.max(18, height * 0.48), height],
            );
            const color = index % 2 === 0 ? accent : index % 3 === 0 ? secondary : tertiary;

            return (
              <div
                key={`${height}-${index}`}
                style={{
                  flex: 1,
                  height: animatedHeight,
                  borderRadius: 999,
                  background: color,
                  boxShadow: `0 0 34px ${hexToRgba(color, 0.38)}`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SwarmVisual({ frame, accent, secondary, tertiary }: { frame: number; accent: string; secondary: string; tertiary: string }) {
  const colors = [accent, secondary, tertiary, "#ff6f96"];

  return (
    <div style={{ position: "relative", width: 470, height: 320 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 32,
          background: "rgba(8,10,14,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: `0 28px 100px ${hexToRgba(accent, 0.18)}`,
        }}
      />
      <div style={{ position: "absolute", left: 178, top: 110, width: 110, height: 110, borderRadius: 999, background: `radial-gradient(circle, ${hexToRgba(accent, 0.7)} 0%, ${hexToRgba(accent, 0.16)} 72%, transparent 100%)`, border: `1px solid ${hexToRgba(accent, 0.36)}` }} />
      <div style={{ position: "absolute", left: 204, top: 148, color: "white", fontSize: 20, fontWeight: 700 }}>Mission</div>
      {colors.map((color, index) => (
        <div key={color}>
          <div
            style={{
              position: "absolute",
              left: 235,
              top: 165,
              width: 2,
              height: 92,
              background: `linear-gradient(180deg, ${hexToRgba(color, 0.2)}, ${hexToRgba(color, 0.65)})`,
              transformOrigin: "top center",
              transform: `rotate(${index * 90 + interpolate(frame % 180, [0, 180], [-8, 8])}deg)`,
            }}
          />
          <OrbitNode
            frame={frame}
            delay={index * 6}
            x={[64, 338, 320, 86][index]}
            y={[54, 78, 222, 228][index]}
            size={72}
            color={color}
          />
        </div>
      ))}
    </div>
  );
}

function CanvasVisual({ frame, accent, secondary, tertiary }: { frame: number; accent: string; secondary: string; tertiary: string }) {
  const drift = interpolate(Math.sin(frame / 20), [-1, 1], [-12, 12]);
  const cards = [
    { left: 40, top: 52, color: accent, title: "Research" },
    { left: 290, top: 36, color: secondary, title: "Builder" },
    { left: 150, top: 186, color: tertiary, title: "Review" },
  ];

  return (
    <div style={{ position: "relative", width: 470, height: 320 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 32,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.08)",
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,191,98,0.14), transparent 32%), radial-gradient(circle at 80% 24%, rgba(79,140,255,0.14), transparent 30%), radial-gradient(circle at 50% 80%, rgba(40,231,197,0.12), transparent 38%), rgba(7,9,13,0.96)",
          boxShadow: `0 24px 100px ${hexToRgba(accent, 0.18)}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            opacity: 0.28,
          }}
        />
        {cards.map((card, index) => (
          <div
            key={card.title}
            style={{
              position: "absolute",
              left: card.left,
              top: card.top + (index % 2 === 0 ? drift : -drift * 0.8),
              width: index === 2 ? 220 : 180,
              padding: 16,
              borderRadius: 26,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(8,8,10,0.72)",
              boxShadow: `0 18px 60px ${hexToRgba(card.color, 0.16)}`,
            }}
          >
            <div style={{ fontSize: 13, color: card.color, fontWeight: 700 }}>{card.title}</div>
            <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>
              {index === 0 ? "mapping topology" : index === 1 ? "spawning thread" : "checking overlap zones"}
            </div>
            <div style={{ marginTop: 14, height: 3, borderRadius: 999, background: card.color }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function OrbitVisual({ frame, accent, secondary, tertiary }: { frame: number; accent: string; secondary: string; tertiary: string }) {
  const colors = [accent, secondary, tertiary, "#ffffff"];

  return (
    <div style={{ position: "relative", width: 470, height: 320 }}>
      <div style={{ position: "absolute", left: 180, top: 105, width: 110, height: 110, borderRadius: 999, background: `radial-gradient(circle, ${hexToRgba(accent, 0.75)} 0%, ${hexToRgba(accent, 0.12)} 70%, transparent 100%)`, border: `1px solid ${hexToRgba(accent, 0.35)}` }} />
      {colors.map((color, index) => {
        const angle = (frame * 1.1 + index * 90) * (Math.PI / 180);
        const radius = 120 + index * 8;
        const x = 235 + Math.cos(angle) * radius - 22;
        const y = 160 + Math.sin(angle) * radius - 22;

        return <OrbitNode key={color} frame={frame} delay={index * 3} x={x} y={y} size={44} color={color} />;
      })}
    </div>
  );
}

function CliVisual({ frame, accent, secondary, tertiary }: { frame: number; accent: string; secondary: string; tertiary: string }) {
  const lines = [
    { text: "$ sloercode run build", color: accent },
    { text: "$ sloercode test auth", color: secondary },
    { text: "$ sloercode ship preview", color: tertiary },
  ];

  return (
    <div style={{ position: "relative", width: 470, height: 320 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 32,
          background: "rgba(7,9,12,0.96)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: `0 24px 100px ${hexToRgba(accent, 0.18)}`,
          padding: 28,
        }}
      >
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", letterSpacing: 2, textTransform: "uppercase" }}>CLI runtime</div>
        <div style={{ marginTop: 26, display: "grid", gap: 16 }}>
          {lines.map((line, index) => (
            <div key={line.text} style={{ borderRadius: 22, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", padding: 16, transform: `translateX(${index % 2 === 0 ? interpolate(Math.sin((frame + index * 6) / 14), [-1, 1], [-6, 6]) : 0}px)` }}>
              <div style={{ fontFamily: "monospace", fontSize: 16, color: line.color }}>{line.text}</div>
              <div style={{ marginTop: 8, fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{index === 0 ? "compile target ready" : index === 1 ? "quality gate synced" : "preview deployment primed"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ModeVisual({
  mode,
  frame,
  accent,
  secondary,
  tertiary,
}: {
  mode: string;
  frame: number;
  accent: string;
  secondary: string;
  tertiary: string;
}) {
  switch (mode) {
    case "workspace":
      return <WorkspaceVisual frame={frame} accent={accent} secondary={secondary} tertiary={tertiary} />;
    case "voice":
      return <VoiceVisual frame={frame} accent={accent} secondary={secondary} tertiary={tertiary} />;
    case "swarm":
      return <SwarmVisual frame={frame} accent={accent} secondary={secondary} tertiary={tertiary} />;
    case "canvas":
      return <CanvasVisual frame={frame} accent={accent} secondary={secondary} tertiary={tertiary} />;
    case "cli":
      return <CliVisual frame={frame} accent={accent} secondary={secondary} tertiary={tertiary} />;
    default:
      return <OrbitVisual frame={frame} accent={accent} secondary={secondary} tertiary={tertiary} />;
  }
}

export function ProductMarketingVideo({ productId }: ProductMarketingVideoProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const intro = spring({ frame, fps, config: { damping: 18, stiffness: 110 } });
  const cards = spring({ frame: frame - 36, fps, config: { damping: 18, stiffness: 120 } });
  const steps = spring({ frame: frame - 90, fps, config: { damping: 20, stiffness: 100 } });
  const loopGlow = interpolate(Math.sin(frame / 24), [-1, 1], [0.4, 1]);
  const outroOpacity = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    easing: Easing.out(Easing.ease),
  });

  return (
    <AbsoluteFill
      style={{
        background: "#050505",
        color: "white",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        opacity: outroOpacity,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 14% 18%, ${hexToRgba(config.accent, 0.18)}, transparent 28%), radial-gradient(circle at 84% 18%, ${hexToRgba(config.secondaryAccent, 0.15)}, transparent 24%), radial-gradient(circle at 50% 86%, ${hexToRgba(config.tertiaryAccent, 0.12)}, transparent 32%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          opacity: 0.12,
        }}
      />

      <div style={{ position: "absolute", inset: 44, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 18px",
              borderRadius: 999,
              border: `1px solid ${hexToRgba(config.accent, 0.26)}`,
              background: hexToRgba(config.accent, 0.08),
              fontSize: 15,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.92)",
              transform: `translateY(${interpolate(intro, [0, 1], [12, 0])}px) scale(${interpolate(intro, [0, 1], [0.98, 1])})`,
            }}
          >
            <span>{config.name}</span>
            <span style={{ color: config.accent }}>{config.tag}</span>
          </div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.56)", letterSpacing: 1.4, textTransform: "uppercase" }}>{config.runtimeLabel}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.03fr 0.97fr", gap: 36, marginTop: 30 }}>
          <div>
            <div
              style={{
                fontSize: 74,
                lineHeight: 0.95,
                fontWeight: 800,
                letterSpacing: -3.6,
                transform: `translateY(${interpolate(intro, [0, 1], [18, 0])}px)`,
                opacity: intro,
              }}
            >
              {config.headline}
            </div>
            <div style={{ marginTop: 24, maxWidth: 560, fontSize: 24, lineHeight: 1.5, color: "rgba(255,255,255,0.72)", opacity: intro }}>
              {config.summary}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 30 }}>
              {config.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  style={{
                    borderRadius: 24,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    padding: 18,
                    opacity: cards,
                    transform: `translateY(${interpolate(cards, [0, 1], [24 + index * 4, 0])}px)`,
                  }}
                >
                  <div style={{ fontSize: 12, letterSpacing: 1.6, textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>{stat.label}</div>
                  <div style={{ marginTop: 12, fontSize: 22, fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ marginTop: 14, width: 58, height: 4, borderRadius: 999, background: [config.accent, config.secondaryAccent, config.tertiaryAccent][index % 3] }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <ModeVisual mode={config.mode} frame={frame} accent={config.accent} secondary={config.secondaryAccent} tertiary={config.tertiaryAccent} />
          </div>
        </div>

        <Sequence from={38}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 26 }}>
            {config.pillars.map((pillar, index) => (
              <div
                key={pillar.title}
                style={{
                  borderRadius: 28,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.025)",
                  padding: 22,
                  opacity: cards,
                  transform: `translateY(${interpolate(cards, [0, 1], [18 + index * 6, 0])}px)`,
                }}
              >
                <div style={{ width: 64, height: 5, borderRadius: 999, background: [config.accent, config.secondaryAccent, config.tertiaryAccent][index % 3] }} />
                <div style={{ marginTop: 18, fontSize: 26, fontWeight: 700, lineHeight: 1.1 }}>{pillar.title}</div>
                <div style={{ marginTop: 14, fontSize: 17, lineHeight: 1.5, color: "rgba(255,255,255,0.64)" }}>{pillar.desc}</div>
              </div>
            ))}
          </div>
        </Sequence>

        <div style={{ marginTop: "auto", display: "grid", gridTemplateColumns: "1.12fr 0.88fr", gap: 18, alignItems: "end" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 24px",
              borderRadius: 30,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <div>
              <div style={{ fontSize: 14, letterSpacing: 1.4, textTransform: "uppercase", color: "rgba(255,255,255,0.44)" }}>Final call</div>
              <div style={{ marginTop: 10, fontSize: 32, fontWeight: 800 }}>{config.cta}</div>
            </div>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${hexToRgba(config.accent, 0.34)}`,
                background: `linear-gradient(135deg, ${hexToRgba(config.accent, 0.24)}, ${hexToRgba(config.secondaryAccent, 0.16)})`,
                boxShadow: `0 0 42px ${hexToRgba(config.accent, 0.22)}`,
                transform: `scale(${loopGlow})`,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 800 }}>{config.name.slice(0, 2).toUpperCase()}</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {config.steps.map((step, index) => (
              <div
                key={step.title}
                style={{
                  padding: "16px 18px",
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.24)",
                  opacity: steps,
                  transform: `translateX(${interpolate(steps, [0, 1], [24 + index * 4, 0])}px)`,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.06)",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{step.title}</div>
                </div>
                <div style={{ marginTop: 8, marginLeft: 40, fontSize: 14, lineHeight: 1.45, color: "rgba(255,255,255,0.6)" }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
