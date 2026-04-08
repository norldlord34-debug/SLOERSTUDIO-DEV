import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Key, Shield, Sparkles, Workflow } from "lucide-react";

export default async function ApiKeysPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const user = session.user as { plan?: string };
  const plan = (user.plan ?? "FREE").toUpperCase();
  const planAccent = plan === "ENTERPRISE" ? "#28e7c5" : plan === "STUDIO" ? "#4f8cff" : "#ffbf62";

  return (
    <div className="p-6 md:p-8 xl:p-10">
      <div className="mb-10 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div>
          <span className="sloer-pill inline-flex">Workspace // API Keys</span>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl xl:text-[4.45rem] xl:leading-[0.96]">
            Access control for the
            <span className="block bg-gradient-to-r from-white via-[#4f8cff] to-[#28e7c5] bg-clip-text text-transparent">tooling layer.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-9 text-gray-300">API keys will become the trust surface for MCP, automation flows, and future external integrations. This page exists to make that layer legible before issuance, rotation, and scoping controls are fully activated.</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/app/settings" className="sloer-button-primary">
              <span>Open workspace settings</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/app/billing" className="sloer-button-secondary">
              <span>Review access tier</span>
              <Workflow size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Current plan", value: plan },
              { label: "Issuance", value: "Next phase" },
              { label: "Direction", value: "Scoped access" },
            ].map((item) => (
              <div key={item.label} className="sloer-panel rounded-2xl px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{item.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="sloer-panel rounded-[34px] p-5 md:p-6">
          <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
            <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Access policy</p>
            <h2 className="mt-4 font-display text-3xl font-bold text-white">The key layer is being built as a real security surface.</h2>
            <p className="mt-4 text-sm leading-8 text-gray-400">We are intentionally not shipping a shallow key generator. The goal is to support scoped issuance, rotation, status visibility, environment separation, and clearer auditability as the product matures.</p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Scoped permissions", desc: "Keys should be limited by surface and purpose instead of acting like vague master secrets.", color: "#4f8cff" },
              { title: "Rotation and trust", desc: "Operators need a clearer path to replace, expire, and revoke compromised access safely.", color: "#28e7c5" },
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <div className="h-1.5 w-14 rounded-full" style={{ background: item.color }} />
                <h3 className="mt-5 font-display text-2xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="mb-8 flex items-start gap-3 rounded-[28px] border p-5" style={{ background: `${planAccent}10`, borderColor: `${planAccent}22` }}>
        <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border" style={{ background: `${planAccent}14`, borderColor: `${planAccent}28`, color: planAccent }}>
          <Shield size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Security note</p>
          <p className="mt-1 text-sm leading-7 text-gray-400">API keys will grant meaningful access to account resources and automations. They should never be shared casually, committed to repositories, or left unrotated after suspected exposure. This layer is being built with that assumption from the start.</p>
        </div>
      </div>

      {/* Keys table */}
      <div className="overflow-hidden rounded-[34px] border border-white/8 bg-white/[0.015]">
        <div className="grid grid-cols-[1fr_1fr_100px_120px_90px_40px] gap-4 border-b border-white/8 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <span>Name</span>
          <span>Prefix / Hint</span>
          <span>Environment</span>
          <span>Created</span>
          <span>Status</span>
          <span></span>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-[24px] border border-white/8 bg-white/[0.03] text-[#4f8cff]">
            <Key size={22} />
          </div>
          <p className="mt-5 text-lg font-semibold text-white">No API keys have been issued yet.</p>
          <p className="mt-2 max-w-xl text-sm leading-7 text-gray-500">The issuance layer is intentionally held back until scoped access, rotation, and clearer policy controls are ready. This keeps the future key system aligned with a more serious trust model.</p>
          <div className="mt-8 grid w-full max-w-3xl gap-4 md:grid-cols-3">
            {[
              { title: "MCP authentication", desc: "Secure access for tooling and assistant integrations.", color: "#4f8cff" },
              { title: "Environment clarity", desc: "Separate local, preview, and future production-facing usage patterns.", color: "#28e7c5" },
              { title: "Revocation and status", desc: "Visibility into active, expired, and compromised credentials.", color: "#ffbf62" },
            ].map((item) => (
              <div key={item.title} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 text-left">
                <span className="block h-1.5 w-12 rounded-full" style={{ background: item.color }} />
                <p className="mt-4 text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-xs leading-6 text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/app/settings" className="sloer-button-primary">
              <span>Prepare access settings</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/company/contact" className="sloer-button-secondary">
              <span>Contact for enterprise access</span>
              <Sparkles size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
