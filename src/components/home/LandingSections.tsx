"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, type Variants } from "framer-motion";
import { PRODUCT_VIDEO_CONFIGS, type ProductVideoId } from "@/remotion/productVideoConfigs";
import { VideoSkeleton } from "@/components/ui/Skeleton";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Command,
  Cpu,
  Database,
  Globe,
  LayoutDashboard,
  LayoutGrid,
  Lock,
  Mic,
  Play,
  Rocket,
  Shield,
  Terminal,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Fragment, useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger } from "@/hooks/useGsap";
import AuroraBackground from "@/components/ui/effects/AuroraBackground";
import BorderBeam from "@/components/ui/effects/BorderBeam";
import ShineCard from "@/components/ui/effects/ShineCard";
import TextReveal from "@/components/ui/effects/TextReveal";
import NumberTicker from "@/components/ui/effects/NumberTicker";
import Marquee from "@/components/ui/effects/Marquee";
import GradientText from "@/components/ui/effects/GradientText";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

const ProductMarketingVideoPlayer = dynamic(
  () => import("@/components/video/ProductMarketingVideoPlayer"),
  { ssr: false, loading: () => <VideoSkeleton /> },
);

/* ─── Shared animation config ──────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease },
  },
};

/* ─── Data ─────────────────────────────────────────────────────── */

const PRODUCTS = [
  {
    name: "SloerSpace",
    href: "/products/sloerspace",
    tag: "FLAGSHIP",
    accent: "#4f8cff",
    icon: Terminal,
    desc: "The cross-platform agentic workspace. Persistent PTY, command palette, guided launch flows, and integrated utilities in one shell.",
    number: "01",
  },
  {
    name: "SloerSwarm",
    href: "/products/sloerswarm",
    tag: "LIVE",
    accent: "#28e7c5",
    icon: Users,
    desc: "Multi-agent orchestration with role-aware flows, launch sequences, and coordination paths for bigger builds.",
    number: "02",
  },
  {
    name: "SloerCanvas",
    href: "/products/sloercanvas",
    tag: "ALPHA",
    accent: "#ffbf62",
    icon: LayoutGrid,
    desc: "Spatial surface for free-form arranging of agents, tasks, terminals, and product flows.",
    number: "03",
  },
  {
    name: "SloerVoice",
    href: "/products/sloervoice",
    tag: "ON-DEVICE",
    accent: "#ff6f96",
    icon: Mic,
    desc: "On-device voice dictation. Global hotkeys, transcript vault, custom vocabulary, and IDE-aware vibe coding.",
    number: "04",
  },
  {
    name: "SloerMCP",
    href: "/roadmap",
    tag: "SOON",
    accent: "#8b5cf6",
    icon: Database,
    desc: "Shared context backbone connecting tools, tasks, agents, docs, and surfaces into one operating graph.",
    number: "05",
  },
  {
    name: "SloerCode",
    href: "/roadmap",
    tag: "SOON",
    accent: "#22c55e",
    icon: Command,
    desc: "Terminal-first coding runtime for direct execution, agent workflows, and build automation at speed.",
    number: "06",
  },
] as const;

const MARKETING_FILMS: { id: ProductVideoId; href: string }[] = [
  { id: "sloerspace", href: "/products/sloerspace" },
  { id: "sloervoice", href: "/products/sloervoice" },
  { id: "sloerswarm", href: "/products/sloerswarm" },
  { id: "sloercanvas", href: "/products/sloercanvas" },
];

const CAPABILITIES = [
  { title: "Agentic workspace runtime", desc: "Persistent PTY sessions, controllable AI workflows, command surfaces, and one shell to ship with multi-agent teams.", icon: Terminal, accent: "#4f8cff" },
  { title: "Creative infrastructure", desc: "Marketing, workspace, billing, docs, admin, and AI video generation operating as one synchronized platform.", icon: Workflow, accent: "#28e7c5" },
  { title: "Enterprise control layer", desc: "Role-based access, audit trails, revenue instrumentation, and compliance-ready security for teams that scale.", icon: Lock, accent: "#ffbf62" },
  { title: "Directable experience", desc: "Every interaction is designed with cinematic precision and controllable workflows.", icon: Command, accent: "#ff6f96" },
  { title: "Production backend", desc: "Rust runtime, Prisma data layer, feature flags, and CI/CD baked into the architecture from day one.", icon: Cpu, accent: "#8b5cf6" },
  { title: "Expansion ecosystem", desc: "SloerSpace ships today. Orchestration, voice, spatial canvases, and AI video follow — one platform.", icon: Rocket, accent: "#22c55e" },
] as const;

