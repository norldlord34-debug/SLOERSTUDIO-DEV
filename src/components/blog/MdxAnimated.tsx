"use client";

import React from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function AnimatedH2({ children, ...props }: React.ComponentProps<"h2">) {
  return (
    <motion.h2
      className="mb-4 mt-12 font-display text-3xl font-bold tracking-tight text-white"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      {...props}
    >
      {children}
    </motion.h2>
  );
}

export function AnimatedH3({ children, ...props }: React.ComponentProps<"h3">) {
  return (
    <motion.h3
      className="mb-3 mt-8 text-xl font-semibold text-white"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease }}
      {...props}
    >
      {children}
    </motion.h3>
  );
}

export function AnimatedCodeBlock({
  children,
  language,
}: {
  children: React.ReactNode;
  language: string;
}) {
  return (
    <motion.div
      className="my-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0f]"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease }}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" aria-hidden="true" />
        <span className="ml-auto text-xs text-gray-500">{language}</span>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-sm leading-6 text-gray-200">{children}</code>
      </pre>
    </motion.div>
  );
}

export function GlassBlockquote({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="relative my-6 overflow-hidden rounded-2xl border border-white/[0.08] border-l-2 border-l-[#4f8cff] bg-white/[0.03] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      whileHover={{ borderColor: "rgba(255,255,255,0.15)", transition: { duration: 0.2 } }}
    >
      <div className="text-gray-200 italic">{children}</div>
    </motion.div>
  );
}

export function AnimatedHr() {
  return (
    <motion.hr
      className="my-10 border-white/[0.08]"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
    />
  );
}
