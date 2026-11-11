"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Subscribes to whole-page scroll progress (0–1) without causing re-renders.
 * The callback is kept in a ref so callers can pass inline functions.
 */
export function useScrollProgress(onProgress: (progress: number) => void) {
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => cb.current(self.progress),
    });
    cb.current(st.progress);
    return () => st.kill();
  }, []);
}
