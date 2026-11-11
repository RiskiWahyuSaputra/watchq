"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/animations";
import { assets, brand } from "@/data/watch";
import TextReveal from "@/components/animations/TextReveal";
import SafeImage from "@/components/ui/SafeImage";
import Button from "@/components/ui/Button";

export default function FinalRevealSection() {
  const root = useRef<HTMLElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const fade = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      // Camera-like zoom out as the section arrives.
      gsap.fromTo(
        camera.current,
        { scale: 1.45, filter: "brightness(0.35)" },
        {
          scale: 1,
          filter: "brightness(1)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true },
        },
      );

      // Subtle floating, only while visible.
      const floatTween = gsap.to(float.current, { y: -14, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true });
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => (self.isActive ? floatTween.play() : floatTween.pause()),
        },
      });

      gsap.from(root.current!.querySelectorAll("[data-fade]"), {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 30%", once: true },
      });

      // Fade to black into the footer.
      gsap.fromTo(
        fade.current,
        { opacity: 0 },
        { opacity: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "bottom 90%", end: "bottom 20%", scrub: true } },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="collection" ref={root} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink">
      {/* Watch */}
      <div ref={camera} className="absolute inset-0 will-change-transform lg:left-[38%]">
        <div ref={float} className="absolute inset-0">
          <SafeImage
            src={assets.main}
            alt="WatchQ silver stainless steel chronograph floating above dark slate under an overhead spotlight"
            fill
            sizes="100vw"
            className="final-mask object-cover object-[52%_45%]"
          />
        </div>
      </div>

      {/* Overhead spotlight + vignette */}
      <div aria-hidden="true" className="final-spotlight pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent lg:via-ink/10" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1680px] flex-col justify-end px-5 pb-20 sm:px-8 lg:justify-center lg:px-12 lg:pb-0">
        <p data-fade className="eyebrow mb-8">07 — The Final Reveal</p>
        <TextReveal
          lines={["Own", "your time."]}
          start="top 75%"
          className="font-serif text-[clamp(3rem,9vw,9.5rem)] font-light uppercase leading-[0.88] text-fg"
          lineClassName="[&:nth-child(2)]:italic [&:nth-child(2)]:text-silver"
        />
        <p data-fade className="mt-8 max-w-xs text-[15px] leading-relaxed text-muted">
          Designed for those who appreciate every second.
        </p>
        <div data-fade className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Button href="#details" variant="solid" icon={<ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />}>
            Discover the Collection
          </Button>
          <Button href="#philosophy" variant="text">
            Explore {brand.name}
          </Button>
        </div>
      </div>

      <div ref={fade} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />
    </section>
  );
}
