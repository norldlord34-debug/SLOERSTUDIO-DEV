import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RefreshCw, ChevronRight } from "lucide-react";

const AGENTS = [
  { name: "SloerSecurity", desc: "Your security-first teammate. Audits code for vulnerabilities, hardens architecture.", color: "#ff6f96", icon: "🔒" },
  { name: "SloerShipper", desc: "Turns vibe-coded ideas into production-ready code. Scaffolds features, writes boilerplate.", color: "#4f8cff", icon: "🚀" },
  { name: "SloerScout", desc: "Deep-dives into unfamiliar codebases, maps architecture, traces data flow.", color: "#28e7c5", icon: "🔭" },
  { name: "SloerQA", desc: "Relentless testing specialist. Writes unit, integration, and E2E tests to a strict standard.", color: "#ffbf62", icon: "🧪" },
  { name: "SloerDesigner", desc: "Frontend UI/UX specialist. Transforms wireframes and ideas into pixel-perfect code.", color: "#a855f7", icon: "🎨" },
  { name: "SloerDevOps", desc: "Infrastructure and deployment expert. Manages CI/CD pipelines, Docker, and cloud.", color: "#84cc16", icon: "⚙️" },
];

export default async function AgentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Agents</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your AI teammates. <span className="text-[#4f8cff] cursor-pointer hover:underline">Learn more</span></p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 hover:bg-white/10 transition-colors text-gray-300">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {AGENTS.map((agent) => (
          <div key={agent.name} className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-default">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}25` }}>
              {agent.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">{agent.name}</span>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{agent.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
