import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sloerstudio.com";

export const metadata: Metadata = {
  title: "SloerSpace — AI-Native Agentic Workspace with Rust PTY Runtime",
  description:
    "The flagship agentic workspace for AI developers. Rust-backed persistent PTY runtime, 1–16 session layouts, command palette, integrated browser, notebook, SSH, and controllable AI workflows — all in one cross-platform shell. The best Sora-era developer tool for 2026.",
  keywords: [
    "agentic workspace",
    "AI development IDE",
    "Rust PTY runtime",
    "multi-pane terminal",
    "AI coding workspace",
    "controllable AI workflows",
    "developer tools 2026",
    "AI-native IDE",
    "Tauri desktop app",
    "SloerSpace",
    "SloerStudio",
    "vibe coding workspace",
    "AI agent terminal",
    "cross-platform IDE",
  ],
  openGraph: {
    type: "website",
    title: "SloerSpace — AI-Native Agentic Workspace",
    description:
      "Rust-backed PTY runtime, 1–16 session layouts, command palette depth, and integrated utilities. The flagship agentic workspace for AI builders.",
    url: `${BASE_URL}/products/sloerspace`,
    siteName: "SloerStudio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SloerSpace — The Agentic Workspace for AI Developers",
    description:
      "Ship faster with Rust-backed PTY sessions, 16-pane layouts, and controllable AI workflows in one cross-platform shell.",
    site: "@sloerstudio",
  },
  alternates: {
    canonical: `${BASE_URL}/products/sloerspace`,
  },
};

export default function SloerSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
