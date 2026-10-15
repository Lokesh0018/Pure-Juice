"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { fruit, ghostWord, goals, img, juiceColor, products, rupee, startGoal, type Juice } from "@/site/content";
import { Bottle, Fruit } from "./bits";
import { clamp, isStatic, onScreen } from "@/site/lib/motion";

// White small text fails contrast on the orange, green and gold bands (lesson 124): use a deep ink there.
const smallInk: Record<Juice, string> = {
  orange: "#2B1306",
  green: "#13260A",
  gold: "#2B2006",
  melon: "#3A1414",
  berry: "#FFFFFF",
  beet: "#FFFFFF",
};
const props: Record<Juice, [string, string, string]> = {
  orange: ["orange", "orange-half", "citrus-leaves"],
  berry: ["strawberry", "apple-red", "mint"],
  green: ["apple-green", "cucumber", "mint"],
  beet: ["beet", "carrot", "ginger"],
  gold: ["pineapple", "lemon-half", "mint"],
  melon: ["lime-half", "mint", "cucumber"],
};
const ADVANCE = 4000; // ms between automatic flavour changes while the band is on screen
const PAUSE_AFTER_CLICK = 8000;

/**
 * PS03 · full-colour flavour stage (giant faded flavour name, hand-lettered goal word, counter) + goal chips on top
 * + 4 kraft price-tag cards. M543: a chip click (or the 4 s auto-advance) wipes the next colour in from the right
 * edge behind the content; the name, copy and bottle swap whole, the cards re-enter one by one (X38, tiles never
 * reflow, lesson 52) and a burst of that flavour's fruit pieces flies out. Scroll: the ghost word drifts sideways and
 * the bottle rises. The travelling orange lands on the featured-orange spot and hops along the card tops.
 */
