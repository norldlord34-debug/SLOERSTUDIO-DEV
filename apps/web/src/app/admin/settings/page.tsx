import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, Globe, Mail, Shield, Zap } from "lucide-react";

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") redirect("/app/dashboard");

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Settings size={20} className="text-amber-400" />
        <div>
          <h1 className="text-2xl font-bold font-display">Platform Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Global configuration for the SloerStudio platform.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* General */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2 font-display">
            <Globe size={15} className="text-[#4f8cff]" /> General
          </h2>
          <div className="space-y-4">
            {[
              { label: "Platform Name", value: "SloerStudio", type: "text" },
              { label: "Support Email", value: "support@sloerstudio.com", type: "email" },
              { label: "Platform URL", value: "https://sloerstudio.com", type: "url" },
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">{field.label}</label>
                <input
                  type={field.type}
                  defaultValue={field.value}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#4f8cff]/50 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Auth */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2 font-display">
            <Shield size={15} className="text-[#28e7c5]" /> Authentication
          </h2>
          <div className="space-y-4">
            {[
              { label: "Allow Public Registration", desc: "Let anyone create an account", defaultChecked: true },
              { label: "Require Email Verification", desc: "Users must verify email before accessing app", defaultChecked: false },
              { label: "Enable Two-Factor Authentication", desc: "Allow users to enable 2FA on accounts", defaultChecked: false },
            ].map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                <div>
                  <p className="text-sm font-medium text-white">{toggle.label}</p>
                  <p className="text-xs text-gray-500">{toggle.desc}</p>
                </div>
                <div className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer ${toggle.defaultChecked ? "bg-[#4f8cff]" : "bg-white/10"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-all ${toggle.defaultChecked ? "ml-auto" : ""}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2 font-display">
            <Mail size={15} className="text-[#ffbf62]" /> Email (Resend)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">RESEND_API_KEY</label>
              <input type="password" placeholder="re_..." className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">From Email</label>
              <input type="email" defaultValue="noreply@sloerstudio.com" className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#4f8cff]/50" />
            </div>
          </div>
        </div>

        {/* Stripe */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2 font-display">
            <Zap size={15} className="text-[#a855f7]" /> Stripe Billing
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Stripe Secret Key</label>
              <input type="password" placeholder="sk_live_..." className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Webhook Secret</label>
              <input type="password" placeholder="whsec_..." className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-[#4f8cff] text-black hover:bg-[#6ba3ff] transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
