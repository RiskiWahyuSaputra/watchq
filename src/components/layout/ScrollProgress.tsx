"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useScrollProgress((p) => {
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px bg-transparent">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-silver/40 via-silver to-fg" />
    </div>
  );
}
