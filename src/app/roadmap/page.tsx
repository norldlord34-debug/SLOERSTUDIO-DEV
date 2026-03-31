import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Clock, Zap } from "lucide-react";

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";

const PHASES = [
  {
    phase: "v1.0 — Shipped",
    status: "complete",
    color: TEAL,
    items: [
      { label: "SloerSpace ADE — multi-pane PTY terminal", done: true },
      { label: "Tauri 2 + Rust backend with portable-pty", done: true },
      { label: "15 built-in themes with CSS variable system", done: true },
      { label: "SloerSwarm 5-step launch wizard", done: true },
      { label: "SloerCanvas free-form canvas runtime", done: true },
      { label: "SiulkVoice on-device Whisper AI", done: true },
      { label: "AI Chat Panel (OpenAI, Anthropic, Gemini, Ollama)", done: true },
      { label: "Kanban task board + command palette", done: true },
      { label: "7 CLI agent auto-resolution (Claude, Codex, Gemini, OpenCode, Cursor, Droid, Copilot)", done: true },
    ],
  },
  {
    phase: "v1.1 — In Progress",
    status: "active",
    color: COBALT,
    items: [
      { label: "SloerStudio web platform (this site)", done: true },
      { label: "Auth system (NextAuth + PostgreSQL)", done: true },
      { label: "Super admin dashboard at /admin", done: true },
      { label: "SloerSwarm dashboard with real-time agent tracking", done: false },
      { label: "Stripe billing integration", done: false },
      { label: "Email verification + password reset", done: false },
      { label: "Team/organization workspaces", done: false },
    ],
  },
  {
    phase: "v1.2 — Planned",
    status: "planned",
    color: AMBER,
    items: [
      { label: "SloerMCP — AI agent protocol server", done: false },
      { label: "Prompt library with community sharing", done: false },
      { label: "Agent marketplace with one-click install", done: false },
      { label: "SSH remote terminal sessions", done: false },
      { label: "Git integration in terminal view", done: false },
      { label: "Plugin API for community extensions", done: false },
    ],
  },
  {
    phase: "v2.0 — Future",
    status: "future",
    color: "#a855f7",
    items: [
      { label: "SloerCode — AI coding CLI for vibe coding", done: false },
      { label: "Multi-machine swarm orchestration", done: false },
      { label: "Real-time collaborative workspaces", done: false },
      { label: "SloerAnalytics — code velocity metrics", done: false },
      { label: "Mobile companion app", done: false },
      { label: "Enterprise SSO + SCIM provisioning", done: false },
    ],
  },
];

const STATUS_ICONS = {
  complete: { icon: Check, label: "Shipped", bg: `${TEAL}15`, color: TEAL, border: `${TEAL}25` },
  active: { icon: Zap, label: "In Progress", bg: `${COBALT}15`, color: COBALT, border: `${COBALT}25` },
  planned: { icon: Clock, label: "Planned", bg: `${AMBER}15`, color: AMBER, border: `${AMBER}25` },
  future: { icon: Clock, label: "Future", bg: "#a855f715", color: "#a855f7", border: "#a855f725" },
};

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-16">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Public Roadmap</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">
            What We&apos;re Building
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Our public product roadmap. We ship in the open. Have a feature request?{" "}
            <a href="/community/discord" className="text-[#4f8cff] hover:underline">Drop it in Discord.</a>
          </p>
        </div>

        <div className="space-y-8">
          {PHASES.map((phase) => {
            const meta = STATUS_ICONS[phase.status as keyof typeof STATUS_ICONS];
            return (
              <div key={phase.phase} className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-white/8">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: meta.bg, border: `1px solid ${meta.border}` }}>
                    <meta.icon size={13} style={{ color: meta.color }} />
                  </div>
                  <h2 className="font-bold text-white font-display">{phase.phase}</h2>
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ color: meta.color, borderColor: meta.border, background: meta.bg }}>
                    {meta.label}
                  </span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {phase.items.map((item) => (
                    <div key={item.label} className={`flex items-start gap-2.5 text-sm ${item.done ? "text-gray-300" : "text-gray-500"}`}>
                      <span className="flex-shrink-0 mt-0.5" style={{ color: item.done ? TEAL : "rgba(255,255,255,0.2)" }}>
                        {item.done ? "✓" : "○"}
                      </span>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center p-8 rounded-2xl border border-white/8 bg-white/[0.01]">
          <p className="text-gray-400 mb-4">Missing a feature you need?</p>
          <a href="/community/discord" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-[#5865f2] bg-[#5865f2]/10 border border-[#5865f2]/20 hover:bg-[#5865f2]/20 transition-colors">
            💬 Request on Discord
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
