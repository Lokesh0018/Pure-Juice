"use client";

// Small shared motion helpers for Pure Juice. The engine's GSAP/Lenis setup stays in lib/ (never edited per site).
import { prefersReducedMotion } from "@/lib/gsap";

declare global {
  interface Window {
    __pfLifted?: boolean;
  }
}

/** Fired by the site's own loader the moment its wipe STARTS (lesson 80): the hero intro starts on that frame. */
export function onLift(fn: () => void) {
  if (window.__pfLifted) {
    fn();
    return () => {};
  }
  const h = () => fn();
  window.addEventListener("pf:lift", h, { once: true });
  return () => window.removeEventListener("pf:lift", h);
}

export const isStatic = () => prefersReducedMotion();
/** phones and tablets (< 1024 px): stacked layouts, sections are not pinned, scroll does not drive steps */
export const isCompact = () => typeof window !== "undefined" && window.innerWidth < 1024;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** smooth 0→1 inside [a, b] */
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** 0→1 while a tall pin wrapper scrolls past a sticky 100vh stage (0 = stage reaches the top, 1 = it leaves). */
export function pinProgress(wrapper: HTMLElement) {
  const r = wrapper.getBoundingClientRect();
  const span = r.height - window.innerHeight;
  return span > 0 ? clamp(-r.top / span) : 0;
}

const NAV_H = 76; // the fixed nav: scaling is anchored just below it, so content never slides under it
const DESIGN_W = 1440; // every stage is laid out at this width

/**
 * Fits a 1440-wide stage to the window by setting `--fit` on `el` (the CSS scales the stage by it): scales down,
 * never up, so `designH` px of height fit below the nav and the 1440 width fits the window. It is layout, not motion,
 * so it runs in ?static=1 too. Returns the cleanup for useEffect.
 */
export function fitStage(el: HTMLElement, designH: number) {
  const fit = () =>
    el.style.setProperty("--fit", String(Math.min(1, document.documentElement.clientWidth / DESIGN_W, (window.innerHeight - NAV_H) / (designH - NAV_H))));
  fit();
  window.addEventListener("resize", fit);
  return () => window.removeEventListener("resize", fit);
}

/** Is any part of the element on screen (with a margin)? */
export function onScreen(el: HTMLElement, margin = 100) {
  const r = el.getBoundingClientRect();
  return r.bottom > -margin && r.top < window.innerHeight + margin;
}
