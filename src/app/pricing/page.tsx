"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Layers3,
  Shield,
  Sparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";
const PINK = "#ff6f96";

const ease = [0.22, 1, 0.36, 1] as const;

type BillingCycle = "monthly" | "annual";

type Plan = {
  tier: string;
  price: Record<BillingCycle, string>;
  desc: string;
  badge?: string | null;
  cta: string;
  href: string;
  color: string;
  highlight?: boolean;
  summary: string;
  features: string[];
};

const PLANS: Plan[] = [
  {
    tier: "Free",
    price: { monthly: "$0", annual: "$0" },
    desc: "Enter the ecosystem and start from the flagship surface.",
    cta: "Create Free Account",
    href: "/signup",
    color: "#6b7280",
    summary: "The entry layer for builders discovering the SloerStudio operating system.",
    features: ["SloerSpace access", "Product ecosystem browsing", "Community surfaces", "Starter workflow access"],
  },
  {
    tier: "Studio",
    price: { monthly: "$16", annual: "$13" },
    desc: "For builders who want the real operating shell.",
    badge: "MOST POPULAR",
    cta: "Start Free Trial",
    href: "/signup?plan=studio",
    color: COBALT,
    highlight: true,
    summary: "Unlock the workspace-grade layer: product execution, prompts, skills, swarms, and stronger control.",
    features: ["Everything in Free", "SloerSwarm access", "Voice + prompts + skills", "Workspace control surfaces"],
  },
  {
    tier: "Enterprise",
    price: { monthly: "$40", annual: "$32" },
    desc: "For teams scaling into governance and expansion.",
    cta: "Start Free Trial",
    href: "/signup?plan=enterprise",
    color: TEAL,
    summary: "Built for bigger control planes, advanced operations, and serious growth into admin, billing, and scale.",
    features: ["Everything in Studio", "Expanded admin capability", "Advanced controls", "Priority expansion access"],
  },
];

const COMPARISON = [
  { feature: "SloerSpace ADE", free: true, studio: true, enterprise: true },
  { feature: "Multi-pane PTY terminal", free: true, studio: true, enterprise: true },
  { feature: "15 built-in themes", free: true, studio: true, enterprise: true },
  { feature: "SloerCanvas (Alpha)", free: true, studio: true, enterprise: true },
  { feature: "Community Discord access", free: true, studio: true, enterprise: true },
  { feature: "SloerSwarm orchestration", free: false, studio: true, enterprise: true },
  { feature: "SloerVoice on-device AI", free: false, studio: true, enterprise: true },
  { feature: "Mission directives & context", free: false, studio: true, enterprise: true },
  { feature: "API key management", free: false, studio: true, enterprise: true },
  { feature: "Kanban task board", free: false, studio: true, enterprise: true },
  { feature: "Email support", free: false, studio: true, enterprise: true },
  { feature: "AI Chat (all providers)", free: false, studio: false, enterprise: true },
  { feature: "Advanced audit logs", free: false, studio: false, enterprise: true },
  { feature: "RBAC & team access", free: false, studio: false, enterprise: true },
  { feature: "Priority support", free: false, studio: false, enterprise: true },
  { feature: "Early access to new products", free: false, studio: false, enterprise: true },
];

const FAQS = [
  { q: "What is included in the Free plan?", a: "Free is the discovery and launch layer. It gives builders access to the core SloerStudio ecosystem, the flagship SloerSpace surface, and the public/community experience without forcing them into paid commitments too early." },
  { q: "What is the Studio plan?", a: "Studio is where the platform starts to feel operational. It brings in the stronger workspace layer — prompts, skills, swarms, richer control, and the more serious day-to-day builder experience." },
  { q: "What is the Enterprise plan?", a: "Enterprise is for teams growing into admin, governance, auditability, advanced workflows, and future company-scale surfaces. It is the expansion layer, not just a bigger feature checklist." },
  { q: "Can I switch plans at any time?", a: "Yes. The pricing architecture is designed for fluid movement between discovery, operation, and scale. Upgrades can happen when the team or workload matures." },
  { q: "Is there an annual discount?", a: "Yes. Annual billing saves 20% on Studio and Enterprise. The toggle above previews the discounted price directly so the value is visible without friction." },
  { q: "Is there a free trial?", a: "Yes. Paid tiers are designed to be easy to trial so users can experience the higher-capability workspace and growth surfaces before committing long-term." },
];

