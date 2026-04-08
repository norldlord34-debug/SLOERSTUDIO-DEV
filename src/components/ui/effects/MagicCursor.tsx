"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MagicCursor() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const springX = useSpring(cursorX, { stiffness: 300, damping: 25 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 25 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setVisible(true);

    function onMove(e: MouseEvent) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    }

    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const interactive =
        target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-hover]");
      setHovering(!!interactive);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [cursorX, cursorY]);

  if (!visible) return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden lg:block"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovering ? 40 : 8,
          height: hovering ? 40 : 8,
          opacity: hovering ? 0.15 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-hidden="true"
      >
        <div className="h-full w-full rounded-full bg-white" />
      </motion.div>

      {/* Glow trail */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden lg:block"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          width: 200,
          height: 200,
        }}
        aria-hidden="true"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(79,140,255,0.06) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </>
  );
}
