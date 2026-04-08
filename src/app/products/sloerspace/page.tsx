"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductMarketingShowcase from "@/components/video/ProductMarketingShowcase";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ChevronRight,
  Command,
  Layers,
  Monitor,
  Network,
  Shield,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";
const PINK = "#ff6f96";
const ease = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  { icon: Terminal, title: "Persistent PTY runtime", desc: "Real PTY sessions via portable-pty + xterm.js with ordered streaming, interactive input, resize support, safe cancellation, and a Rust-backed desktop execution loop.", color: COBALT },
  { icon: Layers, title: "1 to 16-pane launch layouts", desc: "Workspace launch supports single terminals plus 2, 4, 6, 8, 10, 12, 14, and 16-session grids, then live vertical or horizontal splits once the workspace is running.", color: TEAL },
  { icon: Activity, title: "Live session timelines", desc: "Each pane tracks create, cwd, start, finish, cancel, error, close, and live activity events so the runtime stays observable instead of opaque.", color: AMBER },
  { icon: Workflow, title: "Workspace wizard + presets", desc: "Pick a working directory, assign agent CLIs, add custom bootstrap commands, and save reusable launch presets before the first command even runs.", color: PINK },
  { icon: Zap, title: "16 built-in themes + custom mode", desc: "SloerSpace ships with its own signature theme plus GitHub, Catppuccin, Rose Pine, Nord, Dracula, OLED, Synthwave, light modes, and custom theme authoring.", color: "#a855f7" },
  { icon: ChevronRight, title: "Command palette + utility jumps", desc: "Ctrl/Cmd + K can launch commands, snippets, and workspace actions while jumping across browser, notebook, SSH, history, preview, ports, and more.", color: "#84cc16" },
];

const SYSTEM_CARDS = [
  { title: "Runtime model", value: "Rust-backed persistent PTY", accent: COBALT },
  { title: "Launch scale", value: "1 to 16 terminal sessions", accent: TEAL },
  { title: "Platform", value: "Windows · macOS · Linux", accent: AMBER },
  { title: "Surface depth", value: "Browser, notebook, SSH, history", accent: PINK },
];

const OPERATING_LAYERS = [
  {
    title: "Mission control UX",
    desc: "SloerSpace should feel like the place where serious work actually happens: terminals, agents, commands, context, activity, and launch control in one shell.",
    icon: Workflow,
    accent: COBALT,
  },
  {
    title: "Launchpad intelligence",
    desc: "The workspace wizard, presets, directory browsing, and agent assignment system make the first launch intentional instead of manual or repetitive.",
    icon: Command,
    accent: TEAL,
  },
  {
    title: "Integrated desktop depth",
    desc: "Browser, editor, notebook, SSH, preview, session sharing, history, codebase, system monitor, and port tooling already live in the same shell.",
    icon: Network,
    accent: AMBER,
  },
  {
    title: "Trust and observability",
    desc: "A flagship workspace should communicate reliability through session history, live activity, shell identity, system visibility, and operational confidence.",
    icon: Shield,
    accent: PINK,
  },
];

const SPACE_SIGNAL_GRID = [
  { label: "Layouts", value: "1–16 live sessions", accent: COBALT },
  { label: "Operators", value: "Claude to custom CLI", accent: TEAL },
  { label: "Utilities", value: "Browser · notebook · SSH", accent: AMBER },
  { label: "Theme vault", value: "16 built-ins + custom", accent: PINK },
];

const SPACE_OPERATING_ZONES = [
  {
    title: "Launchpad setup",
    desc: "Working directory selection, layout glyphs, preset creation, agent slot assignment, and bootstrap commands make the first run feel intentional and premium.",
    accent: COBALT,
  },
  {
    title: "Persistent shell execution",
    desc: "PTY timelines, ordered streaming, quick splits, broadcast patterns, and pane identity keep the shell trustworthy under real workload pressure.",
    accent: TEAL,
  },
  {
    title: "Desktop-wide operations",
    desc: "Browser, editor, notebook, session history, preview, codebase, ports, SSH, and system monitor prove the workspace is already more than a terminal frame.",
    accent: AMBER,
  },
];

