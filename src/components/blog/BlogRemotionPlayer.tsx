"use client";

import React, { Suspense } from "react";
import { Player } from "@remotion/player";
import { BlogHeroComposition } from "./BlogRemotionHero";

interface BlogRemotionPlayerProps {
  title: string;
  accent?: string;
}

function BlogRemotionPlayerInner({ title, accent = "#4f8cff" }: BlogRemotionPlayerProps) {
  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <Player
        component={BlogHeroComposition}
        inputProps={{ title, accent }}
        durationInFrames={90}
        compositionWidth={1280}
        compositionHeight={720}
        fps={30}
        autoPlay
        loop
        style={{ width: "100%", borderRadius: "1rem" }}
        controls={false}
      />
    </div>
  );
}

export default function BlogRemotionPlayer(props: BlogRemotionPlayerProps) {
  return (
    <Suspense
      fallback={
        <div className="my-8 aspect-video animate-pulse rounded-2xl bg-white/5" />
      }
    >
      <BlogRemotionPlayerInner {...props} />
    </Suspense>
  );
}
