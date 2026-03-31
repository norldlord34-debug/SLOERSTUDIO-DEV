import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Bug, Bitcoin, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AppBugBountyPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/app/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-display mb-2">Bug Bounty Signup</h1>
        <p className="text-gray-400">Register to participate in the SloerStudio Bug Bounty program and earn Bitcoin rewards.</p>
      </div>

      <div className="p-7 rounded-2xl border border-white/8 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-white">Registration Details</h2>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#28e7c5]/30 bg-[#28e7c5]/10 text-[#28e7c5]">
            ⚡ Secure
          </span>
        </div>

        <form className="space-y-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-1.5">
              <MessageCircle size={12} /> Discord Username <span className="text-red-400">*</span>
            </label>
            <input type="text" placeholder="e.g. your_discord_username" className="w-full px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50" />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 mb-1.5">
              <Bitcoin size={12} /> Bitcoin Wallet Address <span className="text-red-400">*</span>
            </label>
            <input type="text" placeholder="e.g. bc1q..." className="w-full px-3.5 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50" />
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" id="terms" className="mt-0.5" />
            <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed">
              I accept the <span className="text-[#4f8cff] cursor-pointer hover:underline">Bug Bounty terms and conditions</span>. I understand that SloerStudio holds full discretion over reward amounts and that all rewards are paid in Bitcoin.
            </label>
          </div>

          <div className="p-3.5 rounded-xl bg-[#4f8cff]/8 border border-[#4f8cff]/20 text-xs text-gray-400 leading-relaxed">
            After signing up, report bugs via our Discord server. Each valid bug earns Bitcoin rewards from $0.50 to $5 based on severity.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/app/dashboard" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors">Cancel</Link>
            <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "#4f8cff", color: "#050505" }}>
              <Bug size={14} /> Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