const TOOLKIT = [
  { name: "SloerSpace", desc: "Cross-platform agentic workspace", icon: Layers3, accent: COBALT },
  { name: "SloerSwarm", desc: "Multi-agent system", icon: Workflow, accent: TEAL },
  { name: "SloerVoice", desc: "On-device dictation cockpit", icon: Bot, accent: PINK },
  { name: "SloerCanvas", desc: "Spatial orchestration", icon: Sparkles, accent: AMBER },
];

const SURFACES = [
  {
    title: "Monetization is part of the platform",
    desc: "Pricing should explain the product architecture: enter, operate, expand. That is why the plans feel like system layers instead of arbitrary limits.",
    icon: CreditCard,
    accent: COBALT,
  },
  {
    title: "Enterprise should feel intentional",
    desc: "Admin, billing, governance, audit, subscriptions, and roadmap expansion all need a visible growth path from the pricing surface.",
    icon: Building2,
    accent: TEAL,
  },
  {
    title: "Trust needs a place in the sales story",
    desc: "Security posture, role-aware direction, and serious operational language help the platform feel bigger than a landing page with buttons.",
    icon: Shield,
    accent: AMBER,
  },
  {
    title: "Activation must stay friction-light",
    desc: "Free remains easy to enter, while Studio and Enterprise reveal the premium control layers that justify deeper commitment.",
    icon: Zap,
    accent: PINK,
  },
];

function MotionLink({ href, children, secondary = false, className = "" }: { href: string; children: React.ReactNode; secondary?: boolean; className?: string }) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.985 }} className={className}>
      <Link href={href} className={secondary ? "sloer-button-secondary" : "sloer-button-primary"}>
        {children}
      </Link>
    </motion.div>
  );
}

