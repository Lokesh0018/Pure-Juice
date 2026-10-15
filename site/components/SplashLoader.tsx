"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const WIPE_AT = 1.8; // s: the wipe starts here (if the hero images are in), and the hero intro starts with it
const WIPE = 0.6; // s: so the loader is gone at 2.4 s

/**
 * I34 drop-and-splash loader: a juice drop falls onto the kraft paper, squashes, splashes into an orange crown with
 * droplets, PURE JUICE rises out of the splash, a real 0→100 counter (the hero's eager images), then the panel wipes
 * up while the hero intro already moves. All motion is CSS from the first paint (lesson 11); JS only counts, fires
 * "pf:lift" as the wipe starts (lesson 80) and keeps the page still until then.
 */
export default function SplashLoader() {
  const [gone, setGone] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [pct, setPct] = useState(0);
  const t0 = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      window.__pfLifted = true;
      setGone(true);
      return;
    }
    t0.current = performance.now();
    window.scrollTo(0, 0);
    const lenis = window.__lenis;
    lenis?.stop();

    const imgs = Array.from(document.images).filter((i) => i.loading === "eager" || i.closest("[data-section=hero]"));
    let done = 0;
    imgs.forEach((im) => {
      if (im.complete) done++;
      else {
        const f = () => done++;
        im.addEventListener("load", f, { once: true });
        im.addEventListener("error", f, { once: true });
      }
    });

    let raf = 0;
    let lifted = false;
    const tick = () => {
      const t = (performance.now() - t0.current) / 1000;
      const real = imgs.length ? done / imgs.length : 1;
      // the counter never runs ahead of the real load, and never faster than the 1.8 s intro
      setPct(Math.round(100 * Math.min(real, Math.min(1, t / WIPE_AT))));
      const ready = real >= 1 || t > 6;
      if (!lifted && t >= WIPE_AT && ready) {
        lifted = true;
        setPct(100);
        setLeaving(true);
        window.__pfLifted = true;
        window.dispatchEvent(new Event("pf:lift"));
        setTimeout(() => {
          setGone(true);
          window.__lenis?.start();
        }, WIPE * 1000);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;
  return (
    <div className={`pf-loader pf-life ${leaving ? "is-leaving" : ""}`} aria-hidden data-loader>
      <div className="pf-loader-band" />
      <div className="pf-loader-center">
        <svg className="pf-loader-splash" viewBox="0 0 400 240" overflow="visible">
          <ellipse className="pf-ld-puddle" cx="200" cy="198" rx="120" ry="16" fill="#E9741C" />
          <g className="pf-ld-crown" fill="#E9741C">
            <path d="M118 196c-8-34 4-58 20-70-2 24 4 44 18 66ZM282 196c8-34-4-58-20-70 2 24-4 44-18 66ZM172 192c-6-46 8-74 28-92 20 18 34 46 28 92Z" />
          </g>
          <g className="pf-ld-drops" fill="#E9741C">
            <circle className="pf-ld-d1" cx="200" cy="170" r="9" />
            <circle className="pf-ld-d2" cx="200" cy="170" r="11" />
            <circle className="pf-ld-d3" cx="200" cy="170" r="6" />
            <circle className="pf-ld-d4" cx="200" cy="170" r="7" />
            <circle className="pf-ld-d5" cx="200" cy="170" r="5" />
          </g>
          <path className="pf-ld-drop" d="M200 112c14 22 26 38 26 54a26 26 0 0 1-52 0c0-16 12-32 26-54Z" fill="#E9741C" />
        </svg>
        <div className="pf-loader-word-mask">
          <p className="pf-loader-word font-display">
            Pure <em>Juice</em>
          </p>
        </div>
      </div>
      <p className="pf-loader-count font-display">
        {String(pct).padStart(2, "0")}
        <small>%</small>
      </p>
    </div>
  );
}
