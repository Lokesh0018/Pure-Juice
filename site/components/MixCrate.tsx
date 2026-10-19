"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, loadPlugin } from "@/lib/gsap";
import { img, mix, rupee } from "@/site/content";
import { fitStage, isCompact, isStatic, onScreen, pinProgress } from "@/site/lib/motion";
import { Arrow, Fruit } from "./bits";

// Bottle geometry (% of its height): cap 0–15, liquid from the shoulder (15.5) to the base. The stills have their
// label painted out; a thin printed band (56–68 %) sits on top, so both layer lines (42 %, 70 %) stay in view.
// Each layer runs from its wavy top to the base; lower layers sit above higher ones, so their waves show.
const LAYER_TOP = [70, 42, 15.5]; // 1 bottom · 2 middle · 3 shoulder
const FILL_TOP = [100, 70, 42, 15.5]; // fill line after 0 / 1 / 2 / 3 picks
const PIN = 750; // px of scroll the stage stays pinned (record: 5 short stops inside it, each hold ≤ 1.2 s)
// Scroll drives the demo blend (forward and back): pin progress at which Orange, Carrot, Ginger are picked.
// The travelling orange sits in cell 1 until the first threshold, then hands over to the Orange pick.
const PICK_AT = [0.14, 0.36, 0.58];
// Liquid surface waves: one period + direction per layer, shared by its white seam line, and every wave is put in
// phase with one global clock (a negative delay from performance.now), so line and juice always roll together.
const WAVE = [
  { dur: 2.6, dir: "normal" },
  { dur: 3.1, dir: "reverse" },
  { dur: 2.6, dir: "normal" },
] as const;
const waveStyle = (i: number): CSSProperties => {
  const w = WAVE[i] ?? WAVE[0];
  return { animationDuration: `${w.dur}s`, animationDirection: w.dir };
};
/** sets the phase once, when the element is created (a re-render never touches it, a re-created one gets a fresh one) */
const phaseRef = (i: number) => (el: HTMLElement | null) => {
  if (!el || el.dataset.phased) return;
  const w = WAVE[i] ?? WAVE[0];
  el.style.animationDelay = `${-((performance.now() / 1000) % w.dur)}s`;
  el.dataset.phased = "1";
};
const FIT_H = 820; // px of window height the stage needs; shorter windows scale it down (anchored below the nav)

const binOf = (id: string) => mix.bins.find((b) => b.id === id)!;

/** A product-like name: the first fruit's word + the last fruit's word (the demo blend keeps its own name). */
function blendName(picks: string[]) {
  if (picks.join() === mix.picks.join()) return mix.blend.name;
  return [binOf(picks[0]).nameA, binOf(picks[picks.length - 1]).nameB];
}
/** ₹ base + each fruit's add-on (the demo Orange + Carrot + Ginger comes to ₹149). */
const blendPrice = (picks: string[]) => mix.base + picks.reduce((n, id) => n + binOf(id).add, 0);
const blendKcal = (picks: string[]) => picks.reduce((n, id) => n + binOf(id).kcal, 0);
/** the cheapest possible blend: base + the three lowest add-ons */
const FROM = mix.base + mix.bins.map((b) => b.add).sort((a, b) => a - b).slice(0, 3).reduce((n, v) => n + v, 0);

/**
 * PS10 · Custom cold press (signature, M716 crate-to-bottle fill). A grid of 9 fruits (picks numbered 1-2-3, each with
 * its price add-on), the bottle fills layer by layer, and the dark board names the blend, lists its fruits, benefits,
 * calories and live price, and adds it to the bag (or starts over).
 * Pinned (CSS sticky). Each pick: the fruit lifts out of its bin, arcs into the neck (MotionPath) and becomes a new
 * liquid layer rising with a rolling wavy surface. The scroll drives the demo (Orange → Carrot → Ginger at PICK_AT,
 * undone when scrolling back); a visitor's own click takes over until they scroll back above the section. Nothing
 * depends on the record cursor. ?static=1 shows the finished blend.
 */
