"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  ChevronRight,
  Command,
  CreditCard,
  FileText,
  FolderOpen,
  KanbanSquare,
  Mic,
  Rocket,
  Shield,
  Sparkles,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;
const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";
const PINK = "#ff6f96";

type DashboardExperienceProps = {
  firstName: string;
  plan: string;
  role?: string;
};

const AGENT_LIBRARY = [
  { name: "SloerSecurity", desc: "Audits code for vulnerabilities, hardens architecture.", color: PINK },
  { name: "SloerShipper", desc: "Turns ideas into production-ready code and faster shipping loops.", color: COBALT },
  { name: "SloerScout", desc: "Maps unfamiliar codebases and reveals architecture fast.", color: TEAL },
  { name: "SloerQA", desc: "Generates stronger test layers and review pressure.", color: AMBER },
];

const PROMPT_LIBRARY = [
  { name: "Ship This Feature", desc: "Turn product direction into structured implementation momentum." },
  { name: "Recon This Codebase", desc: "Map architecture, data flow, and dependencies before moving." },
  { name: "Generate Tests", desc: "Produce a stronger safety layer for new code." },
  { name: "Perform Code Review", desc: "Apply stricter senior review logic before merge." },
];

const SKILL_LIBRARY = [
  { name: "SloerBlueprint", desc: "Convert a vague request into a plan that can actually ship." },
  { name: "SloerRecon", desc: "Deep map any unfamiliar repository or module." },
  { name: "SloerAPI", desc: "Create cleaner REST design and integration structure." },
  { name: "SloerReact", desc: "Improve component performance and UI architecture." },
];

const PRODUCT_RAIL = [
  {
    title: "SloerSpace",
    desc: "Multi-terminal runtime, launch control, and flagship execution depth.",
    href: "/products/sloerspace",
    cta: "Open flagship",
    accent: COBALT,
    icon: Command,
  },
  {
    title: "SloerVoice",
    desc: "Privacy-first voice coding with local inference and workflow recovery.",
    href: "/products/sloervoice",
    cta: "Open voice layer",
    accent: "#9b7cff",
    icon: Mic,
  },
] as const;

