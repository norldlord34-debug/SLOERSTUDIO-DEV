import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Mic, ChevronRight, Shield, CloudOff, Keyboard, Zap } from "lucide-react";

const PINK = "#ff6f96";

const MODELS = [
  { tier: "Tiny.en", size: "75 MB", speed: "Blazing", quality: "Good", color: "#28e7c5" },
  { tier: "Base.en", size: "142 MB", speed: "Fast", quality: "High", color: "#4f8cff" },
  { tier: "Large-v3", size: "2.9 GB", speed: "Slow", quality: "SOTA", color: PINK },
];

const FEATURES = [
  { icon: CloudOff, title: "100% On-Device", desc: "Whisper AI runs locally in Rust via whisper.rs. Your voice never leaves your machine. Zero telemetry, zero cloud.", color: PINK },
  { icon: Keyboard, title: "Push-to-Talk & Toggle", desc: "Two recording modes with fully configurable global hotkeys. Hold to dictate or toggle on/off — your workflow.", color: "#4f8cff" },
  { icon: Zap, title: "Sub-Second Transcription", desc: "Persistent audio stream starts in under 10ms. End-to-end from speech to text injected in under 1 second.", color: "#ffbf62" },
  { icon: Shield, title: "Universal Text Injection", desc: "Transcribed text is instantly pasted into whatever app has focus — code editor, terminal, browser, Slack, Notion.", color: "#28e7c5" },
];

export default function SloerVoicePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold mb-6 border" style={{ color: PINK, borderColor: `${PINK}30`, background: `${PINK}10` }}>
            ◉ SloerVoice · ON-DEVICE
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-6">
            Voice Dictation<br />
            for Developers.<br />
            <span style={{ color: PINK }}>100% On-Device.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            SloerVoice runs Whisper AI locally in Rust. Dictate code, documentation, terminal commands, and messages natively with your voice. Zero cloud dependency. Total privacy.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm hover:scale-105 transition-all" style={{ background: PINK, color: "#050505" }}>
            Download for Windows <ChevronRight size={14} />
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-4 p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}12`, border: `1px solid ${f.color}20` }}>
                <f.icon size={18} style={{ color: f.color }} />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1.5 font-display">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Model tiers */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold font-display text-center mb-3">Choose Your AI Model</h2>
          <p className="text-gray-400 text-center mb-10 max-w-xl mx-auto">Select the Whisper model that fits your hardware. All models run 100% on-device.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MODELS.map((m) => (
              <div key={m.tier} className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="w-3 h-3 rounded-full mb-4" style={{ background: m.color }} />
                <p className="font-bold text-white font-mono text-lg">{m.tier}</p>
                <p className="text-sm text-gray-500 mt-1">{m.size}</p>
                <div className="mt-4 flex gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${m.color}15`, color: m.color }}>⚡ {m.speed}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{m.quality}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="flex items-start gap-8 p-8 rounded-2xl border border-white/8 bg-white/[0.01] mb-20">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${PINK}12`, border: `1px solid ${PINK}20` }}>
            <Shield size={22} style={{ color: PINK }} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display mb-2">Privacy by Default</h2>
            <p className="text-gray-400 leading-relaxed">
              SloerVoice is architected from the ground up with privacy as a first principle. Whisper AI runs on your CPU/GPU via whisper.rs (Rust bindings). Audio is captured, transcribed, and discarded entirely locally. There is no cloud option — by design.
            </p>
          </div>
        </div>

        <div className="text-center p-12 rounded-2xl border border-white/8" style={{ background: `${PINK}06` }}>
          <Mic size={40} style={{ color: PINK }} className="mx-auto mb-5" />
          <h2 className="text-3xl font-bold font-display mb-3">Talk instead of type.</h2>
          <p className="text-gray-400 mb-8">Privacy-first desktop voice dictation for builders. Included with SloerStudio Studio & Enterprise.</p>
          <Link href="/pricing" className="inline-flex px-8 py-3.5 rounded-full font-semibold text-sm hover:scale-105 transition-all" style={{ background: PINK, color: "#050505" }}>
            See Pricing →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
