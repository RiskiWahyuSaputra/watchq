"use client";

import { useCallback, useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { DESKTOP, MOTION_OK, REDUCED_MOTION } from "@/lib/animations";
import { assets, brand, heroChapters, sequence } from "@/data/watch";
import { useScrollTo } from "@/hooks/useLenis";
import ImageSequence, { type ImageSequenceHandle } from "@/components/animations/ImageSequence";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  const section = useRef<HTMLElement>(null);
  const seq = useRef<ImageSequenceHandle>(null);
  const introShade = useRef<HTMLDivElement>(null);
  const scrollShade = useRef<HTMLDivElement>(null);
  const spotlight = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const finale = useRef<HTMLDivElement>(null);
  const introPlayed = useRef(false);
  const scrollTo = useScrollTo();

  /** Intro: near-black → spotlight → headline. Runs once the first frame is on screen. */
  const playIntro = useCallback(() => {
    if (introPlayed.current || !section.current) return;
    introPlayed.current = true;
    const q = gsap.utils.selector(section.current);
    if (window.matchMedia(REDUCED_MOTION).matches) {
      gsap.set(introShade.current, { autoAlpha: 0 });
      gsap.set(q("[data-hero-line], [data-hero-fade]"), { clearProps: "all" });
      return;
    }
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .to(introShade.current, { autoAlpha: 0, duration: 2.4, ease: "power2.inOut" })
      .fromTo(spotlight.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 2.6, ease: "power2.out" }, 0.2)
      .fromTo(
        q("[data-hero-line]"),
        { y: 0, yPercent: 105, clipPath: "inset(0% 0% 100% 0%)" },
        { y: 0, yPercent: 0, clipPath: "inset(0% 0% -15% 0%)", duration: 1.6, stagger: 0.14 },
        0.9,
      )
      .fromTo(q("[data-hero-fade]"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.08 }, 1.3);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(section.current);

    // Safety net: never leave the headline hidden if frames are slow.
    const fallbackTimer = window.setTimeout(playIntro, 2200);

    mm.add({ desktop: DESKTOP, motion: MOTION_OK }, (ctx) => {
      const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };

      if (!motion) {
        // Reduced motion: static, fully revealed final composition.
        seq.current?.setProgress(1);
        gsap.set(scrollShade.current, { opacity: 0.45 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: desktop ? "+=550%" : "+=350%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // The film is driven by the (scrub-smoothed) timeline itself, so frames,
      // captions and overlays always move together. Timeline length = 1.
      const film = { progress: 0 };
      tl.to(film, { progress: 1, duration: 1, onUpdate: () => seq.current?.setProgress(film.progress) }, 0)
        .fromTo(scrollShade.current, { opacity: 0.72 }, { opacity: 0.12, duration: 0.18 }, 0)
        .to(content.current, { opacity: 0, y: -80, duration: 0.14, ease: "power1.in" }, 0.02)
        .to(spotlight.current, { opacity: 0.35, duration: 0.2 }, 0.05)
        .to(q("[data-scroll-cue]"), { opacity: 0, duration: 0.05 }, 0.01);

      heroChapters.forEach((chapter, i) => {
        const el = q(`[data-chapter="${i}"]`);
        const span = chapter.end - chapter.start;
        tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: span * 0.3, ease: "power2.out" }, chapter.start).to(
          el,
          { opacity: 0, y: -30, duration: span * 0.25, ease: "power2.in" },
          chapter.end - span * 0.25,
        );
      });

      tl.to(scrollShade.current, { opacity: 0.35, duration: 0.1 }, 0.86).fromTo(
        finale.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
        0.86,
      );
    });

    return () => {
      window.clearTimeout(fallbackTimer);
      mm.revert();
    };
  }, [playIntro]);

  return (
    <section
      id="top"
      ref={section}
      aria-label="WatchQ — The Awakening"
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
    >
      {/* Layer 1 — canvas image sequence */}
      <ImageSequence
        ref={seq}
        {...sequence}
        fallbackSrc={assets.heroFallback}
        fallbackAlt="WatchQ silver stainless steel chronograph revealed under a single spotlight"
        onReady={playIntro}
      />

      {/* Layer 2 — light & shade */}
      <div ref={scrollShade} aria-hidden="true" className="absolute inset-0 bg-ink opacity-70" />
      <div ref={spotlight} aria-hidden="true" className="hero-spotlight pointer-events-none absolute inset-0 opacity-0" />
      <div aria-hidden="true" className="hero-vignette pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />

      {/* Layer 3 — opening content */}
      <div
        ref={content}
        className="relative z-10 mx-auto flex h-full max-w-[1680px] flex-col justify-end px-5 pb-28 pt-28 sm:px-8 lg:px-12 lg:pb-24"
      >
        <p data-hero-fade className="hero-hidden mb-6 text-[10px] uppercase tracking-[0.42em] text-silver sm:text-[11px]">
          {brand.label}
        </p>
        <h1 className="font-serif text-[clamp(3.4rem,11vw,11.5rem)] font-light uppercase leading-[0.86] tracking-[-0.01em] text-fg">
          <span className="block">
            <span data-hero-line className="hero-hidden block">Timeless.</span>
          </span>
          <span className="block pl-[0.6em] sm:pl-[1.2em]">
            <span data-hero-line className="hero-hidden block italic text-silver">Beyond time.</span>
          </span>
        </h1>
        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <p data-hero-fade className="hero-hidden max-w-xs text-sm leading-relaxed text-muted sm:text-[15px]">
            {brand.statement}
          </p>
          <div data-hero-fade className="hero-hidden">
            <Button href="#collection" variant="outline" icon={<ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />}>
              Explore Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Chapter captions synced to the camera path */}
      {heroChapters.map((chapter, i) => (
        <div
          key={chapter.title}
          data-chapter={i}
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 opacity-0 sm:left-8 lg:left-12"
        >
          <p className="mb-3 font-serif text-sm italic text-silver">{chapter.label}</p>
          <p className="font-serif text-4xl uppercase text-fg sm:text-6xl lg:text-7xl">{chapter.title}</p>
          <span className="mt-5 block h-px w-16 bg-silver/60" />
        </div>
      ))}

      {/* Final composition caption */}
      <div
        ref={finale}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-16 z-10 text-center opacity-0 lg:bottom-20"
      >
        <p className="text-[10px] uppercase tracking-[0.5em] text-silver sm:text-[11px]">{brand.label}</p>
        <p className="mt-4 font-serif text-2xl text-fg sm:text-3xl">{brand.tagline}</p>
      </div>

      {/* Scroll cue */}
      <button
        type="button"
        data-scroll-cue
        onClick={() => scrollTo("#philosophy")}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-muted transition-colors hover:text-fg sm:bottom-8"
      >
        <span data-hero-fade className="hero-hidden flex flex-col items-center gap-3">
          Scroll to discover
          <span className="scroll-line relative block h-10 w-px overflow-hidden bg-line" />
          <ArrowDown className="sr-only" />
        </span>
      </button>

      {/* Intro shade — starts fully black, lifts once the first frame is drawn */}
      <div ref={introShade} aria-hidden="true" className="hero-intro-shade pointer-events-none absolute inset-0 z-20 bg-ink" />
    </section>
  );
}
