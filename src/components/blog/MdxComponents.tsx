import React from "react";
import type { MDXComponents } from "mdx/types";
import {
  AnimatedH2,
  AnimatedH3,
  AnimatedCodeBlock,
  GlassBlockquote,
  AnimatedHr,
} from "./MdxAnimated";
import { MdxRemotionHeroClient } from "./MdxRemotionHeroClient";

export function createMdxComponents(title: string, accent: string): MDXComponents {
  return {
    RemotionHero: () => <MdxRemotionHeroClient title={title} accent={accent} />,

    h2: AnimatedH2,
    h3: AnimatedH3,

    p: ({ children, ...props }) => (
      <p className="mb-5 text-base leading-8 text-gray-300" {...props}>
        {children}
      </p>
    ),

    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-white" {...props}>
        {children}
      </strong>
    ),

    em: ({ children, ...props }) => (
      <em className="text-gray-200" {...props}>
        {children}
      </em>
    ),

    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="font-medium text-[#4f8cff] underline decoration-[#4f8cff]/30 underline-offset-2 transition-colors hover:text-[#28e7c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f8cff]"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    ),

    ul: ({ children, ...props }) => (
      <ul className="mb-5 space-y-2 pl-5 text-gray-300" {...props}>
        {children}
      </ul>
    ),

    ol: ({ children, ...props }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-5 text-gray-300" {...props}>
        {children}
      </ol>
    ),

    li: ({ children, ...props }) => (
      <li className="leading-7" {...props}>
        <span className="relative -left-1">{children}</span>
      </li>
    ),

    blockquote: ({ children }) => <GlassBlockquote>{children}</GlassBlockquote>,

    code: ({ children, className: codeClassName, ...props }) => {
      const isBlock = codeClassName?.includes("language-");
      if (isBlock) {
        const language = codeClassName?.replace("language-", "") ?? "code";
        return <AnimatedCodeBlock language={language}>{children}</AnimatedCodeBlock>;
      }
      return (
        <code
          className="rounded-md border border-white/[0.08] bg-white/[0.05] px-1.5 py-0.5 text-sm text-[#28e7c5]"
          {...props}
        >
          {children}
        </code>
      );
    },

    pre: ({ children }) => <>{children}</>,

    table: ({ children, ...props }) => (
      <div className="my-6 overflow-hidden rounded-xl border border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" {...props}>
            {children}
          </table>
        </div>
      </div>
    ),

    thead: ({ children, ...props }) => (
      <thead className="border-b border-white/[0.08] bg-white/[0.03]" {...props}>
        {children}
      </thead>
    ),

    th: ({ children, ...props }) => (
      <th className="px-4 py-3 text-left font-semibold text-white" {...props}>
        {children}
      </th>
    ),

    td: ({ children, ...props }) => (
      <td className="border-t border-white/[0.05] px-4 py-3 text-gray-300" {...props}>
        {children}
      </td>
    ),

    hr: AnimatedHr,
  };
}
