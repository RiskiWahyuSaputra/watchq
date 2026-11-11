"use client";

import { useRef, type ElementType } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/animations";

type TextRevealProps = {
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** "scroll" reveals when entering the viewport; "manual" leaves control to the parent. */
  trigger?: "scroll" | "manual";
  start?: string;
  delay?: number;
  stagger?: number;
};

/** Line-by-line clip-path reveal. Lines are explicit, so no text-splitting plugin is needed. */
export default function TextReveal({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassName = "",
  trigger = "scroll",
  start = "top 85%",
  delay = 0,
  stagger = 0.12,
}: TextRevealProps) {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (trigger !== "scroll" || !root.current) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const targets = root.current!.querySelectorAll("[data-line]");
      gsap.fromTo(
        targets,
        { yPercent: 105, clipPath: "inset(0% 0% 100% 0%)" },
        {
          yPercent: 0,
          clipPath: "inset(0% 0% -15% 0%)",
          duration: 1.3,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger: { trigger: root.current, start, once: true },
          clearProps: "clipPath",
        },
      );
    });
    return () => mm.revert();
  }, [trigger, start, delay, stagger]);

  return (
    <Tag ref={root} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={`block ${lineClassName}`}>
          <span data-line className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
