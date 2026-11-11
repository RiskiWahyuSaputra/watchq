"use client";

import { useRef, type ReactNode, type MouseEvent, type PointerEvent } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollTo } from "@/hooks/useLenis";
import { FINE_POINTER, REDUCED_MOTION } from "@/lib/animations";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "text";
  icon?: ReactNode;
  className?: string;
  magnetic?: boolean;
};

const variants = {
  solid: "bg-fg text-ink hover:bg-silver px-7 py-4",
  outline: "border border-line text-fg hover:border-silver/60 px-7 py-4",
  text: "text-fg px-0 py-2",
} as const;

export default function Button({
  href,
  children,
  variant = "outline",
  icon,
  className = "",
  magnetic = true,
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const scrollTo = useScrollTo();

  const canMagnet = () =>
    magnetic && window.matchMedia(FINE_POINTER).matches && !window.matchMedia(REDUCED_MOTION).matches;

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (!ref.current || !canMagnet()) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(ref.current, { x: x * 0.25, y: y * 0.35, duration: 0.5, ease: "power3.out" });
    gsap.to(inner.current, { x: x * 0.1, y: y * 0.12, duration: 0.5, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to([ref.current, inner.current], { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
  };

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollTo(href);
    }
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group relative inline-flex items-center justify-center text-[11px] font-medium uppercase tracking-[0.28em] transition-colors duration-500 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-silver ${variants[variant]} ${className}`}
    >
      <span ref={inner} className="relative inline-flex items-center gap-3">
        {children}
        {icon}
      </span>
      {variant === "text" && (
        <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-50 bg-silver/60 transition-transform duration-500 group-hover:scale-x-100" />
      )}
    </a>
  );
}
