"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const WIPE_AT = 1.8; // s: the wipe starts here (if the hero images are in), and the hero intro starts with it
const WIPE = 0.6; // s: so the loader is gone at 2.4 s

/**
 * Logo-fill loader: the JUICE logo sits as a faint grey ghost and fills with colour from the bottom up as the hero's
 * eager images load (real 0→100 counter + a slim progress bar), then the panel wipes up while the hero intro moves. All motion is CSS from the first paint (lesson 11); JS only counts, fires
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
    <div className={`pf-loader pf-life ${leaving ? "is-leaving" : ""}`} aria-hidden data-loader style={{ "--p": pct / 100 } as CSSProperties}>
      <div className="pf-loader-center pf-ld2">
        {/* the logo fills with colour from the bottom up as the page loads */}
        <div className="pf-ld2-logo">
          <img src="/logo.webp" alt="" className="pf-ld2-ghost" draggable={false} />
          <img src="/logo.webp" alt="" className="pf-ld2-fill" draggable={false} />
        </div>
        <div className="pf-ld2-bar">
          <i />
        </div>
        <p className="pf-ld2-status">
          <span>{pct < 100 ? "Pressing fresh" : "Ready"}</span>
          <b>{String(pct).padStart(2, "0")}%</b>
        </p>
        <p className="pf-ld2-tag">Pure Juice · cold-pressed at sunrise</p>
      </div>
    </div>
  );
}
