"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { compare } from "@/site/content";
import { clamp, isStatic, onScreen } from "@/site/lib/motion";

declare global {
  interface Window {
    /** 0→1: how far the travelling juice drop has run along the "Fruit per bottle" bar (set by OrangeTraveller) */
    __pfRun?: number;
  }
}

const FRUIT_ROW = 2; // "Fruit per bottle": filled by the travelling drop instead of by the scroll alone

/** "1.2 kg" → { n: 1.2, dec: 1, unit: " kg" }; "None" → null */
function parse(v: string) {
  const m = v.match(/^([\d.]+)(.*)$/);
  if (!m) return null;
  return { n: Number(m[1]), dec: (m[1].split(".")[1] ?? "").length, unit: m[2] };
}
const show = (v: string, t: number) => {
  const p = parse(v);
  return p ? `${(p.n * t).toFixed(p.dec)}${p.unit}` : v;
};

/**
 * ST06 · chalkboard band, "fresh vs a carton" comparison bars. M225, scroll-linked (forward and back): as the band
 * arrives, each row fills in turn (ours, then theirs) and its numbers count up with it. The "Fruit per bottle" bar is
 * filled by the travelling juice drop as it runs along it.
 */
export default function CartonBars() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isStatic()) return;
    const el = root.current!;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".pf-bar"));
    const last: string[] = [];
    const tick = () => {
      if (!onScreen(el, 200)) return;
      const r = el.getBoundingClientRect();
      const p = clamp((window.innerHeight - r.top) / (window.innerHeight * 0.85));
      rows.forEach((row, i) => {
        const data = compare.rows[i];
        const t = i === FRUIT_ROW ? clamp(window.__pfRun ?? 0) : clamp((p - 0.08 - i * 0.14) / 0.32);
        const tt = i === FRUIT_ROW ? t : clamp((p - 0.16 - i * 0.14) / 0.32);
        row.style.setProperty("--a", String(t));
        row.style.setProperty("--b", String(tt));
        const text = `${show(data.ours, t)}|${show(data.theirs, tt)}`;
        if (text !== last[i]) {
          last[i] = text;
          row.querySelector<HTMLElement>("[data-ours]")!.textContent = show(data.ours, t);
          row.querySelector<HTMLElement>("[data-theirs]")!.textContent = show(data.theirs, tt);
        }
      });
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <section ref={root} className="pf-compare" data-section="compare" data-record-time="1.2" data-record-label="Benefits">
      <div className="pf-stage">
        <div className="pf-compare-side">
          <h2 className="pf-h2 font-display">
            <span className="pf-line">{compare.title[0]}</span>
            <span className="pf-line">{compare.title[1]}</span>
          </h2>
          <ul className="pf-legend">
            <li>
              <i className="is-ours" /> {compare.ours}
            </li>
            <li>
              <i className="is-theirs" /> {compare.theirs}
            </li>
          </ul>
          <p className="pf-compare-note">{compare.note}</p>
        </div>
        <div className="pf-bars">
          {compare.rows.map((r, i) => (
            <div key={r.label} className="pf-bar" style={{ "--a": 1, "--b": 1 } as CSSProperties}>
              <h3 className="font-display">
                <span>{r.label}</span>
                <span className="pf-bar-vals">
                  <b data-ours>{r.ours}</b> <small>vs</small> <span data-theirs>{r.theirs}</span>
                </span>
              </h3>
              <div className="pf-track" {...(i === FRUIT_ROW ? { "data-run-track": "" } : {})}>
                <i className={`is-ours ${r.a === 0 ? "is-dot" : ""}`} style={{ "--w": `${r.a}%` } as CSSProperties} />
              </div>
              <div className="pf-track">
                <i className="is-theirs" style={{ "--w": `${r.b}%` } as CSSProperties} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
