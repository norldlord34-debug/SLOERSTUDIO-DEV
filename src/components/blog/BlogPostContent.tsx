import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { createMdxComponents } from "./MdxComponents";

interface BlogPostContentProps {
  source: string;
  title: string;
  accent: string;
}

export function BlogPostContent({ source, title, accent }: BlogPostContentProps) {
  const components = createMdxComponents(title, accent);

  return (
    <MDXRemote
      source={source}
      components={components}
    />
  );
}
