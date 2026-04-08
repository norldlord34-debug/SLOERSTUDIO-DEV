"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, ChevronRight, Lock, Shield, Sparkles, Workflow } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

type LibraryItem = {
  name: string;
  desc: string;
  icon: string;
  color: string;
};

type LibraryHighlight = {
  title: string;
  desc: string;
  color: string;
};

type LibraryMetric = {
  label: string;
  value: string;
};

type LibraryShowcaseProps = {
  categoryLabel: string;
  productName: string;
  accent: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  supportHref: string;
  supportLabel: string;
  notice: string;
  metrics: LibraryMetric[];
  highlights: LibraryHighlight[];
  unlockedTitle: string;
  unlockedItems: LibraryItem[];
  lockedTitle?: string;
  lockedItems?: LibraryItem[];
  lockedDescription?: string;
  finalTitle: string;
  finalDescription: string;
};

function ItemCard({ item }: { item: LibraryItem }) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[28px] p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border text-lg" style={{ background: `${item.color}15`, borderColor: `${item.color}28` }}>
        {item.icon}
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-white">{item.name}</h3>
      <p className="mt-3 text-sm leading-7 text-gray-400">{item.desc}</p>
    </motion.div>
  );
}

export default function LibraryShowcase({
  categoryLabel,
  productName,
  accent,
  description,
  ctaHref,
  ctaLabel,
  supportHref,
  supportLabel,
  notice,
  metrics,
  highlights,
  unlockedTitle,
  unlockedItems,
  lockedTitle,
  lockedItems,
  lockedDescription,
  finalTitle,
  finalDescription,
}: LibraryShowcaseProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-16 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }} className="mb-24 grid gap-10 lg:grid-cols-[0.98fr_1.02fr]">
          <div>
            <span className="sloer-pill inline-flex">{categoryLabel}</span>
            <h1 className="mt-7 font-display text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl xl:text-[5.25rem] xl:leading-[0.95]">
              SloerStudio
              <span className="block" style={{ color: accent }}>{productName}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-gray-300">{description}</p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link href={ctaHref} className="sloer-button-primary" style={{ background: accent, color: "#050505" }}>
                <span>{ctaLabel}</span>
                <ArrowRight size={16} />
              </Link>
              <Link href={supportHref} className="sloer-button-secondary">
                <span>{supportLabel}</span>
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className="mt-8 rounded-[26px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-gray-300">
              {notice}
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((item) => (
                <div key={item.label} className="sloer-panel rounded-2xl px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sloer-panel rounded-[36px] p-6 md:p-8">
            <div className="rounded-[28px] border border-white/8 bg-black/20 p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Library protocol</p>
              <h2 className="mt-4 font-display text-3xl font-bold text-white">Structured assets for serious agentic execution.</h2>
              <p className="mt-4 text-sm leading-8 text-gray-400">These libraries are designed to reduce randomness. Each surface exists to make operators faster, sharper, and more consistent as the ecosystem scales.</p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <motion.div key={item.title} whileHover={{ y: -6, scale: 1.01 }} className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="h-1.5 w-14 rounded-full" style={{ background: item.color }} />
                  <h3 className="mt-5 font-display text-2xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mb-24">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Unlocked library</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white">{unlockedTitle}</h2>
            </div>
            <div className="hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 md:inline-flex">
              Ready to use today
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {unlockedItems.map((item) => (
              <ItemCard key={item.name} item={item} />
            ))}
          </div>
        </div>

        {lockedItems?.length ? (
          <div className="relative mb-24">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">Premium expansion</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-white">{lockedTitle}</h2>
              </div>
              <div className="hidden rounded-full border border-[#4f8cff]/20 bg-[#4f8cff]/10 px-3 py-1.5 text-xs text-[#4f8cff] md:inline-flex">
                Unlock deeper capability
              </div>
            </div>
            <div className="grid gap-5 opacity-35 md:grid-cols-2 xl:grid-cols-3">
              {lockedItems.map((item) => (
                <div key={item.name} className="sloer-panel rounded-[28px] p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border text-lg" style={{ background: `${item.color}15`, borderColor: `${item.color}28` }}>
                    {item.icon}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-white">{item.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="max-w-md rounded-[32px] border border-white/10 bg-[#07080d]/88 p-8 text-center shadow-[0_30px_100px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4f8cff]/30 bg-[#4f8cff]/12 text-[#4f8cff]">
                  <Lock size={18} />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-white">Unlock the deeper library layer.</h3>
                <p className="mt-3 text-sm leading-7 text-gray-400">{lockedDescription}</p>
                <Link href={ctaHref} className="sloer-button-primary mt-6 inline-flex" style={{ background: accent, color: "#050505" }}>
                  <span>{ctaLabel}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <div className="relative overflow-hidden rounded-[36px] border border-white/8 bg-white/[0.02] p-8 text-center md:p-14">
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${accent}22, transparent 58%)` }} />
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[22px] border" style={{ borderColor: `${accent}30`, background: `${accent}12`, color: accent }}>
              {productName === "Agents" ? <Shield size={22} /> : productName === "Prompts" ? <Workflow size={22} /> : <Sparkles size={22} />}
            </div>
            <h2 className="mt-6 font-display text-4xl font-bold tracking-[-0.05em] text-white md:text-6xl">{finalTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">{finalDescription}</p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href={ctaHref} className="sloer-button-primary" style={{ background: accent, color: "#050505" }}>
                <span>{ctaLabel}</span>
                <ArrowRight size={16} />
              </Link>
              <Link href={supportHref} className="sloer-button-secondary">
                <span>{supportLabel}</span>
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
