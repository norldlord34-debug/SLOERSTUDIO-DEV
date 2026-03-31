"use client";
import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Zap, AlertCircle, Check } from "lucide-react";

const PLANS = [
  { id: "FREE", label: "Free", price: "$0", desc: "Core IDE + terminal" },
  { id: "STUDIO", label: "Studio", price: "$16/mo", desc: "Full swarm + agents" },
  { id: "ENTERPRISE", label: "Enterprise", price: "$40/mo", desc: "Unlimited scale" },
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <div className="w-8 h-8 rounded-lg bg-[#4f8cff]/15 border border-[#4f8cff]/30 flex items-center justify-center">
          <Zap size={14} className="text-[#4f8cff]" fill="currentColor" />
        </div>
        <span className="font-bold text-lg tracking-tight font-display">SloerStudio</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="p-8 rounded-2xl border border-white/8 bg-white/[0.025]">
          <h1 className="text-2xl font-bold font-display mb-1">Create your account</h1>
          <p className="text-gray-400 text-sm mb-8">Start building with AI agents. Free forever.</p>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
              <AlertCircle size={15} className="flex-shrink-0" />{error}
            </div>
          )}

          {/* Plan selector */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-400 mb-3">Choose your plan</label>
            <div className="grid grid-cols-3 gap-2">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlan(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${plan === p.id ? "border-[#4f8cff]/50 bg-[#4f8cff]/8" : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{p.label}</span>
                    {plan === p.id && <Check size={11} className="text-[#4f8cff]" />}
                  </div>
                  <p className="text-[10px] font-semibold" style={{ color: "#4f8cff" }}>{p.price}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Satoshi Nakamoto"
                className="w-full px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                className="w-full px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password <span className="text-gray-600">(min. 8 chars)</span></label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50 transition-colors pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 mt-2" style={{ background: "#4f8cff", color: "#050505" }}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-5">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-gray-400 hover:text-white underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-gray-400 hover:text-white underline">Privacy Policy</Link>.
          </p>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#4f8cff] hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
