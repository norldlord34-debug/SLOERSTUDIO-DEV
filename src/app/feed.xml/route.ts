import RSS from "rss";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sloerstudio.com";

export async function GET() {
  const posts = getAllPosts();

  const feed = new RSS({
    title: "SloerStudio Blog — AI Video Generation & Creative Infrastructure",
    description:
      "Technical articles on Remotion, AI video generation, programmatic video production, agentic workflows, and the future of creative infrastructure.",
    site_url: `${BASE_URL}/blog`,
    feed_url: `${BASE_URL}/feed.xml`,
    language: "en-US",
    copyright: `© ${new Date().getFullYear()} SloerStudio. All rights reserved.`,
    pubDate: posts[0]?.frontmatter.date ?? new Date().toISOString(),
    ttl: 60,
    custom_namespaces: {
      content: "http://purl.org/rss/1.0/modules/content/",
    },
  });

  for (const post of posts) {
    const { frontmatter: fm } = post;
    feed.item({
      title: fm.title,
      description: fm.excerpt,
      url: `${BASE_URL}/blog/${fm.slug}`,
      guid: `${BASE_URL}/blog/${fm.slug}`,
      date: fm.date,
      author: fm.author,
      categories: fm.tags,
    });
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
