"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { footer } from "@/site/content";
import { clamp, isStatic, onScreen } from "@/site/lib/motion";
import Meadow from "./Meadow";

/** Social icons (24 px grid, drawn in currentColor). */
function SocialIcon({ id }: { id: "instagram" | "youtube" | "x" }) {
  if (id === "instagram")
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (id === "youtube")
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="4.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10 9.2v5.6l4.8-2.8L10 9.2Z" fill="currentColor" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
    </svg>
  );
}

// ink blots stamped along the wordmark (x %, y %), in stamping order
const BLOTS: [number, number][] = [
  [6, 55], [17, 38], [28, 62], [39, 44], [50, 58], [61, 40], [72, 60], [83, 42], [94, 56],
];

/**
 * FO03 · orange sign-up strip, link columns, social icons, a centred wordmark sinking into a wind-blown meadow.
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
            <a key={s.id} href="#top" className="pf-social" aria-label={`Pure Juice on ${s.label}`} title={s.label}>
              <SocialIcon id={s.id} />
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
      <Meadow />
    </footer>
  );
}
