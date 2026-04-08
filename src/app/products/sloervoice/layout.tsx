import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sloerstudio.com";

export const metadata: Metadata = {
  title: "SloerVoice — On-Device Voice-to-Code AI for Developers",
  description:
    "On-device voice coding powered by whisper.rs in Rust. Global hotkeys, transcript vault, profile dictionaries, and vibe coding workflows for VS Code, Cursor, and Windsurf. Zero cloud latency, total privacy — the voice-to-code tool built for AI developers in 2026.",
  keywords: [
    "voice-to-code",
    "voice coding AI",
    "on-device dictation",
    "whisper.rs",
    "voice programming",
    "AI voice IDE",
    "developer dictation tool",
    "vibe coding",
    "VS Code voice input",
    "Cursor voice coding",
    "private voice AI",
    "SloerVoice",
    "SloerStudio",
    "local AI transcription",
    "developer tools 2026",
  ],
  openGraph: {
    type: "website",
    title: "SloerVoice — On-Device Voice-to-Code AI",
    description:
      "Private voice coding powered by Rust + whisper.rs. Global shortcuts, transcript vault, and vibe coding for VS Code, Cursor, and Windsurf.",
    url: `${BASE_URL}/products/sloervoice`,
    siteName: "SloerStudio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SloerVoice — Talk to Code, Locally",
    description:
      "On-device voice coding with zero cloud latency. whisper.rs, global hotkeys, transcript vault, and vibe coding for modern IDEs.",
    site: "@sloerstudio",
  },
  alternates: {
    canonical: `${BASE_URL}/products/sloervoice`,
  },
};

export default function SloerVoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
