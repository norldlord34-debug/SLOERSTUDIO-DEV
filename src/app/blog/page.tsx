import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BlogListClient } from "@/components/blog/BlogListClient";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-10" role="main">
        {/* Hero */}
        <section className="mb-16 text-center" aria-label="Blog hero">
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-gray-400 backdrop-blur-sm">
            Engineering Blog
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            How AI Is Rewriting{" "}
            <span
              className="bg-gradient-to-r from-[#4f8cff] via-[#28e7c5] to-[#8b5cf6] bg-clip-text text-transparent"
            >
              Video Production
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-400">
            Technical deep-dives on Remotion, AI video generation, agentic pipelines,
            and why the timeline editor is already obsolete. Written by engineers and Claude 4.6.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/feed.xml"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-400 transition-colors hover:border-[#4f8cff]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f8cff]"
              aria-label="Subscribe to RSS feed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="6.18" cy="17.82" r="2.18" />
                <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
              </svg>
              RSS Feed
            </Link>
          </div>
        </section>

        {/* Post grid */}
        <BlogListClient posts={posts.map((p) => p.frontmatter)} />
      </main>
      <Footer />
    </div>
  );
}
