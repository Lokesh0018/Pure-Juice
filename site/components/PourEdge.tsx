"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { clamp, isStatic, onScreen } from "@/site/lib/motion";

const H = 150; // px of liquid that rises over the section above
const W = 1440;

/**
 * X96 · juice-pour wipe: the next section's colour rises over the seam as a wavy liquid surface with a few droplets,
 * tied to the scroll (forward and back): flat and hidden while the seam is low on screen, full and rolling as it
 * reaches the middle. Used at three key changes only. ?static=1: not drawn.
 */
export default function PourEdge({ color }: { color: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStatic()) return;
    const el = root.current!;
    const front = el.querySelector<SVGPathElement>("[data-wave=front]")!;
    const back = el.querySelector<SVGPathElement>("[data-wave=back]")!;
    const drops = Array.from(el.querySelectorAll<SVGCircleElement>("circle"));
    const wave = (q: number, phase: number, amp: number, lift: number) => {
      const top = H - H * q * lift;
      let d = `M0 ${H} L0 ${top}`;
      for (let x = 0; x <= W; x += 48) {
        const y = top + Math.sin(x / 120 + phase) * amp * q + Math.sin(x / 47 + phase * 1.7) * amp * 0.35 * q;
        d += ` L${x} ${y.toFixed(1)}`;
      }
      return `${d} L${W} ${H} Z`;
    };
    const tick = (time: number) => {
      if (!onScreen(el, 40)) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const q = clamp((vh - r.bottom) / (vh * 0.55)); // 0: seam at the bottom of the screen → 1: seam at 45 %
      const ph = time * 1.4 + window.scrollY * 0.012;
      front.setAttribute("d", wave(q, ph, 14, 0.78));
      back.setAttribute("d", wave(q, ph + 1.3, 18, 0.95));
      drops.forEach((c, i) => {
        const k = (time * 0.7 + i * 0.27) % 1;
        c.setAttribute("cy", String(H - H * q * 0.9 - 40 * Math.sin(Math.PI * k) * q));
        c.setAttribute("opacity", String(q * Math.sin(Math.PI * k)));
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div ref={root} className="pf-pour" style={{ color }} aria-hidden>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <path data-wave="back" d={`M0 ${H}H${W}Z`} fill="currentColor" opacity="0.45" />
        <path data-wave="front" d={`M0 ${H}H${W}Z`} fill="currentColor" />
        {[180, 470, 820, 1130, 1330].map((x, i) => (
          <circle key={x} cx={x} cy={H} r={5 + (i % 3) * 2} fill="currentColor" opacity="0" />
        ))}
      </svg>
    </div>
  );
}
