import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FileText, Lock } from "lucide-react";

const COBALT = "#4f8cff";

const PROMPTS = [
  { name: "SloerGuard Sweep", desc: "Run a targeted security audit on a file, endpoint, or module using the SloerGuard methodology.", color: "#ff6f96", icon: "🛡️" },
  { name: "Ship This Feature", desc: "Go from a natural language description to a fully implemented feature with tests and docs.", color: "#4f8cff", icon: "✦" },
  { name: "Recon This Codebase", desc: "Deep-dive into an unfamiliar codebase and produce a structured intelligence report.", color: "#28e7c5", icon: "🔭" },
  { name: "Refactor Component", desc: "Clean up, optimize, and modernize a messy component without breaking existing functionality.", color: "#ffbf62", icon: "⟐" },
  { name: "Generate Tests", desc: "Create a robust test suite for a given function, class, or component.", color: "#a855f7", icon: "🧪" },
  { name: "Perform Code Review", desc: "Act as a strict but helpful senior engineer reviewing a pull request.", color: "#84cc16", icon: "◈" },
];

export default function PromptsLibraryPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="text-xs text-gray-500 mb-8">
          <span>Home</span> <span className="mx-2">/</span> <span>Libraries</span> <span className="mx-2">/</span> <span className="text-white">Prompts</span>
        </div>
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">
            SloerStudio <span style={{ color: COBALT }}>Prompts</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Curated prompt templates that standardize your agent interactions. Each prompt is battle-tested for real engineering workflows.
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
          {PROMPTS.map((p) => (
            <div key={p.name} className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-default">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: `${p.color}15`, border: `1px solid ${p.color}25` }}>{p.icon}</div>
              <div>
                <p className="font-bold text-white font-display">{p.name}</p>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
