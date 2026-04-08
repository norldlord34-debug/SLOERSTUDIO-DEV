"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { PRODUCT_VIDEO_CONFIGS, type ProductVideoId } from "@/remotion/productVideoConfigs";
import { VideoSkeleton } from "@/components/ui/Skeleton";
import { useCallback, useEffect, useRef } from "react";
import { trackVideoModalOpen, trackVideoModalClose } from "@/lib/posthog";
import AIAssistant from "@/components/ai/AIAssistant";

const ProductMarketingVideoPlayer = dynamic(
  () => import("@/components/video/ProductMarketingVideoPlayer"),
  {
    ssr: false,
    loading: () => <VideoSkeleton className="w-full" />,
  },
);

type VideoModalProps = {
  productId: ProductVideoId;
};

export default function VideoModal({ productId }: VideoModalProps) {
  const router = useRouter();
  const config = PRODUCT_VIDEO_CONFIGS[productId];
  const openedAt = useRef<number>(0);

  const onClose = useCallback(() => {
    const watchDurationMs = openedAt.current > 0 ? Date.now() - openedAt.current : 0;
    trackVideoModalClose(productId, config.name, watchDurationMs);
    router.back();
  }, [router, productId, config.name]);

  useEffect(() => {
    openedAt.current = Date.now();
    trackVideoModalOpen(productId, config.name);
  }, [productId, config.name]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`${config.name} video`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.95, y: 10, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-4 w-full max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -right-2 -top-12 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70 backdrop-blur-md transition-colors hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f8cff]"
            aria-label="Close video modal"
          >
            <X size={18} />
          </button>

          <section aria-label={`${config.name} product video`}>
            <ProductMarketingVideoPlayer productId={productId} />
          </section>

          <div className="mt-5 flex items-center justify-between gap-4 px-1">
            <div>
              <h2 className="font-display text-xl font-bold text-white">{config.name}</h2>
              <p className="mt-1 text-sm text-gray-400">{config.headline}</p>
            </div>
            <div className="flex gap-2">
              {config.webHighlights.slice(0, 2).map((h) => (
                <span
                  key={h}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-gray-400"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Assistant — context-aware to the current video */}
        <AIAssistant productContext={config} />
      </motion.div>
    </AnimatePresence>
  );
}
