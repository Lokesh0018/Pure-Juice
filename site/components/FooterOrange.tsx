"use client";

import { useEffect, useRef } from "react";
import { fruit } from "@/site/content";
import { clamp, isStatic, smooth } from "@/site/lib/motion";

const ROLL = 380; // px the orange rolls in from (to the right of its spot)
const RANGE = 250; // px of scroll at the very bottom of the page that drive the whole animation

/**
 * Footer finale: as the page reaches its bottom, an orange rolls in from the right edge (spinning as it rolls),
 * squashes a little as it lands, then turns into a round stamp with a slowly turning lettered ring.
 * Scroll-linked (forward and back) over the last RANGE px of the page. ?static=1 shows the finished stamp.
 */
export default function FooterOrange() {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current!;
    const whole = el.querySelector<HTMLElement>("[data-fo=whole]")!;
    const stamp = el.querySelector<HTMLElement>("[data-fo=stamp]")!;
    if (isStatic()) {
      whole.style.opacity = "0";
      stamp.style.opacity = "1";
      return;
    }
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = clamp((window.scrollY - (max - RANGE)) / RANGE); // 0 → 1 over the last RANGE px
      // phases (same beats as the old journey's finale): appear 0–0.04, roll 0.04–0.76, land/squash ~0.76, stamp 0.76–1
      const appear = clamp(p / 0.04);
      const roll = smooth(0.04, 0.76, p);
      const land = 1 - Math.min(1, Math.abs(p - 0.76) / 0.12); // squash peaks on landing
      const toStamp = smooth(0.78, 1, p);
      const x = ROLL * (1 - roll);
      const rot = -620 * roll;
      const sy = 1 - 0.16 * land;
      const sx = 1 + 0.09 * land;
      el.style.transform = `translate3d(${x}px, ${(150 * (1 - sy)) / 2}px, 0)`;
      whole.style.opacity = String(appear * (1 - toStamp));
      whole.style.transform = `scale(${sx}, ${sy}) rotate(${rot}deg)`;
      stamp.style.opacity = String(toStamp);
      stamp.style.transform = `scale(${1.15 - 0.15 * toStamp})`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span ref={root} className="pf-stamp-spot pf-fo" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-fo="whole" src={fruit("orange")} alt="" className="pf-t-layer" style={{ opacity: 0 }} />
      <svg data-fo="stamp" className="pf-t-stamp" viewBox="0 0 200 200" style={{ opacity: 0 }}>
        <defs>
          <path id="pf-fo-ring" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
        </defs>
        <circle cx="100" cy="100" r="94" fill="none" stroke="#E8541E" strokeWidth="5" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="#E8541E" strokeWidth="2.5" />
        <g className="pf-t-stamp-ring">
          <text fill="#E8541E" fontFamily="'Inter Tight Variable', sans-serif" fontWeight="600" fontSize="19" letterSpacing="4.6">
            <textPath href="#pf-fo-ring">PRESSED AT SUNRISE · PURE JUICE · NAGPUR ·</textPath>
          </text>
        </g>
        <g transform="translate(100 100)" fill="#E8541E">
          <circle r="30" />
          <path d="M-4-30c2-10 10-14 18-12-4 6-10 10-18 12Z" fill="#7BAA3C" />
          <circle r="22" fill="#F7A14A" />
          <path d="M0-22V22M-22 0H22M-15-15L15 15M15-15L-15 15" stroke="#E8541E" strokeWidth="2" />
        </g>
      </svg>
    </span>
  );
}
