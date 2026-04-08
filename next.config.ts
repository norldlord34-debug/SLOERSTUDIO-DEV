import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "recharts",
    ],
  },
  serverExternalPackages: [
    "remotion",
    "@remotion/bundler",
    "@remotion/renderer",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...(typeof config.optimization.splitChunks === "object"
            ? config.optimization.splitChunks.cacheGroups
            : {}),
          recharts: {
            test: /[\\/]node_modules[\\/](recharts|d3-.*|victory.*)[\\/]/,
            name: "vendor-recharts",
            chunks: "all" as const,
            priority: 40,
            enforce: true,
          },
          sentry: {
            test: /[\\/]node_modules[\\/]@sentry[\\/]/,
            name: "vendor-sentry",
            chunks: "async" as const,
            priority: 50,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
};

export default withAnalyzer(withNextIntl(nextConfig));
