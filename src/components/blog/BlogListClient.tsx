"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogFrontmatter } from "@/lib/blog";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function TagPill({ tag }: { tag: string }) {
  return (
    <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 text-xs text-gray-500">
      {tag}
    </span>
  );
}

function PostCard({ post, index }: { post: BlogFrontmatter; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block"
        aria-label={`Read ${post.title}`}
      >
        <motion.div
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl transition-colors"
          whileHover={{
            borderColor: "rgba(255,255,255,0.14)",
            backgroundColor: "rgba(255,255,255,0.04)",
          }}
          transition={{ duration: 0.2, ease }}
        >
          {/* Accent glow */}
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
            style={{ background: post.coverAccent }}
            aria-hidden="true"
          />

          {/* Header row */}
          <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
            {post.featured && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-[#4f8cff]">Featured</span>
              </>
            )}
          </div>

          {/* Title */}
          <h2 className="mb-2 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-[#4f8cff]">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-400">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>

          {/* Author row */}
          <div className="mt-4 flex items-center gap-2 border-t border-white/[0.05] pt-4 text-xs text-gray-500">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-bold text-gray-400" aria-hidden="true">
              S
            </div>
            <span>{post.author}</span>
            {post.generatedBy && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#28e7c5]">AI-generated</span>
              </>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}

export function BlogListClient({ posts }: { posts: BlogFrontmatter[] }) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>No posts yet. Use the article generator to create your first post.</p>
      </div>
    );
  }

  return (
    <section aria-label="Blog posts" className="grid gap-6 sm:grid-cols-2">
      {posts.map((post, i) => (
        <PostCard key={post.slug} post={post} index={i} />
      ))}
    </section>
  );
}
