import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, CreditCard, User, Shield, Trash2, Download, LogOut } from "lucide-react";

const AVATARS = ["marble", "beam", "pixel", "sunset", "ring", "bauhaus"];

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const user = session.user as { name?: string; email?: string; plan?: string; role?: string };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
          <Settings size={16} className="text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display">Settings</h1>
          <p className="text-gray-400 text-sm">Manage your account configuration and workspace preferences.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-white/[0.03] p-1 rounded-xl w-fit border border-white/8">
        {["Account", "Billing"].map((tab, i) => (
          <button key={tab} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${i === 0 ? "bg-white/8 text-white" : "text-gray-500 hover:text-gray-300"}`}>
            {i === 0 ? <User size={13} /> : <CreditCard size={13} />}{tab}
          </button>
        ))}
      </div>

      {/* Account Preferences */}
      <div className="space-y-6">
        <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
          <h2 className="font-semibold text-white mb-1 flex items-center gap-2"><User size={15} className="text-gray-400" /> Profile Details</h2>
          <p className="text-gray-500 text-xs mb-5">Your account information and status.</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Email Address</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">{user.email}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#28e7c5]/10 text-[#28e7c5] border border-[#28e7c5]/20">Verified</span>
              </div>
              <p className="text-[10px] text-gray-600 mt-1">Email is managed through your login provider.</p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-white/5">
              <div><p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Account Role</p><p className="text-sm text-white capitalize">{user.role?.toLowerCase() ?? "user"}</p></div>
              <div><p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">Current Plan</p><p className="text-sm text-white capitalize">{user.plan?.toLowerCase() ?? "free"}</p></div>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
          <h2 className="font-semibold text-white mb-1">Avatar Style</h2>
          <p className="text-gray-500 text-xs mb-5">Choose your avatar style. This is how you appear across the platform.</p>
          <div className="flex gap-3">
            {AVATARS.map((a) => (
              <div key={a} className={`w-12 h-12 rounded-full border-2 cursor-pointer transition-all hover:scale-110 flex items-center justify-center ${a === "pixel" ? "border-[#4f8cff]" : "border-white/10 hover:border-white/30"}`} style={{ background: `hsl(${AVATARS.indexOf(a) * 60}, 60%, 40%)` }}>
                <span className="text-[10px] text-white font-bold capitalize">{a[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
          <h2 className="font-semibold text-white mb-1 flex items-center gap-2"><Shield size={15} className="text-gray-400" /> Change Password</h2>
          <p className="text-gray-500 text-xs mb-5">Update your password. All other sessions will be signed out.</p>
          <div className="space-y-3 max-w-sm">
            <input type="password" placeholder="Current password" className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50" />
            <input type="password" placeholder="New password (min 8 chars)" className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50" />
            <input type="password" placeholder="Confirm new password" className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50" />
            <button className="px-5 py-2 rounded-xl text-sm font-semibold bg-white/8 border border-white/10 hover:bg-white/12 transition-colors text-white">Update Password</button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
          <h2 className="font-semibold text-red-400 mb-1 flex items-center gap-2"><Trash2 size={15} /> Danger Zone</h2>
          <p className="text-gray-500 text-xs mb-5">Irreversible and destructive actions.</p>
          <div className="space-y-3">
            {[
              { label: "Sign Out", desc: "Log out of your current session on this device.", icon: LogOut, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20 hover:bg-red-500/20" },
              { label: "Export Your Data", desc: "Download a copy of all your personal data as JSON.", icon: Download, color: "text-gray-300", bg: "bg-white/5 border-white/10 hover:bg-white/10" },
              { label: "Delete Account", desc: "Permanently delete your account and all your data.", icon: Trash2, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20 hover:bg-red-500/20" },
            ].map((action) => (
              <div key={action.label} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01]">
                <div>
                  <p className="text-sm font-medium text-white">{action.label}</p>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </div>
                <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${action.bg} ${action.color}`}>
                  <action.icon size={12} />{action.label.split(" ")[0]}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
