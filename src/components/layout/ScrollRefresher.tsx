"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Mounted last so its effect runs after every section has created its triggers:
 * sorts them into document order and recalculates once fonts are ready.
 */
export default function ScrollRefresher() {
  useEffect(() => {
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    refresh();
    document.fonts?.ready.then(refresh);
  }, []);
  return null;
}
