"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductMarketingShowcase from "@/components/video/ProductMarketingShowcase";
import Link from "next/link";
import { AudioLines, ArrowRight, BrainCircuit, ChevronRight, CloudOff, Code2, Command, History, Keyboard, Mic, Shield, Wand2, Workflow } from "lucide-react";

const PINK = "#ff6f96";
const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";
const ease = [0.22, 1, 0.36, 1] as const;

const MODELS = [
  { tier: "Tiny.en", size: "75 MB", speed: "Blazing", quality: "Good", color: TEAL },
  { tier: "Base.en", size: "142 MB", speed: "Fast", quality: "High", color: COBALT },
  { tier: "Large-v3", size: "2.9 GB", speed: "Slow", quality: "SOTA", color: PINK },
];

const FEATURES = [
  {
    icon: CloudOff,
    title: "100% local Whisper inference",
    desc: "SloerVoice runs whisper.rs in Rust with no cloud dependency. Audio stays on-device and the product is intentionally built around that trust model.",
    color: PINK,
  },
  {
    icon: Keyboard,
    title: "Global shortcuts with real safety controls",
    desc: "Push-to-talk and toggle recording modes are native features. The default flow centers on Ctrl + Space, with cancel and undo actions available when output needs correction.",
    color: COBALT,
  },
  {
    icon: AudioLines,
    title: "Live waveform and speaking telemetry",
    desc: "The app exposes real microphone activity, speaking detection, elapsed capture time, and final-processing state so dictation never feels blind or mysterious.",
    color: TEAL,
  },
  {
    icon: History,
    title: "Transcript vault with export and audit",
    desc: "Search local transcription history, export CSV, delete entries, clear the vault, and track useful metrics like time saved, clean words, and session duration.",
    color: AMBER,
  },
  {
    icon: Wand2,
    title: "Dictionary, snippets, and style control",
    desc: "Corporate, gaming, and development dictionaries sit beside reusable snippet expansion, smart formatting, and tone controls for personal, work, email, and other contexts.",
    color: PINK,
  },
  {
    icon: Code2,
    title: "Vibe coding for serious builders",
    desc: "SloerVoice includes IDE-aware flows for VS Code, Cursor, and Windsurf, with variable recognition, file tagging, and voice-driven terminal, React, and test-writing support.",
    color: COBALT,
  },
];

const WORKFLOW = [
  {
    title: "Trigger from anywhere",
    desc: "Use push-to-talk or toggle mode with global hotkeys so dictation can start without changing focus or context.",
    accent: PINK,
  },
  {
    title: "Watch local telemetry",
    desc: "The widget exposes waveform feedback, mic state, speaking detection, and processing transitions in real time.",
    accent: COBALT,
  },
  {
    title: "Transcribe on-device",
    desc: "Select Tiny.en, Base.en, or Large-v3 and keep inference local while tuning microphone, language, and formatting settings.",
    accent: TEAL,
  },
  {
    title: "Inject and archive",
    desc: "Paste into the focused app instantly, then recover it later through the searchable vault, export flows, and output controls.",
    accent: AMBER,
  },
];

const SURFACES = [
  {
    title: "Transcript vault",
    desc: "Operational archive with search, CSV export, delete, clear, and metrics around saved time and session duration.",
    color: COBALT,
  },
  {
    title: "Profile dictionaries",
    desc: "Corporate, gaming, and development rule sets let the engine normalize vocabulary toward the domain you actually work in.",
    color: TEAL,
  },
  {
    title: "Widget and tray control",
    desc: "Compact mode, always-on-top control, opacity tuning, mute, and tray-level actions keep the voice surface lightweight but always ready.",
    color: AMBER,
  },
  {
    title: "Developer mode",
    desc: "Voice pair programming, file tagging, variable naming awareness, and code-focused formatting move the product beyond generic dictation.",
    color: PINK,
  },
];

const IDE_SUPPORT = [
  { name: "VS Code", desc: "Voice-driven coding with syntax-aware dictation", accent: COBALT },
  { name: "Cursor", desc: "File tagging and AI pair-programming flows", accent: TEAL },
  { name: "Windsurf", desc: "Cascade-friendly voice workflow support", accent: PINK },
];

