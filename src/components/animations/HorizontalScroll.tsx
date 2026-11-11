"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { DESKTOP, MOTION_OK } from "@/lib/animations";

type HorizontalScrollProps = {
  id?: string;
  className?: string;
  trackClassName?: string;
  children: ReactNode;
  /** Rendered inside the pinned frame but outside the moving track (e.g. progress UI). */
  overlay?: ReactNode;
};

/**
 * Desktop: pins the section and maps vertical scroll to horizontal movement.
 * Inside the track, `[data-h-parallax]` elements drift, `[data-h-reveal]` elements
 * fade in as they enter, and `[data-h-progress]` scales with overall progress.
 * Mobile / reduced motion: a plain vertical stack with light reveals.
 */
export default function HorizontalScroll({ id, className = "", trackClassName = "", children, overlay }: HorizontalScrollProps) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add({ desktop: DESKTOP, motion: MOTION_OK }, (ctx) => {
      const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
      if (!motion) return;
      if (!desktop) {
        // Mobile/tablet: vertical stack with light reveals.
        track.current!.querySelectorAll<HTMLElement>("[data-h-reveal]").forEach((node) => {
          gsap.from(node.children, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: node, start: "top 85%", once: true },
          });
        });
        return;
      }

      const el = track.current!;
      const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);

      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      el.querySelectorAll<HTMLElement>("[data-h-parallax]").forEach((node) => {
        gsap.fromTo(
          node,
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: node.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          },
        );
      });

      el.querySelectorAll<HTMLElement>("[data-h-reveal]").forEach((node) => {
        gsap.from(node.children, {
          y: 50,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: node, containerAnimation: tween, start: "left 80%", toggleActions: "play none none reverse" },
        });
      });

      section.current!.querySelectorAll<HTMLElement>("[data-h-progress]").forEach((bar) => {
        gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id={id} ref={section} className={`relative overflow-hidden ${className}`}>
      <div ref={track} className={`h-track flex flex-col lg:h-[100svh] lg:w-max lg:flex-row lg:flex-nowrap ${trackClassName}`}>
        {children}
      </div>
      {overlay}
    </section>
  );
}
