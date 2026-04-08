"use client";

import dynamic from "next/dynamic";
import {
  PRODUCT_VIDEO_CONFIGS,
  type ProductVideoId,
} from "@/remotion/productVideoConfigs";
import { VideoSkeleton } from "@/components/ui/Skeleton";

const ProductMarketingVideoPlayer = dynamic(
  () => import("./ProductMarketingVideoPlayer"),
  {
    ssr: false,
    loading: () => <VideoSkeleton />,
  },
);

type ProductMarketingShowcaseProps = {
  productId: ProductVideoId;
};

export default function ProductMarketingShowcase({ productId }: ProductMarketingShowcaseProps) {
  const config = PRODUCT_VIDEO_CONFIGS[productId];

  return (
    <section className="mb-28">
      <div className="overflow-hidden rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.24))] shadow-[0_40px_120px_rgba(0,0,0,0.46)]">
        <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
          <div className="p-2 md:p-3">
            <ProductMarketingVideoPlayer productId={productId} className="rounded-[32px] border-white/8" />
          </div>
          <div className="flex flex-col justify-between border-t border-white/8 p-7 md:p-9 lg:border-l lg:border-t-0">
            <div>
              <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70">
                Cinematic product film
              </span>
              <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl">{config.headline}</h2>
              <p className="mt-4 text-sm uppercase tracking-[0.24em] text-gray-500">{config.runtimeLabel}</p>
              <p className="mt-4 text-lg font-medium text-gray-200">{config.cta}</p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {config.stats.map((stat) => (
                <div key={stat.label} className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">{stat.label}</p>
                  <p className="mt-3 text-sm font-semibold text-white">{stat.value}</p>
                  <span className="mt-3 block h-1.5 w-14 rounded-full" style={{ background: config.accent }} />
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {config.webHighlights.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