const BUILD_FLOW = [
  { title: "Choose directory + layout", desc: "Start with the workspace launchpad, select a project path, and decide whether you need 1, 4, 8, 12, or 16 live sessions.", accent: COBALT },
  { title: "Assign operators", desc: "Route Claude, Codex, Gemini, OpenCode, Cursor, Droid, Copilot, or a custom command into the slots that matter.", accent: TEAL },
  { title: "Run the shell", desc: "Operate through persistent PTY panes, quick splits, command snippets, starred commands, and sequence-safe live streaming.", accent: AMBER },
  { title: "Expand the surface", desc: "Move into browser, notebook, SSH, preview, history, codebase, and system tooling without leaving the flagship shell.", accent: PINK },
];

const PLATFORM_MODULES = [
  {
    title: "Workspace wizard + presets",
    desc: "Guided launch flow with folder browsing, layouts from 1 to 16 sessions, reusable presets, and custom bootstrap commands.",
    icon: Sparkles,
    accent: COBALT,
  },
  {
    title: "Command palette + shortcuts",
    desc: "Ctrl/Cmd + K and the shortcut grid navigate terminals, swarms, agents, prompts, browser, notebook, SSH, env vars, preview, history, ports, and snippets.",
    icon: Command,
    accent: TEAL,
  },
  {
    title: "Integrated utility surfaces",
    desc: "Browser, code editor, notebook, file preview, command history, codebase, port manager, and system monitor all live inside the same desktop shell.",
    icon: Monitor,
    accent: AMBER,
  },
  {
    title: "AI + voice-ready settings",
    desc: "Settings already cover default coding agents, OpenAI, Anthropic, Google, Ollama, API keys, CLI install, notifications, data export, and SiulkVoice controls.",
    icon: Shield,
    accent: PINK,
  },
];

const TERMINAL_PANES = [
  { prompt: "~/workspace", cmd: "npm run dev", out: "▲ Next.js ready on :3000", color: COBALT },
  { prompt: "~/workspace", cmd: "claude --dangerously-skip-permissions", out: "✦ Claude CLI ready", color: "#e8956a" },
  { prompt: "~/workspace", cmd: "git log --oneline -5", out: "a1b2c3d feat: add ecosystem launch", color: TEAL },
  { prompt: "~/workspace", cmd: "cargo build --release", out: "Compiling sloerspace v1.0.0", color: AMBER },
];

function MotionLink({ href, children, secondary = false, className = "" }: { href: string; children: ReactNode; secondary?: boolean; className?: string }) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.985 }} className={className}>
      <Link href={href} className={secondary ? "sloer-button-secondary" : "sloer-button-primary"}>
        {children}
      </Link>
    </motion.div>
  );
}

