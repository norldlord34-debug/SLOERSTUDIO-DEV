"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import BorderBeam from "@/components/ui/effects/BorderBeam";

type DropItem = { href: string; label: string; badge?: string; desc?: string; accent?: string };

const PRODUCTS: DropItem[] = [
  { href: "/products/sloerspace", label: "SloerSpace", desc: "Cross-platform workspace with PTY, palette, and utilities", accent: "#4f8cff" },
  { href: "/products/sloerswarm", label: "SloerSwarm", badge: "LIVE", desc: "Multi-agent orchestration and launch flows", accent: "#28e7c5" },
  { href: "/products/sloercanvas", label: "SloerCanvas", badge: "ALPHA", desc: "Free-form canvas for complex systems", accent: "#ffbf62" },
  { href: "/products/sloervoice", label: "SloerVoice", desc: "On-device dictation with hotkeys, vault, and vibe coding", accent: "#ff6f96" },
  { href: "/roadmap", label: "SloerMCP", badge: "SOON", desc: "Shared context backbone for ecosystem scale", accent: "#8b5cf6" },
  { href: "/roadmap", label: "SloerCode", badge: "SOON", desc: "Terminal-first coding runtime for direct execution", accent: "#22c55e" },
];
const LIBRARIES: DropItem[] = [
  { href: "/libraries/prompts", label: "Prompts", desc: "Battle-tested interaction layers", accent: "#4f8cff" },
  { href: "/libraries/skills", label: "Skills", desc: "Methodologies and reusable patterns", accent: "#28e7c5" },
  { href: "/libraries/agents", label: "Agents", desc: "Curated AI operators for missions", accent: "#ffbf62" },
];
const COMMUNITY: DropItem[] = [
  { href: "/community/docs", label: "Docs", desc: "Guides and references", accent: "#4f8cff" },
  { href: "/community/open-source", label: "Open Source", badge: "NEW", desc: "Build in the open", accent: "#28e7c5" },
  { href: "/community/events", label: "Events", desc: "Launches and sessions", accent: "#ffbf62" },
  { href: "/community/blog", label: "Blog", desc: "Editorial and strategy", accent: "#ff6f96" },
  { href: "/community/discord", label: "Discord", desc: "Join the builder movement", accent: "#8b5cf6" },
];
const COMPANY: DropItem[] = [
  { href: "/company/about", label: "About", desc: "The philosophy behind SloerStudio", accent: "#4f8cff" },
  { href: "/company/careers", label: "Careers", desc: "Build the future with us", accent: "#28e7c5" },
  { href: "/company/contact", label: "Contact", desc: "Partnerships and support", accent: "#ffbf62" },
  { href: "/company/bug-bounty", label: "Bug Bounty", desc: "Security and trust program", accent: "#ff6f96" },
];

const ease = [0.22, 1, 0.36, 1] as const;

