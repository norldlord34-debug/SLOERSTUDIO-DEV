"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

type Highlight = {
  title: string;
  desc: string;
  accent: string;
};

type Metric = {
  label: string;
  value: string;
};

type AuthShellProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  highlights: Highlight[];
  metrics: Metric[];
  cta: {
    href: string;
    label: string;
  };
  secondaryCta?: {
    href: string;
    label: string;
  };
  children: ReactNode;
};

export default function AuthShell({
  eyebrow,
  title,
  description,
  highlights,
  metrics,
  cta,
  secondaryCta,
  children,
}: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="sloer-grid-layer absolute inset-0 opacity-70" />
      <div className="absolute left-[6%] top-12 h-72 w-72 rounded-full bg-[#4f8cff]/18 blur-[110px]" />
      <div className="absolute right-[10%] top-32 h-64 w-64 rounded-full bg-[#28e7c5]/10 blur-[120px]" />
      <div className="absolute bottom-0 left-1/2 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-[#8b5cf6]/10 blur-[140px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[0.98fr_0.82fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease }}>
          <Link href="/" className="inline-flex items-center gap-3 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2.5 transition-colors hover:bg-white/[0.05]">
            <Image src="/company-logo.jpg" alt="SloerStudio" width={40} height={40} className="rounded-2xl object-cover" />
            <div>
              <span className="block font-display text-lg font-bold tracking-tight text-white">SloerStudio</span>
              <span className="block text-[10px] uppercase tracking-[0.24em] text-gray-500">Agentic company system</span>
            </div>
          </Link>

          <span className="sloer-pill mt-8 inline-flex">{eyebrow}</span>
          <h1 className="mt-7 font-display text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl xl:text-[5.15rem] xl:leading-[0.96]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-9 text-gray-300">{description}</p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.985 }}>
              <Link href={cta.href} className="sloer-button-primary">
                <span>{cta.label}</span>
                <ArrowRight size={16} />
              </Link>
            </motion.div>
            {secondaryCta ? (
              <motion.div whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.985 }}>
                <Link href={secondaryCta.href} className="sloer-button-secondary">
                  {secondaryCta.label}
                </Link>
              </motion.div>
            ) : null}
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {highlights.map((item) => (
              <motion.div key={item.title} whileHover={{ y: -6, scale: 1.01 }} className="sloer-panel rounded-[30px] p-6">
                <div className="h-1.5 w-16 rounded-full" style={{ background: item.accent }} />
                <h2 className="mt-5 font-display text-2xl font-bold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="sloer-panel rounded-2xl px-4 py-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500">{metric.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.05 }}
          className="relative"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
