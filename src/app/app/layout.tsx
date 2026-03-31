"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, FolderOpen, KanbanSquare, Bot, Sparkles,
  FileText, HelpCircle, Bug, ChevronLeft, ChevronRight,
  Settings, Key, CreditCard, Zap, LogOut, User
} from "lucide-react";

const NAV = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/projects", label: "Projects", icon: FolderOpen },
  { href: "/app/kanban", label: "Kanban", icon: KanbanSquare },
  { href: "/app/agents", label: "Agents", icon: Bot },
  { href: "/app/skills", label: "Skills", icon: Sparkles },
  { href: "/app/prompts", label: "Prompts", icon: FileText },
  { href: "/app/help", label: "Help", icon: HelpCircle },
  { href: "/app/bug-bounty", label: "Bug Bounty", icon: Bug },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className={`flex flex-col border-r border-white/8 bg-[#07080d] transition-all duration-200 ${collapsed ? "w-14" : "w-[200px]"} flex-shrink-0`}>
        {/* Brand */}
        <div className="h-14 flex items-center px-4 border-b border-white/8 gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#4f8cff]/15 border border-[#4f8cff]/30 flex items-center justify-center flex-shrink-0">
            <Zap size={13} className="text-[#4f8cff]" fill="currentColor" />
          </div>
          {!collapsed && <span className="font-bold text-sm tracking-tight font-display">SloerStudio</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative ${active ? "text-white bg-white/[0.06]" : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"}`}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-[#4f8cff]" />}
                <Icon size={16} className="flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-white/8 p-3 relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 w-full p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#4f8cff]/20 border border-[#4f8cff]/30 flex items-center justify-center text-[10px] font-bold text-[#4f8cff] flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            {!collapsed && (
              <div className="min-w-0 text-left">
                <p className="text-xs font-medium text-white truncate">{user?.name ?? "User"}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email ?? ""}</p>
              </div>
            )}
          </button>

          {userMenuOpen && (
            <div className={`absolute ${collapsed ? "left-14" : "left-3 right-3"} bottom-14 bg-[#0d0d0d] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50 min-w-[160px]`}>
              <div className="px-3 py-2 border-b border-white/5 mb-1">
                <p className="text-xs font-medium text-white">{user?.name}</p>
                <p className="text-[10px] text-gray-500">{user?.email}</p>
              </div>
              {[
                { href: "/app/settings", label: "Settings", icon: Settings },
                { href: "/app/api-keys", label: "API Keys", icon: Key },
                { href: "/app/billing", label: "Billing", icon: CreditCard },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                  <Icon size={13} />{label}
                </Link>
              ))}
              <div className="border-t border-white/5 mt-1 pt-1">
                <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 w-full transition-colors">
                  <LogOut size={13} />Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-1/2 -right-3 w-6 h-6 bg-[#0d0d0d] border border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all z-10"
          style={{ top: "calc(50% - 12px)" }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