function DropMenu({ items }: { items: DropItem[] }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.97 }}
        transition={{ duration: 0.2, ease }}
        className="absolute left-1/2 top-full z-50 mt-2 w-[20rem] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/95 p-1.5 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      >
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {items.map((item) => (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            className="group flex items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-sm text-white/50 transition-all hover:bg-white/[0.04] hover:text-white"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full opacity-50 group-hover:opacity-100"
                style={{ background: item.accent ?? "#4f8cff" }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <span className="block text-[13px] font-medium text-white/70 group-hover:text-white">{item.label}</span>
                {item.desc && <p className="mt-0.5 text-[11px] leading-4 text-white/25 group-hover:text-white/40">{item.desc}</p>}
              </div>
            </div>
            {item.badge && (
              <span className="rounded-full border border-white/[0.06] px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-white/30">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

function NavDropdown({ label, items }: { label: string; items: DropItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className="flex items-center gap-1 px-3 py-2 text-[13px] font-medium text-white/35 transition-colors hover:text-white"
        aria-label={`Open ${label} menu`}
        aria-expanded={open}
      >
        {label}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && <DropMenu items={items} />}
    </div>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const role = (session?.user as { role?: string } | undefined)?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN" || role === "admin";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-2xl"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-shrink-0 items-center gap-3 transition-opacity hover:opacity-80"
          aria-label="SloerStudio home"
        >
          <Image
            src="/company-logo.jpg"
            alt="SloerStudio logo"
            width={34}
            height={34}
            className="rounded-xl object-cover"
          />
          <div>
            <span className="block font-display text-sm font-bold tracking-tight text-white">
              SloerStudio
            </span>
            <span className="block text-[9px] uppercase tracking-[0.2em] text-white/25">
              AI-native platform
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 xl:flex">
          <NavDropdown label="Products" items={PRODUCTS} />
          <NavDropdown label="Libraries" items={LIBRARIES} />
          <NavDropdown label="Community" items={COMMUNITY} />
          <NavDropdown label="Company" items={COMPANY} />
          <Link
            href="/pricing"
            className="px-3 py-2 text-[13px] font-medium text-white/35 transition-colors hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/roadmap"
            className="px-3 py-2 text-[13px] font-medium text-white/35 transition-colors hover:text-white"
          >
            Roadmap
          </Link>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 xl:flex">
          <LocaleSwitcher />
          {session ? (
            <>
              <Link
                href="/app/dashboard"
                className="rounded-full border border-white/[0.08] px-4 py-2 text-[13px] font-medium text-white/50 transition-all hover:border-white/15 hover:text-white"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-full border border-amber-400/20 bg-amber-400/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-amber-300/70 transition-all hover:bg-amber-400/10"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Sign out"
                className="px-3 py-2 text-[13px] font-medium text-white/30 transition-colors hover:text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-[13px] font-medium text-white/40 transition-colors hover:text-white"
              >
                Log in
              </Link>
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/signup"
                  className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black transition-shadow hover:shadow-[0_8px_24px_rgba(255,255,255,0.08)]"
                  aria-label="Get started with SloerStudio"
                >
                  <BorderBeam size={50} duration={4} color="#4f8cff" colorTo="#28e7c5" />
                  Get Started
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="xl:hidden rounded-full border border-white/[0.06] p-2.5 text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease }}
            className="xl:hidden overflow-hidden border-t border-white/[0.04] bg-[#050505]/98 backdrop-blur-2xl"
          >
            <div className="space-y-4 px-6 py-6">
              {[
                { title: "Products", items: PRODUCTS },
                { title: "Libraries", items: LIBRARIES },
                { title: "Community", items: COMMUNITY },
                { title: "Company", items: COMPANY },
              ].map((group) => (
                <div key={group.title}>
                  <p className="mb-2 px-1 text-[10px] uppercase tracking-[0.2em] text-white/20">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={`m-${group.title}-${item.label}`}
                        href={item.href}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] text-white/40 transition-colors hover:bg-white/[0.03] hover:text-white"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="rounded-full border border-white/[0.06] px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] text-white/25">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-white/[0.04] pt-4">
                <div className="flex justify-center pb-3">
                  <LocaleSwitcher />
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/pricing"
                    className="rounded-xl px-3 py-2.5 text-center text-[13px] text-white/40 transition-colors hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link
                    href="/roadmap"
                    className="rounded-xl px-3 py-2.5 text-center text-[13px] text-white/40 transition-colors hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    Roadmap
                  </Link>
                  {session ? (
                    <>
                      <Link
                        href="/app/dashboard"
                        className="sloer-button-primary w-full justify-center"
                        onClick={() => setMobileOpen(false)}
                      >
                        Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="sloer-button-secondary w-full justify-center"
                          onClick={() => setMobileOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="sloer-button-secondary w-full justify-center"
                        onClick={() => setMobileOpen(false)}
                      >
                        Log In
                      </Link>
                      <Link
                        href="/signup"
                        className="sloer-button-primary w-full justify-center"
                        onClick={() => setMobileOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
