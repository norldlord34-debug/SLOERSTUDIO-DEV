import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

const SYSTEM_PROMPT = `You are a senior technical writer for SloerStudio — an AI-native development platform that includes Remotion-powered programmatic video generation.

Your task: write a long-form technical blog post in MDX format about how Remotion and AI are transforming video production.

Rules:
- Write in English, technical but accessible
- Use Markdown headings (## for sections, ### for subsections)
- Include the <RemotionHero /> component exactly once, near the top of the article after the first section
- Use bold for key terms, tables for comparisons, code blocks for examples
- Include real technical details about Remotion (useCurrentFrame, interpolate, spring, <Player />, @remotion/renderer)
- Reference the AI video generation landscape (Runway, Sora, Claude, code-driven video)
- Mention SloerStudio products where relevant (SloerSpace, SloerSwarm, SloerVoice)
- End with a forward-looking conclusion
- Do NOT include frontmatter — only the MDX body content
- Keep it between 800-1500 words
- The tone is premium, direct, technically credible`;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function estimateReadingTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 230));
  return `${minutes} min read`;
}

export async function POST(req: Request) {
  try {
    const { topic, tags = [] } = (await req.json()) as {
      topic?: string;
      tags?: string[];
    };

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Missing required field: topic" },
        { status: 400 },
      );
    }

    const titlePrompt = `Generate a compelling, SEO-optimized article title for this topic: "${topic}". Return ONLY the title text, nothing else.`;

    const titleResult = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt: titlePrompt,
      maxOutputTokens: 100,
      temperature: 0.8,
    });

    const title = titleResult.text.trim().replace(/^["']|["']$/g, "");

    const bodyResult = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: SYSTEM_PROMPT,
      prompt: `Write a technical blog post about: "${topic}"\n\nTitle: ${title}\n\nWrite the MDX body content now.`,
      maxOutputTokens: 4096,
      temperature: 0.7,
    });

    const body = bodyResult.text.trim();
    const slug = slugify(title);
    const date = new Date().toISOString().split("T")[0];
    const readingTime = estimateReadingTime(body);

    const accentColors = ["#4f8cff", "#28e7c5", "#8b5cf6", "#ff6f96", "#ffbf62"];
    const accent = accentColors[Math.floor(Math.random() * accentColors.length)];

    const excerptResult = await generateText({
      model: anthropic("claude-sonnet-4-20250514"),
      prompt: `Write a 1-2 sentence excerpt / meta description for this article titled "${title}". It should be compelling and SEO-optimized. Return ONLY the excerpt text.`,
      maxOutputTokens: 200,
      temperature: 0.6,
    });

    const excerpt = excerptResult.text.trim().replace(/^["']|["']$/g, "");

    const defaultTags = [
      "remotion",
      "AI video generation",
      "code-driven video",
      "creative infrastructure",
    ];
    const finalTags = [...new Set([...defaultTags, ...tags])];

    const frontmatter = [
      "---",
      `title: "${title.replace(/"/g, '\\"')}"`,
      `slug: "${slug}"`,
      `date: "${date}"`,
      `excerpt: "${excerpt.replace(/"/g, '\\"')}"`,
      `author: "SloerStudio Engineering"`,
      `tags: [${finalTags.map((t) => `"${t}"`).join(", ")}]`,
      `coverAccent: "${accent}"`,
      `readingTime: "${readingTime}"`,
      `featured: false`,
      `generatedBy: "claude-4.6-sonnet"`,
      "---",
    ].join("\n");

    const fullContent = `${frontmatter}\n\n${body}\n`;

    if (!fs.existsSync(BLOG_DIR)) {
      fs.mkdirSync(BLOG_DIR, { recursive: true });
    }

    const filename = `${slug}.mdx`;
    const filepath = path.join(BLOG_DIR, filename);

    if (fs.existsSync(filepath)) {
      return NextResponse.json(
        { error: `Article with slug "${slug}" already exists` },
        { status: 409 },
      );
    }

    fs.writeFileSync(filepath, fullContent, "utf-8");

    return NextResponse.json({
      success: true,
      slug,
      title,
      excerpt,
      tags: finalTags,
      readingTime,
      filename,
      url: `/blog/${slug}`,
    });
  } catch (error) {
    console.error("[blog/generate] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate article" },
      { status: 500 },
    );
  }
}
