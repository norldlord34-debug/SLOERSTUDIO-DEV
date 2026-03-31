import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FolderOpen, Plus } from "lucide-react";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-white/5 border border-white/8">Workspace</span>
          </div>
          <h1 className="text-2xl font-bold font-display">Projects</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your active builds and collaborate with your agentic teammates.</p>
        </div>
        <Link href="/app/projects/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm" style={{ background: "#4f8cff", color: "#050505" }}>
          <Plus size={15} /> New Project
        </Link>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-16 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#4f8cff]/10 border border-[#4f8cff]/20 flex items-center justify-center mb-5">
          <FolderOpen size={24} className="text-[#4f8cff]" />
        </div>
        <h2 className="text-xl font-bold font-display mb-2">Ready to build?</h2>
        <p className="text-gray-400 text-sm max-w-xs mb-6">Create your first project and let your AI teammates turn your vision into production code.</p>
        <Link href="/app/projects/new" className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm" style={{ background: "#4f8cff", color: "#050505" }}>
          <Plus size={15} /> Start Building
        </Link>
      </div>
    </div>
  );
}
