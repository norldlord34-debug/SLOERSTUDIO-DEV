import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Key, Shield, MoreHorizontal } from "lucide-react";

export default async function ApiKeysPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-white/5 border border-white/8">Authentication</span>
          </div>
          <h1 className="text-2xl font-bold font-display">API Keys</h1>
          <p className="text-gray-400 text-sm mt-1 max-w-lg">Manage your API keys for authenticating the SloerStudio MCP server and other tools.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white/8 border border-white/10 hover:bg-white/12 transition-colors text-white">
          Create New Key
        </button>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#4f8cff]/8 border border-[#4f8cff]/20 mb-8">
        <Shield size={16} className="text-[#4f8cff] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white mb-0.5">Security Note</p>
          <p className="text-xs text-gray-400 leading-relaxed">API keys allow full access to your account resources. Never share your keys or commit them to public repositories. If you suspect a key has been compromised, revoke it immediately.</p>
        </div>
      </div>

      {/* Keys table */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.015] overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_100px_120px_80px_40px] gap-4 px-5 py-3 border-b border-white/8 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Name</span>
          <span>Prefix / Hint</span>
          <span>Environment</span>
          <span>Created</span>
          <span>Status</span>
          <span></span>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Key size={20} className="text-gray-500" />
          </div>
          <p className="text-sm font-semibold text-white mb-1">No API keys yet</p>
          <p className="text-xs text-gray-500 mb-5">Create your first API key to authenticate with the SloerStudio API.</p>
          <button className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#4f8cff] text-black hover:bg-[#6ba3ff] transition-colors">Create New Key</button>
        </div>
      </div>
    </div>
  );
}
