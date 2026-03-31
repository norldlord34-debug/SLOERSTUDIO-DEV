import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const POSTS = [
  { slug: "introducing-sloerswarm", title: "Introducing SloerSwarm: Multi-Agent Orchestration", excerpt: "Today we're launching SloerSwarm — a multi-agent orchestration engine that lets you deploy specialized AI teams on shared missions.", tags: ["Product", "Launch"], date: "Apr 1, 2026", readTime: "5 min" },
  { slug: "vibe-coding-at-scale", title: "Vibe Coding at Scale: How Agentic Teams Ship Faster", excerpt: "We've been running agent swarms internally for 3 months. Here's what we learned about orchestrating AI teams effectively.", tags: ["Engineering", "Guide"], date: "Mar 28, 2026", readTime: "8 min" },
  { slug: "siulkvoice-privacy-first", title: "SloerVoice: Why We Chose On-Device Over Cloud", excerpt: "The decision to run Whisper AI locally wasn't just about privacy — it was about performance, cost, and developer trust.", tags: ["Product", "Privacy"], date: "Mar 22, 2026", readTime: "6 min" },
  { slug: "tauri2-next14-deep-dive", title: "Building Cross-Platform IDEs with Tauri 2 + Next.js 14", excerpt: "A deep dive into our architecture: how we combine Tauri 2, Rust, Next.js, and portable-pty to deliver a native IDE experience.", tags: ["Engineering", "Architecture"], date: "Mar 15, 2026", readTime: "12 min" },
  { slug: "persistent-pty-sessions", title: "Persistent PTY Sessions: The Technical Deep Dive", excerpt: "How we implement persistent PTY sessions with marker-based completion parsing, ordered stream events, and interactive input in Rust.", tags: ["Engineering", "Rust"], date: "Mar 10, 2026", readTime: "15 min" },
  { slug: "15-themes-design-system", title: "15 Themes, One Design System: Building SloerSpace's Visual Identity", excerpt: "How we architected a CSS custom properties system that supports 15 themes — from OLED black to Synthwave neon — without any JavaScript.", tags: ["Design", "CSS"], date: "Mar 5, 2026", readTime: "7 min" },
];

const TAG_COLORS: Record<string, string> = {
  "Product": "#4f8cff", "Engineering": "#28e7c5", "Guide": "#ffbf62",
  "Privacy": "#ff6f96", "Architecture": "#a855f7", "Rust": "#e8956a",
  "Design": "#84cc16", "CSS": "#06b6d4", "Launch": "#28e7c5",
};

export default function BlogPage() {
  const [featured, ...rest] = POSTS;
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight font-display mb-4">SloerStudio Blog</h1>
          <p className="text-gray-400 text-lg">Insights on agentic coding, product updates, and engineering deep dives.</p>
        </div>

        {/* Featured post */}
        <div className="p-8 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors mb-6 cursor-pointer group">
          <div className="flex items-center gap-2 mb-4">
            {featured.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ color: TAG_COLORS[tag] ?? "#6b7280", borderColor: `${TAG_COLORS[tag] ?? "#6b7280"}30`, background: `${TAG_COLORS[tag] ?? "#6b7280"}10` }}>{tag}</span>
            ))}
            <span className="text-xs text-gray-500 ml-2">{featured.date} · {featured.readTime} read</span>
          </div>
          <h2 className="text-2xl font-bold text-white font-display mb-3 group-hover:text-[#4f8cff] transition-colors">{featured.title}</h2>
          <p className="text-gray-400 leading-relaxed mb-4">{featured.excerpt}</p>
          <span className="text-sm text-[#4f8cff] hover:underline">Read more →</span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rest.map((post) => (
            <div key={post.slug} className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group">
              <div className="flex items-center gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border" style={{ color: TAG_COLORS[tag] ?? "#6b7280", borderColor: `${TAG_COLORS[tag] ?? "#6b7280"}30`, background: `${TAG_COLORS[tag] ?? "#6b7280"}10` }}>{tag}</span>
                ))}
              </div>
              <h3 className="font-bold text-white text-sm font-display mb-2 group-hover:text-[#4f8cff] transition-colors line-clamp-2">{post.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
              <p className="text-[10px] text-gray-600">{post.date} · {post.readTime} read</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
