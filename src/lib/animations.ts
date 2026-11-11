/** Shared motion tokens and media queries. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const DESKTOP = "(min-width: 1024px)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export const ease = {
  out: "power3.out",
  expo: "expo.out",
  inOut: "power2.inOut",
} as const;

export const duration = {
  base: 1,
  slow: 1.4,
} as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION).matches;
}
