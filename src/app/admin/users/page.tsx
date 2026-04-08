"use client";
import { useEffect, useState, useCallback, type CSSProperties } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Activity, Calendar, ChevronLeft, ChevronRight, Clock, CreditCard, Download, Mail, RefreshCw, Search, Shield, Sparkles, Users } from "lucide-react";

const COBALT = "#4f8cff";
const TEAL = "#28e7c5";
const AMBER = "#ffbf62";
const ease = [0.22, 1, 0.36, 1] as const;

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

function MetricCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  color: string;
  icon: LucideIcon;
}) {
  return (
    <motion.div whileHover={{ y: -5, scale: 1.01 }} className="sloer-panel rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl border" style={{ background: `${color}16`, borderColor: `${color}30`, color }}>
          <Icon size={15} />
        </div>
      </div>
      <p className="mt-4 font-display text-4xl font-bold" style={{ color }}>{value}</p>
      <p className="mt-2 text-xs leading-6 text-gray-500">{sub}</p>
    </motion.div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<EditModal>(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async (p = 1, q = "") => {
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
  }, []);

  useEffect(() => { void fetchUsers(1, ""); }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); void fetchUsers(1, search); }, 400);
    return () => clearTimeout(t);
  }, [search, fetchUsers]);

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

  const adminCount = users.filter((user) => user.role === "ADMIN" || user.role === "SUPER_ADMIN").length;
  const paidCount = users.filter((user) => user.plan === "STUDIO" || user.plan === "ENTERPRISE").length;
  const activeCount = users.filter((user) => Boolean(user.lastLoginAt)).length;

  return (
    <div className="p-6 md:p-8 xl:p-10">
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
        {/* Header */}
        <div className="mb-10 grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <div>
            <span className="sloer-pill inline-flex">Control Plane // Users</span>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl xl:text-[4.45rem] xl:leading-[0.96]">
              Govern access to the
              <span className="block bg-gradient-to-r from-white via-[#ffbf62] to-[#4f8cff] bg-clip-text text-transparent">company system.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-gray-300">Users are not just rows in a table. They represent roles, plans, trust levels, billing paths, and access to the larger SloerStudio platform. This surface should make those relationships legible and manageable.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button onClick={exportCSV} className="sloer-button-primary">
                <Download size={16} />
                <span>Export CSV</span>
              </button>
              <button onClick={() => void fetchUsers(page, search)} disabled={loading} className="sloer-button-secondary disabled:opacity-50">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                <span>{loading ? "Refreshing..." : "Refresh directory"}</span>
              </button>
            </div>
          </div>

          <div className="sloer-panel rounded-[34px] p-5 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-white/8 bg-black/20 p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Directory status</p>
                <p className="mt-4 font-display text-3xl font-bold text-white">{loading ? "Loading" : `${total}`}</p>
                <p className="mt-3 text-sm leading-7 text-gray-400">{loading ? "Refreshing the current user directory snapshot." : `${total} registered account${total !== 1 ? "s" : ""} currently visible to the control plane.`}</p>
              </div>
              <div className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Current scope</p>
                <p className="mt-4 font-display text-3xl font-bold text-white">Page {page}</p>
                <p className="mt-3 text-sm leading-7 text-gray-400">Search, pagination, plan edits, and role edits all route through this management surface.</p>
              </div>
            </div>
            <div className="mt-4 rounded-[28px] border border-white/8 bg-black/20 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ffbf62]/30 bg-[#ffbf62]/12 text-[#ffbf62]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Governance snapshot</p>
                  <p className="text-[11px] text-gray-500">Fast signal read for the current page scope.</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { title: "Admins", value: `${adminCount}`, color: COBALT },
                  { title: "Paid", value: `${paidCount}`, color: TEAL },
                  { title: "Active", value: `${activeCount}`, color: AMBER },
                ].map((item) => (
                  <div key={item.title} className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <span className="block h-1.5 w-12 rounded-full" style={{ background: item.color }} />
                    <p className="mt-4 text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total accounts" value={total} sub="Registered users across the directory." color={COBALT} icon={Users} />
          <MetricCard label="Admins on page" value={adminCount} sub="Current page users with elevated roles." color={AMBER} icon={Shield} />
          <MetricCard label="Paid on page" value={paidCount} sub="Studio or Enterprise users in current view." color={TEAL} icon={CreditCard} />
          <MetricCard label="Active on page" value={activeCount} sub="Users with at least one recorded login." color={COBALT} icon={Activity} />
        </div>

        {/* Search bar */}
        <div className="mb-8 rounded-[30px] border border-white/8 bg-white/[0.02] p-4 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-3">
              <Search size={15} className="flex-shrink-0 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by email or name..."
                className="w-full bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                search ? `Searching: ${search}` : "Showing all users",
                `${pages} page${pages !== 1 ? "s" : ""} total`,
              ].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mb-6 overflow-hidden rounded-[34px] border border-white/8 bg-white/[0.015]">
          {/* Header row */}
          <div className="hidden grid-cols-[auto_1fr_120px_120px_140px_130px_90px] gap-3 border-b border-white/8 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-600 md:grid">
            <span className="w-10" />
            <span className="flex items-center gap-1"><Mail size={10} /> Email / Name</span>
            <span><Shield size={10} className="mr-1 inline" />Role</span>
            <span>Plan</span>
            <span className="flex items-center gap-1"><Calendar size={10} /> Joined</span>
            <span className="flex items-center gap-1"><Clock size={10} /> Last Login</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500 animate-pulse">Loading subscriber data...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">No users found{search ? ` matching "${search}"` : ""}.</div>
          ) : users.map((u) => {
            const planStyle = PLAN_COLOR[u.plan] ?? PLAN_COLOR.FREE;
            const roleStyle = ROLE_COLOR[u.role] ?? ROLE_COLOR.USER;

            return (
              <div key={u.id} className="border-b border-white/5 px-5 py-4 last:border-0 md:grid md:grid-cols-[auto_1fr_120px_120px_140px_130px_90px] md:items-center md:gap-3 md:px-6 md:py-4 md:hover:bg-white/[0.025]">
                <div className="flex items-start gap-4 md:contents">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: `${COBALT}18`, border: `1px solid ${COBALT}30`, color: COBALT }}>
                    {(u.name ?? u.email)[0].toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1 md:min-w-0">
                    <p className="truncate text-sm font-medium text-white">{u.name ?? <span className="text-gray-500">—</span>}</p>
                    <p className="truncate font-mono text-xs text-gray-400">{u.email}</p>

                    <div className="mt-3 flex flex-wrap gap-3 md:hidden">
                      <button onClick={() => setEditModal({ user: u, field: "role" })} className="text-left" title="Click to change role">
                        <span className="rounded-full border px-2 py-1 text-[10px] font-bold" style={{ color: roleStyle.text, background: roleStyle.bg, borderColor: roleStyle.border }}>
                          {u.role.replace("_", " ")}
                        </span>
                      </button>
                      <button onClick={() => setEditModal({ user: u, field: "plan" })} className="text-left" title="Click to change plan">
                        <span className="rounded-full border px-2 py-1 text-[10px] font-bold" style={{ color: planStyle.text, background: planStyle.bg, borderColor: planStyle.border }}>
                          {u.plan}
                        </span>
                      </button>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-gray-500 md:hidden">
                      <p>Joined {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      <p>Last login {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never"}</p>
                    </div>
                  </div>
                </div>

                <button onClick={() => setEditModal({ user: u, field: "role" })} className="hidden text-left md:block" title="Click to change role">
                  <span className="rounded-full border px-2 py-0.5 text-[10px] font-bold transition-opacity hover:opacity-80" style={{ color: roleStyle.text, background: roleStyle.bg, borderColor: roleStyle.border }}>
                    {u.role.replace("_", " ")}
                  </span>
                </button>

                <button onClick={() => setEditModal({ user: u, field: "plan" })} className="hidden text-left md:block" title="Click to change plan">
                  <span className="rounded-full border px-2 py-0.5 text-[10px] font-bold transition-opacity hover:opacity-80" style={{ color: planStyle.text, background: planStyle.bg, borderColor: planStyle.border }}>
                    {u.plan}
                  </span>
                </button>

                <span className="hidden text-xs text-gray-500 md:block">{new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span className="hidden text-xs text-gray-500 md:block">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : <span className="text-gray-700">Never</span>}</span>

                <div className="mt-4 md:mt-0">
                  <button onClick={() => handleDelete(u.id)} className="text-xs text-red-500 transition-colors hover:text-red-400">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            {total === 0 ? "No users" : `Showing ${((page - 1) * 20) + 1}–${Math.min(page * 20, total)} of ${total} users`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { const p = page - 1; setPage(p); void fetchUsers(p, search); }}
              disabled={page <= 1}
              className="flex items-center gap-1 rounded-[16px] border border-white/8 bg-white/[0.03] px-3 py-2 transition-colors hover:bg-white/[0.05] disabled:opacity-40"
            >
              <ChevronLeft size={12} /> Prev
            </button>
            <span className="rounded-[16px] border border-white/8 bg-white/[0.03] px-3 py-2 text-white">{page} / {pages}</span>
            <button
              onClick={() => { const p = page + 1; setPage(p); void fetchUsers(p, search); }}
              disabled={page >= pages}
              className="flex items-center gap-1 rounded-[16px] border border-white/8 bg-white/[0.03] px-3 py-2 transition-colors hover:bg-white/[0.05] disabled:opacity-40"
            >
              Next <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {editModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 px-4 backdrop-blur-sm" onClick={() => setEditModal(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease }} className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#0d0d0d] p-7 shadow-[0_35px_120px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ffbf62]/30 bg-[#ffbf62]/12 text-[#ffbf62]">
                  <Shield size={18} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">Change {editModal.field === "role" ? "role" : "plan"}</h2>
                  <p className="text-xs text-gray-500">{editModal.user.email}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {(editModal.field === "role" ? ["USER", "ADMIN", "SUPER_ADMIN"] : ["FREE", "STUDIO", "ENTERPRISE"]).map((val) => {
                  const isActive = (editModal.field === "role" ? editModal.user.role : editModal.user.plan) === val;
                  const style = editModal.field === "role" ? (ROLE_COLOR[val] ?? ROLE_COLOR.USER) : (PLAN_COLOR[val] ?? PLAN_COLOR.FREE);

                  return (
                    <button
                      key={val}
                      onClick={() => handleSave(val)}
                      disabled={saving}
                      className={`flex w-full items-center justify-between rounded-[22px] border px-4 py-3 text-sm font-semibold transition-all disabled:opacity-50 ${isActive ? "ring-1" : "hover:bg-white/[0.03]"}`}
                      style={{ color: style.text, background: isActive ? style.bg : "transparent", borderColor: isActive ? style.border : "rgba(255,255,255,0.08)", ...(isActive ? { "--tw-ring-color": style.border } as CSSProperties : {}) }}
                    >
                      <span>{val.replace("_", " ")}</span>
                      {isActive ? <span className="text-[10px] opacity-60">Current</span> : null}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setEditModal(null)} className="mt-5 w-full rounded-[22px] border border-white/8 py-3 text-sm text-gray-500 transition-colors hover:bg-white/[0.03] hover:text-white">
                Cancel
              </button>
            </motion.div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
