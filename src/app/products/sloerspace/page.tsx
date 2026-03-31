import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Terminal, Zap, ChevronRight, Monitor, Layers, Activity } from "lucide-react";

const COBALT = "#4f8cff";

const FEATURES = [
  { icon: Terminal, title: "Persistent PTY Terminal", desc: "Real PTY sessions via portable-pty + xterm.js. Multi-pane layouts up to 4×4, session timelines, and live sequence-ordered streaming.", color: COBALT },
  { icon: Layers, title: "Multi-Pane Layouts", desc: "1×1 to 4×4 terminal grid. Each pane is an independent session with its own CWD, command history, and agent assignment.", color: "#28e7c5" },
  { icon: Activity, title: "Live PTY Streaming", desc: "Ordered chunk delivery via Tauri events. Interactive input, PTY resize, and real-time output with sequence hardening.", color: "#ffbf62" },
  { icon: Monitor, title: "Session Timelines", desc: "Every pane tracks its full session lifecycle — create, cwd, start, finish, cancel, error, close. Full audit in the sidebar.", color: "#ff6f96" },
  { icon: Zap, title: "15 Built-in Themes", desc: "SloerSpace, GitHub Dark, Catppuccin Mocha, Rose Pine, Dracula, Nord, OLED Black, Synthwave, and 7 more.", color: "#a855f7" },
  { icon: ChevronRight, title: "Command Palette", desc: "Ctrl+K command launcher with starred commands, snippets, AI commands, and workspace-aware recommended actions.", color: "#84cc16" },
];

export default function SloerSpacePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        {/* Hero */}
        <div className="flex flex-col md:flex-row items-start gap-12 mb-20">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold mb-6 border" style={{ color: COBALT, borderColor: `${COBALT}30`, background: `${COBALT}10` }}>
              ⊡ SloerSpace Dev
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-6">
              Agentic<br />
              <span style={{ color: COBALT }}>Development</span><br />
              Environment.
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-xl">
              SloerSpace is the cross-platform desktop IDE built with Tauri 2 + Rust. Multi-pane persistent PTY terminals, agent swarm orchestration, SiulkVoice on-device dictation, and a 15-theme experience.
            </p>
            <div className="flex gap-4">
              <Link href="/signup" className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105" style={{ background: COBALT, color: "#050505" }}>
                Download for Windows <ChevronRight size={14} />
              </Link>
              <Link href="https://github.com/norldlord34-debug/SLOERSPACE-DEV" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors text-white">
                View on GitHub
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-600">Windows · macOS · Linux · MIT License</p>
          </div>
          {/* Mock terminal UI */}
          <div className="w-full md:w-[480px] rounded-2xl border border-white/10 bg-[#07080d] shadow-2xl overflow-hidden flex-shrink-0">
            <div className="h-9 border-b border-white/8 bg-white/[0.03] flex items-center px-4 gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 border border-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/40 border border-green-500/60" />
              <span className="mx-auto text-[10px] text-gray-600 font-mono">SloerSpace — 4 panes</span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-white/5 p-px">
              {[
                { prompt: "~/project", cmd: "npm run dev", out: "▲ Next.js ready on :3000", color: COBALT },
                { prompt: "~/project", cmd: "claude --dangerously-skip-permissions", out: "✦ Claude CLI ready", color: "#e8956a" },
                { prompt: "~/project", cmd: "git log --oneline -5", out: "a1b2c3d feat: add swarm", color: "#28e7c5" },
                { prompt: "~/project", cmd: "cargo build --release", out: "Compiling sloerspace v1.0.0", color: "#ffbf62" },
              ].map((pane, i) => (
                <div key={i} className="bg-[#07080d] p-3 min-h-[100px]">
                  <p className="text-[10px] font-mono" style={{ color: pane.color }}>{pane.prompt} $ {pane.cmd}</p>
                  <p className="text-[10px] text-gray-500 font-mono mt-1">{pane.out}</p>
                  <span className="inline-block w-1.5 h-3 bg-white/60 animate-pulse mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <h2 className="text-3xl font-bold font-display text-center mb-12">Built Different</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${f.color}12`, border: `1px solid ${f.color}20` }}>
                <f.icon size={18} style={{ color: f.color }} />
              </div>
              <h3 className="font-bold text-white mb-2 font-display">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing preview */}
        <div className="text-center p-12 rounded-2xl border border-white/8 bg-white/[0.01] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${COBALT}08 0%, transparent 60%)` }} />
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Open Source · MIT License</p>
          <h2 className="text-3xl font-bold font-display mb-3 relative z-10">Free Forever.</h2>
          <p className="text-gray-400 mb-8 relative z-10">SloerSpace Dev is free and open source. No subscriptions required for the core IDE.</p>
          <Link href="/signup" className="inline-flex px-8 py-3.5 rounded-full font-semibold text-sm relative z-10 hover:scale-105 transition-all" style={{ background: COBALT, color: "#050505" }}>
            Download Free
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
