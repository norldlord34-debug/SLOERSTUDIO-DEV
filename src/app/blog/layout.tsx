import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sloerstudio.com";

export const metadata: Metadata = {
  title: {
    default: "Blog — SloerStudio",
    template: "%s | SloerStudio Blog",
  },
  description:
    "Technical articles on AI video generation, Remotion, programmatic video production, agentic workflows, and the future of creative infrastructure. Written by the SloerStudio engineering team and Claude 4.6.",
  keywords: [
    "AI video generation blog",
    "Remotion tutorials",
    "programmatic video production",
    "AI video editing",
    "code-driven video",
    "agentic video pipeline",
    "Claude AI video",
    "Remotion React video",
    "creative infrastructure blog",
    "SloerStudio engineering",
    "developer tools blog 2026",
  ],
  openGraph: {
    type: "website",
    title: "SloerStudio Blog — AI Video Generation & Creative Infrastructure",
    description:
      "Technical deep-dives on Remotion, AI video generation, agentic workflows, and the death of traditional video editing.",
    url: `${BASE_URL}/blog`,
    siteName: "SloerStudio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SloerStudio Blog",
    description:
      "AI video generation, Remotion deep-dives, and agentic workflow tutorials from the SloerStudio engineering team.",
    site: "@sloerstudio",
  },
  alternates: {
    canonical: `${BASE_URL}/blog`,
    types: {
      "application/rss+xml": `${BASE_URL}/feed.xml`,
    },
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
