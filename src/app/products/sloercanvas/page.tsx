"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductMarketingShowcase from "@/components/video/ProductMarketingShowcase";
import Link from "next/link";
import { ArrowRight, Bot, ChevronRight, Grid, Move, Sparkles, Workflow, ZoomIn } from "lucide-react";

const AMBER = "#ffbf62";
const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const ease = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  {
    icon: Move,
    title: "Drag and resize live threads",
    desc: "Every terminal thread becomes a spatial object on the canvas, not a rigid cell inside a linear grid.",
    color: AMBER,
  },
  {
    icon: ZoomIn,
    title: "Zoom and pan the whole system",
    desc: "Move from mission overview to a single thread instantly, keeping the whole operator topology in view.",
    color: COBALT,
  },
  {
    icon: Grid,
    title: "Run an entire fleet visually",
    desc: "Launch 1 to 12 agent windows with persistent terminals, visible placement, and faster orchestration sense-making.",
    color: TEAL,
  },
];

const SYSTEM_CARDS = [
  {
    title: "Spatial orchestration",
    desc: "Canvas lets the operator think in clusters, dependencies, and mission zones instead of buried terminal tabs.",
    color: COBALT,
  },
  {
    title: "Persistent thread topology",
    desc: "Each thread remains a real runtime surface, preserving the sense that your AI teammates are active workers, not decorative widgets.",
    color: TEAL,
  },
  {
    title: "Alpha included with all plans",
    desc: "The goal is to let developers experience the spatial paradigm early while the rest of the product ecosystem matures around it.",
    color: AMBER,
  },
];

const THREADS = [
  {
    title: "Thread / Research",
    accent: COBALT,
    position: "left-6 top-20 w-[220px]",
    lines: ["mapping workspace topology", "reading runtime surfaces", "tracking dependency lanes"],
  },
  {
    title: "Thread / Builder",
    accent: TEAL,
    position: "right-8 top-14 w-[210px]",
    lines: ["launching agent window", "booting persistent PTY", "syncing canvas context"],
  },
  {
    title: "Thread / Review",
    accent: AMBER,
    position: "left-[150px] bottom-10 w-[250px]",
    lines: ["checking overlap zones", "linking mission branch", "preparing alpha handoff"],
  },
];

