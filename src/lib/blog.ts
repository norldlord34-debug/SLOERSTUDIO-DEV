import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

export type BlogFrontmatter = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  coverAccent: string;
  readingTime: string;
  featured?: boolean;
  generatedBy?: string;
};

export type BlogPost = {
  frontmatter: BlogFrontmatter;
  content: string;
};

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return { frontmatter: data as BlogFrontmatter, content };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find((p) => p.frontmatter.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.frontmatter.slug);
}
