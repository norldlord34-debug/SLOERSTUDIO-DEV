// @sloerstudio/ui — Shared design system
// Shared across apps/web, apps/desktop (web layer), apps/voice

// ── Design Tokens ─────────────────────────────────────────────────────────────
export const colors = {
  cobalt: "#4f8cff",
  teal: "#28e7c5",
  amber: "#ffbf62",
  pink: "#ff6f96",
  surface: "#050505",
  surfaceElevated: "#0a0a0f",
  border: "rgba(255,255,255,0.08)",
  textPrimary: "#ffffff",
  textSecondary: "#9ca3af",
  textMuted: "#6b7280",
} as const;

export const fonts = {
  display: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
  body: "var(--font-inter), Inter, system-ui, sans-serif",
  mono: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
} as const;

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  full: "9999px",
} as const;

// ── Type exports ──────────────────────────────────────────────────────────────
export type Color = keyof typeof colors;
export type Font = keyof typeof fonts;
