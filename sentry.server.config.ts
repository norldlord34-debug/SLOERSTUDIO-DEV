import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",

  tracesSampleRate: 1.0,

  integrations: [
    Sentry.prismaIntegration(),
  ],

  beforeSend(event) {
    if (event.exception?.values?.some((v) => v.type?.includes("Remotion"))) {
      event.tags = { ...event.tags, component: "remotion-render" };
    }
    return event;
  },
});
