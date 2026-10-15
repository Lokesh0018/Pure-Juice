"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { footer } from "@/site/content";
import { clamp, isStatic, onScreen } from "@/site/lib/motion";

// ink blots stamped along the wordmark (x %, y %), in stamping order
const BLOTS: [number, number][] = [
  [6, 55], [17, 38], [28, 62], [39, 44], [50, 58], [61, 40], [72, 60], [83, 42], [94, 56],
];

/**
 * FO03 · tomato sign-up strip, link columns, socials, crate-stencil wordmark sinking off the corner.
 * M239: ink blots stamp along the giant wordmark to reveal it, tied to the scroll and complete exactly at the page
 * bottom (forward and back); the strip headline lifts in; a slow light band keeps the end screen alive. The
 * travelling orange becomes a round stamp on [data-orange-stamp], beside PURE JUICE.
 */
export default function StallFooter() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isStatic()) return;
    const el = root.current!;
    const mark = el.querySelector<HTMLElement>(".pf-wordmark")!;
    const strip = el.querySelector<HTMLElement>(".pf-strip-title")!;
    mark.classList.add("is-inking");
    const tick = () => {
      if (!onScreen(el, 50)) return;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const p = clamp((vh - r.top) / r.height); // 1 exactly at the page bottom
      BLOTS.forEach((_, i) => {
        const t = clamp((p - 0.45 - i * 0.05) / 0.16);
        mark.style.setProperty(`--b${i}`, `${(t * 34).toFixed(2)}%`);
      });
      const lift = clamp((vh - r.top) / (vh * 0.5));
      gsap.set(strip, { y: 40 * (1 - lift), autoAlpha: 0.2 + 0.8 * lift });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      mark.classList.remove("is-inking");
    };
  }, []);

  return (
    <footer ref={root} className="pf-footer" data-section="footer" data-record-time="2.0" data-record-align="bottom" data-record-label="Footer">
      <span className="pf-footer-band" aria-hidden />
      <div className="pf-strip">
        <div className="pf-stage pf-strip-inner">
          <p className="pf-strip-title font-display">{footer.strip}</p>
          <form className="pf-signup">
            <label className="sr-only" htmlFor="pf-email">
              Email
            </label>
            <input id="pf-email" type="email" placeholder={footer.placeholder} autoComplete="off" />
            <button type="button" className="pf-btn pf-btn-ink">
              {footer.join}
            </button>
          </form>
        </div>
      </div>
      <div className="pf-stage pf-footer-body">
        <div className="pf-cols">
          {footer.cols.map((c) => (
            <div key={c.title}>
              <p className="font-display pf-col-title">{c.title}</p>
              <ul>
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="pf-scribble">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="font-display pf-col-title">Hours</p>
            <ul>
              {footer.hours.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pf-socials">
          {footer.socials.map((s) => (
            <a key={s} href="#top" className="pf-social" aria-label={s}>
              {s}
            </a>
          ))}
          <p className="pf-footnote">{footer.note}</p>
        </div>
      </div>
      <span className="pf-stamp-spot" data-orange-stamp aria-hidden />
      <div
        className="pf-wordmark font-display"
        aria-hidden
        style={{ "--blots": BLOTS.map(([x, y], i) => `radial-gradient(circle at ${x}% ${y}%, #000 var(--b${i}, 0%), transparent calc(var(--b${i}, 0%) + 1.5%))`).join(", ") } as CSSProperties}
      >
        {footer.wordmark}
      </div>
    </footer>
  );
}
