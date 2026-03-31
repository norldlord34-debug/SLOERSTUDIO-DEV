import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    title: "Getting Started",
    color: "#4f8cff",
    items: ["Installation", "Creating your first workspace", "Multi-pane terminal basics", "Keyboard shortcuts"],
  },
  {
    title: "SloerSwarm",
    color: "#28e7c5",
    items: ["What is SloerSwarm?", "Configuring your agent roster", "Mission directives", "Live swarm dashboard", "CLI auto-resolution"],
  },
  {
    title: "SloerCanvas",
    color: "#ffbf62",
    items: ["Canvas overview", "Managing terminal threads", "Zoom & navigation", "Agent fleet layout"],
  },
  {
    title: "SloerVoice",
    color: "#ff6f96",
    items: ["Installing Whisper models", "Push-to-talk setup", "Toggle recording mode", "Global hotkey config"],
  },
  {
    title: "Settings & Configuration",
    color: "#a855f7",
    items: ["Themes & appearance", "API key management", "AI provider setup", "Terminal settings"],
  },
  {
    title: "API Reference",
    color: "#84cc16",
    items: ["Authentication", "Projects API", "Tasks API", "Admin API", "Webhooks"],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-16">
          <div className="w-12 h-12 rounded-2xl bg-[#4f8cff]/10 border border-[#4f8cff]/20 flex items-center justify-center mx-auto mb-5">
            <BookOpen size={22} className="text-[#4f8cff]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">Documentation</h1>
          <p className="text-gray-400 text-lg mb-8">Everything you need to build with SloerStudio.</p>
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search docs..."
              className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50 pl-11"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTIONS.map((section) => (
            <div key={section.title} className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: section.color }} />
                <h2 className="font-bold text-white font-display">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors group py-1">
                      <span>{item}</span>
                      <ChevronRight size={12} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl border border-white/8 bg-white/[0.01] text-center">
          <p className="text-gray-400 mb-4">Can&apos;t find what you&apos;re looking for?</p>
          <div className="flex gap-4 justify-center">
            <Link href="/community/discord" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#5865f2] bg-[#5865f2]/10 border border-[#5865f2]/20 hover:bg-[#5865f2]/20 transition-colors">
              Ask on Discord
            </Link>
            <Link href="/company/contact" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
