export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

type PostHogLike = {
  init: (key: string, opts: Record<string, unknown>) => void;
  capture: (event: string, properties?: Record<string, unknown>) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
};

let _posthog: PostHogLike | null = null;
let _loading: Promise<PostHogLike> | null = null;

function loadPostHog(): Promise<PostHogLike> {
  if (_posthog) return Promise.resolve(_posthog);
  if (_loading) return _loading;
  _loading = import("posthog-js").then((mod) => {
    _posthog = mod.default as unknown as PostHogLike;
    return _posthog;
  });
  return _loading;
}

let initialized = false;

export async function initPostHog() {
  if (typeof window === "undefined" || initialized || !POSTHOG_KEY) return;
  const ph = await loadPostHog();
  ph.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
  });
  initialized = true;
}

export function capture(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined" || !POSTHOG_KEY || !_posthog) return;
  _posthog.capture(event, properties);
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === "undefined" || !POSTHOG_KEY || !_posthog) return;
  _posthog.identify(userId, traits);
}

// ── Custom event helpers ─────────────────────────────────────────────

export function trackBentoGridClick(productName: string, productId: string) {
  capture("bento_grid_click", {
    product_name: productName,
    product_id: productId,
    section: "ecosystem",
  });
}

export function trackVideoModalOpen(productId: string, productName: string) {
  capture("video_modal_open", {
    product_id: productId,
    product_name: productName,
  });
}

export function trackVideoModalClose(
  productId: string,
  productName: string,
  watchDurationMs: number,
) {
  capture("video_modal_close", {
    product_id: productId,
    product_name: productName,
    watch_duration_ms: watchDurationMs,
    watch_duration_seconds: Math.round(watchDurationMs / 1000),
  });
}

export function trackVideoPlaybackProgress(
  productId: string,
  percentWatched: number,
) {
  capture("video_playback_progress", {
    product_id: productId,
    percent_watched: percentWatched,
  });
}

export const posthog = {
  capture,
  identify: identifyUser,
};
