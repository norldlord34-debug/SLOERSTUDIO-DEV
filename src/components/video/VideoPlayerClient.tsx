"use client";

import dynamic from "next/dynamic";
import { VideoSkeleton } from "@/components/ui/Skeleton";
import type { ProductVideoId } from "@/remotion/productVideoConfigs";

const ProductMarketingVideoPlayer = dynamic(
  () => import("@/components/video/ProductMarketingVideoPlayer"),
  {
    ssr: false,
    loading: () => <VideoSkeleton className="w-full" />,
  },
);

export default function VideoPlayerClient({ productId }: { productId: ProductVideoId }) {
  return <ProductMarketingVideoPlayer productId={productId} />;
}
