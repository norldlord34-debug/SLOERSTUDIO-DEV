import type { MetadataRoute } from "next";
import { PRODUCT_VIDEO_IDS } from "@/remotion/productVideoConfigs";
import { getAllSlugs } from "@/lib/blog";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sloerstudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/roadmap`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const productPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/products/sloerspace`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE_URL}/products/sloerswarm`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/products/sloervoice`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/products/sloercanvas`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const videoPages: MetadataRoute.Sitemap = PRODUCT_VIDEO_IDS.map((id) => ({
    url: `${BASE_URL}/video/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const companyPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/company/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/company/careers`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/company/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/company/bug-bounty`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  const communityPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/community/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/community/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/community/discord`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/community/events`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/community/open-source`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const libraryPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/libraries/agents`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/libraries/prompts`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/libraries/skills`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const blogPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...getAllSlugs().map((slug) => ({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return [
    ...staticPages,
    ...productPages,
    ...videoPages,
    ...blogPages,
    ...companyPages,
    ...communityPages,
    ...libraryPages,
  ];
}
