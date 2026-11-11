"use client";

import { useRef } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/animations";
import { specifications, watch } from "@/data/watch";
import TextReveal from "@/components/animations/TextReveal";

export default function SpecificationsSection() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const rows = root.current!.querySelectorAll("[data-spec]");
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current!.querySelector("dl"), start: "top 80%", once: true } });
      tl.from(root.current!.querySelectorAll("[data-rule]"), { scaleX: 0, duration: 1.4, ease: "expo.inOut", stagger: 0.08 }).from(
        rows,
        { y: 20, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.08 },
        0.3,
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="specifications" ref={root} className="relative bg-ink px-5 py-28 sm:px-8 lg:px-12 lg:py-44">
      <div className="mx-auto grid max-w-[1680px] gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow mb-8">06 — Specifications</p>
            <TextReveal
              lines={["The", "specifications."]}
              className="font-serif text-[clamp(2.5rem,5.5vw,5.5rem)] font-light uppercase leading-[0.92] text-fg"
              lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:text-silver"
            />
            <p className="mt-10 text-[11px] uppercase tracking-[0.35em] text-muted">
              {watch.name} — {watch.collection}
            </p>
          </div>
        </div>

        <dl className="lg:col-span-6 lg:col-start-7">
          {specifications.map((spec) => (
            <div key={spec.label} className="relative">
              <span data-rule aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
              <div data-spec className="grid grid-cols-1 gap-2 py-7 sm:grid-cols-2 sm:items-baseline sm:gap-8 lg:py-9">
                <dt className="text-[10px] uppercase tracking-[0.35em] text-muted">{spec.label}</dt>
                <dd className="font-serif text-2xl text-fg lg:text-3xl">{spec.value}</dd>
              </div>
            </div>
          ))}
          <span data-rule aria-hidden="true" className="block h-px origin-left bg-line" />
        </dl>
      </div>
    </section>
  );
}
