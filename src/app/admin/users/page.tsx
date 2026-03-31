"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, RefreshCw, Mail, Calendar, Clock, Shield, Download, ChevronLeft, ChevronRight } from "lucide-react";

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";

const PLAN_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  FREE:       { text: "#6b7280", bg: "#6b728015", border: "#6b728030" },
  STUDIO:     { text: COBALT,   bg: `${COBALT}15`, border: `${COBALT}35` },
  ENTERPRISE: { text: TEAL,    bg: `${TEAL}15`,   border: `${TEAL}35`   },
};
const ROLE_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  USER:        { text: "#6b7280", bg: "#6b728015", border: "#6b728030" },
  ADMIN:       { text: COBALT,   bg: `${COBALT}15`, border: `${COBALT}35` },
  SUPER_ADMIN: { text: AMBER,    bg: `${AMBER}15`,   border: `${AMBER}35`  },
};

type User = {
  id: string;
  email: string;
  name?: string;
  role: string;
  plan: string;
  createdAt: string;
  lastLoginAt?: string;
};

type EditModal = { user: User; field: "role" | "plan" } | null;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<EditModal>(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async (p = page, q = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), search: q });
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users ?? []);
        setTotal(data.total ?? 0);
        setPages(data.pages ?? 1);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, []);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(1, search); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  async function handleSave(newValue: string) {
    if (!editModal) return;
    setSaving(true);
    const body: Record<string, string> = { id: editModal.user.id };
    if (editModal.field === "role") body.role = newValue;
    else body.plan = newValue;
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setEditModal(null);
    fetchUsers(page, search);
  }

  async function handleDelete(userId: string) {
    if (!confirm("Delete this user and all their data permanently?")) return;
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId }),
    });
    fetchUsers(page, search);
  }

  function exportCSV() {
    const rows = [
      ["ID", "Email", "Name", "Role", "Plan", "Joined", "Last Login"],
      ...users.map(u => [u.id, u.email, u.name ?? "", u.role, u.plan, u.createdAt, u.lastLoginAt ?? ""]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `sloerstudio-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Super Admin · Users</p>
          <h1 className="text-2xl font-bold font-display">Subscriber Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? "Loading..." : `${total} registered account${total !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/8 hover:bg-white/10 transition-colors text-gray-300">
            <Download size={11} /> Export CSV
          </button>
          <button onClick={() => fetchUsers(page, search)} disabled={loading} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/8 hover:bg-white/10 transition-colors text-gray-300 disabled:opacity-50">
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl flex-1 max-w-md">
          <Search size={13} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email or name..."
            className="bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.015] overflow-hidden mb-4">
        {/* Header row */}
        <div className="grid grid-cols-[auto_1fr_110px_110px_130px_120px_80px] gap-3 px-6 py-3 border-b border-white/8 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
          <span className="w-8" />
          <span className="flex items-center gap-1"><Mail size={10} /> Email / Name</span>
          <span><Shield size={10} className="inline mr-1" />Role</span>
          <span>Plan</span>
          <span className="flex items-center gap-1"><Calendar size={10} /> Joined</span>
          <span className="flex items-center gap-1"><Clock size={10} /> Last Login</span>
          <span>Actions</span>
        </div>

        {loading && (
          <div className="p-10 text-center text-sm text-gray-500 animate-pulse">Loading subscriber data...</div>
        )}

        {!loading && users.length === 0 && (
          <div className="p-10 text-center text-sm text-gray-500">No users found{search ? ` matching "${search}"` : ""}.</div>
        )}

        {!loading && users.map((u) => {
          const planStyle = PLAN_COLOR[u.plan] ?? PLAN_COLOR.FREE;
          const roleStyle = ROLE_COLOR[u.role] ?? ROLE_COLOR.USER;
          return (
            <div
              key={u.id}
              className="grid grid-cols-[auto_1fr_110px_110px_130px_120px_80px] gap-3 px-6 py-4 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.025] transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{ background: `${COBALT}18`, border: `1px solid ${COBALT}30`, color: COBALT }}>
                {(u.name ?? u.email)[0].toUpperCase()}
              </div>

              {/* Email + name */}
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{u.name ?? <span className="text-gray-500">—</span>}</p>
                <p className="text-xs text-gray-400 truncate font-mono">{u.email}</p>
              </div>

              {/* Role — clickable to edit */}
              <button
                onClick={() => setEditModal({ user: u, field: "role" })}
                className="text-left"
                title="Click to change role"
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ color: roleStyle.text, background: roleStyle.bg, borderColor: roleStyle.border }}>
                  {u.role.replace("_", " ")}
                </span>
              </button>

              {/* Plan — clickable to edit */}
              <button
                onClick={() => setEditModal({ user: u, field: "plan" })}
                className="text-left"
                title="Click to change plan"
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border hover:opacity-80 transition-opacity cursor-pointer"
                  style={{ color: planStyle.text, background: planStyle.bg, borderColor: planStyle.border }}>
                  {u.plan}
                </span>
              </button>

              {/* Joined */}
              <span className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>

              {/* Last login */}
              <span className="text-xs text-gray-500">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : <span className="text-gray-700">Never</span>}</span>

              {/* Actions */}
              <button
                onClick={() => handleDelete(u.id)}
                className="text-xs text-red-500 hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {total === 0 ? "No users" : `Showing ${((page - 1) * 20) + 1}–${Math.min(page * 20, total)} of ${total} users`}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { const p = page - 1; setPage(p); fetchUsers(p, search); }}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            <ChevronLeft size={12} /> Prev
          </button>
          <span className="px-3 py-1.5 text-white">{page} / {pages}</span>
          <button
            onClick={() => { const p = page + 1; setPage(p); fetchUsers(p, search); }}
            disabled={page >= pages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            Next <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setEditModal(null)}>
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-7 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="font-bold text-white font-display mb-1">
              Change {editModal.field === "role" ? "Role" : "Plan"}
            </h2>
            <p className="text-xs text-gray-500 mb-5">{editModal.user.email}</p>

            <div className="space-y-2">
              {(editModal.field === "role"
                ? ["USER", "ADMIN", "SUPER_ADMIN"]
                : ["FREE", "STUDIO", "ENTERPRISE"]
              ).map((val) => {
                const isActive = (editModal.field === "role" ? editModal.user.role : editModal.user.plan) === val;
                const style = editModal.field === "role" ? (ROLE_COLOR[val] ?? ROLE_COLOR.USER) : (PLAN_COLOR[val] ?? PLAN_COLOR.FREE);
                return (
                  <button
                    key={val}
                    onClick={() => handleSave(val)}
                    disabled={saving}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all disabled:opacity-50 ${isActive ? "ring-1" : "hover:opacity-80"}`}
                    style={{ color: style.text, background: isActive ? style.bg : "transparent", borderColor: isActive ? style.border : "rgba(255,255,255,0.08)", ...(isActive ? { "--tw-ring-color": style.border } as React.CSSProperties : {}) }}
                  >
                    <span>{val.replace("_", " ")}</span>
                    {isActive && <span className="text-[10px] opacity-60">Current</span>}
                  </button>
                );
              })}
            </div>

            <button onClick={() => setEditModal(null)} className="mt-4 w-full py-2.5 rounded-xl text-sm text-gray-500 hover:text-white border border-white/8 hover:bg-white/5 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
