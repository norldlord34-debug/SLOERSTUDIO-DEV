"use client";

import dynamic from "next/dynamic";

const BlogRemotionPlayer = dynamic(() => import("./BlogRemotionPlayer"), {
  ssr: false,
  loading: () => <div className="my-8 aspect-video animate-pulse rounded-2xl bg-white/5" />,
});

export function MdxRemotionHeroClient({ title, accent }: { title: string; accent: string }) {
  return <BlogRemotionPlayer title={title} accent={accent} />;
}