function SurfaceCard({
  title,
  desc,
  href,
  cta,
  tag,
  accent,
  icon: Icon,
}: {
  title: string;
  desc: string;
  href: string;
  cta: string;
  tag: string;
  accent: string;
  icon: LucideIcon;
}) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${accent}16`, borderColor: `${accent}30`, color: accent }}>
          <Icon size={20} />
        </div>
        <span className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: accent, borderColor: `${accent}35`, background: `${accent}12` }}>
          {tag}
        </span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-gray-400">{desc}</p>
      <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#4f8cff]">
        {cta}
        <ArrowRight size={15} />
      </Link>
    </motion.div>
  );
}

function MetricCard({ label, value, sub, accent, icon: Icon }: { label: string; value: string | number; sub: string; accent: string; icon: LucideIcon }) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.01 }} className="sloer-panel rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl border" style={{ background: `${accent}16`, borderColor: `${accent}30`, color: accent }}>
          <Icon size={15} />
        </div>
      </div>
      <p className="mt-4 font-display text-4xl font-bold" style={{ color: accent }}>{value}</p>
      <p className="mt-2 text-xs leading-6 text-gray-500">{sub}</p>
    </motion.div>
  );
}

function LibraryPanel({
  title,
  href,
  items,
  accent,
  icon: Icon,
}: {
  title: string;
  href: string;
  items: { name: string; desc: string; color?: string }[];
  accent: string;
  icon: LucideIcon;
}) {
  return (
    <div className="sloer-panel rounded-[30px] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border" style={{ background: `${accent}16`, borderColor: `${accent}30`, color: accent }}>
            <Icon size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            <p className="text-[11px] text-gray-500">Curated for faster execution.</p>
          </div>
        </div>
        <Link href={href} className="inline-flex items-center gap-1 text-xs text-[#4f8cff] transition-colors hover:text-white">
          View all <ChevronRight size={13} />
        </Link>
      </div>
      <div className="space-y-3">
        {items.slice(0, 3).map((item) => (
          <div key={item.name} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-3.5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03]" style={{ color: item.color ?? accent }}>
                <Sparkles size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="mt-1 text-[11px] leading-6 text-gray-500">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardExperience({ firstName, plan, role }: DashboardExperienceProps) {
  const normalizedPlan = plan.toUpperCase();
  const planAccent = normalizedPlan === "ENTERPRISE" ? TEAL : normalizedPlan === "STUDIO" ? COBALT : AMBER;
  const planLabel = normalizedPlan === "ENTERPRISE" ? "Enterprise" : normalizedPlan === "STUDIO" ? "Studio" : "Launch";
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN" || role === "admin";
  const upgradeHref = normalizedPlan === "FREE" ? "/pricing" : isAdmin ? "/admin" : "/app/agents";
  const upgradeLabel = normalizedPlan === "FREE" ? "Explore Studio" : isAdmin ? "Open control plane" : "Open agent library";

  return (
    <div className="p-6 md:p-8 xl:p-10">
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
        {/* Header */}
        <div className="mb-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="sloer-pill inline-flex">Workspace // Dashboard</span>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-300">Agentic workspace ready</span>
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl xl:text-[4.75rem] xl:leading-[0.96]">
              Welcome back,
              <span className="block bg-gradient-to-r from-white via-[#4f8cff] to-[#28e7c5] bg-clip-text text-transparent">{firstName}.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-gray-300">
              This is your operating surface for projects, prompts, agents, and execution flow. The experience should feel continuous with the public brand while becoming more focused, more powerful, and more actionable.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/app/projects/new" className="sloer-button-primary">
                <span>New project</span>
                <ArrowRight size={16} />
              </Link>
              <Link href={upgradeHref} className="sloer-button-secondary">
                <span>{upgradeLabel}</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
          <div className="sloer-panel rounded-[34px] p-5 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-white/8 bg-black/20 p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Access layer</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="font-display text-3xl font-bold text-white">{planLabel}</p>
                  <span className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: planAccent, borderColor: `${planAccent}35`, background: `${planAccent}12` }}>
                    {normalizedPlan}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-gray-400">{normalizedPlan === "FREE" ? "Best for entering the ecosystem and discovering the flagship workspace." : normalizedPlan === "STUDIO" ? "Built for active operator workflows and stronger execution depth." : "Company-level access for broader control, governance, and scale."}</p>
              </div>
              <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Current route</p>
                <p className="mt-4 font-display text-2xl font-bold text-white">Command center</p>
                <p className="mt-3 text-sm leading-7 text-gray-400">Projects, libraries, prompts, kanban, and premium workspace surfaces are all one click from here.</p>
              </div>
            </div>
            <div className="mt-4 rounded-[28px] border border-white/8 bg-black/20 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">Recommended next move</p>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-gray-300">Actionable</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { title: "Start project", desc: "Open a new build stream.", accent: COBALT },
                  { title: "Load agents", desc: "Assemble your library layer.", accent: TEAL },
                  { title: "Plan execution", desc: "Move through kanban and prompts.", accent: AMBER },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                    <span className="block h-1.5 w-12 rounded-full" style={{ background: item.accent }} />
                    <p className="mt-4 text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-xs leading-6 text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10 grid gap-5 xl:grid-cols-2">
          {PRODUCT_RAIL.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div key={item.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${item.accent}16`, borderColor: `${item.accent}30`, color: item.accent }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-display text-2xl font-bold text-white">{item.title}</p>
                      <p className="mt-2 max-w-xl text-sm leading-7 text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                  <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: item.accent, borderColor: `${item.accent}35`, background: `${item.accent}12` }}>
                    Live product
                  </span>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/8 bg-black/20 px-4 py-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">Surface signal</p>
                    <p className="mt-2 text-sm font-semibold text-white">{item.title === "SloerSpace" ? "Runtime + orchestration" : "Voice + local inference"}</p>
                  </div>
                  <Link href={item.href} className="sloer-button-primary" style={{ background: item.accent, color: "#050505" }}>
                    <span>{item.cta}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Product cards */}
        <div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Projects",
              desc: "Create and run delivery streams from one premium workspace shell.",
              href: "/app/projects",
              cta: "Open projects",
              tag: "Build",
              accent: COBALT,
              icon: FolderOpen,
            },
            {
              title: "Agents",
              desc: "Load specialized operators for security, shipping, testing, and research.",
              href: "/app/agents",
              cta: "Open agents",
              tag: "Library",
              accent: TEAL,
              icon: Bot,
            },
            {
              title: "Prompts",
              desc: "Launch repeatable execution flows with sharper prompt systems.",
              href: "/app/prompts",
              cta: "Open prompts",
              tag: "System",
              accent: AMBER,
              icon: FileText,
            },
            {
              title: "Kanban",
              desc: "Move work through clear stages instead of losing momentum in chaos.",
              href: "/app/kanban",
              cta: "Open kanban",
              tag: "Flow",
              accent: PINK,
              icon: KanbanSquare,
            },
          ].map((item) => (
            <SurfaceCard key={item.title} {...item} />
          ))}
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Projects" value={0} sub="No active projects yet — the shell is ready." accent={COBALT} icon={FolderOpen} />
          <MetricCard label="Agents" value={AGENT_LIBRARY.length} sub="Specialized operators available to activate." accent={TEAL} icon={Bot} />
          <MetricCard label="Prompts" value={PROMPT_LIBRARY.length} sub="Execution systems available in the prompt layer." accent={AMBER} icon={FileText} />
          <MetricCard label="Tasks" value={0} sub="Todo lanes are ready for the first delivery stream." accent={PINK} icon={Workflow} />
        </div>

        {/* Active projects + task overview */}
        <div className="mb-10 grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
          <div className="sloer-panel rounded-[34px] p-6 md:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Project launch</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-white">No active projects yet.</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#4f8cff]/30 bg-[#4f8cff]/12 text-[#4f8cff]">
                <Rocket size={18} />
              </div>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-gray-400">Create your first project and let the workspace become operational: add agents, load prompts, define the mission, and move tasks through a cleaner execution system.</p>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                { title: "Create the project", desc: "Start with the outcome and the delivery surface.", accent: COBALT },
                { title: "Load execution assets", desc: "Attach prompts, skills, and agents to the mission.", accent: TEAL },
                { title: "Move through flow", desc: "Push delivery through visible stages and keep control.", accent: AMBER },
              ].map((item, index) => (
                <div key={item.title} className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white">{index + 1}</div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                  </div>
                  <p className="mt-3 text-xs leading-6 text-gray-500">{item.desc}</p>
                  <span className="mt-4 block h-1.5 w-12 rounded-full" style={{ background: item.accent }} />
                </div>
              ))}
            </div>
            <Link href="/app/projects/new" className="sloer-button-primary mt-8 inline-flex">
              <span>Create first project</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6">
            <div className="sloer-panel rounded-[34px] p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Execution rail</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-white">Task overview</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ff6f96]/30 bg-[#ff6f96]/12 text-[#ff6f96]">
                  <Command size={16} />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Todo", color: "#6b7280", count: 0 },
                  { label: "In Progress", color: COBALT, count: 0 },
                  { label: "In Review", color: AMBER, count: 0 },
                  { label: "Complete", color: TEAL, count: 0 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-sm text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sloer-panel rounded-[34px] p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Ready rail</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-white">Ready to build?</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border" style={{ background: `${planAccent}16`, borderColor: `${planAccent}30`, color: planAccent }}>
                  {normalizedPlan === "FREE" ? <CreditCard size={16} /> : <Shield size={16} />}
                </div>
              </div>
              <p className="text-sm leading-8 text-gray-400">Start your first project, activate the agent/prompt/skill layer, and then use your current plan rail to expand into deeper control surfaces as the workspace grows.</p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/app/projects/new" className="sloer-button-primary w-full justify-center">
                  <span>Create first project</span>
                  <ArrowRight size={16} />
                </Link>
                <Link href={upgradeHref} className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#4f8cff]">
                  {upgradeLabel}
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Libraries */}
        <div className="grid gap-6 xl:grid-cols-3">
          <LibraryPanel title="Agent Library" href="/app/agents" items={AGENT_LIBRARY} accent={COBALT} icon={Bot} />
          <LibraryPanel title="Prompt Library" href="/app/prompts" items={PROMPT_LIBRARY} accent={AMBER} icon={FileText} />
          <LibraryPanel title="Skill Library" href="/app/skills" items={SKILL_LIBRARY} accent={TEAL} icon={Sparkles} />
        </div>
      </motion.div>
    </div>
  );
}
