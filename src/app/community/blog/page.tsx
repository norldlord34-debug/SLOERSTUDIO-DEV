import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, BookOpenText, ChevronRight, Sparkles } from "lucide-react";
import { BLOG_POSTS, BLOG_TAG_COLORS } from "@/data/blogPosts";

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-16 md:pt-20">
        <div className="mb-20 grid gap-10 lg:grid-cols-[0.98fr_1.02fr]">
          <div>
            <span className="sloer-pill inline-flex">Community // Editorial</span>
            <h1 className="mt-7 font-display text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl xl:text-[5.2rem] xl:leading-[0.95]">
              The thinking behind the
              <span className="block bg-gradient-to-r from-white via-[#4f8cff] to-[#28e7c5] bg-clip-text text-transparent">SloerStudio ecosystem.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-gray-300">The blog is where product launches, architectural decisions, design system thinking, privacy rationale, and agentic execution lessons become legible. This is the editorial layer of the company system.</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href={`/community/blog/${featured.slug}`} className="sloer-button-primary">
                <span>Read featured article</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/company/about" className="sloer-button-secondary">
                <span>Read the company story</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Posts", value: `${BLOG_POSTS.length} editorials` },
                { label: "Focus", value: "Product + engineering" },
                { label: "Role", value: "Public thinking layer" },
              ].map((item) => (
                <div key={item.label} className="sloer-panel rounded-2xl px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sloer-panel rounded-[36px] p-6 md:p-8">
            <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Editorial thesis</p>
              <h2 className="mt-4 font-display text-3xl font-bold text-white">We write to explain the product logic behind the brand.</h2>
              <p className="mt-4 text-sm leading-8 text-gray-400">The goal is not content for content&apos;s sake. The blog exists to expose how SloerStudio thinks about agentic software, premium design, runtime systems, privacy, orchestration, and company-building.</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Product clarity",
                  desc: "Launches and roadmap logic should be explained in a way that helps users understand the ecosystem direction.",
                  color: "#4f8cff",
                },
                {
                  title: "Engineering depth",
                  desc: "Architecture and systems work deserve an editorial surface that feels as serious as the product itself.",
                  color: "#28e7c5",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="h-1.5 w-14 rounded-full" style={{ background: item.color }} />
                  <h3 className="mt-5 font-display text-2xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured post */}
        <Link href={`/community/blog/${featured.slug}`} className="group mb-8 block rounded-[36px] border border-white/8 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04] md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            {featured.tags.map((tag) => (
              <span key={tag} className="rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: BLOG_TAG_COLORS[tag] ?? "#6b7280", borderColor: `${BLOG_TAG_COLORS[tag] ?? "#6b7280"}30`, background: `${BLOG_TAG_COLORS[tag] ?? "#6b7280"}12` }}>
                {tag}
              </span>
            ))}
            <span className="ml-0 text-xs text-gray-500 sm:ml-2">{featured.date} · {featured.readTime} read</span>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Featured editorial</p>
              <h2 className="mt-4 font-display text-4xl font-bold text-white transition-colors group-hover:text-[#4f8cff] md:text-5xl">{featured.title}</h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-gray-300">{featured.summary}</p>
            </div>
            <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#4f8cff]/30 bg-[#4f8cff]/12 text-[#4f8cff]">
                  <BookOpenText size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Why read this</p>
                  <p className="text-[11px] text-gray-500">Launch logic, product direction, and orchestration thesis.</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-gray-400">This piece explains how SloerSwarm fits into the broader company system and why orchestration is one of the defining product problems in the AI era.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors group-hover:text-[#4f8cff]">
                Read editorial <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.slug} href={`/community/blog/${post.slug}`} className="group rounded-[30px] border border-white/8 bg-white/[0.02] p-6 transition-colors hover:bg-white/[0.04]">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: BLOG_TAG_COLORS[tag] ?? "#6b7280", borderColor: `${BLOG_TAG_COLORS[tag] ?? "#6b7280"}30`, background: `${BLOG_TAG_COLORS[tag] ?? "#6b7280"}12` }}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{post.category}</p>
              <h3 className="mt-4 line-clamp-2 font-display text-2xl font-bold text-white transition-colors group-hover:text-[#4f8cff]">{post.title}</h3>
              <p className="mt-4 line-clamp-4 text-sm leading-7 text-gray-400">{post.excerpt}</p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <p className="text-[11px] text-gray-500">{post.date} · {post.readTime} read</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-white transition-colors group-hover:text-[#4f8cff]">
                  Open <ChevronRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="relative mt-24 overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] p-8 text-center md:p-14">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(79,140,255,0.18),transparent_58%)]" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[22px] border border-[#4f8cff]/30 bg-[#4f8cff]/12 text-[#4f8cff]">
              <Sparkles size={22} />
            </div>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">Editorial depth is part of the product.</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">SloerStudio is not only shipping interfaces. It is building a point of view about how agentic software should work, scale, and feel.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
