import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenText, Calendar, ChevronRight, Clock, Sparkles } from "lucide-react";
import { BLOG_POSTS, BLOG_TAG_COLORS, getBlogPostBySlug } from "@/data/blogPosts";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 pb-32 pt-16 md:pt-20">
        <div className="mb-10">
          <Link href="/community/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
            <ArrowLeft size={15} />
            Back to blog
          </Link>
        </div>

        <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: BLOG_TAG_COLORS[tag] ?? "#6b7280", borderColor: `${BLOG_TAG_COLORS[tag] ?? "#6b7280"}30`, background: `${BLOG_TAG_COLORS[tag] ?? "#6b7280"}12` }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.24em] text-gray-500">{post.category}</p>
            <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl xl:text-[5rem] xl:leading-[0.95]">
              {post.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-gray-300">{post.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                <Calendar size={14} />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                <Clock size={14} />
                {post.readTime} read
              </span>
            </div>
          </div>

          <div className="sloer-panel rounded-[34px] p-6">
            <div className="rounded-[26px] border border-white/8 bg-black/20 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border" style={{ borderColor: `${post.accent}30`, background: `${post.accent}12`, color: post.accent }}>
                  <BookOpenText size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Article focus</p>
                  <p className="text-[11px] text-gray-500">Editorial summary and key takeaways.</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-8 text-gray-400">This article exists to explain one layer of the product or company logic behind SloerStudio, not just announce that something shipped.</p>
            </div>
            <div className="mt-5 space-y-3">
              {post.takeaways.map((takeaway) => (
                <div key={takeaway} className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-white">
                      <Sparkles size={14} />
                    </div>
                    <p className="text-sm leading-7 text-gray-300">{takeaway}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <article className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <div className="space-y-10">
            {post.sections.map((section) => (
              <section key={section.title} className="rounded-[34px] border border-white/8 bg-white/[0.02] p-7 md:p-8">
                <h2 className="font-display text-3xl font-bold text-white md:text-4xl">{section.title}</h2>
                <p className="mt-5 text-base leading-9 text-gray-300">{section.body}</p>
              </section>
            ))}
          </div>

          <aside className="space-y-5">
            <div className="sloer-panel rounded-[30px] p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Read next</p>
              <div className="mt-4 space-y-3">
                {relatedPosts.map((item) => (
                  <Link key={item.slug} href={`/community/blog/${item.slug}`} className="block rounded-[24px] border border-white/8 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{item.category}</p>
                    <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs text-[#4f8cff]">
                      Open article <ChevronRight size={13} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="sloer-panel rounded-[30px] p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Continue exploring</p>
              <div className="mt-4 space-y-3">
                <Link href="/products/sloerspace" className="block rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-white">
                  Explore SloerSpace
                </Link>
                <Link href="/products/sloerswarm" className="block rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-gray-300 transition-colors hover:bg-white/[0.05] hover:text-white">
                  Explore SloerSwarm
                </Link>
              </div>
            </div>
          </aside>
        </article>

        <div className="relative mt-24 overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] p-8 text-center md:p-14">
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${post.accent}22, transparent 58%)` }} />
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">Read the next layer of the ecosystem story.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">The editorial surface is part of how SloerStudio explains its product logic, design system, and technical direction as the platform expands.</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/community/blog" className="sloer-button-primary">
                <span>Back to blog</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/company/about" className="sloer-button-secondary">
                <span>Read the company story</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
