"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductMarketingShowcase from "@/components/video/ProductMarketingShowcase";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Target,
  Terminal,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

const TEAL = "#28e7c5";
const COBALT = "#4f8cff";
const AMBER = "#ffbf62";
const PINK = "#ff6f96";
const ease = [0.22, 1, 0.36, 1] as const;

const ROLES = [
  { name: "Builder", desc: "Implements features, writes production code, and pushes execution forward with delivery-focused context.", color: COBALT, icon: "⊡" },
  { name: "Reviewer", desc: "Validates outputs, checks quality, and enforces standards before the swarm compounds mistakes.", color: TEAL, icon: "◈" },
  { name: "Scout", desc: "Maps the codebase, traces dependencies, and gathers the context the rest of the swarm needs to move fast.", color: AMBER, icon: "🔭" },
  { name: "Coordinator", desc: "Sequences handoffs, manages directives, and keeps the mission coherent across multiple operators.", color: PINK, icon: "✦" },
];

const RULES = [
  "Agents run in isolated persistent PTY sessions",
  "CLI bootstrap command auto-resolved per agent",
  "Mission directives shared across all agents",
  "Working directory scoped per session",
  "Live progress visible in the swarm dashboard",
  "Real-time handoff flow visualization on canvas",
];

const STEPS = [
  { title: "Roster", desc: "Choose the operators and assign their role definitions.", accent: COBALT },
  { title: "Mission", desc: "Set the outcome, quality bar, and objectives for the swarm.", accent: TEAL },
  { title: "Directory", desc: "Scope each session to the correct workspace and context root.", accent: AMBER },
  { title: "Context", desc: "Pass constraints, notes, docs, and architecture signals to the team.", accent: PINK },
  { title: "Launch", desc: "Start the coordinated execution flow with live visibility.", accent: "#8b5cf6" },
];

const METRICS = [
  { label: "Coordination mode", value: "Multi-agent mission control" },
  { label: "Execution model", value: "Persistent PTY sessions" },
  { label: "Expansion fit", value: "Built on top of SloerSpace" },
  { label: "Plan layer", value: "Studio + Enterprise" },
];

const SURFACES = [
  {
    title: "Richer orchestration UX",
    desc: "The product should feel like a control tower: missions, agents, context, status, and handoffs all visible at once.",
    icon: Workflow,
    accent: COBALT,
  },
  {
    title: "Role-aware execution",
    desc: "Each agent exists for a reason. Roles shape prompts, behavior, focus, and collaboration patterns.",
    icon: Users,
    accent: TEAL,
  },
  {
    title: "Mission-first planning",
    desc: "The system should lead from shared goals and directives instead of random task spam or disconnected chat threads.",
    icon: Target,
    accent: AMBER,
  },
  {
    title: "Terminal-grounded runtime",
    desc: "Under the visual orchestration, the core remains real execution in persistent command surfaces, not fake simulation.",
    icon: Terminal,
    accent: PINK,
  },
];

