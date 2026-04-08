"use client";

import Link from "next/link";
import { ArrowRight, KeyRound, LifeBuoy, Mail, ShieldCheck } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

const HIGHLIGHTS = [
  {
    title: "Security before convenience",
    desc: "Recovery flows should be strong enough for a serious platform. That means verification, safe reset tokens, and future support for stronger identity layers.",
    accent: "#4f8cff",
  },
  {
    title: "Temporary support route",
    desc: "Until the full secure reset system is launched, we keep recovery explicit and support-led instead of shipping a weak or misleading flow.",
    accent: "#28e7c5",
  },
];

const METRICS = [
  { label: "Recovery mode", value: "Support-assisted" },
  { label: "Security focus", value: "Hardened access design" },
  { label: "Next phase", value: "Reset + verification" },
  { label: "Direction", value: "2FA-ready future" },
];

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Access // Recovery"
      title={<>Recover access without weakening the <span className="bg-gradient-to-r from-white via-[#4f8cff] to-[#28e7c5] bg-clip-text text-transparent">trust layer.</span></>}
      description="Password recovery is being upgraded as part of the broader auth expansion. We prefer a safer, more explicit path now rather than pretending a reset system exists when it is not ready yet."
      highlights={HIGHLIGHTS}
      metrics={METRICS}
      cta={{ href: "/company/contact", label: "Contact support" }}
      secondaryCta={{ href: "/login", label: "Back to sign in" }}
    >
      <div className="sloer-panel rounded-[36px] p-6 md:p-8">
        <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Recovery status</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-white">Secure recovery is being upgraded.</h1>
          <p className="mt-3 text-sm leading-7 text-gray-400">We are intentionally not shipping a shallow password reset experience. While the new recovery system is being built, access help is handled through the support route.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Support-led verification",
              desc: "Identity recovery should be explicit and safer than a weak generic reset pattern.",
              icon: LifeBuoy,
              accent: "#4f8cff",
            },
            {
              title: "Email-aware next phase",
              desc: "The future version will include proper tokenized email reset and stronger verification rails.",
              icon: Mail,
              accent: "#28e7c5",
            },
            {
              title: "Security-first posture",
              desc: "Recovery design is being aligned with the broader auth roadmap, including stronger trust signals.",
              icon: ShieldCheck,
              accent: "#ffbf62",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border" style={{ background: `${item.accent}16`, borderColor: `${item.accent}30`, color: item.accent }}>
                <item.icon size={18} />
              </div>
              <p className="mt-4 text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-xs leading-6 text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[28px] border border-white/8 bg-black/20 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#4f8cff]/30 bg-[#4f8cff]/12 text-[#4f8cff]">
              <KeyRound size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Current recovery path</p>
              <p className="text-xs text-gray-500">A safer temporary route while full reset flows are implemented.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              "Open the support/contact route.",
              "Explain which account you need help recovering.",
              "Continue once the secure access assistance path is verified.",
            ].map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-xs font-semibold text-white">{index + 1}</div>
                <p className="text-sm leading-7 text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Link href="/company/contact" className="sloer-button-primary flex-1 justify-center">
            <span>Open support route</span>
            <ArrowRight size={16} />
          </Link>
          <Link href="/login" className="sloer-button-secondary flex-1 justify-center">
            Return to sign in
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
