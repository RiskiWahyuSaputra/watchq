"use client";

import { createContext, useCallback, useContext } from "react";
import type Lenis from "lenis";

export const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/** Smoothly scrolls to an anchor (`#id`) or offset, with or without Lenis. */
export function useScrollTo() {
  const lenis = useLenis();
  return useCallback(
    (target: string | number) => {
      let top: number | HTMLElement | null = null;
      if (typeof target === "number") top = target;
      else if (target === "#top") top = 0;
      else if (target.startsWith("#")) top = document.querySelector<HTMLElement>(target);
      if (top === null) return;

      if (lenis) {
        lenis.scrollTo(top, { duration: 1.6 });
      } else {
        const y = typeof top === "number" ? top : top.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
      if (typeof target === "string" && target.startsWith("#")) {
        history.replaceState(null, "", target === "#top" ? location.pathname : target);
      }
    },
    [lenis],
  );
}
