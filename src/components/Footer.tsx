import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Github, MessageCircle, Sparkles, Youtube, Instagram } from "lucide-react";

const COLS = [
  {
    title: "Products",
    links: [
      { href: "/products/sloerspace", label: "SloerSpace" },
      { href: "/products/sloerswarm", label: "SloerSwarm" },
      { href: "/products/sloercanvas", label: "SloerCanvas" },
      { href: "/products/sloervoice", label: "SloerVoice" },
      { href: "/roadmap", label: "SloerMCP" },
      { href: "/roadmap", label: "SloerCode" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/community/docs", label: "Documentation" },
      { href: "/libraries/prompts", label: "Prompts" },
      { href: "/libraries/skills", label: "Skills" },
      { href: "/libraries/agents", label: "Agents" },
      { href: "/community/blog", label: "Blog" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/community/discord", label: "Discord" },
      { href: "/community/open-source", label: "Open Source" },
      { href: "/community/events", label: "Events" },
      { href: "/roadmap", label: "Roadmap" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company/about", label: "About" },
      { href: "/company/careers", label: "Careers" },
      { href: "/company/contact", label: "Contact" },
      { href: "/company/bug-bounty", label: "Bug Bounty" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

const SOCIALS = [
  { href: "/community/discord", label: "Discord", icon: MessageCircle },
  { href: "/community/open-source", label: "GitHub", icon: Github },
  { href: "/community/blog", label: "Blog", icon: Sparkles },
  { href: "/community/events", label: "YouTube", icon: Youtube },
  { href: "/company/contact", label: "Instagram", icon: Instagram },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
        {/* Newsletter strip */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-md">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/25">Stay updated</p>
            <p className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
              Get product drops &amp; launch signals.
            </p>
          </div>
          <div className="w-full max-w-md">
            <div className="group/input relative flex gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] p-1.5 transition-all focus-within:border-white/[0.15] focus-within:shadow-[0_0_30px_rgba(79,140,255,0.08)]">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                placeholder="you@company.com"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white placeholder:text-white/20 focus:outline-none"
              />
              <button
                type="button"
                className="relative flex items-center gap-1.5 overflow-hidden rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition-shadow hover:shadow-[0_8px_24px_rgba(255,255,255,0.06)]"
                aria-label="Subscribe to newsletter"
              >
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover/input:opacity-100"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(79,140,255,0.15), transparent)",
                    animation: "shine-sweep 2s ease-in-out infinite",
                    width: "40%",
                    height: "100%",
                  }}
                  aria-hidden="true"
                />
                Subscribe <ArrowRight size={13} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* Main grid */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="SloerStudio home">
              <Image
                src="/company-logo.jpg"
                alt="SloerStudio logo"
                width={36}
                height={36}
                className="rounded-xl object-cover"
              />
              <div>
                <span className="block font-display text-base font-bold text-white">SloerStudio</span>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-white/20">
                  AI-native platform
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/25">
              The AI-native development platform that unifies agentic workspaces,
              orchestration, voice coding, and cinematic video into one system.
            </p>

            <div className="mt-8 flex gap-2">
              {SOCIALS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] text-white/20 transition-all hover:border-white/15 hover:text-white"
                  aria-label={label}
                >
                  <Icon size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLS.map((col) => (
              <div key={col.title}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/20">
                  {col.title}
                </p>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-white/30 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.04] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-white/15">© 2026 SloerStudio. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="text-[11px] text-white/15 transition-colors hover:text-white/40">Privacy</Link>
            <Link href="/terms" className="text-[11px] text-white/15 transition-colors hover:text-white/40">Terms</Link>
            <Link href="/roadmap" className="text-[11px] text-white/15 transition-colors hover:text-white/40">Roadmap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
