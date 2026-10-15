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

/** Is any part of the element on screen (with a margin)? */
export function onScreen(el: HTMLElement, margin = 100) {
  const r = el.getBoundingClientRect();
  return r.bottom > -margin && r.top < window.innerHeight + margin;
}
