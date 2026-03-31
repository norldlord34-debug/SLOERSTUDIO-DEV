import Link from "next/link";
import { Terminal, Users, Layout, Mic, Bot, ChevronRight, Zap, Shield, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";
const PINK = "#ff6f96";

const PRODUCTS = [
  {
    name: "SloerSpace",
    tag: "ADE",
    desc: "Agentic Development Environment. Multi-pane persistent PTY terminal, 4×4 layouts, session timelines, and live streaming.",
    cta: "Download for Windows",
    href: "/products/sloerspace",
    color: COBALT,
    icon: "⊡",
    platforms: ["Windows", "macOS", "Linux"],
  },
  {
    name: "SloerSwarm",
    tag: "NEW",
    desc: "Multi-agent orchestration. Deploy a fleet of AI agents in 5 steps with mission directives, roles, and live swarm dashboard.",
    cta: "Download for Windows",
    href: "/products/sloerswarm",
    color: TEAL,
    icon: "⟐",
    platforms: ["Windows", "macOS", "Linux"],
  },
  {
    name: "SloerCanvas",
    tag: "ALPHA",
    desc: "Free-form canvas IDE. Draggable, resizable terminal threads. Arrange 1–12 agent windows spatially. Zoom, pan, orchestrate.",
    cta: "Early Access",
    href: "/products/sloercanvas",
    color: AMBER,
    icon: "◈",
    platforms: ["Windows", "macOS"],
  },
  {
    name: "SloerVoice",
    tag: "ON-DEVICE",
    desc: "Voice dictation powered by Whisper AI, running 100% locally in Rust. Zero cloud. Zero telemetry. Total privacy.",
    cta: "Download for Windows",
    href: "/products/sloervoice",
    color: PINK,
    icon: "✦",
    platforms: ["Windows", "macOS", "Linux"],
  },
];

const FEATURES = [
  {
    icon: <Terminal size={20} style={{ color: COBALT }} />,
    accent: COBALT,
    title: "Persistent PTY Terminal",
    desc: "Real PTY sessions via portable-pty + xterm.js. Multi-pane layouts up to 4×4, live sequence-ordered streaming, and interactive input.",
  },
  {
    icon: <Users size={20} style={{ color: TEAL }} />,
    accent: TEAL,
    title: "SloerSwarm Orchestration",
    desc: "5-step wizard: Roster → Mission → Directory → Context → Launch. Each agent gets a resolved CLI bootstrap + persistent PTY session.",
  },
  {
    icon: <Layout size={20} style={{ color: AMBER }} />,
    accent: AMBER,
    title: "SloerCanvas Runtime",
    desc: "Spatial canvas with draggable terminal threads. 1–12 agents arranged freely. Zoom, pan, and manage your fleet visually.",
  },
  {
    icon: <Mic size={20} style={{ color: PINK }} />,
    accent: PINK,
    title: "SloerVoice — On-Device AI",
    desc: "Whisper AI running locally in Rust. Tiny.en (75MB) to Large-v3 (2.9GB). Push-to-talk or toggle. Zero cloud dependency.",
  },
  {
    icon: <Bot size={20} style={{ color: "#a855f7" }} />,
    accent: "#a855f7",
    title: "7 Native CLI Agents",
    desc: "Claude, Codex, Gemini, OpenCode, Cursor, Droid, Copilot — each with brand identity, auto-resolution, and bootstrap commands.",
  },
  {
    icon: <Zap size={20} style={{ color: "#84cc16" }} />,
    accent: "#84cc16",
    title: "AI Chat + Command Palette",
    desc: "Built-in AI assistant (OpenAI, Anthropic, Gemini, Ollama local). Ctrl+K command palette with starred commands and snippets.",
  },
];

const PRICING = [
  {
    tier: "Free",
    price: "$0",
    period: "forever",
    desc: "Get started with the agentic future.",
    features: ["SloerSpace ADE", "Multi-pane PTY terminal", "SloerCanvas (Alpha)", "15 themes", "Community Discord access", "Public content access"],
    cta: "Create Free Account",
    href: "/signup",
    highlighted: false,
  },
  {
    tier: "Studio",
    price: "$16",
    period: "/mo",
    desc: "Your agent development environment, ready to go.",
    features: ["Everything in Free", "SloerSwarm (multi-agent)", "Mission directives & context", "SloerVoice on-device", "Kanban task board", "API key management", "Email support"],
    cta: "Start Free Trial",
    href: "/signup?plan=studio",
    highlighted: true,
    badge: "MOST POPULAR",
  },
  {
    tier: "Enterprise",
    price: "$40",
    period: "/mo",
    desc: "The full stack for teams who ship at AI speed.",
    features: ["Everything in Studio", "Unlimited agents & swarms", "AI Chat (all providers)", "Advanced audit logs", "RBAC & team access", "Priority support", "Early access to new products"],
    cta: "Start Free Trial",
    href: "/signup?plan=enterprise",
    highlighted: false,
  },
];

const STATS = [
  { value: "7", label: "AI Agent CLIs", color: COBALT },
  { value: "15", label: "Built-in Themes", color: TEAL },
  { value: "3", label: "Platforms", color: AMBER },
  { value: "PTY", label: "Persistent Terminal", color: PINK },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#4f8cff]/30 font-sans overflow-x-hidden">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-30" style={{ background: `radial-gradient(ellipse at center, ${COBALT}18 0%, transparent 70%)` }} />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: `${TEAL}08` }} />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full blur-[100px]" style={{ background: `${PINK}06` }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-8 backdrop-blur-sm" style={{ color: COBALT }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: COBALT }} />
              Agentic Platform — v1.0 Live
            </div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[96px] font-bold tracking-[-0.04em] leading-[0.95] mb-8 font-display">
              Build the<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(90deg, ${COBALT} 0%, ${TEAL} 100%)` }}>
                Future.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
              SloerStudio is the agentic platform for developers who build at the speed of thought.
              Deploy AI agent swarms, run persistent multi-pane terminals, and ship faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105" style={{ background: COBALT, color: "#050505" }}>
                Get Started Free <ChevronRight size={16} />
              </Link>
              <Link href="/products/sloerspace" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors text-white">
                Explore Products
              </Link>
            </div>
            <p className="mt-6 text-xs text-gray-600">Free forever · No credit card required · Windows, macOS & Linux</p>
          </div>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────────────────────── */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold text-center mb-10">The Agentic Toolkit</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PRODUCTS.map((p) => (
              <div key={p.name} className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${p.color}50, transparent)` }} />
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold" style={{ background: `${p.color}15`, border: `1px solid ${p.color}25`, color: p.color }}>{p.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-display">{p.name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border" style={{ color: p.color, borderColor: `${p.color}40`, background: `${p.color}12` }}>{p.tag}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {p.platforms.map((pl) => (
                          <span key={pl} className="text-[10px] text-gray-600">{pl}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{p.desc}</p>
                <Link href={p.href} className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105" style={{ background: p.color, color: "#050505" }}>
                  {p.cta} <ChevronRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-1 items-center">
                <span className="text-3xl font-bold font-display" style={{ color: s.color }}>{s.value}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display mb-4">The Full Mission Stack</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Every tool an agentic developer needs — terminal, swarm, canvas, voice, AI chat, kanban — unified in one desktop runtime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-7 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${f.accent}60, transparent)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ background: `${f.accent}12`, border: `1px solid ${f.accent}20` }}>{f.icon}</div>
                <h3 className="text-base font-bold text-white mb-2 font-display">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────────── */}
      <section className="py-28 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-4">Simple Plans for Every Builder</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-display mb-4">Ship at the Speed of Thought</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">The agentic coding platform for every stage. Free forever with optional paid tiers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING.map((plan) => (
              <div key={plan.tier} className={`p-7 rounded-2xl border flex flex-col gap-5 ${plan.highlighted ? "border-[#4f8cff]/40 bg-[#4f8cff]/5 ring-1 ring-[#4f8cff]/20" : "border-white/8 bg-white/[0.02]"}`}>
                {plan.badge && (
                  <div className="text-[9px] font-bold px-2 py-1 rounded-full text-center w-fit" style={{ background: `${COBALT}20`, color: COBALT, border: `1px solid ${COBALT}30` }}>{plan.badge}</div>
                )}
                <div>
                  <p className="font-bold text-white font-display">{plan.tier}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-bold font-display text-white">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{plan.desc}</p>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <span className="flex-shrink-0 mt-0.5" style={{ color: TEAL }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`w-full py-3 rounded-full font-semibold text-sm text-center transition-all hover:opacity-90 ${plan.highlighted ? "" : "bg-white/6 border border-white/10 hover:bg-white/10"}`} style={plan.highlighted ? { background: COBALT, color: "#050505" } : {}}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/pricing" className="text-sm text-gray-500 hover:text-white transition-colors underline underline-offset-4">Compare all plans in detail →</Link>
          </div>
        </div>
      </section>

      {/* ── Security / Trust ─────────────────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={22} style={{ color: COBALT }} />, title: "Enterprise Security", desc: "RBAC, audit logs, encrypted secrets, 2FA, and bcrypt-hashed credentials. Built for compliance from day one." },
              { icon: <Globe size={22} style={{ color: TEAL }} />, title: "Cross-Platform", desc: "Single codebase. Native binaries for Windows (MSI/NSIS), macOS (DMG), and Linux (AppImage/DEB) via Tauri 2 + Rust." },
              { icon: <Zap size={22} style={{ color: AMBER }} />, title: "Open Core", desc: "MIT licensed desktop runtime. SloerSpace Dev is free forever. Pro features unlock advanced swarm capabilities." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-white/5 bg-white/[0.015]">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-white mb-2 font-display">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ───────────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center bottom, ${COBALT}08 0%, transparent 60%)` }} />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">
            Build the future.<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(90deg, ${COBALT}, ${TEAL})` }}>Ship today.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join builders who deploy AI agent swarms at the speed of thought. SloerStudio is free to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 rounded-full font-semibold text-sm transition-all hover:scale-105" style={{ background: COBALT, color: "#050505", boxShadow: `0 0 40px ${COBALT}30` }}>
              Get Started Free
            </Link>
            <Link href="/company/about" className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors text-white">
              About SloerStudio
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
