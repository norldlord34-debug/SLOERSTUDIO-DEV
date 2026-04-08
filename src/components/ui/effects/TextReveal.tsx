"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  scrollTrigger?: boolean;
}

export default function TextReveal({
  children,
  className,
  delay = 0,
  as: Tag = "h2",
  scrollTrigger = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = "";
    const words = children.split(" ");

    words.forEach((word, i) => {
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";
      wrapper.style.verticalAlign = "top";

      const inner = document.createElement("span");
      inner.textContent = word + (i < words.length - 1 ? "\u00A0" : "");
      inner.style.display = "inline-block";
      inner.style.transform = "translateY(110%)";
      inner.style.filter = "blur(4px)";
      inner.style.opacity = "0";

      wrapper.appendChild(inner);
      el.appendChild(wrapper);
    });

    const inners = el.querySelectorAll("span > span");

    const ctx = gsap.context(() => {
      const anim: gsap.TweenVars = {
        y: "0%",
        filter: "blur(0px)",
        opacity: 1,
        duration: 0.7,
        stagger: 0.04,
        delay,
        ease: "power3.out",
      };

      if (scrollTrigger) {
        anim.scrollTrigger = {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        };
      }

      gsap.to(inners, anim);
    });

    return () => ctx.revert();
  }, [children, delay, scrollTrigger]);

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLHeadingElement>}
      className={cn("will-change-transform", className)}
      aria-label={children}
    />
  );
}