function SurfaceCard({ title, desc, icon: Icon, accent }: { title: string; desc: string; icon: LucideIcon; accent: string }) {
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

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#4f8cff]/30">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 pb-32 pt-16 md:pt-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }} className="mb-18 grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="sloer-pill inline-flex">Pricing architecture</span>
            <h1 className="mt-7 font-display text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl xl:text-[5.5rem] xl:leading-[0.95]">
              Plans built for
              <span className="block bg-gradient-to-r from-white via-[#4f8cff] to-[#28e7c5] bg-clip-text text-transparent">entry, operation, and scale.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-gray-300">
              SloerStudio pricing should read like a platform map. Free gets builders inside the system. Studio unlocks the real operating shell. Enterprise opens the door to governance, control, and expansion.
            </p>
            <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
              {(["monthly", "annual"] as BillingCycle[]).map((cycle) => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setBilling(cycle)}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${billing === cycle ? "text-[#050505]" : "text-gray-400 hover:text-white"}`}
                >
                  {billing === cycle ? (
                    <motion.span layoutId="billing-pill" className="absolute inset-0 rounded-full bg-[#4f8cff]" transition={{ duration: 0.25, ease }} />
                  ) : null}
                  <span className="relative z-10">{cycle === "monthly" ? "Monthly" : "Annual · Save 20%"}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <MotionLink href="/signup?plan=studio">
                <span>Start Studio</span>
                <ArrowRight size={16} />
              </MotionLink>
              <MotionLink href="/company/contact" secondary>
                <span>Talk to sales</span>
                <ChevronRight size={16} />
              </MotionLink>
            </div>
          </div>
          <div className="sloer-panel rounded-[34px] p-5 md:p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Selected billing</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-5xl font-bold text-white">{billing === "monthly" ? "$16" : "$13"}</span>
                  <span className="pb-1 text-sm text-gray-500">Studio</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-gray-400">{billing === "monthly" ? "Best for flexible entry and fast product activation." : "Best for builders committing to the system and saving immediately."}</p>
              </div>
              <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Growth path</p>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Free", value: "Discover the platform" },
                    { label: "Studio", value: "Operate the workspace" },
                    { label: "Enterprise", value: "Scale the company layer" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="mt-1 text-xs leading-6 text-gray-500">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-[28px] border border-white/8 bg-black/20 p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Why this pricing direction works</p>
                <span className="rounded-full border border-[#28e7c5]/25 bg-[#28e7c5]/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#28e7c5]">Platform-led</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { title: "Low friction", desc: "Free gets people in fast." },
                  { title: "Clear upgrades", desc: "Studio reveals the real shell." },
                  { title: "Enterprise depth", desc: "Expansion is priced intentionally." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-xs leading-6 text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="mb-20 grid grid-cols-1 gap-5 xl:grid-cols-3">
          {PLANS.map((plan) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.65, ease }}
              whileHover={{ y: -8, scale: 1.01 }}
              className={`sloer-panel flex rounded-[34px] p-7 ${plan.highlight ? "ring-1 ring-[#4f8cff]/28" : ""}`}
              style={{ boxShadow: `0 24px 80px rgba(0,0,0,0.4), 0 0 0 1px ${plan.color}22` }}
            >
              <div className="flex w-full flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl font-bold text-white">{plan.tier}</p>
                    <p className="mt-3 text-sm leading-7 text-gray-400">{plan.desc}</p>
                  </div>
                  {plan.badge ? (
                    <div className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: plan.color, borderColor: `${plan.color}40`, background: `${plan.color}12` }}>
                      {plan.badge}
                    </div>
                  ) : null}
                </div>
                <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
                  <div className="flex items-end gap-2">
                    <span className="font-display text-5xl font-bold text-white">{plan.price[billing]}</span>
                    <span className="pb-1 text-sm text-gray-500">{billing === "monthly" ? "/mo" : "/mo billed annually"}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-gray-400">{plan.summary}</p>
                </div>
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-[#28e7c5]">
                        <Sparkles size={12} />
                      </div>
                      <span className="leading-6">{feature}</span>
                    </div>
                  ))}
                </div>
                <MotionLink href={plan.href} className="mt-auto">
                  <span>{plan.cta}</span>
                  <ArrowRight size={16} />
                </MotionLink>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mb-20 grid gap-5 lg:grid-cols-4">
          {SURFACES.map((surface) => (
            <SurfaceCard key={surface.title} {...surface} />
          ))}
        </div>

        {/* Compare plans */}
        <div className="mb-10 text-center">
          <span className="sloer-pill inline-flex">Comparison grid</span>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">See how the layers stack.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">This table exists to make the upgrade path obvious. The platform should feel clear, not confusing.</p>
        </div>
        <div className="sloer-panel mb-20 overflow-hidden rounded-[34px]">
          <div className="grid grid-cols-[1.65fr_1fr_1fr_1fr] border-b border-white/8 bg-white/[0.03]">
            <div className="p-5 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">Feature</div>
            {["Free", "Studio", "Enterprise"].map((t) => (
              <div key={t} className="p-5 text-center text-sm font-bold text-white border-l border-white/5">{t}</div>
            ))}
          </div>
          {COMPARISON.map((row, i) => (
            <div key={row.feature} className={`grid grid-cols-[1.65fr_1fr_1fr_1fr] border-b border-white/5 last:border-0 ${i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}`}>
              <div className="p-4 text-sm text-gray-300 md:text-[15px]">{row.feature}</div>
              {[row.free, row.studio, row.enterprise].map((val, j) => (
                <div key={j} className="flex items-center justify-center border-l border-white/5 p-4">
                  {val ? <Check size={16} className="text-[#28e7c5]" /> : <X size={14} className="text-gray-700" />}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Toolkit */}
        <div className="mb-16 text-center">
          <span className="sloer-pill inline-flex">Toolkit surfaces</span>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Every plan connects to the wider system.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-gray-400 md:text-lg">The pricing page should reinforce the ecosystem: flagship workspace, agent orchestration, voice, canvas, docs, and company-scale expansion.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {TOOLKIT.map((t) => (
              <motion.div key={t.name} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-6 text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border" style={{ background: `${t.accent}16`, borderColor: `${t.accent}32`, color: t.accent }}>
                  <t.icon size={20} />
                </div>
                <p className="mt-5 font-display text-2xl font-bold text-white">{t.name}</p>
                <p className="mt-2 text-sm leading-7 text-gray-400">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10 text-center">
          <span className="sloer-pill inline-flex">FAQ</span>
          <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl">Questions that move deals forward.</h2>
        </div>
        <div className="mb-20 space-y-3">
          {FAQS.map((faq, index) => (
            <div key={faq.q} className="sloer-panel rounded-[28px] px-5 py-3 md:px-6">
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 py-3 text-left">
                <span className="text-base font-semibold text-white">{faq.q}</span>
                <motion.span animate={{ rotate: openFaq === index ? 180 : 0 }} transition={{ duration: 0.22 }} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400">
                  <ChevronDown size={16} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === index ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.24, ease }}
                    className="overflow-hidden"
                  >
                    <p className="pb-4 text-sm leading-8 text-gray-400">{faq.a}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] p-8 text-center md:p-14">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(79,140,255,0.18),transparent_58%)]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">Choose the layer that matches your ambition.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">Start free, move into Studio when you want the real shell, and grow into Enterprise when the platform becomes operational infrastructure.</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <MotionLink href="/signup">
                <span>Start for Free</span>
                <ArrowRight size={16} />
              </MotionLink>
              <MotionLink href="/company/contact" secondary>
                <span>Talk about Enterprise</span>
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
