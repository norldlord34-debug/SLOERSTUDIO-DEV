import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Sparkles, Lock } from "lucide-react";

const COBALT = "#4f8cff";

const SKILLS = [
  { name: "SloerGuard", desc: "Full-stack security audit methodology. Systematic vulnerability scanning and remediation pipeline.", color: "#ff6f96", icon: "🛡️" },
  { name: "SloerBlueprint", desc: "Turn a natural language feature description into a complete implementation plan with architecture decisions.", color: "#4f8cff", icon: "📐" },
  { name: "SloerRecon", desc: "Rapidly map and understand any codebase. Structured methodology to trace data flow and map dependencies.", color: "#28e7c5", icon: "🔭" },
  { name: "SloerAPI", desc: "RESTful API design standards and best practices for creating scalable, well-documented interfaces.", color: "#ffbf62", icon: "⚡" },
  { name: "SloerDB", desc: "Database optimization techniques, indexing strategies, query performance tuning, and schema design.", color: "#a855f7", icon: "🗄️" },
  { name: "SloerReact", desc: "React performance optimization, render cycle management, state management patterns, and component design.", color: "#84cc16", icon: "⚛️" },
];

export default function SkillsLibraryPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="text-xs text-gray-500 mb-8">
          <span>Home</span> <span className="mx-2">/</span> <span>Libraries</span> <span className="mx-2">/</span> <span className="text-white">Skills</span>
        </div>
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">
            SloerStudio <span style={{ color: COBALT }}>Skills</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Give your agents superpowers. Skills are curated methodologies injected into agent context — giving them domain expertise beyond their base training.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
              <Lock size={11} /> Sign up for Pro to access full content
            </div>
            <Link href="/signup?plan=STUDIO" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: COBALT, color: "#050505" }}>
              Get Started
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SKILLS.map((s) => (
            <div key={s.name} className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-default">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>{s.icon}</div>
              <div>
                <p className="font-bold text-white font-display">{s.name}</p>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
