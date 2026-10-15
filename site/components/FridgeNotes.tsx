"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { reviews } from "@/site/content";
import { clamp, isStatic } from "@/site/lib/motion";
import { Fruit } from "./bits";

const TILT = [0, 0, 0, 0];
const N = reviews.notes.length;

/**
 * SP10 · stacked review cards as taped paper notes in marker handwriting (sample reviews, fruit badges instead of
 * faces). M527: the top note is flicked off sideways and slides back under the pile, revealing the next. The scroll
 * through the section picks the top note (forward and back), and a click flicks to the next one.
 */
export default function FridgeNotes() {
  const root = useRef<HTMLElement>(null);
  const [top, setTop] = useState(0); // index of the note on top
  const [flick, setFlick] = useState<{ i: number; dir: 1 | -1; n: number } | null>(null);
  const extra = useRef(0); // clicks add to the scroll's choice

  const goTo = (next: number, dir: 1 | -1) => {
    setTop((cur) => {
      if (cur === next) return cur;
      setFlick({ i: dir > 0 ? cur : next, dir, n: Date.now() });
      return next;
    });
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

  return (
    <section ref={root} className="pf-reviews pf-life" data-section="reviews" data-record-time="1.4" data-record-label="Reviews">
      <div className="pf-stage">
        <div className="pf-reviews-side">
          <h2 className="pf-h2 font-display">
            <span className="pf-line">{reviews.title[0]}</span>
            <span className="pf-line">{reviews.title[1]}</span>
          </h2>
          <p className="pf-reviews-meta">
            <b className="mk">4.9</b> {reviews.meta}
          </p>
        </div>

        <div className="pf-notes">
          {reviews.notes.map((n, i) => {
            const depth = (((i - top) % N) + N) % N;
            const flicking = flick && flick.i === i;
            return (
              <figure
                key={n.who}
                className={`pf-note ${flicking ? (flick!.dir > 0 ? "is-flick" : "is-unflick") : ""}`}
                data-note={depth}
                onAnimationEnd={() => setFlick(null)}
                onClick={() => {
                  if (depth !== 0) return;
                  extra.current += 1;
                  goTo((top + 1) % N, 1);
                }}
                style={{ "--r": `${TILT[depth]}deg`, "--d": depth, zIndex: N - depth } as CSSProperties}
              >
                <blockquote className="mk">&ldquo;{n.quote}&rdquo;</blockquote>
                <figcaption>
                  <Fruit name={n.fruit} className="pf-note-badge" />
                  <span>
                    <span className="pf-stars" aria-label="5 stars">
                      ★★★★★
                    </span>
                    {n.who}
                  </span>
                </figcaption>
              </figure>
            );
          })}
          <p className="pf-sample pf-notes-sample">{reviews.sample}</p>
        </div>
        <Fruit name="orange-half" className="pf-reviews-prop" />
      </div>
    </section>
  );
}
