"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/animations";
import { assets, watchComponents } from "@/data/watch";
import TextReveal from "@/components/animations/TextReveal";
import SafeImage from "@/components/ui/SafeImage";
import WatchHotspot from "@/components/ui/WatchHotspot";

export default function DetailsSection() {
  const root = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const active = watchComponents[activeIndex];

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(root.current!.querySelector("[data-stage]"), {
        clipPath: "inset(12% 12% 12% 12%)",
        scale: 1.08,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current!.querySelector("[data-stage]"), start: "top 80%", once: true },
      });
      gsap.from(root.current!.querySelectorAll("[data-list] li"), {
        x: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: root.current!.querySelector("[data-list]"), start: "top 85%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="details" ref={root} className="relative overflow-hidden bg-ink-2 px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
      <div className="mx-auto max-w-[1680px]">
        <div className="mb-14 flex flex-col gap-6 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-8">03 — The Details</p>
            <TextReveal
              lines={["Precision in", "every detail."]}
              className="font-serif text-[clamp(2.5rem,6vw,6rem)] font-light uppercase leading-[0.92] text-fg"
              lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:text-silver"
            />
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-muted">
            Select a numbered point to explore the components that define the WatchQ chronograph.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Stage */}
          <div className="lg:col-span-8">
            <div data-stage className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
              <SafeImage
                src={assets.details}
                alt="WatchQ silver stainless steel chronograph with crown, pushers, dial and bracelet visible"
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
              {/* Spotlight that follows the selected component */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute z-10 aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ boxShadow: "0 0 0 200vmax rgba(8,8,8,0.55), inset 0 0 60px 20px rgba(8,8,8,0.55)" }}
                initial={false}
                animate={{ left: `${active.x}%`, top: `${active.y}%` }}
                transition={reduced ? { duration: 0 } : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
              {watchComponents.map((c, i) => (
                <WatchHotspot key={c.id} index={i} label={c.name} x={c.x} y={c.y} active={i === activeIndex} onSelect={() => setActiveIndex(i)} />
              ))}
            </div>
          </div>

          {/* Information */}
          <div className="flex flex-col justify-between gap-12 lg:col-span-4">
            <div className="min-h-[11rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.id}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-serif text-6xl italic text-silver/80">{String(activeIndex + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 font-serif text-3xl uppercase text-fg lg:text-4xl">{active.name}</h3>
                  <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted">{active.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <ul data-list className="border-t border-line">
              {watchComponents.map((c, i) => (
                <li key={c.id} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-pressed={i === activeIndex}
                    className={`group flex w-full items-center gap-6 py-4 text-left transition-colors duration-500 ${i === activeIndex ? "text-fg" : "text-muted hover:text-fg"}`}
                  >
                    <span className="w-6 text-[10px] tracking-[0.2em]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[11px] uppercase tracking-[0.28em]">{c.name}</span>
                    <span className={`h-px bg-silver transition-all duration-700 ${i === activeIndex ? "w-10" : "w-0 group-hover:w-4"}`} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