const VOICE_SIGNAL_GRID = [
  { label: "Capture", value: "Live waveform", accent: PINK },
  { label: "Recovery", value: "Cancel + undo", accent: COBALT },
  { label: "Output", value: "Inject anywhere", accent: TEAL },
  { label: "Memory", value: "Vault + export", accent: AMBER },
];

const VOICE_OPERATING_ZONES = [
  {
    title: "Code editors",
    desc: "Variable recognition, file tagging, terminal dictation, React authoring, and test-writing flows move voice into real dev work instead of generic note taking.",
    accent: COBALT,
  },
  {
    title: "Messages and documents",
    desc: "Style presets, smart formatting, dictionary control, and snippet expansion keep output polished across chat, docs, and email surfaces.",
    accent: PINK,
  },
  {
    title: "Control and audit",
    desc: "Widget visibility, always-on-top behavior, mute, history search, CSV export, and recovery shortcuts keep the system reliable under pressure.",
    accent: TEAL,
  },
];

function VoicePreview() {
  return (
    <div className="sloer-panel relative rounded-[34px] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.48)] md:p-5">
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500">SloerVoice cockpit</p>
          <p className="mt-1 text-sm font-semibold text-white">On-device dictation control center</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6f96] shadow-[0_0_18px_rgba(255,111,150,0.8)]" />
          Local inference ready
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="rounded-[28px] border border-white/8 bg-[#07080d] p-5">
          <div className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-gray-500">
            <Mic size={13} />
            Recording widget
          </div>
          <div className="rounded-[24px] border border-white/8 bg-black/25 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Ctrl + Space</p>
                <p className="mt-1 text-[11px] text-gray-500">Push-to-talk · global shortcut</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ff6f96]/30 bg-[#ff6f96]/12 text-[#ff6f96]">
                <Mic size={18} />
              </div>
            </div>
            <div className="mt-5 flex h-20 items-end gap-1.5">
              {[18, 32, 48, 66, 78, 94, 76, 58, 42, 28, 18, 14].map((height, index) => (
                <motion.span
                  key={`${height}-${index}`}
                  animate={{ height: [Math.max(10, height * 0.72), height, Math.max(10, height * 0.58)] }}
                  transition={{ duration: 1.2 + index * 0.05, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="w-full rounded-full"
                  style={{ background: index % 3 === 0 ? PINK : index % 2 === 0 ? COBALT : TEAL }}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { label: "Esc cancel", color: AMBER },
                { label: "Alt + Z undo", color: COBALT },
                { label: "Toggle mode", color: TEAL },
              ].map((item) => (
                <span key={item.label} className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: item.color, borderColor: `${item.color}30`, background: `${item.color}12` }}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Vault signal</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Records", value: "Searchable history", accent: COBALT },
                { label: "Export", value: "CSV ready", accent: TEAL },
                { label: "Rule engine", value: "Profile dictionaries", accent: AMBER },
                { label: "Mode", value: "Vibe coding", accent: PINK },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
                  <p className="mt-3 text-sm font-semibold text-white">{item.value}</p>
                  <span className="mt-3 block h-1.5 w-12 rounded-full" style={{ background: item.accent }} />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Developer integrations</p>
            <div className="mt-4 space-y-3">
              {IDE_SUPPORT.map((item) => (
                <div key={item.name} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.accent, boxShadow: `0 0 18px ${item.accent}` }} />
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SloerVoicePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-16 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }} className="mb-24 grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <span className="sloer-pill inline-flex">SloerVoice // On-device dictation</span>
            <h1 className="mt-7 font-display text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl xl:text-[5.45rem] xl:leading-[0.95]">
              The private
              <span className="block bg-gradient-to-r from-white via-[#ff6f96] to-[#4f8cff] bg-clip-text text-transparent">voice cockpit for builders.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-gray-300">
              SloerVoice turns local Whisper inference into a real operator surface: global shortcuts, live audio telemetry, instant text injection, searchable transcript history, custom vocabulary control, and developer-specific voice workflows.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup?plan=STUDIO" className="sloer-button-primary" style={{ background: PINK, color: "#050505" }}>
                <span>Get SloerVoice access</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/community/blog/siulkvoice-privacy-first" className="sloer-button-secondary">
                <span>Read the privacy rationale</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "100% local whisper.rs stack",
                "Ctrl + Space push-to-talk",
                "Vault + dictionary + vibe coding",
              ].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Inference", value: "Rust + Whisper" },
                { label: "Modes", value: "PTT + Toggle" },
                { label: "Surface", value: "Local voice cockpit" },
                { label: "Fit", value: "Developer workflows" },
              ].map((item) => (
                <div key={item.label} className="sloer-panel rounded-2xl px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:pl-4">
            <VoicePreview />
          </div>
        </motion.div>

        <ProductMarketingShowcase productId="sloervoice" />

        {/* Features */}
        <div className="mb-24 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((f) => (
            <motion.div key={f.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${f.color}12`, borderColor: `${f.color}20` }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{f.title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-24 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div whileHover={{ y: -6 }} className="relative overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] p-7 md:p-8">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(255,111,150,0.2),transparent_42%)]" />
            <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-[#4f8cff]/10 blur-[90px]" />
            <div className="relative z-10">
              <span className="sloer-pill inline-flex">Showcase layer</span>
              <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">See the voice system as a real product surface.</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-gray-400 md:text-lg">The strongest signal in the reference is not just a feature list. It is a cinematic middle section that proves the product has depth, control, and a recognizable internal operating model.</p>

              <div className="mt-8 rounded-[30px] border border-white/8 bg-black/25 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Voice billboard</p>
                    <p className="mt-2 text-sm font-semibold text-white">SloerVoice // On-device for builders</p>
                  </div>
                  <span className="rounded-full border border-[#ff6f96]/30 bg-[#ff6f96]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ff6f96]">Local-first</span>
                </div>
                <div className="mt-8 rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(255,111,150,0.18),rgba(8,8,10,0.92)_62%)] px-6 py-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#ff6f96]/30 bg-[#ff6f96]/12 text-[#ff6f96]">
                    <Mic size={28} />
                  </div>
                  <p className="mt-5 font-display text-4xl font-bold text-white">SloerVoice</p>
                  <p className="mt-3 text-sm leading-7 text-gray-300">Private dictation, developer-native execution, and instant recovery controls.</p>
                  <div className="mt-8 flex h-24 items-end gap-2">
                    {[28, 44, 68, 94, 76, 58, 88, 104, 82, 62, 48, 34].map((height, index) => (
                      <motion.span
                        key={`${height}-${index}`}
                        animate={{ height: [Math.max(12, height * 0.7), height, Math.max(12, height * 0.56)] }}
                        transition={{ duration: 1.4 + index * 0.05, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="w-full rounded-full"
                        style={{ background: index % 2 === 0 ? PINK : index % 3 === 0 ? COBALT : TEAL }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                {VOICE_SIGNAL_GRID.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">{item.label}</p>
                    <p className="mt-3 text-sm font-semibold text-white">{item.value}</p>
                    <span className="mt-3 block h-1.5 w-14 rounded-full" style={{ background: item.accent }} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5">
            {VOICE_OPERATING_ZONES.map((item) => (
              <motion.div key={item.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-7">
                <div className="h-1.5 w-14 rounded-full" style={{ background: item.accent }} />
                <h3 className="mt-5 font-display text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-8 text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Model tiers */}
        <div className="mb-24 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <div className="mb-8">
              <span className="sloer-pill inline-flex">Inference stack</span>
              <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Choose the local model that matches your machine.</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-gray-400 md:text-lg">SloerVoice already ships around a practical model ladder: Tiny.en for raw speed, Base.en for the everyday sweet spot, and Large-v3 for maximum quality when hardware can support it.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {MODELS.map((m) => (
                <div key={m.tier} className="rounded-[28px] border border-white/8 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]">
                  <div className="h-3 w-3 rounded-full" style={{ background: m.color }} />
                  <p className="mt-4 font-mono text-lg font-bold text-white">{m.tier}</p>
                  <p className="mt-1 text-sm text-gray-500">{m.size}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: `${m.color}15`, color: m.color }}>⚡ {m.speed}</span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400">{m.quality}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            <div className="sloer-panel rounded-[34px] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4f8cff]/30 bg-[#4f8cff]/12 text-[#4f8cff]">
                <BrainCircuit size={20} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">Settings go beyond the model picker.</h3>
              <p className="mt-4 text-sm leading-8 text-gray-400">The app already exposes microphone selection, recording mode, theme vault, widget behavior, smart formatting, creator mode, and auto-add dictionary options from a real control center.</p>
            </div>
            <div className="sloer-panel rounded-[34px] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#28e7c5]/30 bg-[#28e7c5]/12 text-[#28e7c5]">
                <Workflow size={20} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">Languages already planned into the voice layer.</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {["English", "Español", "Français", "Deutsch", "日本語", "中文"].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-8 text-gray-400">That matters because SloerVoice is evolving as an operating surface, not just a one-shot dictation widget.</p>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="mb-24 grid gap-6 lg:grid-cols-[0.98fr_1.02fr]">
          <div className="flex items-start gap-5 rounded-[34px] border border-white/8 bg-white/[0.02] p-8">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border" style={{ background: `${PINK}12`, borderColor: `${PINK}20` }}>
              <Shield size={22} style={{ color: PINK }} />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Privacy by architecture, not copywriting.</h2>
              <p className="mt-4 text-sm leading-8 text-gray-400">SloerVoice is built around the decision to keep inference local. Audio is captured, processed, transcribed, and injected on-device, which aligns speed, cost control, and developer trust instead of forcing those goals to compete with each other.</p>
              <p className="mt-4 text-sm leading-8 text-gray-400">That same local posture supports the rest of the product: transcript history, dictionaries, snippets, formatting, and voice-driven development workflows can compound without depending on a remote inference service for every spoken action.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {SURFACES.map((item) => (
              <motion.div key={item.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-6">
                <div className="h-1.5 w-14 rounded-full" style={{ background: item.color }} />
                <h3 className="mt-5 font-display text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-8 text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-24 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="sloer-panel rounded-[36px] p-7 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">How it works</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white">From shortcut press to injected text, all inside one local loop.</h2>
            <div className="mt-8 space-y-4">
              {WORKFLOW.map((step, index) => (
                <div key={step.title} className="rounded-[26px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white">{index + 1}</div>
                    <p className="text-base font-semibold text-white">{step.title}</p>
                  </div>
                  <p className="mt-2 pl-11 text-sm leading-7 text-gray-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            <div className="sloer-panel rounded-[34px] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ff6f96]/30 bg-[#ff6f96]/12 text-[#ff6f96]">
                <Code2 size={20} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">Made for developers, not generic dictation demos.</h3>
              <p className="mt-4 text-sm leading-8 text-gray-400">The product already exposes developer-oriented capabilities like variable recognition, file tagging in chat, voice pair programming, and dedicated modes for terminal commands, React components, and test writing.</p>
            </div>
            <div className="sloer-panel rounded-[34px] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4f8cff]/30 bg-[#4f8cff]/12 text-[#4f8cff]">
                <Command size={20} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">Onboarding teaches the workflow, not just the UI.</h3>
              <p className="mt-4 text-sm leading-8 text-gray-400">SIULK-VOICE already includes onboarding for activity profiling, occupation-driven personalization, microphone testing, smart formatting demos, and visible speed comparisons against typing.</p>
            </div>
          </div>
        </div>

        <div className="text-center rounded-[36px] border border-white/8 p-12" style={{ background: `${PINK}06` }}>
          <Mic size={40} style={{ color: PINK }} className="mx-auto mb-5" />
          <h2 className="text-3xl font-bold font-display text-white md:text-5xl">Talk instead of type, without surrendering control.</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-300">SloerVoice is not just a microphone button. It is a premium local voice system with real workflow depth: hotkeys, vaults, dictionaries, style logic, widget control, and developer-native execution paths.</p>
          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/signup?plan=STUDIO" className="sloer-button-primary" style={{ background: PINK, color: "#050505" }}>
              <span>Unlock the voice layer</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" className="sloer-button-secondary">
              <span>See pricing</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
