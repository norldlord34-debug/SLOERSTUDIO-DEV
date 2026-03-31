import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Zap } from "lucide-react";

export default function DiscordPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        {/* Icons */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#4f8cff]/15 border border-[#4f8cff]/30 flex items-center justify-center">
            <Zap size={28} className="text-[#4f8cff]" fill="currentColor" />
          </div>
          <span className="text-gray-500 text-2xl font-thin">+</span>
          <div className="w-16 h-16 rounded-2xl bg-[#5865f2]/15 border border-[#5865f2]/30 flex items-center justify-center text-2xl">
            💬
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#28e7c5]/10 border border-[#28e7c5]/20 text-xs font-semibold text-[#28e7c5] mb-6">
          ● Official Community Now Open
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-4">
          Join the<br />
          <span className="text-[#4f8cff]">Agentic Coding</span><br />
          Movement
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-xl leading-relaxed">
          Ship software at the speed of thought. Connect with builders, share your agents, and shape the future of autonomous engineering.
        </p>

        <div className="flex items-center gap-10 mb-12">
          {[
            { value: "7,300+", label: "Builders" },
            { value: "Active", label: "& Engaged" },
            { value: "Agentic", label: "Coding Leaders" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-bold text-white font-display">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <a
          href="https://discord.gg/sloerstudio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base bg-[#5865f2] text-white hover:bg-[#6971f2] transition-all hover:scale-105"
        >
          💬 Enter the Discord →
        </a>

        <a href="/" className="mt-6 text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1">
          🏠 Return to Homepage
        </a>
      </div>
      <Footer />
    </div>
  );
}
