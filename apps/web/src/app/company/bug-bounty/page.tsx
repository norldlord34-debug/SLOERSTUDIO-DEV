import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Bug, Bitcoin, Shield, ChevronDown } from "lucide-react";

const TIERS = [
  { label: "Low", range: "$0.50 – $1", color: "#6b7280" },
  { label: "Medium", range: "$1.50 – $3", color: "#ffbf62" },
  { label: "High", range: "$3.50 – $5", color: "#ff6f96" },
];

const STEPS = [
  { title: "Sign Up", desc: "Register via our Discord server with your BTC wallet address.", icon: "1" },
  { title: "Find a Bug", desc: "Test SloerStudio products and discover security vulnerabilities or critical bugs.", icon: "2" },
  { title: "Submit Report", desc: "Report the issue via our Discord server with full reproduction steps.", icon: "3" },
  { title: "Earn Bitcoin", desc: "Valid bugs earn Bitcoin rewards based on severity within 48 hours.", icon: "4" },
];

const RULES = [
  "Only report bugs in SloerStudio-owned products and infrastructure",
  "No social engineering attacks or phishing",
  "No DDoS or service disruption attacks",
  "Provide clear reproduction steps and proof of concept",
  "Do not publicly disclose bugs before we patch them",
  "One reward per unique bug per researcher",
];

const FAQS = [
  { q: "What counts as a valid bug?", a: "Security vulnerabilities, authentication bypasses, data leaks, RCE, and other critical functional bugs in SloerStudio products." },
  { q: "How long until I get paid?", a: "Valid bugs are reviewed within 48 hours. Bitcoin rewards are sent within 72 hours of validation." },
  { q: "What if my bug is a duplicate?", a: "Only the first report of a unique bug receives a reward. We&apos;ll notify you if your report is a duplicate." },
  { q: "Can I report UI/UX issues?", a: "UI/UX issues are not eligible for bounty but are always welcome via GitHub Issues." },
];

export default function BugBountyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-32">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Security Program</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">Bug Bounty</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Help us make SloerStudio products more secure by testing, discovering, and reporting bugs. Earn Bitcoin rewards for valid reports.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#28e7c5]/10 border border-[#28e7c5]/20 text-xs font-semibold text-[#28e7c5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28e7c5]" />
              Program Active — Submit Reports
            </div>
          </div>
        </div>

        {/* Tiers */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-display text-center mb-4">Reward Tiers</h2>
          <p className="text-gray-400 text-center mb-8">Rewards are paid in Bitcoin based on the severity and impact of the reported bug.</p>
          <div className="grid grid-cols-3 gap-4">
            {TIERS.map((tier) => (
              <div key={tier.label} className="p-5 rounded-2xl border border-white/8 bg-white/[0.02] text-center">
                <div className="w-3 h-3 rounded-full mx-auto mb-3" style={{ background: tier.color }} />
                <p className="font-bold text-white font-display">{tier.label}</p>
                <p className="text-sm font-semibold mt-1" style={{ color: tier.color }}>{tier.range}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Bitcoin size={11} className="text-[#f7931a]" />
                  <span className="text-[10px] text-gray-500">BTC rewards</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold font-display text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STEPS.map((step) => (
              <div key={step.title} className="p-5 rounded-2xl border border-white/8 bg-white/[0.02] text-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3 bg-[#4f8cff]/15 text-[#4f8cff] border border-[#4f8cff]/25">{step.icon}</div>
                <p className="font-bold text-white mb-2 text-sm font-display">{step.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="p-7 rounded-2xl border border-white/8 bg-white/[0.01] mb-12">
          <h2 className="font-bold text-white mb-5 font-display flex items-center gap-2"><Shield size={16} className="text-[#4f8cff]" /> Rules & Guidelines</h2>
          <div className="space-y-2.5">
            {RULES.map((rule) => (
              <div key={rule} className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="text-[#28e7c5] flex-shrink-0 mt-0.5">✓</span>{rule}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold font-display text-center mb-8">FAQ</h2>
        <div className="space-y-2 mb-16">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group rounded-xl border border-white/8 bg-white/[0.02]">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="text-sm font-medium text-white">{faq.q}</span>
                <ChevronDown size={14} className="text-gray-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a }} />
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-2xl border border-white/8 bg-white/[0.01] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(79,140,255,0.05) 0%, transparent 70%)" }} />
          <Bug size={36} className="text-[#4f8cff] mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-display mb-2 relative z-10">Ready to start hunting?</h2>
          <p className="text-gray-400 text-sm mb-6 relative z-10">Sign up via our app to register your BTC wallet and Discord username.</p>
          <div className="flex gap-4 justify-center relative z-10">
            <Link href="/login" className="px-6 py-3 rounded-xl font-semibold text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white">
              Log In
            </Link>
            <Link href="/signup" className="px-6 py-3 rounded-xl font-semibold text-sm bg-[#4f8cff] text-black hover:bg-[#6ba3ff] transition-colors">
              Sign Up for SloerStudio
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
