"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Bot,
  Bug,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  FolderOpen,
  HelpCircle,
  KanbanSquare,
  Key,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon; badge?: string };

const PRIMARY_NAV: NavItem[] = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/projects", label: "Projects", icon: FolderOpen },
  { href: "/app/kanban", label: "Kanban", icon: KanbanSquare },
];

const LIBRARY_NAV: NavItem[] = [
  { href: "/app/agents", label: "Agents", icon: Bot },
  { href: "/app/skills", label: "Skills", icon: Sparkles },
  { href: "/app/prompts", label: "Prompts", icon: FileText },
];

const SUPPORT_NAV: NavItem[] = [
  { href: "/app/help", label: "Help", icon: HelpCircle },
  { href: "/app/bug-bounty", label: "Bug Bounty", icon: Bug },
];

function NavSection({
  title,
  items,
  pathname,
  collapsed,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  collapsed: boolean;
}) {
  return (
    <div className="mb-6 last:mb-0">
      {!collapsed && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">{title}</p>}
      <div className="space-y-1">
        {items.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`group relative flex items-center gap-3 rounded-[20px] px-3.5 py-3 text-sm transition-all ${active ? "bg-white/[0.08] text-white" : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"}`}
            >
              {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[#4f8cff]" />}
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border ${active ? "border-[#4f8cff]/20 bg-[#4f8cff]/10 text-[#4f8cff]" : "border-white/8 bg-white/[0.03] text-gray-400 group-hover:text-white"}`}>
                <Icon size={16} />
              </div>
              {!collapsed && (
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <span className="truncate">{label}</span>
                  {badge ? <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-gray-300">{badge}</span> : null}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user as { role?: string } | undefined)?.role;
  const plan = ((user as { plan?: string } | undefined)?.plan ?? "FREE").toUpperCase();
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN" || role === "admin";
  const planAccent = plan === "ENTERPRISE" ? "#28e7c5" : plan === "STUDIO" ? "#4f8cff" : "#ffbf62";
  const planLabel = plan === "ENTERPRISE" ? "Enterprise" : plan === "STUDIO" ? "Studio" : "Launch";

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute left-[8%] top-10 h-64 w-64 rounded-full bg-[#4f8cff]/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-[8%] h-80 w-80 rounded-full bg-[#28e7c5]/8 blur-[140px]" />

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className={`relative z-10 flex flex-shrink-0 flex-col border-r border-white/8 bg-[#06070d]/94 transition-all duration-300 ${collapsed ? "w-[96px]" : "w-[290px]"}`}>
        {/* Brand */}
        <div className={`border-b border-white/8 ${collapsed ? "px-3 py-4" : "px-4 py-4"}`}>
          <Link href="/app/dashboard" className="flex items-center gap-3 rounded-[24px] border border-white/8 bg-white/[0.03] p-2.5 transition-colors hover:bg-white/[0.05]">
            <Image src="/company-logo.jpg" alt="SloerStudio" width={42} height={42} className="rounded-2xl object-cover flex-shrink-0" />
            {!collapsed && (
              <div className="min-w-0">
                <span className="block truncate font-display text-base font-bold tracking-tight text-white">SloerStudio</span>
                <span className="block text-[10px] uppercase tracking-[0.24em] text-gray-500">Premium workspace shell</span>
              </div>
            )}
          </Link>

          {!collapsed ? (
            <div className="mt-4 rounded-[24px] border border-white/8 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Plan</p>
                  <p className="mt-2 text-sm font-semibold text-white">{planLabel}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border" style={{ background: `${planAccent}16`, borderColor: `${planAccent}30`, color: planAccent }}>
                  <Zap size={16} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                <span className="text-xs text-gray-400">Access layer</span>
                <span className="rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: planAccent, borderColor: `${planAccent}35`, background: `${planAccent}12` }}>
                  {plan}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex justify-center">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: planAccent, boxShadow: `0 0 20px ${planAccent}` }} />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavSection title="Core" items={PRIMARY_NAV} pathname={pathname} collapsed={collapsed} />
          <NavSection title="Libraries" items={LIBRARY_NAV} pathname={pathname} collapsed={collapsed} />
          <NavSection title="Support" items={SUPPORT_NAV} pathname={pathname} collapsed={collapsed} />

          {!collapsed && isAdmin ? (
            <div className="mt-6 rounded-[28px] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ffbf62]/30 bg-[#ffbf62]/12 text-[#ffbf62]">
                  <Shield size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Control plane</p>
                  <p className="text-[11px] leading-5 text-gray-500">Manage the company layer.</p>
                </div>
              </div>
              <Link href="/admin" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#ffbf62] transition-colors hover:text-white">
                Open /admin <ArrowUpRight size={14} />
              </Link>
            </div>
          ) : null}
        </nav>

        {/* User */}
        <div className="relative border-t border-white/8 p-3">
          <button
            onClick={() => setUserMenuOpen((open) => !open)}
            className="flex w-full items-center gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] p-2.5 transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-[#4f8cff]/30 bg-[#4f8cff]/16 text-sm font-bold text-[#4f8cff]">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            {!collapsed ? (
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold text-white">{user?.name ?? "User"}</p>
                <p className="truncate text-[11px] text-gray-500">{user?.email ?? ""}</p>
              </div>
            ) : null}
            {!collapsed ? <ChevronRight size={15} className={`text-gray-500 transition-transform ${userMenuOpen ? "rotate-90" : ""}`} /> : null}
          </button>

          <AnimatePresence>
            {userMenuOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute bottom-[86px] z-50 overflow-hidden rounded-[28px] border border-white/10 bg-[#090b12]/96 p-2 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl ${collapsed ? "left-[88px] w-[240px]" : "left-3 right-3"}`}
              >
                <div className="mb-2 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3">
                  <p className="text-sm font-semibold text-white">{user?.name ?? "User"}</p>
                  <p className="mt-1 text-[11px] text-gray-500">{user?.email ?? ""}</p>
                </div>
                {[
                  { href: "/app/settings", label: "Settings", icon: Settings },
                  { href: "/app/api-keys", label: "API Keys", icon: Key },
                  { href: "/app/billing", label: "Billing", icon: CreditCard },
                  ...(isAdmin ? [{ href: "/admin", label: "Open Admin", icon: Shield }] : []),
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm text-gray-300 transition-all hover:bg-white/[0.05] hover:text-white"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-gray-400">
                      <Icon size={14} />
                    </div>
                    <span>{label}</span>
                  </Link>
                ))}
                <div className="mt-2 border-t border-white/6 pt-2">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-3 rounded-[20px] px-4 py-3 text-sm text-red-400 transition-all hover:bg-red-500/10"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl border border-red-500/16 bg-red-500/10">
                      <LogOut size={14} />
                    </div>
                    <span>Sign out</span>
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-3 top-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0d0d0d] text-gray-500 transition-all hover:border-white/20 hover:text-white"
          style={{ top: "calc(50% - 14px)" }}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="relative flex-1 overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%)]" />
        <div className="relative min-h-full p-4 md:p-6">
          <div className="mx-auto min-h-[calc(100vh-2rem)] max-w-[1600px] rounded-[34px] border border-white/8 bg-[#070911]/84 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