function CanvasPreview() {
  return (
    <div className="relative h-[430px] overflow-hidden rounded-[34px] border border-white/8 bg-black/20 p-4 md:p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,191,98,0.12),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(79,140,255,0.14),transparent_30%),radial-gradient(circle_at_50%_75%,rgba(40,231,197,0.1),transparent_38%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px] opacity-25" />

      <div className="relative z-10 flex items-center justify-between rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Canvas overview</p>
          <p className="mt-1 text-sm font-semibold text-white">Mission map // visual runtime</p>
        </div>
        <div className="flex gap-2">
          {[
            { label: "Alpha", color: AMBER },
            { label: "12 threads", color: COBALT },
            { label: "Live topology", color: TEAL },
          ].map((item) => (
            <span key={item.label} className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: item.color, borderColor: `${item.color}35`, background: `${item.color}12` }}>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {THREADS.map((thread, index) => (
        <motion.div
          key={thread.title}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.12 + index * 0.1 }}
          className={`absolute ${thread.position} rounded-[24px] border border-white/8 bg-[#090b12]/88 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl`}
        >
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: thread.accent }} />
              <p className="text-xs font-semibold text-white">{thread.title}</p>
            </div>
            <Bot size={14} style={{ color: thread.accent }} />
          </div>
          <div className="space-y-3 p-4">
            {thread.lines.map((line) => (
              <div key={line} className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2.5 text-[11px] text-gray-300">
                {line}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <div className="absolute bottom-4 right-4 rounded-[24px] border border-white/8 bg-[#090b12]/90 px-4 py-3 backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Spatial advantage</p>
        <p className="mt-2 text-sm font-semibold text-white">See the fleet, not just the tab list.</p>
      </div>
    </div>
  );
}

export default function SloerCanvasPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-16 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }} className="mb-24 grid gap-10 lg:grid-cols-[0.96fr_1.04fr]">
          <div>
            <span className="sloer-pill inline-flex">Product // SloerCanvas Alpha</span>
            <h1 className="mt-7 font-display text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl xl:text-[5.35rem] xl:leading-[0.95]">
              The
              <span className="block bg-gradient-to-r from-white via-[#ffbf62] to-[#4f8cff] bg-clip-text text-transparent">spatial runtime for AI threads.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-gray-300">
              SloerCanvas turns the terminal into an open operating field. Instead of forcing agent work into stacked panes and linear tabs, it gives every thread a visible place inside a zoomable mission surface.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup?plan=STUDIO" className="sloer-button-primary" style={{ background: AMBER, color: "#050505" }}>
                <span>Request early access</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="sloer-button-secondary">
                <span>Compare plans</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Alpha included with all plans",
                "1–12 visual threads",
                "Persistent terminal topology",
              ].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Surface", value: "Free-form canvas" },
                { label: "Scope", value: "Multi-agent runtime" },
                { label: "Stage", value: "Alpha now" },
              ].map((item) => (
                <div key={item.label} className="sloer-panel rounded-2xl px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <CanvasPreview />
        </motion.div>

        <ProductMarketingShowcase productId="sloercanvas" />

        <div className="mb-24 grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <motion.div key={feature.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${feature.color}16`, borderColor: `${feature.color}30`, color: feature.color }}>
                <feature.icon size={20} />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm leading-8 text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-24 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="sloer-panel rounded-[36px] p-7 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Why canvas matters</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white">Terminal work should not be trapped in a single dimension.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-gray-400">When multiple agents are active, a classic stacked terminal layout starts to hide the very topology you need to reason about. SloerCanvas gives each thread a visible position so the operator can cluster related work, separate parallel streams, and understand the mission at a glance.</p>
            <div className="mt-8 space-y-4">
              {[
                { title: "Group related threads spatially", desc: "Research, build, QA, and review can occupy different zones instead of collapsing into one pane stack." },
                { title: "Keep the mission map visible", desc: "The operator always sees the broader system state rather than losing context while switching tabs." },
                { title: "Treat agent windows like active workers", desc: "The UI should reinforce that these are persistent runtimes with roles, not transient visual gimmicks." },
              ].map((item, index) => (
                <div key={item.title} className="rounded-[26px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white">{index + 1}</div>
                    <p className="text-base font-semibold text-white">{item.title}</p>
                  </div>
                  <p className="mt-2 pl-11 text-sm leading-7 text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            {SYSTEM_CARDS.map((card) => (
              <motion.div key={card.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[34px] p-7">
                <div className="h-1.5 w-16 rounded-full" style={{ background: card.color }} />
                <h3 className="mt-5 font-display text-2xl font-bold text-white">{card.title}</h3>
                <p className="mt-4 text-sm leading-8 text-gray-400">{card.desc}</p>
              </motion.div>
            ))}
            <div className="sloer-panel rounded-[34px] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ffbf62]/30 bg-[#ffbf62]/12 text-[#ffbf62]">
                <Sparkles size={20} />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-white">Built to expand beyond today&apos;s layouts.</h3>
              <p className="mt-4 text-sm leading-8 text-gray-400">SloerCanvas is not just a visual novelty. It is an experiment in how agentic development environments should feel when multiple threads, multiple agents, and multiple work zones all have to coexist without collapsing into noise.</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] p-8 text-center md:p-14">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,191,98,0.18),transparent_58%)]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[22px] border border-[#ffbf62]/30 bg-[#ffbf62]/12 text-[#ffbf62]">
              <Workflow size={22} />
            </div>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">Join the alpha for the un-scrolled terminal.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">If you want to operate an AI fleet spatially instead of forcing it into stacked panes, SloerCanvas is where that future starts.</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup?plan=STUDIO" className="sloer-button-primary" style={{ background: AMBER, color: "#050505" }}>
                <span>Get early access</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/products/sloerspace" className="sloer-button-secondary">
                <span>See the flagship shell</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