export default function FlavourStage() {
  const [goalId, setGoalId] = useState<string>(startGoal);
  const [base, setBase] = useState<string>(startGoal); // colour under the wipe
  const root = useRef<HTMLElement>(null);
  const lastClick = useRef(0);
  const gi = goals.findIndex((g) => g.id === goalId);
  const goal = goals[gi];
  const lead = products[goal.lead];
  const color = juiceColor[lead.juice];
  const baseColor = juiceColor[products[goals.find((g) => g.id === base)!.lead].juice];
  const [pa, pb, pc] = props[lead.juice];

  const choose = (id: string) => {
    lastClick.current = performance.now();
    setGoalId(id);
  };

  // scroll: ghost drift + bottle rise; time: auto-advance while the band fills most of the screen
  useEffect(() => {
    if (isStatic()) return;
    const el = root.current!;
    const ghost = el.querySelector<HTMLElement>(".pf-ghost")!;
    const art = el.querySelector<HTMLElement>(".pf-flavour-art")!;
    const tick = () => {
      if (!onScreen(el)) return;
      const r = el.getBoundingClientRect();
      const p = clamp((window.innerHeight - r.top) / (window.innerHeight + r.height));
      gsap.set(ghost, { x: 160 - 360 * p });
      gsap.set(art, { y: 90 - 180 * p });
    };
    gsap.ticker.add(tick);
    const timer = window.setInterval(() => {
      const r = el.getBoundingClientRect();
      const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (visible < window.innerHeight * 0.55 || performance.now() - lastClick.current < PAUSE_AFTER_CLICK) return;
      setGoalId((g) => goals[(goals.findIndex((x) => x.id === g) + 1) % goals.length].id);
    }, ADVANCE);
    return () => {
      gsap.ticker.remove(tick);
      clearInterval(timer);
    };
  }, []);

  // the pour edge above this band takes its current colour
  useEffect(() => {
    document.documentElement.style.setProperty("--pf-band", baseColor);
  }, [baseColor]);

  // each change: the colour wipe + a burst of fruit pieces
  useEffect(() => {
    if (isStatic() || goalId === base) return;
    const el = root.current!;
    const wipe = el.querySelector<HTMLElement>(".pf-wipe")!;
    const burst = el.querySelector<HTMLElement>(".pf-burst")!;
    const tl = gsap
      .timeline({ onComplete: () => setBase(goalId) })
      .fromTo(wipe, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 0.8, ease: "power3.inOut" });
    const pieces: HTMLImageElement[] = [];
    const names = props[products[goals.find((g) => g.id === goalId)!.lead].juice];
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("img");
      p.src = fruit(names[i % 3]);
      p.className = "pf-burst-piece";
      const size = 26 + ((i * 37) % 26);
      Object.assign(p.style, { width: `${size}px`, height: `${size}px` });
      burst.appendChild(p);
      pieces.push(p);
      const a = (i / 12) * Math.PI * 2 + 0.3;
      const d = 170 + ((i * 53) % 110);
      gsap.fromTo(
        p,
        { x: 0, y: 0, scale: 0.92, autoAlpha: 1, rotate: 0 },
        {
          x: Math.cos(a) * d,
          y: Math.sin(a) * d * 0.8 - 40,
          rotate: (i % 2 ? 1 : -1) * 140,
          scale: 0.94,
          autoAlpha: 0,
          duration: 0.95,
          ease: "power3.out",
          delay: 0.3,
          onComplete: () => p.remove(),
        },
      );
    }
    return () => {
      tl.kill();
      pieces.forEach((p) => p.remove());
    };
  }, [goalId, base]);

  return (
    <section
      id="flavours"
      ref={root}
      className="pf-flavours pf-life"
      data-section="flavours"
      style={{ "--band": baseColor, "--wipe": color, "--band-small": smallInk[lead.juice] } as CSSProperties}
      data-record-time="1.5"
      data-record-hold="1.2"
      data-record-offset="-60"
      data-record-label="Flavours: click Energy"
    >
      <div className="pf-wipe" aria-hidden />
      <div className="pf-stage">
        <div className="pf-chips" role="tablist" aria-label="Shop by goal">
          {goals.map((g) => (
            <button
              key={g.id}
              type="button"
              role="tab"
              aria-selected={g.id === goalId}
              className={`pf-chip ${g.id === goalId ? "is-on" : ""}`}
              onClick={() => choose(g.id)}
              {...(g.id === "energy" ? { "data-hover-demo": "click", "data-hover-label": "Energy chip" } : {})}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="pf-ghost font-display" aria-hidden>
          <span key={lead.juice} className="pf-swap">
            {ghostWord[lead.juice]}
          </span>
        </div>

        <div key={`copy-${goalId}`} className="pf-flavour-copy pf-swap">
          <p className="pf-count font-display">
            {String(gi + 1).padStart(2, "0")} / {String(goals.length).padStart(2, "0")}
          </p>
          <p className="pf-flavour-word mk">{goal.label}</p>
          <h2 className="pf-h2 font-display">
            {lead.name.split(" ").map((w) => (
              <span key={w} className="pf-line">
                {w}
              </span>
            ))}
          </h2>
          <p className="pf-flavour-desc">{lead.blurb}</p>
          <div className="pf-flavour-buy">
            <span className="mk pf-flavour-price">{rupee(lead.price)}</span>
            <button
              type="button"
              className="pf-btn pf-btn-paper"
              onClick={() => window.dispatchEvent(new CustomEvent("pf:add", { detail: { id: lead.id } }))}
            >
              Add to bag
            </button>
          </div>
        </div>

        <div className="pf-flavour-art" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={`splash-${lead.juice}`} src={img(`splash-${lead.juice}`)} alt="" className="pf-splash pf-swap" />
          <Bottle key={`bottle-${lead.juice}`} juice={lead.juice} word={lead.word} className="pf-flavour-bottle pf-swap" />
          <Fruit name={pa} className="pf-fprop pf-fprop-a pf-traveller-slot" />
          <Fruit name={pb} className="pf-fprop pf-fprop-b" />
          <Fruit name={pc} className="pf-fprop pf-fprop-c" />
          <span className="pf-orange-spot" data-orange-spot aria-hidden />
          <div className="pf-burst" />
        </div>

        <ul className="pf-tags">
          {goal.cards.map((id, i) => {
            const p = products[id];
            return (
              <li
                key={`${goalId}-${i}`}
                className={`pf-tag pf-tag-in ${p.goal === goal.label ? "is-match" : ""}`}
                style={{ animationDelay: `${i * 0.07}s` }}
                data-cursor="Shop"
                data-hop={i}
                {...(i === 0 ? { "data-hover-demo": "", "data-hover-hold": "0.8", "data-hover-label": "Price tag" } : {})}
              >
                <span className="pf-tag-hole" aria-hidden />
                <span className="pf-tag-text">
                  <b className="font-display">{p.name}</b>
                  <small>
                    {p.goal} · {p.ml} ml
                  </small>
                </span>
                <span className="mk pf-tag-price">{rupee(p.price)}</span>
                <Bottle juice={p.juice} className="pf-tag-bottle" />
                <span className="pf-tag-add">+ Add</span>
              </li>
            );
          })}
        </ul>
      </div>
      <span
        className="pf-marker"
        style={{ bottom: 0 }}
        data-record-time="0.9"
        data-record-hold="0.8"
        data-record-align="bottom"
        data-record-label="Flavours: hover a tag"
        aria-hidden
      />
    </section>
  );
}