export default function MixCrate() {
  const initial = useRef(mix.picks); // SSR / ?static=1: the finished demo blend
  const [picks, setPicks] = useState<string[]>(mix.picks);
  const prev = useRef<string[]>(mix.picks);
  const touched = useRef(false);
  const skipFirst = useRef(false);
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const full = picks.length === 3;
  const name = full ? blendName(picks) : null;
  const price = blendPrice(picks);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef(0);
  useEffect(() => () => clearTimeout(addedTimer.current), []);

  // the finished blend goes into the bag as its own line (name, recipe, price, bottle colour of the first fruit)
  const addToBag = () => {
    if (!name) return;
    window.dispatchEvent(
      new CustomEvent("pf:add", {
        detail: {
          id: `mix-${picks.join("-")}`,
          size: "custom",
          name: name.join(" "),
          note: `Custom blend · ${picks.map((id) => binOf(id).label).join(", ")}`,
          price,
          juice: binOf(picks[0]).juice,
        },
      }),
    );
    setAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setAdded(false), 1600);
  };
  const reset = () => {
    touched.current = true;
    setPicks([]);
  };

  const pick = (id: string) => {
    touched.current = true;
    setPicks((p) => {
      if (p.length === 3) return [id];
      if (p.includes(id)) return p.filter((x) => x !== id);
      return [...p, id];
    });
  };

  // Motion on: start empty (the fill and the board play as the picks come in).
  useLayoutEffect(() => {
    if (isStatic()) return;
    prev.current = [];
    skipFirst.current = true; // the pick effect below also runs on mount with the SSR picks: ignore that run
    setPicks([]);
    gsap.set(stage.current!.querySelector(".pf-fill"), { clipPath: `inset(${FILL_TOP[0]}% 0 0 0)` });
  }, []);

  // Each change: fly the new fruit into the neck, then raise the fill to its new line.
  useLayoutEffect(() => {
    if (isStatic()) return;
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    const root = stage.current!;
    const fill = root.querySelector<HTMLElement>(".pf-fill")!;
    const before = prev.current;
    prev.current = picks;
    const to = `inset(${FILL_TOP[picks.length]}% 0 0 0)`;
    const added = picks.length > before.length && picks.slice(0, before.length).join() === before.join();
    if (!added) {
      // scrolling back: the layer is already gone, so the fill line follows at once (no bare grey liquid showing)
      gsap.killTweensOf(fill);
      gsap.set(fill, { clipPath: to });
      return;
    }
    const id = picks[picks.length - 1];
    const bin = root.querySelector<HTMLElement>(`[data-bin="${id}"]`)!;
    const src = bin.querySelector<HTMLImageElement>("img")!;
    const bottle = root.querySelector<HTMLElement>(".pf-mix-bottle")!;
    const host = root.querySelector<HTMLElement>(".pf-fly-layer")!;
    const a = src.getBoundingClientRect();
    const b = bottle.getBoundingClientRect();
    const h = host.getBoundingClientRect();
    const k = h.width / host.offsetWidth || 1; // the stage may be scaled to fit the window: work in its own pixels
    const flyer = src.cloneNode() as HTMLImageElement;
    flyer.className = "pf-flyer";
    Object.assign(flyer.style, { left: `${(a.left - h.left) / k}px`, top: `${(a.top - h.top) / k}px`, width: `${a.width / k}px`, height: `${a.height / k}px` });
    host.appendChild(flyer);
    const dx = (b.left + b.width / 2 - (a.left + a.width / 2)) / k;
    const dy = (b.top + b.height * 0.1 - (a.top + a.height / 2)) / k;
    gsap.set(src, { autoAlpha: 0.25 });
    // each flight finishes on its own (the next pick may start before this one has landed)
    loadPlugin("MotionPathPlugin").then(() => {
      gsap
        .timeline({ onComplete: () => flyer.remove() })
        .to(flyer, { y: -34, scale: 1.08, duration: 0.18, ease: "power2.out" })
        .to(flyer, {
          motionPath: { path: [{ x: dx * 0.45, y: Math.min(dy, 0) - 190 }, { x: dx, y: dy }], curviness: 1.25 },
          scale: 0.42,
          rotate: 160,
          duration: 0.62,
          ease: "power1.inOut",
        })
        .to(flyer, { autoAlpha: 0, scale: 0.2, duration: 0.12, ease: "power1.in" }, ">-0.06")
        .to(fill, { clipPath: to, duration: 0.75, ease: "power2.out", overwrite: true }, "-=0.12")
        .to(src, { autoAlpha: 1, duration: 0.4 }, "-=0.5");
    });
  }, [picks]);

  // The chalkboard writes the name line by line, then chalks the price in.
  useLayoutEffect(() => {
    if (isStatic() || !full) return;
    const root = stage.current!;
    const lines = root.querySelectorAll(".pf-board-name .pf-chalk-line");
    const tl = gsap
      .timeline({ delay: 0.35 })
      .fromTo(lines, { clipPath: "inset(-10% 100% -10% 0)" }, { clipPath: "inset(-10% 0% -10% 0)", duration: 0.42, ease: "none", stagger: 0.42 })
      .fromTo(root.querySelector(".pf-board-recipe"), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.1")
      .fromTo(root.querySelectorAll(".pf-board-tags i"), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.06 }, "-=0.15")
      .fromTo(root.querySelector(".pf-board-price"), { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, "-=0.15")
      .fromTo(root.querySelector(".pf-board .pf-btn"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.2");
    return () => {
      tl.kill();
    };
  }, [full]);

  // fit the pinned stage to short windows (the grid and bottle never drop below the screen)
  useEffect(() => fitStage(stage.current!, FIT_H), []);

  // Pinned stage life (lesson 9): crate, bottle and board drift with the pin; the scroll picks the demo blend.
  useEffect(() => {
    if (isStatic()) return;
    const root = stage.current!;
    const crate = root.querySelector(".pf-crate");
    const board = root.querySelector(".pf-board");
    const bottle = root.querySelector(".pf-mix-bottle");
    let shown = -1;
    const tick = () => {
      const p = pinProgress(pin.current!);
      if (p <= 0 && pin.current!.getBoundingClientRect().top > 0) touched.current = false; // back above: demo again
      if (!onScreen(root) || isCompact()) return;
      gsap.set(crate, { y: 18 - 36 * p });
      gsap.set(board, { y: 30 - 60 * p });
      gsap.set(bottle, { y: 10 - 20 * p });
      if (touched.current) return;
      const n = PICK_AT.filter((t) => p >= t).length;
      if (n !== shown) {
        shown = n;
        setPicks(mix.picks.slice(0, n));
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div ref={pin} className="pf-pin" style={{ "--pin": `${PIN}px` } as CSSProperties}>
      <span className="pf-marker" style={{ top: 0 }} data-record-time="1.6" data-record-label="Mix arrives (pinned)" aria-hidden />
      {/* the record cursor's three picks land in the first stops, the chalk writes in the last ones */}
      {[150, 300, 450, 600].map((y, i) => (
        <span
          key={y}
          className="pf-marker"
          style={{ top: y }}
          data-record-time="0.3"
          data-record-hold="1.2"
          data-record-label={i < 3 ? `Mix pick ${i + 1}` : "Mix: last layer rises, chalk starts"}
          aria-hidden
        />
      ))}
      <span className="pf-marker" style={{ top: PIN }} data-record-time="0.3" data-record-hold="0.95" data-record-label="Mix: Sunrise Kick · ₹149" aria-hidden />

      <section id="mix" ref={stage} className="pf-mix pf-sticky pf-life" data-section="mix">
        <div className="pf-stage">
          <div className="pf-mix-copy">
            <span className="pf-mix-eyebrow">{mix.eyebrow}</span>
            <h2 className="pf-mix-title font-display">
              <span className="pf-line">{mix.title[0]}</span>
              <span className="pf-line">
                <em>{mix.title[1]}</em>
              </span>
            </h2>
            <p className="pf-mix-lead">{mix.lead}</p>
          </div>

          <div className="pf-crate" role="group" aria-label="Pick three fruits">
            {mix.bins.map((b) => {
              const n = picks.indexOf(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  className={`pf-bin ${n >= 0 ? "is-on" : ""}`}
                  onClick={() => pick(b.id)}
                  aria-pressed={n >= 0}
                  data-cursor="Pick"
                  data-bin={b.id}
                  {...(b.id === "strawberry" ? { "data-hover-demo": "", "data-hover-hold": "0.8", "data-hover-label": "Strawberry bin" } : {})}
                >
                  <span className="pf-bin-add">+{rupee(b.add)}</span>
                  <Fruit name={b.id} className="pf-bin-fruit" />
                  <span className="pf-bin-label">{b.label}</span>
                  {n >= 0 && <span className="pf-bin-n font-display">{n + 1}</span>}
                </button>
              );
            })}
          </div>

          <div className="pf-mix-bottle" aria-label={`Bottle with ${picks.length} of 3 fruits`}>
            <span className="pf-mix-shadow" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img("bottle-clear")} alt="" className="pf-mix-base" />
            <span className="pf-fill" aria-hidden style={{ clipPath: `inset(${FILL_TOP[initial.current.length]}% 0 0 0)` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img("bottle-orange-bare")} alt="" />
              <span className="pf-layers">
                {picks.map((id, i) => {
                  const bin = mix.bins.find((b) => b.id === id)!;
                  return (
                    <span
                      key={`${id}-${i}`}
                      className="pf-layer"
                      data-layer={i}
                      ref={phaseRef(i)}
                      style={{ "--c": bin.liquid, top: `${LAYER_TOP[i]}%`, zIndex: 10 - i, ...waveStyle(i) } as CSSProperties}
                    />
                  );
                })}
              </span>
              {/* the white seam on top of layer i: same wave shape, period, direction and phase as that layer */}
              {picks.slice(1).map((id, i) => (
                <span key={`line-${id}`} className="pf-wave-line" data-line={i} ref={phaseRef(i)} style={{ top: `${LAYER_TOP[i]}%`, ...waveStyle(i) }} />
              ))}
            </span>
            <span className="pf-mix-label" aria-hidden>
              <span className="pf-label-brand">Pure Juice</span>
              <span className="pf-mix-label-word">Your blend</span>
            </span>
          </div>

          <div className="pf-board" aria-live="polite">
            <div className="pf-board-top">
              <span className="pf-board-label">Your blend</span>
              {picks.length > 0 && (
                <button type="button" className="pf-board-reset" onClick={reset}>
                  {mix.reset}
                </button>
              )}
            </div>
            {name ? (
              <>
                <span key="name" className="mk pf-board-name">
                  <span className="pf-chalk-line">{name[0]}</span>
                  <span className="pf-chalk-line">{name[1]}</span>
                </span>
                <span key="recipe" className="pf-board-recipe">
                  {picks.map((id) => (
                    <em key={id} style={{ "--c": binOf(id).liquid } as CSSProperties}>
                      {binOf(id).label}
                    </em>
                  ))}
                </span>
                <span key="tags" className="pf-board-tags">
                  {picks.map((id) => (
                    <i key={id}>{binOf(id).tag}</i>
                  ))}
                </span>
                <span key="price" className="pf-board-price">
                  <b>{rupee(price)}</b>
                  <small>300 ml · ~{blendKcal(picks)} kcal</small>
                </span>
                <button key="add" type="button" className={`pf-btn pf-btn-tomato ${added ? "is-added" : ""}`} onClick={addToBag}>
                  {added ? (
                    "✓ Added to bag"
                  ) : (
                    <>
                      Add to bag <Arrow />
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <span key="wait" className="mk pf-board-name pf-board-wait">
                  <span className="pf-chalk-line">{picks.length === 0 ? "Pick three" : `Pick ${3 - picks.length}`}</span>
                  <span className="pf-chalk-line">{picks.length === 0 ? "fruits" : "more"}</span>
                </span>
                <span className="pf-board-slots" aria-label={`${picks.length} of 3 chosen`}>
                  {[0, 1, 2].map((i) => {
                    const id = picks[i];
                    return (
                      <span key={i} className={`pf-board-slot ${id ? "is-on" : ""}`}>
                        {id ? <Fruit name={id} /> : <span>{i + 1}</span>}
                      </span>
                    );
                  })}
                </span>
                <span key="count" className="pf-board-hint">
                  {picks.length === 0 ? `From ${rupee(FROM)} · priced by what you pick` : `${picks.length} of 3 in the bottle · ${rupee(price)} so far`}
                </span>
              </>
            )}
          </div>
          <div className="pf-fly-layer" aria-hidden />
        </div>
      </section>
    </div>
  );
}
