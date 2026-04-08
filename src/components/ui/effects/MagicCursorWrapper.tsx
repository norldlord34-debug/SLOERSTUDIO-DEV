"use client";

import dynamic from "next/dynamic";

const MagicCursor = dynamic(() => import("./MagicCursor"), { ssr: false });

export default function MagicCursorWrapper() {
  return <MagicCursor />;
}
