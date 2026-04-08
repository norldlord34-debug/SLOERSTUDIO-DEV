"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useTextReveal(ref: RefObject<HTMLElement | null>, delay = 0) {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 80, opacity: 0, filter: "blur(12px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    return () => ctx.revert();
  }, [ref, delay]);
}

export function useParallax(ref: RefObject<HTMLElement | null>, speed = 0.3) {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: () => speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, speed]);
}

export function useFadeInStagger(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  staggerAmount = 0.1,
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(selector);
    if (!elements.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { y: 50, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          stagger: staggerAmount,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    return () => ctx.revert();
  }, [containerRef, selector, staggerAmount]);
}

export function useHorizontalReveal(ref: RefObject<HTMLElement | null>) {
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
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    return () => ctx.revert();
  }, [ref]);
}

export function useSplitTextReveal(ref: RefObject<HTMLElement | null>, delay = 0) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const text = el.textContent || "";
    el.innerHTML = "";

    const words = text.split(" ");
    words.forEach((word, i) => {
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";
      wrapper.style.verticalAlign = "top";

      const inner = document.createElement("span");
      inner.textContent = word + (i < words.length - 1 ? "\u00A0" : "");
      inner.style.display = "inline-block";
      inner.style.transform = "translateY(110%)";

      wrapper.appendChild(inner);
      el.appendChild(wrapper);
    });

    const inners = el.querySelectorAll("span > span");

    const ctx = gsap.context(() => {
      gsap.to(inners, {
        y: "0%",
        duration: 0.8,
        stagger: 0.04,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [ref, delay]);
}

export { gsap, ScrollTrigger };
