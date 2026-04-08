"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  Globe,
  Rocket,
  Shield,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";
const PINK = "#ff6f96";
const ease = [0.22, 1, 0.36, 1] as const;

const MANIFESTO = [
  {
    title: "This is not marketing language. It is the operating model.",
    body: "We build the products we want to work inside. SloerSpace is the flagship shell. SloerSwarm is how we coordinate. SloerVoice helps compress thought into action. We use the ecosystem to build the ecosystem.",
    icon: Workflow,
    accent: COBALT,
  },
  {
    title: "AI agents are teammates when the system is designed correctly.",
    body: "SloerStudio is built around role clarity, context quality, persistent execution, and orchestrated flows. That is how human and AI operators stop feeling like demos and start feeling like a real team.",
    icon: Users,
    accent: TEAL,
  },
];

const PRINCIPLES = [
  {
    title: "Open core foundation",
    desc: "Trust begins with tangible product value, not empty access gates. That is why the flagship layer can remain open at its foundation while the ecosystem scales upward.",
    icon: Shield,
    accent: COBALT,
  },
  {
    title: "Operator-first design",
    desc: "We care about the people actually using the product to ship. That means sharper control surfaces, better context flow, and less decorative fluff without substance.",
    icon: Zap,
    accent: TEAL,
  },
  {
    title: "Platform-level ambition",
    desc: "The company is bigger than one product. Public web, app, billing, docs, admin, and community all need to feel like one ecosystem under one brand system.",
    icon: Building2,
    accent: AMBER,
  },
  {
    title: "Global product mindset",
    desc: "We are building for developers everywhere. The product language has to scale across audiences, geographies, teams, and operating maturity levels.",
    icon: Globe,
    accent: PINK,
  },
];

const TRAJECTORY = [
  { title: "Flagship", desc: "SloerSpace establishes the core product gravity.", accent: COBALT },
  { title: "Coordination", desc: "SloerSwarm introduces a real operator model for multi-agent work.", accent: TEAL },
  { title: "Expansion", desc: "Docs, pricing, community, admin, billing, and future products build outward from that core.", accent: AMBER },
  { title: "Company scale", desc: "SloerStudio matures from a product website into a software company system.", accent: PINK },
];

const METRICS = [
  { label: "Company type", value: "Product-led AI software company" },
  { label: "Flagship", value: "SloerSpace" },
  { label: "Operating model", value: "Human + AI operators" },
  { label: "Direction", value: "Enterprise-ready ecosystem" },
];

function MotionLink({ href, children, secondary = false, className = "" }: { href: string; children: ReactNode; secondary?: boolean; className?: string }) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.985 }} className={className}>
      <Link href={href} className={secondary ? "sloer-button-secondary" : "sloer-button-primary"}>
        {children}
      </Link>
    </motion.div>
  );
}

