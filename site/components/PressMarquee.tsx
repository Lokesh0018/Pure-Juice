"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { isStatic, onScreen } from "@/site/lib/motion";

const WORDS = ["Pressed today", "No heat", "No added sugar", "Glass bottles"];
const BASE = 46; // px/s drift when the page is still

/**
 * M14 · marquee strip between the hero and Flavours: "PRESSED TODAY · NO HEAT · NO ADDED SUGAR · GLASS BOTTLES".
 * It drifts on its own, moves with the scroll (direction follows it) and speeds up with scroll velocity.
 * Transform only; ?static=1 shows it still.
 */
export default function PressMarquee() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStatic()) return;
    const el = root.current!;
    const track = el.querySelector<HTMLElement>(".pf-marquee-track")!;
    let x = 0;
    let lastY = window.scrollY;
    let v = 0; // smoothed scroll velocity, px/s
    const tick = (_t: number, dtMs: number) => {
      const dt = Math.min(0.05, dtMs / 1000);
      const y = window.scrollY;
      const inst = (y - lastY) / Math.max(dt, 0.001);
      lastY = y;
      v += (inst - v) * Math.min(1, dt * 8);
      if (!onScreen(el, 50)) return;
      const dir = v < -5 ? -1 : 1;
      x -= dir * (BASE + Math.min(Math.abs(v) * 0.35, 520)) * dt;
      const half = track.scrollWidth / 2;
      x = ((x % half) + half) % half;
      track.style.transform = `translate3d(${-x}px,0,0) skewX(${Math.max(-8, Math.min(8, -v / 260))}deg)`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const run = [...WORDS, ...WORDS, ...WORDS];
  return (
    <div ref={root} className="pf-marquee" aria-label={WORDS.join(" · ")}>
      <div className="pf-marquee-track" aria-hidden>
        {[0, 1].map((half) => (
          <span key={half} className="pf-marquee-half">
            {run.map((w, i) => (
              <span key={i} className="pf-marquee-item font-display">
                {w}
                <svg viewBox="0 0 24 24" className="pf-marquee-dot">
                  <circle cx="12" cy="12" r="10" fill="#E9741C" />
                  <circle cx="12" cy="12" r="7" fill="#F7B15A" />
                  <path d="M12 5v14M5 12h14M7 7l10 10M17 7 7 17" stroke="#E9741C" strokeWidth="1.2" />
                </svg>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
