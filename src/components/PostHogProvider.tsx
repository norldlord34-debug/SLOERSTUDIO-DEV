"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, capture, POSTHOG_KEY } from "@/lib/posthog";

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!POSTHOG_KEY || !pathname) return;
    const url = `${window.location.origin}${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void initPostHog();
  }, []);

  return (
    <>
      <PostHogPageView />
      {children}
    </>
  );
}
