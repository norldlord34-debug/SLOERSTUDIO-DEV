import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, X } from "lucide-react";

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";

const PLANS = [
  {
    tier: "Free",
    price: { monthly: "$0", annual: "$0" },
    desc: "Get started with the agentic future.",
    badge: null,
    cta: "Create Free Account",
    href: "/signup",
    color: "#6b7280",
  },
  {
    tier: "Studio",
    price: { monthly: "$16", annual: "$13" },
    desc: "Your agent development environment, ready to go.",
    badge: "MOST POPULAR",
    cta: "Start Free Trial",
    href: "/signup?plan=studio",
    color: COBALT,
    highlight: true,
  },
  {
    tier: "Enterprise",
    price: { monthly: "$40", annual: "$32" },
    desc: "The full stack for teams who ship at AI speed.",
    badge: null,
    cta: "Start Free Trial",
    href: "/signup?plan=enterprise",
    color: TEAL,
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
  { q: "What is included in the Free plan?", a: "The Free plan includes the full SloerSpace ADE desktop app, multi-pane PTY terminal, SloerCanvas (Alpha), 15 themes, and community Discord access. It's free forever." },
  { q: "What is the Studio plan?", a: "Studio ($16/mo) adds SloerSwarm multi-agent orchestration, SloerVoice on-device AI transcription, mission directives, API key management, kanban board, and email support." },
  { q: "What is the Enterprise plan?", a: "Enterprise ($40/mo) includes everything in Studio plus AI Chat with all providers, advanced audit logs, RBAC team access, priority support, and early access to new products." },
  { q: "Can I switch plans at any time?", a: "Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period." },
  { q: "Is there an annual discount?", a: "Yes. Annual billing saves 20% on both Studio and Enterprise plans." },
  { q: "Is there a free trial?", a: "Yes. Both Studio and Enterprise plans come with a 7-day free trial. No credit card required to start." },
];

const TOOLKIT = [
  { name: "SloerSpace", desc: "ADE" },
  { name: "SloerSwarm", desc: "Multi-Agent" },
  { name: "SloerVoice", desc: "Voice AI" },
  { name: "SloerCanvas", desc: "Canvas IDE" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#4f8cff]/30">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4f8cff]/10 border border-[#4f8cff]/20 text-xs font-medium text-[#4f8cff] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4f8cff]" />
            Agentic pricing — no surprises
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">
            Simple Plans for Every <span className="text-[#4f8cff]">Builder</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            The agentic coding platform for every stage. Free forever with optional paid tiers.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-20">
          {PLANS.map((plan) => (
            <div
              key={plan.tier}
              className={`p-7 rounded-2xl border flex flex-col gap-5 ${
                plan.highlight
                  ? "border-[#4f8cff]/40 bg-[#4f8cff]/5 ring-1 ring-[#4f8cff]/20"
                  : "border-white/8 bg-white/[0.02]"
              }`}
            >
              {plan.badge ? (
                <div className="text-[9px] font-bold px-2.5 py-1 rounded-full w-fit border" style={{ color: plan.color, borderColor: `${plan.color}40`, background: `${plan.color}12` }}>
                  {plan.badge}
                </div>
              ) : <div className="h-6" />}

              <div>
                <p className="font-bold text-white font-display text-lg">{plan.tier}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-bold font-display text-white">{plan.price.monthly}</span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">{plan.desc}</p>
              </div>

              <Link
                href={plan.href}
                className="w-full py-3 rounded-xl font-semibold text-sm text-center transition-all hover:opacity-90"
                style={plan.highlight ? { background: COBALT, color: "#050505" } : { background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Compare plans */}
        <h2 className="text-2xl font-bold font-display text-center mb-10">Compare Plans</h2>
        <div className="rounded-2xl border border-white/8 overflow-hidden mb-20">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-white/8">
            <div className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Feature</div>
            {["Free", "Studio", "Enterprise"].map((t) => (
              <div key={t} className="p-5 text-sm font-bold text-white text-center border-l border-white/5">{t}</div>
            ))}
          </div>
          {COMPARISON.map((row, i) => (
            <div key={row.feature} className={`grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-white/5 last:border-0 ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
              <div className="p-4 text-sm text-gray-300">{row.feature}</div>
              {[row.free, row.studio, row.enterprise].map((val, j) => (
                <div key={j} className="p-4 flex items-center justify-center border-l border-white/5">
                  {val ? <Check size={15} className="text-[#28e7c5]" /> : <X size={13} className="text-gray-700" />}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Toolkit */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold font-display mb-3">The Agentic Coding Toolkit</h2>
          <p className="text-gray-400 mb-10">Every plan comes with access to all the fundamental tools. Pro tiers unlock the full fleet.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {TOOLKIT.map((t) => (
              <div key={t.name} className="p-5 rounded-2xl border border-white/8 bg-white/[0.02] text-center min-w-[130px]">
                <p className="font-bold text-white text-sm mb-1">{t.name}</p>
                <p className="text-xs text-gray-500">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold font-display text-center mb-10">Questions & Answers</h2>
        <div className="space-y-2 mb-20">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group rounded-xl border border-white/8 bg-white/[0.02]">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="text-sm font-medium text-white">{faq.q}</span>
                <span className="text-gray-500 group-open:rotate-180 transition-transform text-lg leading-none">↓</span>
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center p-12 rounded-2xl border border-white/8 bg-white/[0.01] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${COBALT}08 0%, transparent 70%)` }} />
          <h2 className="text-3xl font-bold font-display mb-3 relative z-10">Ready to start building?</h2>
          <p className="text-gray-400 mb-8 relative z-10">Join the free plan now — no credit card required.</p>
          <Link href="/signup" className="inline-flex px-8 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105 relative z-10" style={{ background: COBALT, color: "#050505" }}>
            Start for Free →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
