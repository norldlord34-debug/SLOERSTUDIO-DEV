import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RefreshCw, ChevronRight } from "lucide-react";

const PROMPTS = [
  { name: "SloerGuard Sweep", desc: "Run a targeted security audit on a file, endpoint, or module using the SloerGuard methodology.", color: "#ff6f96", icon: "🛡️" },
  { name: "Ship This Feature", desc: "Go from a natural language description to a fully implemented feature with tests.", color: "#4f8cff", icon: "✦" },
  { name: "Recon This Codebase", desc: "Deep-dive into an unfamiliar codebase and produce a structured intelligence report.", color: "#28e7c5", icon: "🔭" },
  { name: "Refactor Component", desc: "Clean up, optimize, and modernize a messy component without breaking existing functionality.", color: "#ffbf62", icon: "⟐" },
  { name: "Generate Tests", desc: "Create a robust test suite for a given function, class, or component.", color: "#a855f7", icon: "🧪" },
  { name: "Perform Code Review", desc: "Act as a strict but helpful senior engineer reviewing a pull request.", color: "#84cc16", icon: "◈" },
];

export default async function PromptsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Prompts</h1>
          <p className="text-gray-400 text-sm mt-1">Standardize your agent interactions. <span className="text-[#4f8cff] cursor-pointer hover:underline">Learn more</span></p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 hover:bg-white/10 transition-colors text-gray-300">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PROMPTS.map((p) => (
          <div key={p.name} className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-default">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}>
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">{p.name}</span>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
