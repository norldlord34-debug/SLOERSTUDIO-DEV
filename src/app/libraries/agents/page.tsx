import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Bot, Lock } from "lucide-react";

const COBALT = "#4f8cff";

const FREE_AGENTS = [
  { name: "SloerSecurity", desc: "Your security-first teammate. Audits code for vulnerabilities, hardens architecture, and surfaces risks before they ship.", color: "#ff6f96", icon: "🔒" },
  { name: "SloerShipper", desc: "Turns vibe-coded ideas into production-ready code. Scaffolds features, writes boilerplate, and keeps the codebase clean.", color: "#4f8cff", icon: "🚀" },
  { name: "SloerScout", desc: "Deep-dives into unfamiliar codebases, maps architecture, traces data flows, and produces structured intelligence reports.", color: "#28e7c5", icon: "🔭" },
];

const PRO_AGENTS = [
  { name: "SloerQA", desc: "Relentless testing specialist. Writes unit, integration, and E2E tests to a strict standard.", color: "#ffbf62", icon: "🧪" },
  { name: "SloerDesigner", desc: "Frontend UI/UX specialist. Transforms wireframes and ideas into pixel-perfect, responsive code.", color: "#a855f7", icon: "🎨" },
  { name: "SloerDevOps", desc: "Infrastructure and deployment expert. Manages CI/CD pipelines, Docker, Kubernetes, and cloud infrastructure.", color: "#84cc16", icon: "⚙️" },
];

export default function AgentsLibraryPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-8">
          <span>Home</span> <span className="mx-2">/</span> <span>Libraries</span> <span className="mx-2">/</span> <span className="text-white">Agents</span>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">
            SloerStudio <span style={{ color: COBALT }}>Agents</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            Pre-configured AI teammates for your agentic workflows. Each agent is specialized for a domain with a crafted system prompt, role definition, and behavior profile.
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

        {/* Free agents */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-5">Free Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FREE_AGENTS.map((agent) => (
              <div key={agent.name} className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group cursor-default">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}25` }}>{agent.icon}</div>
                <div>
                  <p className="font-bold text-white font-display">{agent.name}</p>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">{agent.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pro agents */}
        <div className="relative">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-5">Pro Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-40 pointer-events-none select-none">
            {PRO_AGENTS.map((agent) => (
              <div key={agent.name} className="flex items-start gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}25` }}>{agent.icon}</div>
                <div>
                  <p className="font-bold text-white font-display">{agent.name}</p>
                  <p className="text-gray-400 text-sm mt-1 leading-relaxed">{agent.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Unlock overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#07080d]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center max-w-sm">
              <div className="w-10 h-10 rounded-xl bg-[#4f8cff]/15 border border-[#4f8cff]/25 flex items-center justify-center mx-auto mb-4">
                <Lock size={18} className="text-[#4f8cff]" />
              </div>
              <p className="font-bold text-white font-display mb-2">Unlock All Agents</p>
              <p className="text-gray-400 text-sm mb-5">Get full access to our entire library of curated agents, prompts, and skills with a Pro subscription.</p>
              <Link href="/signup?plan=STUDIO" className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm" style={{ background: COBALT, color: "#050505" }}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
