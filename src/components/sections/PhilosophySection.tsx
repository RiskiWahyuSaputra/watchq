"use client";

import { useRef } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/animations";
import { assets } from "@/data/watch";
import TextReveal from "@/components/animations/TextReveal";
import ParallaxImage from "@/components/animations/ParallaxImage";

const paragraphs = [
  "Time is more than a measurement. It is a collection of moments, precision, and purpose.",
  "WatchQ is shaped around that idea — a silver chronograph composed with restraint, where every line exists for a reason and every surface is meant to be noticed slowly.",
];

export default function PhilosophySection() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(root.current!.querySelectorAll("[data-stagger]"), {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: root.current!.querySelector("[data-copy]"), start: "top 80%", once: true },
      });
      gsap.fromTo(
        root.current!.querySelector("[data-index]"),
        { yPercent: 30 },
        { yPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="philosophy" ref={root} className="relative overflow-hidden bg-ink px-5 py-28 sm:px-8 lg:px-12 lg:py-44">
      <div className="mx-auto grid max-w-[1680px] grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="relative lg:col-span-6 lg:pt-16">
          <span
            data-index
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 right-0 select-none font-serif text-[clamp(8rem,22vw,20rem)] leading-none text-outline lg:-top-24 lg:right-10"
          >
            02
          </span>
          <p className="eyebrow mb-10">02 — The Philosophy</p>
          <TextReveal
            lines={["Every second", "has a story."]}
            className="relative font-serif text-[clamp(2.75rem,7vw,7rem)] font-light uppercase leading-[0.92] text-fg"
            lineClassName="[&:nth-child(2)]:pl-[0.8em] [&:nth-child(2)]:italic [&:nth-child(2)]:text-silver"
          />
          <div data-copy className="mt-14 max-w-md space-y-6 lg:ml-[12%] lg:mt-20">
            {paragraphs.map((p, i) => (
              <p key={i} data-stagger className={i === 0 ? "font-serif text-2xl leading-snug text-fg/90 lg:text-[1.75rem]" : "text-[15px] leading-relaxed text-muted"}>
                {p}
              </p>
            ))}
            <div data-stagger className="flex items-center gap-4 pt-4 text-[10px] uppercase tracking-[0.35em] text-muted">
              <span className="h-px w-12 bg-silver/50" />
              A WatchQ manifesto
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 lg:mt-48">
          <ParallaxImage
            src={assets.dial}
            alt="Macro view of the WatchQ silver chronograph dial with three sub-dials and applied indices"
            className="aspect-[4/5] w-full bg-surface"
            sizes="(min-width: 1024px) 40vw, 100vw"
            scaleFrom={1.25}
          />
          <p className="mt-5 flex justify-between text-[10px] uppercase tracking-[0.3em] text-muted">
            <span>The Dial</span>
            <span>Silver · Chronograph</span>
          </p>
        </div>
      </div>
    </section>
  );
}
