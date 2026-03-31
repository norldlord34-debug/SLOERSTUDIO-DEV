import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderOpen, Bot, FileText, KanbanSquare, ChevronRight, Zap, Terminal, Users, Layout } from "lucide-react";

const AGENT_LIBRARY = [
  { name: "SloerSecurity", desc: "Audits code for vulnerabilities, hardens architecture.", color: "#ff6f96" },
  { name: "SloerShipper", desc: "Turns vibe-coded ideas into production-ready code.", color: "#4f8cff" },
  { name: "SloerScout", desc: "Deep-dives into unfamiliar codebases, maps architecture.", color: "#28e7c5" },
  { name: "SloerQA", desc: "Relentless testing specialist. Writes unit, integration tests.", color: "#ffbf62" },
  { name: "SloerDesigner", desc: "Frontend UI/UX specialist. Transforms wireframes into code.", color: "#a855f7" },
  { name: "SloerDevOps", desc: "Infrastructure and deployment expert. Manages CI/CD pipelines.", color: "#84cc16" },
];

const PROMPT_LIBRARY = [
  { name: "SloerGuard Sweep", desc: "Run a targeted security audit on a file, endpoint, or module." },
  { name: "Ship This Feature", desc: "Go from a natural language description to a fully implemented feature." },
  { name: "Recon This Codebase", desc: "Deep-dive into an unfamiliar codebase and produce a structured intel." },
  { name: "Refactor Component", desc: "Clean up, optimize, and modernize a messy component." },
  { name: "Generate Tests", desc: "Create a robust test suite for a given function, class, or component." },
  { name: "Perform Code Review", desc: "Act as a strict but helpful senior engineer reviewing a pull request." },
];

const SKILL_LIBRARY = [
  { name: "SloerGuard", desc: "Full-stack security audit methodology." },
  { name: "SloerBlueprint", desc: "Turn a natural language feature description into a full implementation plan." },
  { name: "SloerRecon", desc: "Rapidly map and understand any codebase." },
  { name: "SloerAPI", desc: "RESTful API design standards and best practices." },
  { name: "SloerDB", desc: "Database optimization techniques and query performance." },
  { name: "SloerReact", desc: "React performance optimization and state management." },
];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const user = session.user as { name?: string; email?: string; plan?: string };
  const firstName = user.name?.split(" ")[0] ?? "Builder";

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#28e7c5]/10 border border-[#28e7c5]/20 text-[10px] font-semibold text-[#28e7c5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28e7c5] animate-pulse" />
              Agentic Workspace Ready
            </span>
          </div>
          <h1 className="text-3xl font-bold font-display">
            Welcome back, <span className="text-[#4f8cff]">{firstName}</span>
          </h1>
        </div>
        <Link href="/app/projects/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105" style={{ background: "#4f8cff", color: "#050505" }}>
          + New Project
        </Link>
      </div>

      {/* Product cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { name: "SloerSpace", tag: "ADE", desc: "Multi-terminal AI swarm orchestration.", icon: Terminal, color: "#4f8cff" },
          { name: "SloerVoice", tag: "ON-DEVICE", desc: "Privacy-first voice coding with Whisper AI.", icon: Zap, color: "#ff6f96" },
        ].map((p) => (
          <div key={p.name} className="flex items-center justify-between p-5 rounded-2xl border border-white/8 bg-white/[0.025]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}>
                <p.icon size={18} style={{ color: p.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-display text-sm">{p.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border" style={{ color: p.color, borderColor: `${p.color}40`, background: `${p.color}12` }}>{p.tag}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
              </div>
            </div>
            <Link href={`/products/${p.name.toLowerCase().replace("sloe", "sloer")}`} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold" style={{ background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}30` }}>
              Download
            </Link>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "PROJECTS", icon: FolderOpen, value: 0, color: "#4f8cff" },
          { label: "AGENTS", icon: Bot, value: 0, color: "#28e7c5" },
          { label: "PROMPTS", icon: FileText, value: 0, color: "#ffbf62" },
          { label: "TASKS", icon: KanbanSquare, value: 0, sub: "0 todo · 0 active", color: "#ff6f96" },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-2xl border border-white/8 bg-white/[0.025]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-semibold text-gray-500 tracking-widest">{s.label}</span>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <p className="text-3xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
            {s.sub && <p className="text-[10px] text-gray-600 mt-1">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Active projects + task overview */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-8">
        <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-white">Active Projects</h2>
            <Link href="/app/projects" className="flex items-center gap-1 text-xs text-[#4f8cff] hover:underline">View All <ChevronRight size={12} /></Link>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#4f8cff]/10 flex items-center justify-center mb-4">
              <FolderOpen size={22} className="text-[#4f8cff]" />
            </div>
            <p className="font-semibold text-white mb-1">No active projects yet</p>
            <p className="text-sm text-gray-500 mb-5">Create your first project and let your AI teammates turn your vision into production code.</p>
            <Link href="/app/projects/new" className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "#4f8cff", color: "#050505" }}>
              + New Project
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-6">
          <h2 className="text-sm font-semibold text-white mb-5">Task Overview</h2>
          {[
            { label: "Todo", color: "#6b7280", count: 0 },
            { label: "In Progress", color: "#4f8cff", count: 0 },
            { label: "In Review", color: "#ffbf62", count: 0 },
            { label: "Complete", color: "#28e7c5", count: 0 },
          ].map((t) => (
            <div key={t.label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                <span className="text-sm text-gray-400">{t.label}</span>
              </div>
              <span className="text-sm font-semibold text-white">{t.count}</span>
            </div>
          ))}
          <div className="mt-5 p-4 rounded-xl bg-[#4f8cff]/5 border border-[#4f8cff]/15 text-center">
            <p className="text-xs text-gray-400 mb-3">Ready to build? Start your first project and experience vibe coding.</p>
            <Link href="/app/projects/new" className="text-xs font-semibold text-[#4f8cff] hover:underline">+ Create First Project</Link>
          </div>
        </div>
      </div>

      {/* Libraries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Agent Library", href: "/app/agents", items: AGENT_LIBRARY, colorKey: "color" as const },
          { title: "Prompt Library", href: "/app/prompts", items: PROMPT_LIBRARY, colorKey: null },
          { title: "Skill Library", href: "/app/skills", items: SKILL_LIBRARY, colorKey: null },
        ].map((lib) => (
          <div key={lib.title} className="rounded-2xl border border-white/8 bg-white/[0.015] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">{lib.title}</h2>
              <Link href={lib.href} className="flex items-center gap-1 text-xs text-[#4f8cff] hover:underline">View All <ChevronRight size={12} /></Link>
            </div>
            <div className="space-y-3">
              {lib.items.slice(0, 3).map((item) => (
                <div key={item.name} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                  <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: lib.colorKey ? `${(item as unknown as { color: string }).color}15` : "rgba(255,255,255,0.05)" }}>
                    <Bot size={13} style={{ color: lib.colorKey ? (item as unknown as { color: string }).color : "#6b7280" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed mt-0.5 line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
