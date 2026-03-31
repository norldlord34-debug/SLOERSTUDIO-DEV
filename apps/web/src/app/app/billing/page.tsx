import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreditCard, Check, ArrowLeft, Zap } from "lucide-react";

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";

const PLANS = [
  {
    tier: "Free",
    price: "$0",
    desc: "Get started with the agentic future.",
    color: "#6b7280",
    features: ["SloerSpace ADE", "Multi-pane PTY terminal", "SloerCanvas (Alpha)", "15 themes", "Community Discord access"],
    cta: "Downgrade to Free",
    action: "downgrade",
  },
  {
    tier: "Studio",
    price: "$16",
    period: "/mo",
    desc: "Your agent development environment, ready to go.",
    color: COBALT,
    features: ["Everything in Free", "SloerSwarm orchestration", "SloerVoice on-device AI", "Mission directives", "API key management", "Email support"],
    cta: "Switch to Studio",
    action: "upgrade-studio",
    badge: "CURRENT",
  },
  {
    tier: "Enterprise",
    price: "$40",
    period: "/mo",
    desc: "The full stack for teams who ship at AI speed.",
    color: TEAL,
    features: ["Everything in Studio", "AI Chat (all providers)", "Advanced audit logs", "RBAC & team access", "Priority support", "Early access to products"],
    cta: "Upgrade to Enterprise",
    action: "upgrade-enterprise",
  },
];

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const user = session.user as { name?: string; email?: string; plan?: string };
  const currentPlan = user.plan ?? "FREE";

  return (
    <div className="p-8">
      <Link href="/app/settings" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
        <ArrowLeft size={14} /> Back to Settings
      </Link>

      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold font-display mb-2">
          Manage your <span className="text-[#4f8cff]">plan</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          You&apos;re on the <strong className="text-white capitalize">{currentPlan.toLowerCase()}</strong> plan.
        </p>

        {/* Toggle */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-sm font-medium text-white">Monthly</span>
          <div className="w-10 h-5 rounded-full bg-[#4f8cff] flex items-center px-0.5 cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-white ml-auto" />
          </div>
          <span className="text-sm font-medium text-white">Annual</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#28e7c5]/10 text-[#28e7c5] border border-[#28e7c5]/20">Save 20%</span>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {PLANS.map((plan) => {
            const isCurrent = plan.badge === "CURRENT" || (currentPlan === "FREE" && plan.tier === "Free");
            return (
              <div
                key={plan.tier}
                className={`p-6 rounded-2xl border flex flex-col gap-4 ${isCurrent ? "border-[#4f8cff]/40 bg-[#4f8cff]/5" : "border-white/8 bg-white/[0.02]"}`}
              >
                {isCurrent && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full w-fit border" style={{ color: COBALT, borderColor: `${COBALT}40`, background: `${COBALT}12` }}>
                    ✓ CURRENT PLAN
                  </span>
                )}
                <div>
                  <p className="font-bold text-white font-display">{plan.tier}</p>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className="text-3xl font-bold font-display text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{plan.desc}</p>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
                      <Check size={11} className="flex-shrink-0 mt-0.5" style={{ color: TEAL }} />{f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <div className="py-2.5 rounded-xl text-center text-xs font-semibold text-gray-500 border border-white/5">
                    Current Plan
                  </div>
                ) : (
                  <button
                    className="py-2.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                    style={plan.action.startsWith("upgrade") ? { background: plan.color, color: "#050505" } : { background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    {plan.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Stripe notice */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/8 text-xs text-gray-400">
          <CreditCard size={14} className="flex-shrink-0 text-[#4f8cff]" />
          <span>Billing is managed securely via Stripe. Cancel or change plans anytime. Upgrades take effect immediately.</span>
          <span className="ml-auto flex items-center gap-1.5 text-[#4f8cff] cursor-pointer hover:underline flex-shrink-0">
            <Zap size={10} />Manage in Stripe ↗
          </span>
        </div>
      </div>
    </div>
  );
}
