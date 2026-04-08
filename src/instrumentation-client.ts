async function initSentryClient() {
  const Sentry = await import("@sentry/nextjs");

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enabled: process.env.NODE_ENV === "production",

    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,

    integrations: [
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
      Sentry.browserTracingIntegration(),
    ],

    beforeSend(event) {
      if (event.exception?.values?.some((v) => v.type?.includes("Remotion"))) {
        event.tags = { ...event.tags, component: "remotion-video" };
      }
      return event;
    },
  });
}

if (typeof window !== "undefined") {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(() => void initSentryClient());
  } else {
    setTimeout(() => void initSentryClient(), 2000);
  }
}
