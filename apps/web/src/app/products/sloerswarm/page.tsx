import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Users, ChevronRight, Bot, Target, Terminal, Zap } from "lucide-react";

const TEAL = "#28e7c5";

const ROLES = [
  { name: "Builder", desc: "Implements features, writes production code, scaffolds architecture.", color: "#4f8cff", icon: "⊡" },
  { name: "Reviewer", desc: "Reviews PRs, validates output quality, enforces coding standards.", color: "#28e7c5", icon: "◈" },
  { name: "Scout", desc: "Deep-dives into unfamiliar codebases, traces data flow, maps dependencies.", color: "#ffbf62", icon: "🔭" },
  { name: "Coordinator", desc: "Manages agent handoffs, sequences tasks, ensures mission alignment.", color: "#ff6f96", icon: "✦" },
];

const RULES = [
  "Agents run in isolated persistent PTY sessions",
  "CLI bootstrap command auto-resolved per agent",
  "Mission directives shared across all agents",
  "Working directory scoped per session",
  "Live progress visible in the swarm dashboard",
  "Real-time handoff flow visualization on canvas",
];

export default function SloerSwarmPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold mb-6 border" style={{ color: TEAL, borderColor: `${TEAL}30`, background: `${TEAL}10` }}>
            ⟐ SloerSwarm · NEW
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-6">
            Multi-Agent<br />
            <span style={{ color: TEAL }}>Coding Swarm.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            SloerSwarm lets you deploy a fleet of specialized AI agents on a shared mission. Each agent runs its own persistent terminal session with a resolved CLI, full mission context, and real-time coordination.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup?plan=STUDIO" className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm hover:scale-105 transition-all" style={{ background: TEAL, color: "#050505" }}>
              Start Free Trial <ChevronRight size={14} />
            </Link>
            <Link href="/pricing" className="flex items-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors text-white">
              See Pricing
            </Link>
          </div>
        </div>

        {/* What is SloerSwarm? */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 items-center">
          <div>
            <h2 className="text-3xl font-bold font-display mb-4">What Is SloerSwarm?</h2>
            <p className="text-gray-400 leading-relaxed mb-5">
              SloerSwarm is a multi-agent orchestration engine built into SloerSpace Dev. You configure a roster of AI agents with defined roles, assign a mission with directives and context notes, and launch. Each agent runs in its own PTY session with a resolved CLI bootstrap command.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Watch your agents collaborate in real time on the swarm dashboard canvas — with animated handoff flows, progress bars, terminal targeting, and a live operator composer.
            </p>
          </div>
          {/* Mock swarm dashboard */}
          <div className="rounded-2xl border border-white/10 bg-[#07080d] shadow-2xl overflow-hidden">
            <div className="h-9 border-b border-white/8 bg-white/[0.03] flex items-center px-4">
              <span className="mx-auto text-[10px] text-gray-500 font-mono">SloerSwarm · Mission Alpha · 4 agents</span>
            </div>
            <div className="p-4 space-y-2.5">
              {[
                { role: "Builder", cli: "Claude", color: "#e8956a", pct: 65 },
                { role: "Reviewer", cli: "Codex", color: "#10a37f", pct: 45 },
                { role: "Scout", cli: "Gemini", color: "#4285f4", pct: 20 },
                { role: "Coord", cli: "OpenCode", color: "#06b6d4", pct: 100 },
              ].map((a) => (
                <div key={a.role} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div className="w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center" style={{ background: `${a.color}20`, color: a.color }}>{a.role[0]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-white">{a.role}</span>
                      <span className="text-[10px] font-mono" style={{ color: a.color }}>{a.cli}</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/5">
                      <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.color }} />
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500">{a.pct}%</span>
                </div>
              ))}
              <div className="flex items-center gap-2 pt-1 text-xs text-gray-600 border-t border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Mission active · persistent PTY
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold font-display text-center mb-4">How SloerSwarm Works</h2>
          <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto">5 steps from roster to live swarm. Each step gives you full control over your agent fleet.</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {["Roster", "Mission", "Directory", "Context", "Launch"].map((step, i) => (
              <div key={step} className="p-5 rounded-2xl border border-white/8 bg-white/[0.02] text-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3" style={{ background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}25` }}>{i + 1}</div>
                <p className="text-xs font-semibold text-white font-display">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Roles */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold font-display text-center mb-4">SloerSwarm Agent Roles</h2>
          <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto">Each agent in your swarm is assigned a specialized role that shapes its system prompt, focus area, and behavior.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROLES.map((r) => (
              <div key={r.name} className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: `${r.color}15`, border: `1px solid ${r.color}25`, color: r.color }}>{r.icon}</div>
                <div>
                  <p className="font-bold text-white font-display">{r.name}</p>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="mb-20 p-8 rounded-2xl border border-white/8 bg-white/[0.01]">
          <h2 className="text-2xl font-bold font-display text-center mb-8">SloerSwarm Rules That Keep Agents Shipping</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RULES.map((r) => (
              <div key={r} className="flex items-center gap-3 text-sm text-gray-300">
                <span style={{ color: TEAL }} className="flex-shrink-0">✓</span>{r}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-12 rounded-2xl border border-white/8" style={{ background: `linear-gradient(135deg, ${TEAL}08, transparent)` }}>
          <h2 className="text-3xl font-bold font-display mb-3">Start your first SloerSwarm</h2>
          <p className="text-gray-400 mb-8">Requires SloerStudio Studio or Enterprise plan.</p>
          <Link href="/signup?plan=STUDIO" className="inline-flex px-8 py-3.5 rounded-full font-semibold text-sm hover:scale-105 transition-all" style={{ background: TEAL, color: "#050505" }}>
            Start Free Trial
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