type BillingMode = "monthly" | "annual";

const PRICING = [
  {
    tier: "Free",
    monthlyPrice: "$0",
    annualPrice: "$0",
    period: "forever",
    accent: "#71717a",
    desc: "Discover the SloerStudio ecosystem.",
    href: "/signup",
    cta: "Create Free Account",
    features: ["SloerSpace access", "Product browsing", "Community", "Starter workflows"],
    annualNote: "No billing required",
  },
  {
    tier: "Studio",
    monthlyPrice: "$16",
    annualPrice: "$13",
    period: "/mo",
    accent: "#ffffff",
    desc: "For builders who want the real product experience.",
    href: "/signup?plan=studio",
    cta: "Start Studio Trial",
    highlighted: true,
    badge: "POPULAR",
    features: ["Everything in Free", "SloerSwarm access", "Voice + prompts + skills", "Control surfaces"],
    annualNote: "Save 20% billed yearly",
  },
  {
    tier: "Enterprise",
    monthlyPrice: "$40",
    annualPrice: "$32",
    period: "/mo",
    accent: "#28e7c5",
    desc: "For teams with governance and deployment needs.",
    href: "/signup?plan=enterprise",
    cta: "Start Enterprise Trial",
    features: ["Everything in Studio", "Expanded admin", "Advanced controls", "Priority access"],
    annualNote: "Save 20% billed yearly",
  },
];

const PLAN_COMPARE = [
  { feature: "SloerSpace workspace", values: [true, true, true] },
  { feature: "SloerVoice dictation", values: [false, true, true] },
  { feature: "SloerSwarm orchestration", values: [false, true, true] },
  { feature: "Prompts + skills", values: [false, true, true] },
  { feature: "Admin + governance", values: [false, false, true] },
  { feature: "Priority expansion", values: [false, false, true] },
] as const;

const TRUST_PILLARS = [
  { title: "Zero-trust security", desc: "RBAC, 2FA readiness, audit logging, and policy enforcement for enterprise compliance.", icon: Shield, accent: "#4f8cff" },
  { title: "Production data layer", desc: "Prisma-backed models with edge caching and stale-while-revalidate reads.", icon: Database, accent: "#28e7c5" },
  { title: "Revenue infrastructure", desc: "Subscription plans, usage billing, and monetized expansion built into the core.", icon: Zap, accent: "#ffbf62" },
  { title: "Growth engine", desc: "Marketing, workspace, docs, community, and admin working as one AI-native flywheel.", icon: Rocket, accent: "#ff6f96" },
] as const;

const PLATFORM_SURFACES = [
  { title: "Public web", desc: "Marketing, product storytelling, roadmap, and launch narratives.", icon: Globe, accent: "#4f8cff" },
  { title: "Workspace", desc: "Projects, prompts, skills, agents, API keys, and operating surfaces.", icon: LayoutDashboard, accent: "#28e7c5" },
  { title: "Superadmin", desc: "Users, subscriptions, analytics, audit trails, and company control.", icon: Shield, accent: "#ffbf62" },
  { title: "Docs + community", desc: "Documentation, blog, Discord, events, and open source.", icon: Globe, accent: "#8b5cf6" },
] as const;

const TECH_BADGES = [
  "Next.js 16", "React 19", "Tailwind v4", "Prisma", "Rust", "Three.js",
  "GSAP", "Framer Motion", "Remotion", "TypeScript", "NextAuth", "Stripe",
  "SQLite → Postgres", "Vercel", "MDX",
];

/* ─── GSAP-powered section reveal ──────────────────────────────── */

function useGsapReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const children = ref.current.querySelectorAll("[data-reveal]");
    if (!children.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        { y: 60, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
}

/* ─── Horizontal animated line ─────────────────────────────────── */

function AnimatedLine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6">
      <div
        ref={ref}
        className="h-px w-full origin-left bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

/* ─── Shared UI primitives ─────────────────────────────────────── */

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="sloer-pill mb-6 inline-flex" data-reveal>{children}</span>
  );
}

function SectionDescription({ children }: { children: ReactNode }) {
  return (
    <p className="mt-6 max-w-2xl text-base leading-8 text-white/40 md:text-lg" data-reveal>
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO — Aurora + TextReveal + NumberTicker + ShineCards
   ═══════════════════════════════════════════════════════════════════ */

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden px-6 pt-24">
      <AuroraBackground intensity="medium" />
      <HeroCanvas />

      <div className="absolute inset-0 -z-[5]" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-7xl"
      >
        <motion.div variants={fadeUp} className="mb-8">
          <span className="sloer-pill inline-flex">SloerStudio — 2026</span>
        </motion.div>

        <motion.div variants={fadeUp}>
          <TextReveal
            as="h1"
            className="font-display text-[clamp(3rem,8vw,9rem)] font-bold leading-[0.92] tracking-[-0.06em] text-white"
            scrollTrigger={false}
          >
            We build the AI-native tools you ship with.
          </TextReveal>
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-8 max-w-xl text-lg leading-8 text-white/40 md:text-xl"
        >
          Agentic workspaces. Multi-agent orchestration. On-device voice coding.
          Cinematic AI video. One controllable platform.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
          <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Link href="/signup" className="sloer-button-primary relative overflow-hidden" aria-label="Start building for free">
              <BorderBeam size={60} duration={4} color="#4f8cff" colorTo="#28e7c5" />
              Start building <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Link href="/products/sloerspace" className="sloer-button-secondary" aria-label="Explore SloerSpace">
              Explore SloerSpace <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="relative mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] md:grid-cols-4"
        >
          <BorderBeam duration={8} color="#4f8cff" colorTo="#28e7c5" />
          {[
            { label: "Products", value: 6, suffix: "" },
            { label: "Surfaces", value: 12, suffix: "+" },
            { label: "Components", value: 200, suffix: "+" },
            { label: "Uptime", value: 99, suffix: ".9%" },
          ].map((stat) => (
            <div key={stat.label} className="px-6 py-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">{stat.label}</p>
              <p className="mt-2 font-display text-lg font-semibold text-white">
                <NumberTicker value={stat.value} suffix={stat.suffix} duration={1.8} />
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-12 grid gap-3 sm:grid-cols-3">
          {PRODUCTS.slice(0, 3).map((product) => (
            <ShineCard key={product.name} glowColor={product.accent} className="p-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg border"
                  style={{ borderColor: `${product.accent}30`, color: product.accent }}
                >
                  <product.icon size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{product.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">{product.tag}</p>
                </div>
              </div>
            </ShineCard>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-6 rounded-full border border-white/10"
        >
          <motion.div
            animate={{ y: [2, 14, 2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mt-1.5 h-2 w-1 rounded-full bg-white/30"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ECOSYSTEM — Bento Grid with ShineCards
   ═══════════════════════════════════════════════════════════════════ */

export function EcosystemSection() {
  const containerRef = useGsapReveal();

  return (
    <>
      <AnimatedLine />
      <section className="px-6 py-28 md:py-36" ref={containerRef}>
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Ecosystem</SectionLabel>
          <TextReveal
            as="h2"
            className="font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl lg:text-7xl"
          >
            Six products. One operating system.
          </TextReveal>
          <SectionDescription>
            A growing family of AI-native tools for builders who ship — from workspace
            runtimes to multi-agent orchestration and on-device voice coding.
          </SectionDescription>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
            {PRODUCTS.map((product, i) => (
              <ShineCard key={product.name} glowColor={product.accent}>
                <Link
                  href={product.href}
                  className="group relative block p-6"
                  aria-label={`Open ${product.name}`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="flex h-11 w-11 items-center justify-center rounded-xl border"
                        style={{ borderColor: `${product.accent}30`, color: product.accent }}
                        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <product.icon size={19} aria-hidden="true" />
                      </motion.div>
                      <div>
                        <span className="font-display text-lg font-bold text-white">{product.name}</span>
                        <span
                          className="ml-2 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em]"
                          style={{ color: product.accent, borderColor: `${product.accent}30` }}
                        >
                          {product.tag}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-white/15">{product.number}</span>
                  </div>
                  <p className="text-sm leading-7 text-white/40">{product.desc}</p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-medium text-white/25 transition-colors group-hover:text-white/50">
                    <span>Explore</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                  {i === 0 && <BorderBeam duration={6} color={product.accent} colorTo="#28e7c5" />}
                </Link>
              </ShineCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PLATFORM SURFACE — Architecture with ShineCards
   ═══════════════════════════════════════════════════════════════════ */

export function PlatformSurfaceSection() {
  const containerRef = useGsapReveal();

  return (
    <>
      <AnimatedLine />
      <section className="px-6 py-28 md:py-36" ref={containerRef}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <SectionLabel>Architecture</SectionLabel>
              <TextReveal
                as="h2"
                className="font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl lg:text-6xl"
              >
                Every surface works together.
              </TextReveal>
              <SectionDescription>
                Marketing generates demand, pricing closes intent, the workspace activates
                builders, admin runs the business, and docs compound trust.
              </SectionDescription>

              <div className="mt-10 space-y-4" data-reveal>
                {[
                  { step: "01", title: "Acquire", desc: "Home, products, pricing, community, content." },
                  { step: "02", title: "Activate", desc: "Signup, first project, prompts, dashboard." },
                  { step: "03", title: "Operate", desc: "Subscriptions, analytics, admin, audit." },
                  { step: "04", title: "Expand", desc: "New products, plans, docs, ecosystem flywheel." },
                ].map((item) => (
                  <ShineCard key={item.step} glowColor="#4f8cff" className="px-5 py-5">
                    <div className="flex items-start gap-5">
                      <span
                        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] font-mono text-xs text-white/30"
                        style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
                      >
                        {item.step}
                      </span>
                      <div>
                        <p className="font-display text-base font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-sm text-white/35">{item.desc}</p>
                      </div>
                    </div>
                  </ShineCard>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2" data-reveal>
              {PLATFORM_SURFACES.map((surface) => (
                <ShineCard key={surface.title} glowColor={surface.accent}>
                  <div className="p-6">
                    <div
                      className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border"
                      style={{ borderColor: `${surface.accent}25`, color: surface.accent }}
                    >
                      <surface.icon size={18} aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-white">{surface.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/35">{surface.desc}</p>
                  </div>
                </ShineCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MARKETING FILMS — Showreel & video gallery
   ═══════════════════════════════════════════════════════════════════ */

export function MarketingFilmsSection() {
  const containerRef = useGsapReveal();
  const [featuredFilm, ...supportingFilms] = MARKETING_FILMS;
  const featuredConfig = PRODUCT_VIDEO_CONFIGS[featuredFilm.id];

  return (
    <>
      <AnimatedLine />
      <section className="px-6 py-28 md:py-36" ref={containerRef}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <SectionLabel>Showreel</SectionLabel>
            <TextReveal
              as="h2"
              className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl lg:text-7xl"
            >
              Cinematic AI video for every product.
            </TextReveal>
            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/40" data-reveal>
              Code-driven video production powered by Remotion. Programmatically rendered
              with controllable scenes and synchronized audio-visual generation.
            </p>
          </div>

          <div className="mt-16 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]" data-reveal>
            <ShineCard glowColor={featuredConfig.accent} className="overflow-hidden rounded-3xl">
              <div className="p-2 md:p-3">
                <ProductMarketingVideoPlayer
                  productId={featuredFilm.id}
                  className="rounded-2xl border-white/[0.06]"
                />
              </div>
              <div className="border-t border-white/[0.06] px-6 py-5 md:px-7">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">Featured film</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
                  {featuredConfig.name}
                </h3>
                <p className="mt-2 text-sm text-white/40">{featuredConfig.headline}</p>
              </div>
            </ShineCard>

            <div className="grid gap-4">
              {supportingFilms.map((film) => {
                const config = PRODUCT_VIDEO_CONFIGS[film.id];
                return (
                  <ShineCard key={film.id} glowColor={config.accent} className="p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="font-display text-lg font-bold text-white">{config.name}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/25">
                          {config.tag}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/video/${film.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-white/40 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                          aria-label={`Watch ${config.name} video`}
                        >
                          <Play size={12} aria-hidden="true" />
                        </Link>
                        <Link
                          href={film.href}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] text-white/40 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                          aria-label={`Open ${config.name}`}
                        >
                          <ArrowRight size={12} aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                    <Link
                      href={`/video/${film.id}`}
                      className="block"
                      aria-label={`Watch ${config.name} film`}
                    >
                      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/[0.06] bg-black/40">
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(circle at 50% 50%, ${config.accent}12, transparent 60%)`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md"
                          >
                            <Play size={18} aria-hidden="true" />
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  </ShineCard>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   EXPERIENCE — Capabilities with ShineCard grid
   ═══════════════════════════════════════════════════════════════════ */

export function ExperienceSection() {
  const containerRef = useGsapReveal();

  return (
    <>
      <AnimatedLine />
      <section className="px-6 py-28 md:py-36" ref={containerRef}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <SectionLabel>Capabilities</SectionLabel>
            <TextReveal
              as="h2"
              className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl lg:text-7xl"
            >
              Built for builders who ship.
            </TextReveal>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
            {CAPABILITIES.map((cap, i) => (
              <ShineCard key={cap.title} glowColor={cap.accent}>
                <div className="p-7">
                  <div
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border"
                    style={{ borderColor: `${cap.accent}25`, color: cap.accent }}
                  >
                    <cap.icon size={19} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white">{cap.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/35">{cap.desc}</p>
                </div>
                {i === 0 && <BorderBeam duration={6} color={cap.accent} colorTo="#28e7c5" />}
              </ShineCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PRICING — Glass ShineCards + animated toggle
   ═══════════════════════════════════════════════════════════════════ */

export function PricingSection() {
  const containerRef = useGsapReveal();
  const [billingMode, setBillingMode] = useState<BillingMode>("monthly");

  return (
    <>
      <AnimatedLine />
      <section className="px-6 py-28 md:py-36" ref={containerRef}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <SectionLabel>Pricing</SectionLabel>
            <TextReveal
              as="h2"
              className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-6xl lg:text-7xl"
            >
              Transparent pricing. No surprises.
            </TextReveal>
          </div>

          <div className="mt-10 flex justify-center" data-reveal>
            <div className="relative inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1">
              {([
                { id: "monthly", label: "Monthly" },
                { id: "annual", label: "Annual · 20% off" },
              ] as const).map((option) => {
                const active = billingMode === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setBillingMode(option.id)}
                    aria-label={`Switch to ${option.label} billing`}
                    className={cn(
                      "relative rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                      active ? "text-black" : "text-white/40 hover:text-white/60",
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="billing-pill"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3" data-reveal>
            {PRICING.map((plan) => (
              <ShineCard
                key={plan.tier}
                glowColor={plan.accent}
                className={cn(
                  plan.highlighted ? "border-white/20 bg-white/[0.04]" : "",
                )}
              >
                <div className="relative p-7">
                  {plan.highlighted && <BorderBeam duration={5} color="#4f8cff" colorTo="#28e7c5" />}
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl font-bold text-white">{plan.tier}</p>
                    {plan.badge && (
                      <span
                        className="rounded-full border border-white/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em]"
                        style={{
                          background: "linear-gradient(135deg, rgba(79,140,255,0.1), rgba(40,231,197,0.1))",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 3s ease infinite",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-white/35">{plan.desc}</p>

                  <div className="mt-6 flex items-end gap-2">
                    <motion.span
                      key={billingMode}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="font-display text-4xl font-bold text-white"
                    >
                      {billingMode === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                    </motion.span>
                    <span className="pb-1 text-sm text-white/25">{plan.period}</span>
                  </div>
                  <p className="mt-1.5 text-xs text-white/20">
                    {billingMode === "annual" ? plan.annualNote : plan.tier === "Free" ? plan.annualNote : "Flexible monthly billing"}
                  </p>

                  <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-sm text-white/50">
                        <Check size={14} className="text-white/30" aria-hidden="true" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="mt-7">
                    <Link
                      href={plan.href}
                      className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all",
                        plan.highlighted
                          ? "bg-white text-black hover:bg-white/90"
                          : "border border-white/10 text-white/60 hover:border-white/25 hover:text-white",
                      )}
                    >
                      {plan.cta}
                      <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  </motion.div>
                </div>
              </ShineCard>
            ))}
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]" data-reveal>
            <div className="border-b border-white/[0.06] px-6 py-4">
              <p className="font-display text-base font-semibold text-white">Compare plans</p>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[640px] px-6 py-4">
                <div className="grid grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] gap-2">
                  <div className="px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/25">Capability</div>
                  {["Free", "Studio", "Enterprise"].map((tier) => (
                    <div key={tier} className="px-3 py-2 text-center text-xs uppercase tracking-[0.2em] text-white/25">
                      {tier}
                    </div>
                  ))}
                  {PLAN_COMPARE.map((row) => (
                    <Fragment key={row.feature}>
                      <div className="border-t border-white/[0.04] px-3 py-3 text-sm text-white/50">
                        {row.feature}
                      </div>
                      {row.values.map((value, i) => (
                        <div key={`${row.feature}-${i}`} className="flex items-center justify-center border-t border-white/[0.04] px-3 py-3">
                          {value ? (
                            <Check size={14} className="text-white/50" aria-hidden="true" />
                          ) : (
                            <span className="h-px w-3 bg-white/10" />
                          )}
                        </div>
                      ))}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TRUST — Marquee + ShineCards
   ═══════════════════════════════════════════════════════════════════ */

export function TrustSection() {
  const containerRef = useGsapReveal();

  return (
    <>
      <AnimatedLine />
      <section className="px-6 py-28 md:py-36" ref={containerRef}>
        <div className="mx-auto max-w-7xl">
          <SectionLabel>Security</SectionLabel>
          <TextReveal
            as="h2"
            className="font-display text-4xl font-bold tracking-[-0.04em] text-white md:text-5xl"
          >
            Enterprise-grade from day one.
          </TextReveal>
          <SectionDescription>
            Role-based auth, encrypted data, subscription governance, audit trails, and admin
            control — built on Prisma, Rust, and battle-tested frameworks.
          </SectionDescription>

          <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.01] py-4" data-reveal>
            <Marquee speed={25}>
              {TECH_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs font-medium text-white/30"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" aria-hidden="true" />
                  {badge}
                </span>
              ))}
            </Marquee>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
            {TRUST_PILLARS.map((pillar) => (
              <ShineCard key={pillar.title} glowColor={pillar.accent}>
                <div className="p-6">
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border"
                    style={{ borderColor: `${pillar.accent}25`, color: pillar.accent }}
                  >
                    <pillar.icon size={18} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/35">{pillar.desc}</p>
                </div>
              </ShineCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FINAL CTA — Aurora + TextReveal
   ═══════════════════════════════════════════════════════════════════ */

export function FinalCtaSection() {
  return (
    <>
      <AnimatedLine />
      <section className="relative flex min-h-[70vh] items-center overflow-hidden px-6 py-28">
        <AuroraBackground intensity="strong" colors={["#4f8cff", "#28e7c5", "#8b5cf6"]} />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeUp}>
            <TextReveal
              as="h2"
              className="font-display text-5xl font-bold tracking-[-0.05em] text-white md:text-8xl"
            >
              Ready to ship?
            </TextReveal>
          </motion.div>

          <motion.p variants={fadeUp} className="mx-auto mt-8 max-w-xl text-lg text-white/40">
            Join the next generation of AI builders. Free to start, built to scale.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Link href="/signup" className="sloer-button-primary relative overflow-hidden" aria-label="Start building for free">
                <BorderBeam size={60} duration={4} color="#4f8cff" colorTo="#28e7c5" />
                Start building <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Link href="/roadmap" className="sloer-button-secondary" aria-label="Explore 2026 roadmap">
                2026 Roadmap <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            {["AI-native platform", "Controllable workflows", "Cinematic AI video", "Enterprise-grade"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/[0.06] px-4 py-2 text-xs text-white/25"
                >
                  {item}
                </span>
              ),
            )}
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
