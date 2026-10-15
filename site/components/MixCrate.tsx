"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, loadPlugin } from "@/lib/gsap";
import { img, mix, rupee } from "@/site/content";
import { isStatic, onScreen, pinProgress } from "@/site/lib/motion";
import { Arrow, Fruit } from "./bits";

// Bottle geometry (% of its height): cap 0–15, liquid from the shoulder (15.5) to the base. The stills have their
// label painted out; a thin printed band (56–68 %) sits on top, so both layer lines (42 %, 70 %) stay in view.
// Each layer runs from its wavy top to the base; lower layers sit above higher ones, so their waves show.
const LAYER_TOP = [70, 42, 15.5]; // 1 bottom · 2 middle · 3 shoulder
const FILL_TOP = [100, 70, 42, 15.5]; // fill line after 0 / 1 / 2 / 3 picks
const SUFFIX = ["Kick", "Glow", "Rush", "Zing", "Bloom", "Snap", "Splash", "Dash", "Pop"];
const PIN = 750; // px of scroll the stage stays pinned (record: 5 short stops inside it, each hold ≤ 1.2 s)
// Scroll drives the demo blend (forward and back): pin progress at which Orange, Carrot, Ginger are picked.
// The travelling orange sits in cell 1 until the first threshold, then hands over to the Orange pick.
export const PICK_AT = [0.14, 0.36, 0.58];

function blendName(picks: string[]) {
  if (picks.join() === mix.picks.join()) return mix.blend.name;
  const first = mix.bins.find((b) => b.id === picks[0])!;
  const idx = picks.reduce((n, p) => n + mix.bins.findIndex((b) => b.id === p), 0) % SUFFIX.length;
  return [first.label.split(" ").pop()!, SUFFIX[idx]];
}

/**
 * PS10 · Mix your own (signature, M716 crate-to-bottle fill). A wooden crate of 9 fruit bins (picks numbered 1-2-3),
 * the bottle fills layer by layer, a chalkboard names the blend (chalk writing, M110 supporting) and chalks the price.
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
    const flyer = src.cloneNode() as HTMLImageElement;
    flyer.className = "pf-flyer";
    Object.assign(flyer.style, { left: `${a.left - h.left}px`, top: `${a.top - h.top}px`, width: `${a.width}px`, height: `${a.height}px` });
    host.appendChild(flyer);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height * 0.1 - (a.top + a.height / 2);
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
      .fromTo(root.querySelector(".pf-board-price"), { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" }, "-=0.15")
      .fromTo(root.querySelector(".pf-board .pf-btn"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35 }, "-=0.2");
    return () => {
      tl.kill();
    };
  }, [full]);

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
      if (!onScreen(root)) return;
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
            <h2 className="pf-h2 font-display">
              <span className="pf-line">{mix.title[0]}</span>
              <span className="pf-line">{mix.title[1]}</span>
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
                      style={{ "--c": bin.liquid, top: `${LAYER_TOP[i]}%`, zIndex: 10 - i } as CSSProperties}
                    />
                  );
                })}
              </span>
              {picks.slice(1).map((id, i) => (
                <span key={`line-${id}`} className="pf-wave-line" style={{ top: `${LAYER_TOP[i]}%` }} />
              ))}
            </span>
            <span className="pf-mix-label" aria-hidden>
              <span className="pf-label-brand">Pure Juice</span>
              <span className="pf-mix-label-word">Your blend</span>
            </span>
          </div>

          <div className="pf-board">
            <span className="pf-board-label">Your blend</span>
            {name ? (
              <>
                <span key="name" className="mk pf-board-name">
                  <span className="pf-chalk-line">{name[0]}</span>
                  <span className="pf-chalk-line">{name[1]}</span>
                </span>
                <span key="recipe" className="mk pf-board-recipe">
                  {picks.map((p) => mix.bins.find((b) => b.id === p)!.label.toLowerCase()).join(" + ")}
                </span>
                <span key="price" className="mk pf-board-price">{rupee(mix.blend.price)}</span>
                <button key="add" type="button" className="pf-btn pf-btn-tomato">
                  Add to bag <Arrow />
                </button>
              </>
            ) : (
              <>
                <span key="wait" className="mk pf-board-name pf-board-wait">
                  <span className="pf-chalk-line">Pick {3 - picks.length}</span>
                  <span className="pf-chalk-line">more</span>
                </span>
                <span key="count" className="mk pf-board-recipe">{picks.length} of 3 in the bottle</span>
                <span className="pf-board-dots" aria-hidden>
                  {[0, 1, 2].map((i) => (
                    <i key={i} className={i < picks.length ? "is-on" : ""} />
                  ))}
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
