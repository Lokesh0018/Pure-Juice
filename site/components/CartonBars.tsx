"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { compare } from "@/site/content";
import { clamp, isStatic, onScreen } from "@/site/lib/motion";


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
 * ST06 · dark band, "Pure Press vs store carton" comparison table (our column highlighted). M225, scroll-linked
 * (forward and back): as the band arrives, each row fills in turn (ours, then theirs) and its numbers count up. The "Fruit per bottle" bar is
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
        const t = clamp((p - 0.08 - i * 0.14) / 0.32);
        const tt = clamp((p - 0.16 - i * 0.14) / 0.32);
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
          <span className="pf-cmp-eyebrow">{compare.eyebrow}</span>
          <h2 className="pf-cmp-title font-display">
            <span className="pf-line">{compare.title[0]}</span>
            <span className="pf-line">
              <em>{compare.title[1]}</em>
            </span>
          </h2>
          <p className="pf-cmp-lead">{compare.lead}</p>
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

        <div className="pf-cmp-table" role="table" aria-label={`${compare.ours} compared with ${compare.theirs}`}>
          <span className="pf-cmp-highlight" aria-hidden />
          <div className="pf-cmp-head" role="row">
            <span role="columnheader">
              <span className="sr-only">Measure</span>
            </span>
            <span role="columnheader" className="pf-cmp-col is-ours-col">
              <i className="is-ours" /> {compare.ours}
            </span>
            <span role="columnheader" className="pf-cmp-col">
              <i className="is-theirs" /> {compare.theirs}
            </span>
          </div>
          {compare.rows.map((r, i) => (
            <div key={r.label} className="pf-bar" role="row" style={{ "--a": 1, "--b": 1 } as CSSProperties}>
              <span role="rowheader" className="pf-cmp-label">
                {r.label}
              </span>
              <span role="cell" className="pf-cmp-cell is-ours-cell">
                <b data-ours>{r.ours}</b>
                <small>{r.oursNote}</small>
                <span className="pf-track">
                  <i className={`is-ours ${r.a === 0 ? "is-dot" : ""}`} style={{ "--w": `${r.a}%` } as CSSProperties} />
                </span>
              </span>
              <span role="cell" className="pf-cmp-cell">
                <b data-theirs>{r.theirs}</b>
                <small>{r.theirsNote}</small>
                <span className="pf-track">
                  <i className="is-theirs" style={{ "--w": `${r.b}%` } as CSSProperties} />
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
