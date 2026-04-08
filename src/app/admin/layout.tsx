"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true, badge: "Live" },
  { href: "/admin/users", label: "Users", icon: Users, badge: "IAM" },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard, badge: "MRR" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, badge: "Data" },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children, charts }: { children: ReactNode; charts: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = ((session?.user as { role?: string } | undefined)?.role ?? "ADMIN").toUpperCase();

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#030304] text-white">
      <div className="pointer-events-none absolute left-[8%] top-0 h-72 w-72 rounded-full bg-[#ffbf62]/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-[10%] h-80 w-80 rounded-full bg-[#4f8cff]/8 blur-[140px]" />

      {/* Sidebar */}
      <aside className={`relative z-10 flex flex-shrink-0 flex-col border-r border-white/8 bg-[#06070b]/94 transition-all duration-300 ${collapsed ? "w-[96px]" : "w-[296px]"}`}>
        {/* Brand */}
        <div className={`border-b border-white/8 ${collapsed ? "px-3 py-4" : "px-4 py-4"}`}>
          <Link href="/admin" className="flex items-center gap-3 rounded-[24px] border border-white/8 bg-white/[0.03] p-2.5 transition-colors hover:bg-white/[0.05]">
            <Image src="/company-logo.jpg" alt="SloerStudio" width={42} height={42} className="rounded-2xl object-cover flex-shrink-0" />
            {!collapsed && (
              <div className="min-w-0">
                <span className="block truncate font-display text-base font-bold tracking-tight text-white">SloerStudio</span>
                <span className="block text-[10px] uppercase tracking-[0.24em] text-amber-300/80">Control plane</span>
              </div>
            )}
          </Link>

          {!collapsed ? (
            <div className="mt-4 rounded-[24px] border border-white/8 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Governance layer</p>
                  <p className="mt-2 text-sm font-semibold text-white">Enterprise oversight</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#ffbf62]/30 bg-[#ffbf62]/12 text-[#ffbf62]">
                  <Shield size={16} />
                </div>
              </div>
              <p className="mt-4 text-xs leading-6 text-gray-500">Users, subscriptions, analytics, and control surfaces live here.</p>
            </div>
          ) : (
            <div className="mt-4 flex justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ffbf62] shadow-[0_0_20px_rgba(255,191,98,0.7)]" />
            </div>
          )}
        </div>

        {/* Back to app */}
        <div className="px-3 pt-4">
          <Link href="/app/dashboard" className="flex items-center gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] px-3.5 py-3 text-sm text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03] text-[#4f8cff]">
              <ArrowUpRight size={15} />
            </div>
            {!collapsed ? <span>Return to /app</span> : null}
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {!collapsed && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-500">Admin navigation</p>}
          <div className="space-y-1">
            {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
              const active = exact ? pathname === href : pathname.startsWith(href) && !pathname.startsWith(href + "/skip");

              return (
                <Link
                  key={href}
                  href={href}
                  className={`group relative flex items-center gap-3 rounded-[20px] px-3.5 py-3 text-sm transition-all ${active ? "bg-white/[0.08] text-white" : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-200"}`}
                >
                  {active ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[#ffbf62]" /> : null}
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border ${active ? "border-[#ffbf62]/20 bg-[#ffbf62]/10 text-[#ffbf62]" : "border-white/8 bg-white/[0.03] text-gray-400 group-hover:text-white"}`}>
                    <Icon size={16} />
                  </div>
                  {!collapsed ? (
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <span className="truncate">{label}</span>
                      {badge ? <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-gray-300">{badge}</span> : null}
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>

          {!collapsed ? (
            <div className="mt-6 rounded-[28px] border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#28e7c5]/30 bg-[#28e7c5]/12 text-[#28e7c5]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Live company view</p>
                  <p className="text-[11px] leading-5 text-gray-500">Use this layer to understand the business system, not just the UI.</p>
                </div>
              </div>
            </div>
          ) : null}
        </nav>

        {/* User */}
        <div className="relative border-t border-white/8 p-3">
          <button
            onClick={() => setUserMenuOpen((open) => !open)}
            className="flex w-full items-center gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] p-2.5 transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-[#ffbf62]/30 bg-[#ffbf62]/14 text-sm font-bold text-[#ffbf62]">
              {session?.user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            {!collapsed ? (
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold text-white">{session?.user?.name ?? "Admin"}</p>
                <p className="truncate text-[11px] text-gray-500">{session?.user?.email ?? ""}</p>
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
                  <p className="text-sm font-semibold text-white">{session?.user?.name ?? "Admin"}</p>
                  <p className="mt-1 text-[11px] text-gray-500">{session?.user?.email ?? ""}</p>
                  <span className="mt-3 inline-flex rounded-full border border-[#ffbf62]/30 bg-[#ffbf62]/12 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffbf62]">
                    {role}
                  </span>
                </div>
                {[
                  { href: "/admin/settings", label: "Admin settings", icon: Settings },
                  { href: "/app/dashboard", label: "Open workspace", icon: ArrowUpRight },
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

        <button
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-3 top-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0d0d0d] text-gray-500 transition-all hover:border-white/20 hover:text-white"
          style={{ top: "calc(50% - 14px)" }}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>

      {/* Main */}
      <main className="relative flex-1 overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%)]" />
        <div className="relative min-h-full p-4 md:p-6">
          <div className="mx-auto min-h-[calc(100vh-2rem)] max-w-[1600px] rounded-[34px] border border-white/8 bg-[#070911]/84 shadow-[0_30px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl">
            {children}
            {charts}
          </div>
        </div>
      </main>
    </div>
  );
}
