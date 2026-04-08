import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sloerstudio.com";

export const metadata: Metadata = {
  title: "SloerCanvas — Spatial AI Workspace for Visual Orchestration",
  description:
    "A zoomable spatial runtime for visual AI thread orchestration. Drag, resize, and position 1-12 live agent threads on an infinite canvas. Persistent runtimes, directable visual workflows, and mission topology for complex AI development.",
  keywords: [
    "spatial AI workspace",
    "visual AI orchestration",
    "AI canvas tool",
    "zoomable workspace",
    "AI thread management",
    "spatial development environment",
    "visual coding workspace",
    "AI workflow canvas",
    "SloerCanvas",
    "SloerStudio",
    "developer tools 2026",
    "directable AI workflows",
    "infinite canvas IDE",
  ],
  openGraph: {
    type: "website",
    title: "SloerCanvas — Spatial AI Workspace",
    description:
      "Zoomable spatial runtime for visual AI thread orchestration. 1-12 live views with persistent runtimes and directable workflows.",
    url: `${BASE_URL}/products/sloercanvas`,
    siteName: "SloerStudio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SloerCanvas — The Spatial Surface for AI Threads",
    description:
      "Drag, zoom, and orchestrate AI agent threads on an infinite canvas. Persistent runtimes and visible topology for complex workflows.",
    site: "@sloerstudio",
  },
  alternates: {
    canonical: `${BASE_URL}/products/sloercanvas`,
  },
};

export default function SloerCanvasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
