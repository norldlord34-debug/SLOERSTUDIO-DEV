"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const shimmer = {
  initial: { x: "-100%" },
  animate: { x: "100%" },
  transition: { repeat: Infinity, duration: 1.8, ease: "linear" as const },
};

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/[0.04]",
        className,
      )}
      aria-hidden="true"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"
        initial={shimmer.initial}
        animate={shimmer.animate}
        transition={shimmer.transition}
      />
    </div>
  );
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "sloer-panel rounded-[34px] p-6",
        className,
      )}
      aria-label="Loading chart"
      role="status"
    >
      <div className="mb-5 flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex items-end gap-1.5">
        {[80, 120, 60, 140, 100, 160, 90, 130, 70, 150, 110, 85].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-lg bg-white/[0.04]"
            initial={{ height: 20 }}
            animate={{ height: h }}
            transition={{
              duration: 0.6,
              delay: i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function PieSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "sloer-panel rounded-[34px] p-6",
        className,
      )}
      aria-label="Loading chart"
      role="status"
    >
      <div className="mb-5 flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="flex items-center gap-8">
        <motion.div
          className="relative h-[160px] w-[160px] rounded-full border-[12px] border-white/[0.04]"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            borderTopColor: "rgba(79,140,255,0.2)",
            borderRightColor: "rgba(40,231,197,0.15)",
          }}
        />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function VideoSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[34px] border border-white/10 bg-[#05060a]",
        className,
      )}
      aria-label="Loading video player"
      role="status"
    >
      <div className="aspect-video w-full">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="h-16 w-16 rounded-full border-2 border-white/10 border-t-[#4f8cff]/60"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </div>
      <div className="absolute left-4 top-4 flex gap-2">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function AdminChartsRowSkeleton() {
  return (
    <div
      className="mb-10 grid gap-6 xl:grid-cols-[0.82fr_0.82fr_0.54fr]"
      aria-label="Loading admin charts"
      role="status"
    >
      <ChartSkeleton />
      <PieSkeleton />
      <div className="sloer-panel rounded-[34px] p-6">
        <div className="mb-5 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-2xl" />
          <div>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-3 w-44" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="mt-2 h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ModalSkeleton() {
  return (
    <div
      className="flex items-center justify-center p-8"
      aria-label="Loading video modal"
      role="status"
    >
      <div className="w-full max-w-5xl">
        <VideoSkeleton className="w-full" />
        <div className="mt-6 flex gap-4">
          <Skeleton className="h-12 w-48 rounded-2xl" />
          <Skeleton className="h-12 flex-1 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
