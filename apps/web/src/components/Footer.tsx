import Link from "next/link";
import { Zap } from "lucide-react";

const COLS = [
  {
    title: "Products",
    links: [
      { href: "/products/sloerspace", label: "SloerSpace" },
      { href: "/products/sloerswarm", label: "SloerSwarm" },
      { href: "/products/sloercanvas", label: "SloerCanvas" },
      { href: "/products/sloervoice", label: "SloerVoice" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/community/docs", label: "Docs" },
      { href: "/community/open-source", label: "Open Source" },
      { href: "/community/blog", label: "Blog" },
      { href: "/company/careers", label: "Careers" },
      { href: "/company/contact", label: "Contact" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/learn/what-is-agentic-coding", label: "What is Agentic Coding?" },
      { href: "/libraries/prompts", label: "Prompts Library" },
      { href: "/libraries/skills", label: "Skills Library" },
      { href: "/libraries/agents", label: "Agents Library" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company/about", label: "About Us" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/company/contact", label: "Contact Us" },
      { href: "/company/bug-bounty", label: "Bug Bounty" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/community/discord", label: "Discord" },
      { href: "/community/events", label: "Events" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-[#4f8cff]/15 border border-[#4f8cff]/30 flex items-center justify-center">
                <Zap size={13} className="text-[#4f8cff]" fill="currentColor" />
              </div>
              <span className="font-bold tracking-tight text-sm font-display">SloerStudio</span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed">
              The hub of the agentic coding space. Ship software at the speed of thought alongside autonomous AI teammates.
            </p>
            <div className="flex gap-4 mt-5">
              {["X", "YouTube", "Instagram", "TikTok", "Discord"].map((s) => (
                <span key={s} className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer transition-colors">{s[0]}</span>
              ))}
            </div>
            <div className="mt-5">
              <p className="text-xs font-semibold text-white mb-2">Subscribe & get 50% off</p>
              <p className="text-[11px] text-gray-500 mb-3">Join the newsletter and get a unique 50% off code for your first 3 months.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Enter your email" className="flex-1 px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#4f8cff]/50" />
                <button className="px-3 py-2 rounded-lg bg-[#4f8cff] text-black text-xs font-bold">→</button>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold text-white mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">© 2025 SloerStudio. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
