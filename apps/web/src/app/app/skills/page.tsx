import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ChevronRight, RefreshCw } from "lucide-react";

const SKILLS = [
  { name: "SloerGuard", desc: "Full-stack security audit methodology. Systematic vulnerability scanning and remediation.", color: "#ff6f96", icon: "🛡️" },
  { name: "SloerBlueprint", desc: "Turn a natural language feature description into a full implementation plan.", color: "#4f8cff", icon: "📐" },
  { name: "SloerRecon", desc: "Rapidly map and understand any codebase. Structured methodology to trace data flow.", color: "#28e7c5", icon: "🔭" },
  { name: "SloerAPI", desc: "RESTful API design standards and best practices for creating scalable interfaces.", color: "#ffbf62", icon: "⚡" },
  { name: "SloerDB", desc: "Database optimization techniques, indexing strategies, and query performance tuning.", color: "#a855f7", icon: "🗄️" },
  { name: "SloerReact", desc: "React performance optimization, render cycle management, and state management patterns.", color: "#84cc16", icon: "⚛️" },
];

export default async function SkillsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Skills</h1>
          <p className="text-gray-400 text-sm mt-1">Give your agents superpowers. <span className="text-[#4f8cff] cursor-pointer hover:underline">Learn more</span></p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 border border-white/8 hover:bg-white/10 transition-colors text-gray-300">
          <RefreshCw size={13} /> Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SKILLS.map((s) => (
          <div key={s.name} className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-default">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>{s.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-sm">{s.name}</span>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
