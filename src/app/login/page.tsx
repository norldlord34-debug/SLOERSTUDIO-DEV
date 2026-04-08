"use client";
import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Shield, Sparkles, Workflow } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";

const HIGHLIGHTS = [
  {
    title: "Return to the workspace fast",
    desc: "Your next action should feel close: sign in, land in the right destination, and continue the mission without friction.",
    accent: "#4f8cff",
  },
  {
    title: "Access is part of the product experience",
    desc: "Auth should feel like an extension of the premium system, not a forgotten utility screen disconnected from the brand.",
    accent: "#28e7c5",
  },
];

const METRICS = [
  { label: "Flagship", value: "SloerSpace" },
  { label: "Destination", value: "/app + /admin" },
  { label: "Session mode", value: "Credentials auth" },
  { label: "Direction", value: "Role-aware access" },
];

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/app/dashboard";
  const destination = callbackUrl.includes("/admin") ? "superadmin control" : callbackUrl.includes("/app") ? "workspace" : "SloerStudio";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <>
      {/* Brand */}
      <AuthShell
        eyebrow="Access // Sign in"
        title={<>Continue inside the <span className="bg-gradient-to-r from-white via-[#4f8cff] to-[#28e7c5] bg-clip-text text-transparent">SloerStudio control layer.</span></>}
        description="Move from the premium public system into your workspace, account context, and future admin surfaces with a cleaner, sharper sign-in experience."
        highlights={HIGHLIGHTS}
        metrics={METRICS}
        cta={{ href: "/signup", label: "Create account" }}
        secondaryCta={{ href: "/pricing", label: "View pricing" }}
      >
        <div className="sloer-panel rounded-[36px] p-6 md:p-8">
          <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Destination</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-white">Welcome back</h1>
            <p className="mt-3 text-sm leading-7 text-gray-400">Sign in to continue to your {destination}. Your session will respect the callback route already requested.</p>
          </div>

          {error && (
            <div className="mt-5 flex items-center gap-2.5 rounded-[24px] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-400">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#4f8cff] transition-colors hover:text-white">Forgot password?</Link>
              </div>
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Secure session flow",
                desc: "Credentials auth today, stronger role-aware access tomorrow.",
                icon: Shield,
                accent: "#4f8cff",
              },
              {
                title: "Premium continuity",
                desc: "The experience should feel consistent from public web to workspace entry.",
                icon: Workflow,
                accent: "#28e7c5",
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

          <div className="mt-6 rounded-[28px] border border-white/8 bg-black/20 p-5 text-sm text-gray-400">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300">
                <Sparkles size={13} />
                Smooth handoff into /app
              </span>
            </div>
            <p className="mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-[#4f8cff] transition-colors hover:text-white">Create one free</Link>
            </p>
          </div>
        </div>
      </AuthShell>
    </>
  );
}
