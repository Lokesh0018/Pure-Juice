"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { hero, products } from "@/site/content";
import { clamp, isStatic, onLift, onScreen } from "@/site/lib/motion";
import { Arrow, Bottle, Fruit, Stamp } from "./bits";

// M42 drive: shown progress = max(intro, scroll) (lessons 4, 64, 81). The intro starts on the loader's lift and runs
// linearly, long enough that the record scroll overtakes it; 0.5 = the rows' resting layout.
const INTRO_RATE = 0.21; // per second
const INTRO_MAX = 0.62;
const SCROLL_FROM = 0.28; // progress at scrollY 0
const ROW_TRAVEL = 260; // px each row travels along the diagonal from p 0 → 0.5 (and again 0.5 → 1)

/**
 * HR23 · headline left, a diagonal wall of bottles in two rows on paint blobs right, leaves + citrus,
 * a chalkboard price sign. M42: the two rows slide opposite ways along the diagonal (intro, then scroll).
 */
export default function BottleWallHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isStatic()) return;
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const rowA = q("[data-wall-row=a]")[0];
    const rowB = q("[data-wall-row=b]")[0];
    const depth1 = q("[data-depth='1']");
    const depth2 = q("[data-depth='2']");
    const depth3 = q("[data-depth='3']");
    const copy = q(".pf-hero-copy")[0];

    gsap.set(q(".pf-line-in"), { yPercent: 110 });
    gsap.set(q("[data-hero-in]"), { autoAlpha: 0, y: 26 });
    gsap.set(q(".pf-chalk-sign"), { autoAlpha: 0, y: -50, rotate: 0 });

    let introStart = -1;
    const offLift = onLift(() => {
      introStart = performance.now();
      gsap
        .timeline()
        .to(q(".pf-line-in"), { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.12 })
        .to(q("[data-hero-in]"), { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 0.35)
        .to(q(".pf-chalk-sign"), { autoAlpha: 1, y: 0, rotate: 0, duration: 0.8, ease: "power3.out" }, 0.55);
    });

    const tick = () => {
      if (!onScreen(el)) return;
      const t = introStart < 0 ? 0 : (performance.now() - introStart) / 1000;
      const intro = Math.min(INTRO_MAX, t * INTRO_RATE);
      const s = clamp(window.scrollY / el.offsetHeight);
      const p = Math.max(intro, SCROLL_FROM + (1 - SCROLL_FROM) * s);
      // after the intro the rows never stop: a slow drift keeps sliding them while the page rests (lesson 8)
      const drift = introStart < 0 ? 0 : Math.sin(Math.max(0, t - 2.4) * 0.55) * 34;
      const x = ROW_TRAVEL * (1 - 2 * p) + drift;
      gsap.set(rowA, { x });
      gsap.set(rowB, { x: -x });
      gsap.set(depth1, { y: -50 * p });
      gsap.set(depth2, { y: -110 * p });
      gsap.set(depth3, { y: -190 * p });
      gsap.set(copy, { y: -90 * s });
    };
    gsap.ticker.add(tick);

    // bottles tilt slightly toward the cursor while hovered
    const items = q<HTMLElement>(".pf-wall-item");
    const offs = items.map((it) => {
      const move = (e: PointerEvent | MouseEvent) => {
        const r = it.getBoundingClientRect();
        const dx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
        const dy = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);
        it.style.setProperty("--tilt", `${(dx * 7).toFixed(2)}deg`);
        it.style.setProperty("--tilt-y", `${(dy * 6).toFixed(2)}px`);
      };
      const leave = () => {
        it.style.setProperty("--tilt", "0deg");
        it.style.setProperty("--tilt-y", "0px");
      };
      it.addEventListener("pointermove", move);
      it.addEventListener("mousemove", move);
      it.addEventListener("pointerleave", leave);
      it.addEventListener("mouseleave", leave);
      return () => {
        it.removeEventListener("pointermove", move);
        it.removeEventListener("mousemove", move);
        it.removeEventListener("pointerleave", leave);
        it.removeEventListener("mouseleave", leave);
      };
    });
    return () => {
      offLift();
      gsap.ticker.remove(tick);
      offs.forEach((f) => f());
    };
  }, []);

  return (
    <section id="top" ref={root} className="pf-hero" data-section="hero" data-record-time="0" data-record-hold="1.4" data-record-label="Hero intro">
      <div className="pf-stage">
        <div className="pf-hero-art" aria-hidden>
          <span data-depth="1" className="pf-depth">
            <span className="pf-hero-disc" />
          </span>
          <span data-depth="2" className="pf-depth">
            <span className="pf-hero-disc pf-hero-disc-sm" />
          </span>
          <div className="pf-wall">
            {[hero.rowA, hero.rowB].map((row, r) => (
              <div key={r} className={`pf-wall-row pf-wall-row-${r ? "b" : "a"}`} data-wall-row={r ? "b" : "a"}>
                {row.map((id, i) => {
                  const p = products[id];
                  const demo = r === 0 && i === 1;
                  return (
                    <a
                      key={`${id}-${i}`}
                      href="#flavours"
                      className="pf-wall-item"
                      data-cursor="Shop"
                      {...(demo ? { "data-hover-demo": "", "data-hover-hold": "1.0", "data-hover-label": "Hero bottle" } : {})}
                      aria-label={p.name}
                    >
                      <Bottle juice={p.juice} word={p.word} eager />
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
          <span data-depth="3" className="pf-depth">
            <Fruit name="citrus-leaves" className="pf-hero-prop pf-hero-leaf-a pf-float" />
            <Fruit name="mint" className="pf-hero-prop pf-hero-leaf-b pf-float pf-float-slow" />
            <Fruit name="orange" className="pf-hero-prop pf-hero-orange pf-float pf-float-slow pf-traveller-slot" />
            <Fruit name="orange-half" className="pf-hero-prop pf-hero-half pf-float" />
          </span>
        </div>

        <div className="pf-hero-copy">
          <h1 className="pf-h1 font-display">
            <span className="pf-line pf-mask">
              <span className="pf-line-in">{hero.lines[0]}</span>
            </span>
            <span className="pf-line pf-mask">
              <span className="pf-line-in">
                at <em>first light.</em>
              </span>
            </span>
          </h1>
          <p className="pf-hero-lead" data-hero-in>
            {hero.lead}
          </p>
          <div className="pf-hero-cta" data-hero-in>
            <a href="#flavours" className="pf-btn pf-btn-tomato" data-magnetic>
              {hero.primary} <Arrow />
            </a>
            <a href="#cleanses" className="pf-btn pf-btn-line">
              {hero.secondary}
            </a>
          </div>
          <div className="pf-hero-badges" data-hero-in>
            {hero.badges.map((b) => (
              <Stamp key={b}>
                {b}
              </Stamp>
            ))}
          </div>
        </div>

        <div className="pf-chalk-sign" aria-label="Today's press, 149 rupees a bottle">
          <span>{hero.chalk[0]}</span>
          <span className="pf-chalk-price">{hero.chalk[1]}</span>
          <span>{hero.chalk[2]}</span>
        </div>
      </div>
      {/* record stop: a short scroll, then the hover on the Sunrise bottle while the rows keep sliding */}
      <span className="pf-marker" style={{ top: 150 }} data-record-time="0.45" data-record-hold="0.9" data-record-label="Hero hover" aria-hidden />
    </section>
  );
}