function LayerCard({ title, desc, icon: Icon, accent }: { title: string; desc: string; icon: LucideIcon; accent: string }) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${accent}16`, borderColor: `${accent}30`, color: accent }}>
        <Icon size={20} />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-gray-400">{desc}</p>
    </motion.div>
  );
}

function WorkspacePreview() {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8, ease }}
        className="sloer-panel relative rounded-[34px] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.48)] md:p-5"
      >
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">SloerSpace command center</p>
            <p className="mt-1 text-sm font-semibold text-white">Flagship workspace shell</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="h-2.5 w-2.5 rounded-full bg-[#28e7c5] shadow-[0_0_18px_rgba(40,231,197,0.8)]" />
            Runtime live
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-white/8 bg-[#07080d] p-4">
            <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-gray-500">
              <Terminal size={13} />
              Workspace panes
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TERMINAL_PANES.map((pane) => (
                <div key={pane.cmd} className="rounded-[24px] border border-white/8 bg-black/25 p-4">
                  <p className="font-mono text-[11px]" style={{ color: pane.color }}>{pane.prompt} $ {pane.cmd}</p>
                  <p className="mt-2 font-mono text-[11px] text-gray-500">{pane.out}</p>
                  <span className="mt-3 inline-block h-3 w-1.5 animate-pulse bg-white/60" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {SYSTEM_CARDS.map((card) => (
                <div key={card.title} className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{card.title}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{card.value}</p>
                  <span className="mt-4 block h-1.5 w-14 rounded-full" style={{ background: card.accent }} />
                </div>
              ))}
            </div>
            <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Why SloerSpace matters</p>
                <span className="rounded-full border border-[#4f8cff]/25 bg-[#4f8cff]/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#4f8cff]">Flagship</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: "Execution core", desc: "Where builders actually ship.", accent: COBALT },
                  { title: "Expansion anchor", desc: "Where the ecosystem plugs in.", accent: TEAL },
                  { title: "Premium shell", desc: "Where brand meets product depth.", accent: AMBER },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.accent, boxShadow: `0 0 18px ${item.accent}` }} />
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="sloer-panel absolute -top-8 right-6 hidden rounded-3xl px-5 py-4 lg:block"
      >
        <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Operating mode</p>
        <p className="mt-2 text-sm font-semibold text-white">Persistent terminals + premium command shell</p>
      </motion.div>
    </div>
  );
}

export default function SloerSpacePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-16 md:pt-20">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }} className="mb-24 grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <span className="sloer-pill inline-flex">SloerSpace // Flagship product</span>
            <h1 className="mt-7 font-display text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl xl:text-[5.6rem] xl:leading-[0.95]">
              The flagship
              <span className="block bg-gradient-to-r from-white via-[#4f8cff] to-[#28e7c5] bg-clip-text text-transparent">agentic workspace.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-gray-300">
              SloerSpace is the cross-platform command surface for SloerStudio: real Rust-backed PTY terminals, guided workspace launch, command intelligence, integrated desktop utilities, and the flagship shell the rest of the ecosystem expands around.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <MotionLink href="/signup">
                <span>Download for Windows</span>
                <ArrowRight size={16} />
              </MotionLink>
              <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.985 }}>
                <Link href="https://github.com/norldlord34-debug/SLOERSPACE-DEV" target="_blank" rel="noreferrer" className="sloer-button-secondary">
                  View on GitHub
                </Link>
              </motion.div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Windows · macOS · Linux",
                "1–16 session launch layouts",
                "Browser · notebook · SSH utilities",
              ].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {SYSTEM_CARDS.map((metric) => (
                <div key={metric.title} className="sloer-panel rounded-2xl px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{metric.title}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:pl-4">
            <WorkspacePreview />
          </div>
        </motion.div>

        <ProductMarketingShowcase productId="sloerspace" />

        {/* Features */}
        <div className="mb-24">
          <div className="mb-12 text-center">
            <span className="sloer-pill inline-flex">Flagship capabilities</span>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Built different because it has to anchor the whole system.</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-gray-400 md:text-lg">SloerSpace is not just a terminal wrapper. It is the main product identity that future surfaces, plans, admin controls, docs, and growth loops will orbit around.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((feature) => (
              <motion.div key={feature.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${feature.color}16`, borderColor: `${feature.color}30` }}>
                  <feature.icon size={20} style={{ color: feature.color }} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="sloer-panel rounded-[34px] p-7 md:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Operating flow</p>
                  <h3 className="mt-3 font-display text-3xl font-bold text-white">How SloerSpace becomes the center of gravity</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4f8cff]/30 bg-[#4f8cff]/12 text-[#4f8cff]">
                  <Sparkles size={20} />
                </div>
              </div>
              <div className="mt-8 space-y-4">
                {BUILD_FLOW.map((step, index) => (
                  <div key={step.title} className="rounded-[26px] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white">{index + 1}</div>
                      <p className="text-base font-semibold text-white">{step.title}</p>
                    </div>
                    <p className="mt-2 pl-11 text-sm leading-7 text-gray-400">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {OPERATING_LAYERS.map((layer) => (
                <LayerCard key={layer.title} {...layer} />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-24 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div whileHover={{ y: -6 }} className="relative overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] p-7 md:p-8">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(79,140,255,0.18),transparent_42%)]" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#28e7c5]/10 blur-[100px]" />
            <div className="relative z-10">
              <span className="sloer-pill inline-flex">Showcase layer</span>
              <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">See the flagship shell as a product, not just a terminal.</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-gray-400 md:text-lg">The reference pushes a central visual proof-point: a large brand billboard, dense control surfaces, and evidence that the shell already supports real launch, runtime, and operations depth.</p>

              <div className="mt-8 rounded-[30px] border border-white/8 bg-black/25 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Workspace billboard</p>
                    <p className="mt-2 text-sm font-semibold text-white">SloerSpace // Cross-platform command shell</p>
                  </div>
                  <span className="rounded-full border border-[#4f8cff]/30 bg-[#4f8cff]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4f8cff]">Flagship</span>
                </div>
                <div className="mt-8 rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(79,140,255,0.18),rgba(7,8,13,0.94)_62%)] px-6 py-8">
                  <div className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#4f8cff]/30 bg-[#4f8cff]/12 text-[#4f8cff]">
                          <Terminal size={24} />
                        </div>
                        <div>
                          <p className="font-display text-3xl font-bold text-white">SloerSpace</p>
                          <p className="mt-1 text-sm text-gray-300">Real PTY runtime, utility jumps, and coordinated execution depth.</p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-3 font-mono text-[12px]">
                        {[
                          "$ workspace launch --layout 8 --preset ship-fast",
                          "$ claude --model sonnet --project ./web",
                          "$ browser open localhost:3000 && notebook open",
                        ].map((line, index) => (
                          <div key={line} className="rounded-2xl border border-white/8 bg-black/35 px-3 py-2.5" style={{ color: index === 0 ? COBALT : index === 1 ? TEAL : AMBER }}>
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        { label: "Palette", value: "Ctrl/Cmd + K", accent: COBALT },
                        { label: "Split mode", value: "Vertical + horizontal", accent: TEAL },
                        { label: "History", value: "Persistent session trail", accent: AMBER },
                        { label: "Surface", value: "Browser / SSH / Preview", accent: PINK },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
                          <p className="mt-3 text-sm font-semibold text-white">{item.value}</p>
                          <span className="mt-3 block h-1.5 w-12 rounded-full" style={{ background: item.accent }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                {SPACE_SIGNAL_GRID.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
                    <p className="mt-3 text-sm font-semibold text-white">{item.value}</p>
                    <span className="mt-3 block h-1.5 w-14 rounded-full" style={{ background: item.accent }} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5">
            {SPACE_OPERATING_ZONES.map((item) => (
              <motion.div key={item.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-7">
                <div className="h-1.5 w-14 rounded-full" style={{ background: item.accent }} />
                <h3 className="mt-5 font-display text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-8 text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <div className="mb-12 text-center">
            <span className="sloer-pill inline-flex">Desktop depth</span>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">The shell is already broader than terminals alone.</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-gray-400 md:text-lg">What makes SloerSpace interesting is not just the PTY layer. It is the fact that launch flows, AI configuration, utility views, and system-grade navigation already compound inside the same desktop product.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {PLATFORM_MODULES.map((module) => (
              <LayerCard key={module.title} {...module} />
            ))}
          </div>
        </div>

        {/* Pricing preview */}
        <div className="relative overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] p-8 text-center md:p-14">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(79,140,255,0.18),transparent_58%)]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Open source foundation · flagship surface</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">Free at the core. Premium as the ecosystem expands.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">SloerSpace gives you the core flagship experience. As SloerStudio grows, pricing layers unlock orchestration, deeper control, enterprise surfaces, and the wider platform system around it.</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <MotionLink href="/signup">
                <span>Download free</span>
                <ArrowRight size={16} />
              </MotionLink>
              <MotionLink href="/pricing" secondary>
                <span>See platform pricing</span>
                <ChevronRight size={16} />
              </MotionLink>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