function PrincipleCard({ title, desc, icon: Icon, accent }: { title: string; desc: string; icon: LucideIcon; accent: string }) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${accent}16`, borderColor: `${accent}30`, color: accent }}>
        <Icon size={20} />
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-gray-400">{desc}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-16 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }} className="mb-24 grid gap-10 lg:grid-cols-[0.96fr_1.04fr]">
          <div>
            <span className="sloer-pill inline-flex">Company // SloerStudio</span>
            <h1 className="mt-7 font-display text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl xl:text-[5.5rem] xl:leading-[0.95]">
              We are building an
              <span className="block bg-gradient-to-r from-white via-[#4f8cff] to-[#28e7c5] bg-clip-text text-transparent">agentic software company.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-gray-300">
              SloerStudio exists to give developers a sharper way to build: better product surfaces, clearer orchestration, stronger operating systems for human and AI collaboration, and an ecosystem that scales from product to company.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <MotionLink href="/signup">
                <span>Enter SloerStudio</span>
                <ArrowRight size={16} />
              </MotionLink>
              <MotionLink href="/company/careers" secondary>
                <span>Join the team</span>
                <ChevronRight size={16} />
              </MotionLink>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Product-led growth",
                "Operator mindset",
                "Built for long-term expansion",
              ].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-300">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {METRICS.map((metric) => (
                <div key={metric.label} className="sloer-panel rounded-2xl px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{metric.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="sloer-panel rounded-[36px] p-6 md:p-8">
            <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Manifesto</p>
              <h2 className="mt-4 font-display text-3xl font-bold text-white">Small teams should be able to build like powerful companies.</h2>
              <p className="mt-5 text-sm leading-8 text-gray-400">We believe the next wave of software will be created by compact, high-leverage teams using AI operators with real context, real tools, and real ownership. That requires better products, not better hype.</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {TRAJECTORY.map((item) => (
                <div key={item.title} className="rounded-[26px] border border-white/8 bg-white/[0.03] p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{item.title}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{item.desc}</p>
                  <span className="mt-4 block h-1.5 w-14 rounded-full" style={{ background: item.accent }} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mb-24 grid gap-5 lg:grid-cols-2">
          {MANIFESTO.map((item) => (
            <motion.div key={item.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[34px] p-7 md:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${item.accent}16`, borderColor: `${item.accent}30`, color: item.accent }}>
                <item.icon size={20} />
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-8 text-gray-400">{item.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-24 text-center">
          <span className="sloer-pill inline-flex">Mission and vision</span>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">We want software creation to feel faster, clearer, and more leverage-rich.</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-9 text-gray-300">Our mission is to give developers access to a better operating environment for building with AI. Our vision is a world where small teams ship at a level that used to require much larger organizations.</p>
        </div>

        <div className="mb-24 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PRINCIPLES.map((principle) => (
            <PrincipleCard key={principle.title} {...principle} />
          ))}
        </div>

        <div className="mb-24 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="sloer-panel rounded-[36px] p-7 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Operating model</p>
            <h2 className="mt-4 font-display text-4xl font-bold text-white">How we think about building the company.</h2>
            <div className="mt-8 space-y-4">
              {[
                { title: "Build the flagship first", desc: "SloerSpace must be strong enough to anchor the identity of the whole company." },
                { title: "Design for the ecosystem", desc: "Products, pricing, docs, admin, community, and billing should feel like one coordinated operating system." },
                { title: "Make expansion legible", desc: "Every new module should strengthen the company structure instead of making the product sprawl feel random." },
                { title: "Ship with clarity", desc: "Great UI matters, but it only wins if the product logic and business logic underneath it stay coherent." },
              ].map((point, index) => (
                <div key={point.title} className="rounded-[26px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-sm font-semibold text-white">{index + 1}</div>
                    <p className="text-base font-semibold text-white">{point.title}</p>
                  </div>
                  <p className="mt-2 pl-11 text-sm leading-7 text-gray-400">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5">
            {[
              {
                title: "Product depth over facade",
                desc: "We want the visual layer to feel premium because the product underneath is intended to scale into something serious, not because decoration hides weak foundations.",
                icon: Sparkles,
                accent: COBALT,
              },
              {
                title: "Expansion without dilution",
                desc: "SloerStudio can add new products and new company surfaces, but they must all reinforce the brand system and the operating logic instead of fragmenting it.",
                icon: Rocket,
                accent: TEAL,
              },
            ].map((item) => (
              <motion.div key={item.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[34px] p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${item.accent}16`, borderColor: `${item.accent}30`, color: item.accent }}>
                  <item.icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-8 text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] p-8 text-center md:p-14">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(79,140,255,0.16),transparent_58%)]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">Help shape the next version of software building.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">If you care about premium product design, AI operator systems, and building a real software company around them, SloerStudio is only getting started.</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <MotionLink href="/company/careers">
                <span>View open positions</span>
                <ArrowRight size={16} />
              </MotionLink>
              <MotionLink href="/company/contact" secondary>
                <span>Contact the company</span>
                <ChevronRight size={16} />
              </MotionLink>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
