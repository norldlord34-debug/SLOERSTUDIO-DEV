"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, Users, CreditCard, BarChart3,
  Settings, LogOut
} from "lucide-react";
import Image from "next/image";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-[#030304] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-white/8 bg-[#06070b]">
        {/* Brand */}
        <div className="h-14 flex items-center px-4 border-b border-white/8 gap-2.5">
          <Image src="/company-logo.jpg" alt="SloerStudio" width={28} height={28} className="rounded-lg object-cover flex-shrink-0" />
          <div>
            <span className="font-bold text-sm tracking-tight font-display">SloerStudio</span>
            <span className="text-[9px] text-amber-400 font-semibold ml-1.5 uppercase">Admin</span>
          </div>
        </div>

        {/* Back to app */}
        <Link href="/app/dashboard" className="flex items-center gap-2 mx-3 mt-3 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors border border-white/5">
          ← SloerStudio App
        </Link>

        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href) && !pathname.startsWith(href + "/skip");
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors relative ${active ? "text-white bg-white/8" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r bg-amber-400" />}
                <Icon size={15} className="flex-shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-white/8 p-3">
          <div className="flex items-center gap-2.5 p-2 rounded-lg mb-1">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] font-bold text-amber-400 flex-shrink-0">
              {session?.user?.name?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{session?.user?.name ?? "Admin"}</p>
              <p className="text-[10px] text-gray-600 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 w-full transition-colors">
            <LogOut size={12} />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
