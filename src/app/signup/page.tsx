"use client";
import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Check, Eye, EyeOff, Rocket, Shield, Sparkles, Workflow } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

const PLANS = [
  { id: "FREE", label: "Free", price: "$0", desc: "Core flagship access", accent: "#6b7280", detail: "Start inside SloerStudio without friction and explore the ecosystem." },
  { id: "STUDIO", label: "Studio", price: "$16/mo", desc: "Full workspace layer", accent: "#4f8cff", detail: "Unlock the serious operating shell with swarms, prompts, skills, and stronger control." },
  { id: "ENTERPRISE", label: "Enterprise", price: "$40/mo", desc: "Company-scale growth", accent: "#28e7c5", detail: "Expand into admin, governance, billing depth, and higher-control operations." },
];

const HIGHLIGHTS = [
  {
    title: "Choose the right entry point",
    desc: "Free gets you inside. Studio gives you the stronger shell. Enterprise prepares the platform for scale and company-level depth.",
    accent: "#4f8cff",
  },
  {
    title: "Onboarding should sell the system",
    desc: "Signup is not just data capture. It is where users understand what SloerStudio is and why the ecosystem is worth entering.",
    accent: "#28e7c5",
  },
];

const METRICS = [
  { label: "Plans", value: "Free · Studio · Enterprise" },
  { label: "Flagship", value: "SloerSpace" },
  { label: "Expansion", value: "Workspace to admin" },
  { label: "Onboarding", value: "Immediate access" },
];

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultPlan = (params.get("plan") ?? "FREE").toUpperCase();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [plan, setPlan] = useState(defaultPlan);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedPlan = PLANS.find((item) => item.id === plan) ?? PLANS[0];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: email.toLowerCase().trim(), password, plan }),
    });
    if (!res.ok) {
      const data = await res.json();
      setLoading(false);
      setError(data.error?.message ?? data.error ?? "Registration failed. Please try again.");
      return;
    }
    const signInRes = await signIn("credentials", { email: email.toLowerCase().trim(), password, redirect: false });
    setLoading(false);
    if (signInRes?.error) { setError("Account created but login failed. Please sign in manually."); return; }
    router.push("/app/dashboard");
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Access // Create account"
      title={<>Enter the system and start from the <span className="bg-gradient-to-r from-white via-[#4f8cff] to-[#28e7c5] bg-clip-text text-transparent">right layer.</span></>}
      description="Signup should feel like entering a real software company platform: clear value, visible plan logic, and immediate continuity into the flagship workspace and future operating surfaces."
      highlights={HIGHLIGHTS}
      metrics={METRICS}
      cta={{ href: "/pricing", label: "Compare plans" }}
      secondaryCta={{ href: "/login", label: "Already have access?" }}
    >
      <div className="sloer-panel rounded-[36px] p-6 md:p-8">
        <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
          <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Selected entry point</p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-white">Create your account</h1>
              <p className="mt-3 text-sm leading-7 text-gray-400">You&apos;re entering through the <span className="font-semibold text-white">{selectedPlan.label}</span> layer. You can change this now and upgrade later as the product depth you need increases.</p>
            </div>
            <span className="rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: selectedPlan.accent, borderColor: `${selectedPlan.accent}40`, background: `${selectedPlan.accent}12` }}>
              {selectedPlan.price}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-5 flex items-center gap-2.5 rounded-[24px] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Plan selector */}
        <div className="mt-6">
          <label className="mb-3 block text-xs font-medium text-gray-400">Choose your plan</label>
          <div className="grid gap-3 md:grid-cols-3">
            {PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlan(p.id)}
                className={`rounded-[24px] border p-4 text-left transition-all ${plan === p.id ? "bg-white/[0.05]" : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"}`}
                style={plan === p.id ? { borderColor: `${p.accent}50`, boxShadow: `0 0 0 1px ${p.accent}22 inset` } : undefined}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-white">{p.label}</span>
                  {plan === p.id ? <Check size={14} style={{ color: p.accent }} /> : null}
                </div>
                <p className="mt-2 text-sm font-semibold" style={{ color: p.accent }}>{p.price}</p>
                <p className="mt-2 text-xs text-gray-400">{p.desc}</p>
                <p className="mt-3 text-[11px] leading-5 text-gray-500">{p.detail}</p>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Satoshi Nakamoto"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white placeholder-gray-600 transition-colors focus:border-[#4f8cff]/50 focus:bg-white/[0.08] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5 text-sm text-white placeholder-gray-600 transition-colors focus:border-[#4f8cff]/50 focus:bg-white/[0.08] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">Password <span className="text-gray-600">(min. 8 chars)</span></label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3.5 pr-11 text-sm text-white placeholder-gray-600 transition-colors focus:border-[#4f8cff]/50 focus:bg-white/[0.08] focus:outline-none"
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="sloer-button-primary mt-2 w-full justify-center disabled:opacity-50">
            {loading ? "Creating account..." : `Create ${selectedPlan.label} account`}
          </button>
        </form>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Fast activation", desc: "Account creation flows directly into the workspace experience.", icon: Rocket, accent: "#4f8cff" },
            { title: "Secure onboarding", desc: "Credential handling stays aligned with the current NextAuth flow.", icon: Shield, accent: "#28e7c5" },
            { title: "Ecosystem continuity", desc: "Plans connect cleanly to pricing, products, and future admin depth.", icon: Workflow, accent: "#ffbf62" },
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

        <div className="mt-6 rounded-[28px] border border-white/8 bg-black/20 p-5 text-sm text-gray-400">
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300">
              <Sparkles size={13} />
              Immediate sign-in after registration
            </span>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-gray-300 underline transition-colors hover:text-white">Terms</Link> and{" "}
            <Link href="/privacy" className="text-gray-300 underline transition-colors hover:text-white">Privacy Policy</Link>.
          </p>
          <p className="mt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#4f8cff] transition-colors hover:text-white">Sign in</Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
