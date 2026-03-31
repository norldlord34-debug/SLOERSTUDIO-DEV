import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { KanbanSquare, Plus } from "lucide-react";

const COLUMNS = [
  { id: "todo", label: "To Do", color: "#6b7280" },
  { id: "in_progress", label: "In Progress", color: "#4f8cff" },
  { id: "in_review", label: "In Review", color: "#ffbf62" },
  { id: "complete", label: "Complete", color: "#28e7c5" },
  { id: "cancelled", label: "Cancelled", color: "#ff6f96" },
];

export default async function KanbanPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-[#4f8cff]/10 flex items-center justify-center">
              <KanbanSquare size={14} className="text-[#4f8cff]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold font-display">Task Board</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track your vibe coding progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <Plus size={15} /> New Project
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm" style={{ background: "#4f8cff", color: "#050505" }}>
            <Plus size={15} /> New Task
          </button>
        </div>
      </div>

      {/* Project selector */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-gray-500 uppercase tracking-widest">PROJECT</span>
        <select className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[#4f8cff]/50">
          <option value="">Select a project</option>
        </select>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-64 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
              <span className="text-sm font-semibold text-white">{col.label}</span>
              <span className="text-xs text-gray-600 ml-1">0</span>
            </div>
            <div className="flex-1 rounded-2xl border border-white/8 bg-white/[0.015] p-3 min-h-[200px] flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xs text-gray-600">Drop tasks here</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mt-2 px-2 py-1.5">
                <Plus size={12} /> Add task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
