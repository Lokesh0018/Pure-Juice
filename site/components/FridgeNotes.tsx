"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { reviews } from "@/site/content";
import { clamp, isStatic } from "@/site/lib/motion";
import { Fruit } from "./bits";

const N = reviews.notes.length;

/** Five stars filled to `value` (0–5), drawn in currentColor over a faint track. */
function Stars({ value = 5, size = 16 }: { value?: number; size?: number }) {
  const pct = `${clamp(value / 5) * 100}%`;
  const row = (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" width={size} height={size} aria-hidden>
          <path d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8L10 1.6Z" />
        </svg>
      ))}
    </>
  );
  return (
    <span className="pf-stars-row" role="img" aria-label={`${value} out of 5 stars`}>
      <span className="pf-stars-track">{row}</span>
      <span className="pf-stars-fill" style={{ width: pct }}>
        {row}
      </span>
    </span>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}

function Chevron({ dir }: { dir: 1 | -1 }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={dir > 0 ? "M8 4l6 6-6 6" : "M12 4l-6 6 6 6"} />
    </svg>
  );
}

/**
 * SP10 · verified reviews: a headline + rating summary (score, stars, star breakdown) on the left, a stack of review
 * cards on the right. M527: the top card is flicked off sideways and slides back under the pile, revealing the next.
 * The scroll through the section picks the top card (forward and back); the arrows (or a click on the card) step it.
 */
export default function FridgeNotes() {
  const root = useRef<HTMLElement>(null);
  const [top, setTop] = useState(0); // index of the card on top
  const [flick, setFlick] = useState<{ i: number; dir: 1 | -1; n: number } | null>(null);
  const extra = useRef(0); // arrow clicks add to the scroll's choice

  const goTo = (next: number, dir: 1 | -1) => {
    setTop((cur) => {
      if (cur === next) return cur;
      setFlick({ i: dir > 0 ? cur : next, dir, n: Date.now() });
      return next;
    });
  };
  const step = (dir: 1 | -1) => {
    extra.current += dir;
    goTo((((top + dir) % N) + N) % N, dir);
  };

  useEffect(() => {
    if (isStatic()) return;
    const el = root.current!;
    let scrollIdx = -1;
    const tick = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh * 0.55 - r.top) / (vh * 0.55 + r.height * 0.45));
      const i = Math.min(N - 1, Math.floor(p * N));
      if (i !== scrollIdx) {
        const dir = i > scrollIdx ? 1 : -1;
        scrollIdx = i;
        goTo((((i + extra.current) % N) + N) % N, dir);
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const { rating } = reviews;

  return (
    <section ref={root} className="pf-reviews pf-life" data-section="reviews" data-record-time="1.4" data-record-label="Reviews">
      <div className="pf-stage">
        <div className="pf-reviews-side">
          <span className="pf-rv-eyebrow">{reviews.eyebrow}</span>
          <h2 className="pf-rv-title font-display">
            <span className="pf-line">{reviews.title[0]}</span>
            <span className="pf-line">
              {reviews.title[1]} <em>{reviews.accent}</em>
            </span>
          </h2>

          <div className="pf-rv-summary">
            <div className="pf-rv-score">
              <b>{rating.score.toFixed(1)}</b>
              <span>
                <Stars value={rating.score} size={18} />
                <small>{rating.meta}</small>
              </span>
            </div>
            <ul className="pf-rv-bars" aria-label="Rating breakdown">
              {rating.bars.map((b) => (
                <li key={b.stars}>
                  <span className="pf-rv-bar-label">{b.stars}★</span>
                  <span className="pf-rv-bar">
                    <i style={{ width: `${b.pct}%` }} />
                  </span>
                  <span className="pf-rv-bar-pct">{b.pct}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pf-rv-nav">
            <button type="button" className="pf-rv-arrow" aria-label="Previous review" onClick={() => step(-1)}>
              <Chevron dir={-1} />
            </button>
            <button type="button" className="pf-rv-arrow" aria-label="Next review" onClick={() => step(1)} data-hover-demo="" data-hover-label="Next review">
              <Chevron dir={1} />
            </button>
            <span className="pf-rv-count" aria-live="polite">
              {String(top + 1).padStart(2, "0")} <span>/ {String(N).padStart(2, "0")}</span>
            </span>
          </div>
        </div>

        <div className="pf-notes">
          {reviews.notes.map((n, i) => {
            const depth = (((i - top) % N) + N) % N;
            const flicking = flick && flick.i === i;
            return (
              <figure
                key={n.name}
                className={`pf-note ${flicking ? (flick!.dir > 0 ? "is-flick" : "is-unflick") : ""}`}
                data-note={depth}
                aria-hidden={depth !== 0}
                onAnimationEnd={() => setFlick(null)}
                onClick={() => depth === 0 && step(1)}
                style={{ "--r": "0deg", "--d": depth, zIndex: N - depth } as CSSProperties}
              >
                <div className="pf-note-head">
                  <Stars value={5} size={15} />
                  <span className="pf-note-badge-v">
                    <Check /> {reviews.badge}
                  </span>
                </div>
                <blockquote className="mk">&ldquo;{n.quote}&rdquo;</blockquote>
                <figcaption>
                  <span className="pf-note-avatar">
                    <Fruit name={n.fruit} className="pf-note-badge" />
                  </span>
                  <span className="pf-note-who">
                    <b>{n.name}</b>
                    <small>{n.city}</small>
                  </span>
                  <span className="pf-note-product">{n.product}</span>
                </figcaption>
              </figure>
            );
          })}
          <p className="pf-sample pf-notes-sample">{reviews.sample}</p>
        </div>
      </div>
    </section>
  );
}
