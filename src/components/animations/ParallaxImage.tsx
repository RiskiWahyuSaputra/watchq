"use client";

import { useRef } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/animations";
import SafeImage from "@/components/ui/SafeImage";

type ParallaxImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Vertical drift in percent of the image height (keep ≤ 8). */
  speed?: number;
  /** Optional scale the image settles from as it enters. */
  scaleFrom?: number;
};

export default function ParallaxImage({
  src,
  alt,
  className = "",
  imageClassName = "object-cover",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  speed = 7,
  scaleFrom,
}: ParallaxImageProps) {
  const root = useRef<HTMLDivElement>(null);
  const scaler = useRef<HTMLDivElement>(null);
  const drift = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        drift.current,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      if (scaleFrom) {
        gsap.fromTo(
          scaler.current,
          { scale: scaleFrom },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
          },
        );
      }
    });
    return () => mm.revert();
  }, [speed, scaleFrom]);

  return (
    <div ref={root} className={`relative overflow-hidden ${className}`}>
      <div ref={scaler} className="absolute inset-0 will-change-transform">
        <div ref={drift} className="absolute inset-x-0 -inset-y-[10%] will-change-transform">
          <SafeImage src={src} alt={alt} fill sizes={sizes} priority={priority} className={`img-hover ${imageClassName}`} />
        </div>
      </div>
    </div>
  );
}
