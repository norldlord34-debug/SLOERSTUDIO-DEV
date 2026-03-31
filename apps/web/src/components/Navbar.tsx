"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, X, Menu } from "lucide-react";
import Image from "next/image";

const PRODUCTS = [
  { href: "/products/sloerspace", label: "SloerSpace", desc: "Agentic IDE & terminal runtime" },
  { href: "/products/sloerswarm", label: "SloerSwarm", badge: "NEW", desc: "Multi-agent orchestration" },
  { href: "/products/sloercanvas", label: "SloerCanvas", desc: "Free-form canvas IDE" },
  { href: "/products/sloervoice", label: "SloerVoice", desc: "On-device voice dictation" },
];
const LIBRARIES = [
  { href: "/libraries/prompts", label: "Prompts" },
  { href: "/libraries/skills", label: "Skills" },
  { href: "/libraries/agents", label: "Agents" },
];
const COMMUNITY = [
  { href: "/community/docs", label: "Docs" },
  { href: "/community/open-source", label: "Open Source", badge: "NEW" },
  { href: "/community/events", label: "Events" },
  { href: "/community/blog", label: "Blog" },
  { href: "/community/discord", label: "Discord" },
];
const COMPANY = [
  { href: "/company/about", label: "About" },
  { href: "/company/careers", label: "Careers" },
  { href: "/company/contact", label: "Contact" },
];

type DropItem = { href: string; label: string; badge?: string; desc?: string };

function DropMenu({ items }: { items: DropItem[] }) {
  return (
    <div className="absolute top-full left-0 mt-2 w-52 bg-[#0d0d0d] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          <div>
            <span>{item.label}</span>
            {item.desc && <p className="text-[11px] text-gray-600 mt-0.5">{item.desc}</p>}
          </div>
          {item.badge && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#4f8cff]/20 text-[#4f8cff] border border-[#4f8cff]/30">
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

function NavDropdown({ label, items }: { label: string; items: DropItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white transition-colors py-1">
        {label} <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <DropMenu items={items} />}
    </div>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Promo bar */}
      <div className="w-full bg-[#4f8cff]/10 border-b border-[#4f8cff]/20 text-center py-2 text-xs text-[#4f8cff] font-medium">
        🚀 SloerStudio v1.0 — Now available for Windows, macOS & Linux.{" "}
        <Link href="/pricing" className="underline hover:text-white transition-colors">Get Started Free →</Link>
      </div>

      {/* Main nav */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#050505]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image src="/company-logo.jpg" alt="SloerStudio" width={32} height={32} className="rounded-lg object-cover" />
            <span className="font-bold tracking-tight text-base font-display">SloerStudio</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <NavDropdown label="Products" items={PRODUCTS} />
            <NavDropdown label="Libraries" items={LIBRARIES} />
            <NavDropdown label="Community" items={COMMUNITY} />
            <NavDropdown label="Company" items={COMPANY} />
            <Link href="/pricing" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/app/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                {(session.user as { role?: string })?.role === "admin" && (
                  <Link href="/admin" className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">Admin</Link>
                )}
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log In</Link>
                <Link href="/signup" className="text-sm font-semibold px-4 py-1.5 rounded-full bg-[#4f8cff] text-black hover:bg-[#6ba3ff] transition-all">Get Started</Link>
              </>
            )}
          </div>

          <button className="md:hidden text-gray-400" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#050505] px-6 py-4 space-y-3">
            {[...PRODUCTS, ...LIBRARIES, { href: "/pricing", label: "Pricing" }, { href: "/community/blog", label: "Blog" }].map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-gray-400 hover:text-white transition-colors py-1" onClick={() => setMobileOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
              {session ? (
                <Link href="/app/dashboard" className="text-sm font-semibold px-4 py-2 rounded-full bg-[#4f8cff] text-black text-center" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-center text-gray-400" onClick={() => setMobileOpen(false)}>Log In</Link>
                  <Link href="/signup" className="text-sm font-semibold px-4 py-2 rounded-full bg-[#4f8cff] text-black text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
