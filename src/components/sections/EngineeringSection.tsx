"use client";

import { useRef } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/animations";
import { engineering } from "@/data/watch";
import TextReveal from "@/components/animations/TextReveal";
import ParallaxImage from "@/components/animations/ParallaxImage";

export default function EngineeringSection() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      root.current!.querySelectorAll<HTMLElement>("[data-row]").forEach((row, i) => {
        const reveal = row.querySelector("[data-reveal]");
        const fromRight = i % 2 === 1;
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 75%", once: true } })
          .fromTo(
            reveal,
            { clipPath: fromRight ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
          )
          .from(row.querySelectorAll("[data-stagger]"), { y: 40, opacity: 0, duration: 1.1, ease: "power3.out", stagger: 0.1 }, 0.6);
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="engineering" ref={root} className="relative bg-ink px-5 py-28 sm:px-8 lg:px-12 lg:py-44">
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-20 grid gap-10 lg:mb-32 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-8">04 — Engineering</p>
            <TextReveal
              lines={["Built with", "purpose."]}
              className="font-serif text-[clamp(2.75rem,8vw,8.5rem)] font-light uppercase leading-[0.9] text-fg"
              lineClassName="[&:nth-child(2)]:pl-[1em] [&:nth-child(2)]:italic [&:nth-child(2)]:text-silver"
            />
          </div>
          <p className="self-end text-[15px] leading-relaxed text-muted lg:col-span-4 lg:col-start-9">
            Case, crown, pushers and bracelet — the physical architecture of the WatchQ chronograph, rendered in stainless steel.
          </p>
        </div>

        <div className="space-y-24 lg:space-y-40">
          {engineering.map((item, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={item.index} data-row className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                <div data-reveal className={`lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""}`}>
                  <ParallaxImage
                    src={item.image}
                    alt={item.alt}
                    className="aspect-[16/10] w-full bg-surface"
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    scaleFrom={1.2}
                    speed={6}
                  />
                </div>
                <div className={`lg:col-span-4 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}>
                  <p data-stagger className="font-serif text-7xl italic text-outline lg:text-8xl">{item.index}</p>
                  <h3 data-stagger className="mt-6 font-serif text-3xl uppercase text-fg lg:text-5xl">{item.title}</h3>
                  <p data-stagger className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">{item.copy}</p>
                  <ul data-stagger className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-silver/80">
                    {item.focus.map((f) => (
                      <li key={f} className="flex items-center gap-3">
                        <span className="h-px w-4 bg-silver/50" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
