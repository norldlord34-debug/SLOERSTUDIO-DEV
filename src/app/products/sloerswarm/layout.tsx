import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sloerstudio.com";

export const metadata: Metadata = {
  title: "SloerSwarm — Multi-Agent AI Orchestration Platform",
  description:
    "Coordinate multiple AI agents with role-aware operators, mission directives, persistent PTY sessions, and visible handoffs. SloerSwarm turns multi-agent orchestration into a controllable, directable workflow — not a chaotic prompt chain.",
  keywords: [
    "multi-agent orchestration",
    "AI agent coordination",
    "AI swarm platform",
    "role-aware AI agents",
    "mission-driven AI workflows",
    "controllable AI orchestration",
    "AI team coordination",
    "developer tools 2026",
    "SloerSwarm",
    "SloerStudio",
    "AI agent management",
    "persistent agent sessions",
    "AI workflow automation",
  ],
  openGraph: {
    type: "website",
    title: "SloerSwarm — Multi-Agent AI Orchestration",
    description:
      "Mission-driven orchestration for AI teams. Role-aware operators, shared directives, and visible handoffs in one controllable system.",
    url: `${BASE_URL}/products/sloerswarm`,
    siteName: "SloerStudio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SloerSwarm — Coordinate AI Teams Like a Director",
    description:
      "Multi-agent orchestration with role-aware operators, mission directives, and persistent PTY sessions. Built for serious AI development workflows.",
    site: "@sloerstudio",
  },
  alternates: {
    canonical: `${BASE_URL}/products/sloerswarm`,
  },
};

export default function SloerSwarmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
