"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { ProductMarketingVideo } from "@/remotion/PremiumProductMarketingVideo";
import {
  PRODUCT_VIDEO_CONFIGS,
  VIDEO_DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  type ProductVideoId,
} from "@/remotion/productVideoConfigs";

const RemotionPlayer = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false },
);

const PlayerComposition = ProductMarketingVideo as unknown as ComponentType<Record<string, unknown>>;

type ProductMarketingVideoPlayerProps = {
  productId: ProductVideoId;
  className?: string;
  compact?: boolean;
};

export default function ProductMarketingVideoPlayer({
  productId,
  className = "",
  compact = false,
}: ProductMarketingVideoPlayerProps) {
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const inputProps = { productId } as Record<string, unknown>;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.006 }}
      className={`group relative overflow-hidden rounded-[34px] border border-white/10 bg-[#05060a] ${className}`.trim()}
      style={{ boxShadow: `0 36px 120px rgba(0, 0, 0, 0.46), 0 0 0 1px ${config.accent}20, 0 0 80px ${config.accent}14` }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(circle at 18% 18%, ${config.accent}22, transparent 30%), radial-gradient(circle at 82% 18%, ${config.secondaryAccent}14, transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 22%, rgba(0,0,0,0.32) 100%)` }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px" style={{ background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)` }} />
      <div className="pointer-events-none absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2 md:left-5 md:top-5">
        <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 backdrop-blur-md">
          {config.name}
        </span>
        <span className="rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] backdrop-blur-md" style={{ color: config.accent, borderColor: `${config.accent}40`, background: `${config.accent}12` }}>
          {compact ? "Spot" : config.tag}
        </span>
      </div>
      <div className="pointer-events-none absolute right-4 top-4 z-20 md:right-5 md:top-5">
        <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 backdrop-blur-md">
          30s film
        </span>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-4 z-20 flex max-w-[75%] flex-wrap gap-2 md:bottom-5 md:left-5">
        {config.webHighlights.slice(0, compact ? 1 : 2).map((highlight) => (
          <span key={highlight} className="rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/70 backdrop-blur-md">
            {highlight}
          </span>
        ))}
      </div>
      <div className="relative z-10 p-1.5 md:p-2">
        <div className={`overflow-hidden rounded-[28px] border border-white/8 bg-black/40 ${compact ? "" : "shadow-[0_28px_100px_rgba(0,0,0,0.38)]"}`}>
          <RemotionPlayer
            component={PlayerComposition}
            inputProps={inputProps}
            durationInFrames={VIDEO_DURATION_IN_FRAMES}
            fps={VIDEO_FPS}
            compositionWidth={VIDEO_WIDTH}
            compositionHeight={VIDEO_HEIGHT}
            controls={!compact}
            loop
            style={{ width: "100%", aspectRatio: `${VIDEO_WIDTH} / ${VIDEO_HEIGHT}`, borderRadius: 28 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