const DASHBOARD_AGENTS = [
  { role: "Builder", cli: "Claude", color: "#e8956a", pct: 68 },
  { role: "Reviewer", cli: "Codex", color: "#10a37f", pct: 46 },
  { role: "Scout", cli: "Gemini", color: "#4285f4", pct: 28 },
  { role: "Coordinator", cli: "OpenCode", color: "#06b6d4", pct: 100 },
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

export default function SloerSwarmPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-16 md:pt-20">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }} className="mb-24 grid gap-10 lg:grid-cols-[0.94fr_1.06fr]">
          <div>
            <span className="sloer-pill inline-flex">SloerSwarm // Orchestration product</span>
            <h1 className="mt-7 font-display text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl xl:text-[5.5rem] xl:leading-[0.95]">
              Coordinate AI teams
              <span className="block bg-gradient-to-r from-white via-[#28e7c5] to-[#4f8cff] bg-clip-text text-transparent">like an operator, not a spectator.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-gray-300">
              SloerSwarm is the orchestration layer for multi-agent execution inside the SloerStudio ecosystem. Define the roster, frame the mission, pass the context, and launch persistent terminals that collaborate toward one outcome.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <MotionLink href="/signup?plan=studio">
                <span>Start Studio Trial</span>
                <ArrowRight size={16} />
              </MotionLink>
              <MotionLink href="/pricing" secondary>
                <span>See pricing</span>
                <ChevronRight size={16} />
              </MotionLink>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Mission-driven execution",
                "Role-aware operators",
                "Persistent PTY sessions",
              ].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {METRICS.map((metric) => (
                <div key={metric.label} className="sloer-panel rounded-2xl px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{metric.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, ease }}
              className="sloer-panel rounded-[34px] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.48)] md:p-5"
            >
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">Swarm dashboard</p>
                  <p className="mt-1 text-sm font-semibold text-white">Mission Alpha // 4 operators live</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28e7c5] shadow-[0_0_18px_rgba(40,231,197,0.8)]" />
                  Coordination synced
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
                <div className="rounded-[28px] border border-white/8 bg-[#07080d] p-4">
                  <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-gray-500">
                    <Users size={13} />
                    Live roster
                  </div>
                  <div className="space-y-3">
                    {DASHBOARD_AGENTS.map((agent) => (
                      <div key={agent.role} className="rounded-[24px] border border-white/8 bg-black/25 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-white">{agent.role}</p>
                            <p className="mt-1 font-mono text-[11px]" style={{ color: agent.color }}>{agent.cli}</p>
                          </div>
                          <span className="text-[11px] text-gray-500">{agent.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5">
                          <div className="h-full rounded-full" style={{ width: `${agent.pct}%`, background: agent.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Mission brief</p>
                    <p className="mt-4 text-lg font-semibold text-white">Ship the premium SloerStudio public layer</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">Coordinate product narrative, pricing, flagship UX, and scalable structure without losing execution speed.</p>
                  </div>
                  <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Why it matters</p>
                    <div className="mt-4 space-y-3">
                      {[
                        { title: "Multi-agent delivery", accent: COBALT },
                        { title: "Shared directives", accent: TEAL },
                        { title: "Visible execution", accent: AMBER },
                      ].map((item) => (
                        <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.accent, boxShadow: `0 0 18px ${item.accent}` }} />
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <ProductMarketingShowcase productId="sloerswarm" />

        {/* What is SloerSwarm? */}
        <div className="mb-24 grid items-start gap-6 lg:grid-cols-[0.98fr_1.02fr]">
          <div className="sloer-panel rounded-[34px] p-7 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">What it is</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white">The orchestration engine for the SloerStudio operator model.</h2>
            <p className="mt-5 text-sm leading-8 text-gray-400">
              SloerSwarm turns multi-agent building into a structured operational flow. You define the team, align the objective, scope the environment, pass the context, and launch a coordinated execution system that remains visible and controllable.
            </p>
            <p className="mt-4 text-sm leading-8 text-gray-400">
              Instead of isolated chats and disconnected tool windows, SloerSwarm moves toward a real control surface: one mission, many operators, persistent execution, and clearer handoffs inside the product shell.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {SURFACES.map((surface) => (
              <motion.div key={surface.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${surface.accent}16`, borderColor: `${surface.accent}30`, color: surface.accent }}>
                  <surface.icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-white">{surface.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-400">{surface.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <div className="mb-12 text-center">
            <span className="sloer-pill inline-flex">Launch sequence</span>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Five steps from intent to live swarm.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">The product works best when orchestration is structured. The flow below keeps the experience legible even as complexity rises.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {STEPS.map((step, index) => (
              <motion.div key={step.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[28px] p-5 text-center">
                <div className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold" style={{ background: `${step.accent}16`, borderColor: `${step.accent}30`, color: step.accent }}>
                  {index + 1}
                </div>
                <p className="font-display text-lg font-semibold text-white">{step.title}</p>
                <p className="mt-3 text-sm leading-7 text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Agent Roles */}
        <div className="mb-24">
          <div className="mb-12 text-center">
            <span className="sloer-pill inline-flex">Operator roles</span>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Every agent should have a clear reason to exist.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">Role design is what separates useful orchestration from noisy concurrency. These roles shape focus, handoffs, and output quality.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {ROLES.map((role) => (
              <motion.div key={role.name} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel flex items-start gap-4 rounded-[30px] p-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border text-lg" style={{ background: `${role.color}16`, borderColor: `${role.color}30`, color: role.color }}>
                  {role.icon}
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-white">{role.name}</p>
                  <p className="mt-3 text-sm leading-7 text-gray-400">{role.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="mb-24 rounded-[36px] border border-white/8 bg-white/[0.02] p-8 md:p-10">
          <div className="mb-8 text-center">
            <span className="sloer-pill inline-flex">Swarm discipline</span>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">Rules that keep the swarm shipping instead of drifting.</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {RULES.map((rule) => (
              <div key={rule} className="sloer-panel rounded-[28px] px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#28e7c5]/12 text-[#28e7c5]">
                    <Zap size={13} />
                  </div>
                  <p className="text-sm leading-7 text-gray-300">{rule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] p-8 text-center md:p-14">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(40,231,197,0.16),transparent_58%)]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">Start your first coordinated mission.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">SloerSwarm belongs inside the premium SloerStudio layer: bigger missions, clearer handoffs, and execution that feels orchestrated instead of chaotic.</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <MotionLink href="/signup?plan=studio">
                <span>Start free trial</span>
                <ArrowRight size={16} />
              </MotionLink>
              <MotionLink href="/products/sloerspace" secondary>
                <span>See the flagship workspace</span>
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
