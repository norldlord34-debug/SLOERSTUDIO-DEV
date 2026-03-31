import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Layout, ChevronRight, Move, ZoomIn, Grid } from "lucide-react";

const AMBER = "#ffbf62";

export default function SloerCanvasPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold mb-6 border" style={{ color: AMBER, borderColor: `${AMBER}30`, background: `${AMBER}10` }}>
            ◈ SloerCanvas · ALPHA
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-6">
            Free-Form<br />
            <span style={{ color: AMBER }}>Canvas IDE.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            SloerCanvas is a spatial runtime where each AI agent lives in a draggable, resizable terminal thread. Arrange 1–12 agent windows freely. Zoom, pan, and manage your entire fleet visually.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup" className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm" style={{ background: AMBER, color: "#050505" }}>
              Request Early Access <ChevronRight size={14} />
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-600">Currently in Alpha — included with all plans</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {[
            { icon: Move, title: "Drag & Resize Threads", desc: "Each terminal window (Thread) can be freely positioned and resized anywhere on the infinite canvas.", color: AMBER },
            { icon: ZoomIn, title: "Zoom & Pan", desc: "Navigate your agent fleet spatially. Zoom from overview to individual terminal detail with smooth controls.", color: "#4f8cff" },
            { icon: Grid, title: "1–12 Agent Fleet", desc: "Launch 1 to 12 agents simultaneously. Each gets its own persistent PTY session with CLI bootstrap.", color: "#28e7c5" },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}12`, border: `1px solid ${f.color}20` }}>
                <f.icon size={18} style={{ color: f.color }} />
              </div>
              <h3 className="font-bold text-white mb-2 font-display">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center p-12 rounded-2xl border border-white/8" style={{ background: `${AMBER}08` }}>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: `${AMBER}15`, color: AMBER, border: `1px solid ${AMBER}25` }}>ALPHA</span>
          <h2 className="text-3xl font-bold font-display mb-3">The Un-Scrolled Terminal.</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">SloerCanvas replaces linear terminal grids with a spatial canvas. See your entire agent fleet at once. Move fast, think spatially.</p>
          <Link href="/signup" className="inline-flex px-8 py-3.5 rounded-full font-semibold text-sm" style={{ background: AMBER, color: "#050505" }}>
            Get Early Access
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
