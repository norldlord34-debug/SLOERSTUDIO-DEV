export type BlogPostSection = {
  title: string;
  body: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  readTime: string;
  category: string;
  accent: string;
  summary: string;
  sections: BlogPostSection[];
  takeaways: string[];
};

export const BLOG_TAG_COLORS: Record<string, string> = {
  Product: "#4f8cff",
  Engineering: "#28e7c5",
  Guide: "#ffbf62",
  Privacy: "#ff6f96",
  Architecture: "#a855f7",
  Rust: "#e8956a",
  Design: "#84cc16",
  CSS: "#06b6d4",
  Launch: "#28e7c5",
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "introducing-sloerswarm",
    title: "Introducing SloerSwarm: Multi-Agent Orchestration",
    excerpt: "Today we're launching SloerSwarm — a multi-agent orchestration engine that lets you deploy specialized AI teams on shared missions.",
    tags: ["Product", "Launch"],
    date: "Apr 1, 2026",
    readTime: "5 min",
    category: "Product launch",
    accent: "#4f8cff",
    summary: "SloerSwarm is our answer to the coordination problem. Developers do not just need more AI outputs; they need a clearer way to assign roles, maintain context, and move specialized operators through one mission without losing command of the whole system.",
    sections: [
      {
        title: "Why orchestration matters now",
        body: "The biggest limitation in agentic workflows is no longer raw model capability. It is coordination. Teams need a system that can assign specialists to a mission, preserve the logic of who is doing what, and keep the operator in control while work stays parallel instead of chaotic.",
      },
      {
        title: "From assistants to real operator structures",
        body: "SloerSwarm is designed around explicit roles, mission flow, and shared state. Instead of one vague assistant trying to do everything, the system encourages specialized execution lanes that are easier to reason about, easier to evaluate, and much closer to how real software organizations actually ship.",
      },
      {
        title: "What this unlocks for SloerStudio",
        body: "Swarm is not a side experiment. It is a foundational layer in the larger SloerStudio ecosystem. It strengthens how SloerSpace, future products, and the broader company system will handle multi-agent workflows as the platform grows into a deeper enterprise-grade operating model.",
      },
    ],
    takeaways: [
      "Multi-agent work needs orchestration, not just more prompts.",
      "Role clarity is a product feature, not an afterthought.",
      "SloerSwarm becomes a core layer inside the broader SloerStudio platform.",
    ],
  },
  {
    slug: "vibe-coding-at-scale",
    title: "Vibe Coding at Scale: How Agentic Teams Ship Faster",
    excerpt: "We've been running agent swarms internally for 3 months. Here's what we learned about orchestrating AI teams effectively.",
    tags: ["Engineering", "Guide"],
    date: "Mar 28, 2026",
    readTime: "8 min",
    category: "Engineering guide",
    accent: "#28e7c5",
    summary: "Vibe coding only scales when the system underneath it becomes more disciplined. Our internal experiments have shown that velocity rises when agent roles are constrained, mission goals are explicit, and review loops are treated as part of the workflow instead of cleanup at the end.",
    sections: [
      {
        title: "Shipping fast is not the same as shipping randomly",
        body: "Teams often assume that agentic development means letting an AI run free and then hoping the output is close enough. In practice, the opposite is true. High-velocity teams move faster when they design narrower lanes, clearer goals, and more visible checkpoints for the swarm to work inside.",
      },
      {
        title: "The leverage comes from structure",
        body: "We repeatedly saw better outcomes when research, build, QA, and review were separated into explicit responsibilities. That reduced prompt drift, made outputs easier to compare, and helped humans intervene earlier when something started bending in the wrong direction.",
      },
      {
        title: "Scaling the operator mindset",
        body: "The lesson is simple: vibe coding at scale still needs operators. The future is not removing judgment from the loop. It is giving teams stronger systems so their judgment applies to higher-value control decisions instead of repetitive low-level execution.",
      },
    ],
    takeaways: [
      "Speed improves when agent lanes are better defined.",
      "Review is a core part of the system, not just a final check.",
      "Operator control becomes more important as autonomy increases.",
    ],
  },
  {
    slug: "siulkvoice-privacy-first",
    title: "SloerVoice: Why We Chose On-Device Over Cloud",
    excerpt: "The decision to run Whisper AI locally wasn't just about privacy — it was about performance, cost, and developer trust.",
    tags: ["Product", "Privacy"],
    date: "Mar 22, 2026",
    readTime: "6 min",
    category: "Product decision",
    accent: "#ff6f96",
    summary: "Running SloerVoice on-device is a design choice grounded in trust. Privacy matters, but so do responsiveness, predictable cost, and the simple fact that developers want tighter control over when and how their local work leaves the machine.",
    sections: [
      {
        title: "Trust starts with architecture",
        body: "Users can feel when privacy language is superficial. We wanted a product decision that was actually architectural. Running voice processing locally reduces unnecessary exposure, keeps control closer to the user, and creates a foundation that feels consistent with the rest of our operator-first product philosophy.",
      },
      {
        title: "Local also improves the experience",
        body: "The on-device route is not only about ethics. It also improves responsiveness and lowers dependency on external service variability. That matters when voice is supposed to feel like a natural part of the workflow rather than a slow detour through a remote pipeline.",
      },
      {
        title: "A stronger long-term position",
        body: "As SloerStudio expands, on-device capability gives us more control over how product value is delivered. It helps align performance, trust, and product identity instead of forcing one of those to compromise the others.",
      },
    ],
    takeaways: [
      "On-device voice is an architectural trust decision.",
      "Local processing also improves responsiveness and cost predictability.",
      "Privacy only matters if the product design actually supports it.",
    ],
  },
  {
    slug: "tauri2-next14-deep-dive",
    title: "Building Cross-Platform IDEs with Tauri 2 + Next.js 14",
    excerpt: "A deep dive into our architecture: how we combine Tauri 2, Rust, Next.js, and portable-pty to deliver a native IDE experience.",
    tags: ["Engineering", "Architecture"],
    date: "Mar 15, 2026",
    readTime: "12 min",
    category: "Architecture",
    accent: "#a855f7",
    summary: "Cross-platform developer tooling gets much better when the native layer and the web layer each do what they are best at. Our architecture combines Tauri and Rust for runtime-heavy capability while using Next.js for a faster product surface and iteration loop.",
    sections: [
      {
        title: "Splitting responsibilities the right way",
        body: "We use Tauri and Rust where native runtime access, performance, and system-level integration really matter. We use Next.js where UI richness, interface composition, and product iteration speed matter. That separation keeps the architecture pragmatic instead of ideological.",
      },
      {
        title: "Why the PTY layer matters",
        body: "Persistent terminals are not a cosmetic detail in our stack. They are one of the core product primitives. Once agents, orchestration, and local developer workflows sit on top of that layer, the reliability and clarity of PTY behavior starts to influence the whole product experience.",
      },
      {
        title: "What this means for future products",
        body: "The same architectural pattern gives us room to expand into more products without rewriting the whole system. A strong native runtime paired with a flexible web surface is one of the reasons SloerStudio can scale into a broader ecosystem rather than remain a one-off tool.",
      },
    ],
    takeaways: [
      "Native and web layers should each handle the work they are best at.",
      "Persistent PTY behavior is foundational to the product experience.",
      "The architecture is designed for ecosystem expansion, not a single isolated tool.",
    ],
  },
  {
    slug: "persistent-pty-sessions",
    title: "Persistent PTY Sessions: The Technical Deep Dive",
    excerpt: "How we implement persistent PTY sessions with marker-based completion parsing, ordered stream events, and interactive input in Rust.",
    tags: ["Engineering", "Rust"],
    date: "Mar 10, 2026",
    readTime: "15 min",
    category: "Systems engineering",
    accent: "#e8956a",
    summary: "Persistent PTY sessions are one of the hardest parts of making terminal-based agent systems feel real. They require more than starting processes. They require careful stream handling, ordered event semantics, and clear ways to determine when work is truly complete.",
    sections: [
      {
        title: "Why completion is harder than it looks",
        body: "A shell command finishing is not the same thing as a user understanding that it is finished. We built marker-based completion parsing because terminal output is noisy, streaming is asynchronous, and users need a clearer interpretation layer if they are going to trust the runtime surface.",
      },
      {
        title: "Ordered streams create confidence",
        body: "When stream events arrive out of order or state gets muddy, the product immediately feels unstable. A lot of our Rust-side engineering has gone into making stream behavior deterministic enough that higher-level product surfaces can rely on the runtime instead of compensating for it.",
      },
      {
        title: "The hidden leverage of runtime quality",
        body: "Persistent PTY reliability is not a niche backend concern. It changes how much complexity we can safely build on top of the terminal. Better runtime guarantees mean better agents, stronger orchestration, and a more trustworthy developer environment overall.",
      },
    ],
    takeaways: [
      "Completion semantics matter as much as raw process execution.",
      "Ordered event streams create user trust in terminal systems.",
      "Runtime quality determines how far the product can safely scale.",
    ],
  },
  {
    slug: "15-themes-design-system",
    title: "15 Themes, One Design System: Building SloerSpace's Visual Identity",
    excerpt: "How we architected a CSS custom properties system that supports 15 themes — from OLED black to Synthwave neon — without any JavaScript.",
    tags: ["Design", "CSS"],
    date: "Mar 5, 2026",
    readTime: "7 min",
    category: "Design system",
    accent: "#84cc16",
    summary: "Theme systems only feel premium when the underlying design language stays coherent. Supporting many themes without destroying the brand required us to think in tokens, surfaces, and visual behavior, not just color swaps.",
    sections: [
      {
        title: "Tokens before cosmetics",
        body: "A robust theming system starts with token logic, not screenshots. We focused on defining surface relationships, readable contrast ranges, and reusable visual semantics so that each theme could feel expressive without fragmenting the underlying product identity.",
      },
      {
        title: "Why CSS variables were enough",
        body: "We intentionally avoided a JavaScript-heavy theming architecture for this layer. Custom properties gave us speed, control, and simpler composition across surfaces while keeping the visual system easier to maintain as the product grew more complex.",
      },
      {
        title: "Identity at scale",
        body: "The point of multiple themes is not novelty alone. It is giving users a richer visual relationship with the product without sacrificing consistency. That same principle now shapes how we think about the broader SloerStudio design system across public and authenticated surfaces.",
      },
    ],
    takeaways: [
      "Theme flexibility only works when the core token system is strong.",
      "CSS variables can support sophisticated design systems without extra complexity.",
      "Visual identity must scale across many surfaces without fragmenting the brand.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
