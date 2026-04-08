import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import SessionProvider from "@/components/SessionProvider";
import PostHogProvider from "@/components/PostHogProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SloerStudio — AI-Native Development Platform for Agentic Workflows",
    template: "%s | SloerStudio",
  },
  description:
    "Ship faster with the AI-native development platform. SloerStudio unifies agentic workspaces, multi-agent orchestration, on-device voice coding, AI video generation, and enterprise-grade admin — all powered by Rust and controllable workflows.",
  keywords: [
    "AI development platform",
    "agentic workspace",
    "AI video generation",
    "AI video generator",
    "multi-agent orchestration",
    "AI coding tools",
    "voice-to-code",
    "AI creative infrastructure",
    "developer tools 2026",
    "Sora alternative",
    "Runway alternative",
    "AI product marketing video",
    "text-to-video SaaS",
    "cinematic AI video",
    "controllable AI workflows",
    "code-driven video generation",
    "AI video rendering engine",
    "vibe coding",
    "Tauri",
    "Rust",
  ],
  openGraph: {
    type: "website",
    siteName: "SloerStudio",
    title: "SloerStudio — AI-Native Development Platform for Agentic Workflows",
    description:
      "The operating system for AI builders. Agentic workspaces, multi-agent swarms, voice coding, cinematic AI video generation, and enterprise control — one platform.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sloerstudio",
    creator: "@sloerstudio",
    title: "SloerStudio — AI-Native Development Platform",
    description:
      "Ship faster with agentic workspaces, multi-agent orchestration, on-device voice coding, and AI-powered video generation. The 2026 dev platform.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <Suspense>
              <PostHogProvider>
                {children}
                {modal}
              </PostHogProvider>
            </Suspense>
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
