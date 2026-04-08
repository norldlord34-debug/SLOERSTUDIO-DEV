import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sloerstudio.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/app/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/app/"],
      },
      {
        userAgent: "Googlebot-Video",
        allow: ["/video/", "/marketing-videos/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
