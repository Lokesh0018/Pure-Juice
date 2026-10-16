"use client";

import { useEffect, useRef } from "react";
import { fruit } from "@/site/content";
import { clamp, isStatic } from "@/site/lib/motion";

const SIZE = 104; // px
const RANGE = 520; // px of scroll over which the orange crosses the screen
const Y_START = 0.86; // viewport height fraction where it enters (left)…
const Y_END = 0.34; // …and where it leaves (right): a gentle upward diagonal below the hero copy

/**
 * Hero scroll orange: as the visitor scrolls the hero, an orange rolls in from off-screen left, across the screen on
 * a gentle upward diagonal, and out past the right edge. The spin matches the distance travelled (a real roll, no
 * sliding). Scroll-linked, so scrolling back rolls it back. Fixed layer, no pointer events; off in ?static=1.
 */
export default function HeroOrange() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStatic()) return;
    const el = root.current!;
    let raf = 0;
    let shown = true;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const s = window.scrollY;
      const p = clamp(s / RANGE);
      const visible = p > 0 && p < 1;
      if (!visible) {
        if (shown) {
          el.style.opacity = "0";
          shown = false;
        }
        return;
      }
      shown = true;
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const x = -SIZE + (vw + SIZE * 2) * p; // left edge → past the right edge
      const y = vh * (Y_START + (Y_END - Y_START) * p) - SIZE / 2;
      const rot = ((x + SIZE) / (SIZE / 2)) * (180 / Math.PI); // angle = distance / radius
      el.style.opacity = "1";
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={root} className="pf-hero-roller" aria-hidden style={{ opacity: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={fruit("orange")} alt="" draggable={false} />
    </div>
  );
}
