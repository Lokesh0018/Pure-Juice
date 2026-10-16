"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { flavours, ghostWord, goals, juiceColor, products, rupee, startGoal, type Juice } from "@/site/content";
import { Bottle, Fruit } from "./bits";
import { clamp, isCompact, isStatic, onScreen } from "@/site/lib/motion";

// White small text fails contrast on the orange, green and gold bands (lesson 124): use a deep ink there.
const smallInk: Record<Juice, string> = {
  orange: "#2B1306",
  green: "#13260A",
  gold: "#2B2006",
  melon: "#3A1414",
  berry: "#FFFFFF",
  beet: "#FFFFFF",
};

/** small goal icons (24 px grid, currentColor) */
function GoalIcon({ name }: { name: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden {...p}>
      {name === "leaf" && <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Zm0 0 7-7" />}
      {name === "shield" && <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />}
      {name === "bolt" && <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />}
      {name === "sparkle" && <path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" />}
    </svg>
  );
}
// The section is designed at 1440 × 960 (content from the header at 96 px to the cards' bottom + padding). It is
// scaled to fit the window below the fixed nav (and its width), and its height follows, so it always fits one screen.
const DESIGN_W = 1440;
const DESIGN_H = 960;
const NAV_H = 76;
// three fruits shown around the bottle, per flavour. The first sits on the travelling orange's spot: on the orange
// steps the traveller itself is that fruit; on the other steps this flavour's own fruit (mango, strawberry, guava) shows.
const props: Record<Juice, [string, string, string]> = {
  orange: ["orange", "orange-half", "citrus-leaves"],
  berry: ["strawberry", "apple-red", "mint"],
  green: ["gauva", "cucumber", "mint"],
  beet: ["beet", "carrot", "ginger"],
  gold: ["mango", "lemon-half", "mint"],
  melon: ["lime-half", "mint", "cucumber"],
};
const STEPS = flavours.sequence;
const PIN = 350 * STEPS.length; // px pinned: ~350 px of scroll per step

/**
 * PS03 · "Botanicals": full-colour flavour stage. Header row (title + goal chips), then three columns (featured
 * flavour copy with price and actions · bottle · "Inside every bottle" blend list), then 4 product cards. Pinned: the scroll steps through the goals (a chip click holds until you scroll on). M543: each change wipes the next colour in from the right
 * edge behind the content; the name, copy and bottle swap whole, the cards re-enter one by one (X38, tiles never
 * reflow, lesson 52) and a burst of that flavour's fruit pieces flies out. Scroll: the ghost word drifts sideways and
 * the bottle rises. The travelling orange lands on the featured-orange spot and hops along the card tops.
 */
export default function FlavourStage() {
  const [goalId, setGoalId] = useState<string>(startGoal);
  const [base, setBase] = useState<string>(startGoal); // colour under the wipe
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const manual = useRef<number | null>(null); // scrollY of a chip click: the click holds until the visitor scrolls on
  const gi = goals.findIndex((g) => g.id === goalId);
  const goal = goals[gi];
  const lead = products[goal.lead];
  const color = juiceColor[lead.juice];
  const baseColor = juiceColor[products[goals.find((g) => g.id === base)!.lead].juice];
  const [pa, pb, pc] = props[lead.juice];
  const add = (id: string) => window.dispatchEvent(new CustomEvent("pf:add", { detail: { id } }));

  const choose = (id: string) => {
    manual.current = window.scrollY;
    setGoalId(id);
  };

  // scroll: ghost drift + bottle rise; time: auto-advance while the band fills most of the screen
  useEffect(() => {
    if (isStatic()) return;
    const el = root.current!;
    const ghost = el.querySelector<HTMLElement>(".pf-ghost")!;
    const wrap = pin.current!;
    let shown = -1;
    const tick = () => {
      if (!onScreen(el) || isCompact()) return;
      // pin progress 0 → 1 over the pinned scroll; each step of the sequence owns an equal slice of it
      const w = wrap.getBoundingClientRect();
      const span = Math.max(1, wrap.offsetHeight - el.offsetHeight);
      const p = clamp(-w.top / span);
      const f = p * STEPS.length;
      const i = Math.min(STEPS.length - 1, Math.floor(f));
      gsap.set(ghost, { x: 160 - 360 * p });
      el.style.setProperty("--seg", String(i === STEPS.length - 1 && p >= 1 ? 1 : clamp(f - i)));
      if (manual.current !== null && Math.abs(window.scrollY - manual.current) < 60) return; // a chip click holds
      manual.current = null;
      if (i !== shown) {
        shown = i;
        setGoalId(STEPS[i]);
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  // fit to the window (runs in ?static=1 too: it is layout, not motion)
  useEffect(() => {
    const fit = () => {
      const f = Math.min(1, (window.innerHeight - NAV_H) / (DESIGN_H - NAV_H), document.documentElement.clientWidth / DESIGN_W);
      pin.current!.style.setProperty("--fit", String(f));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // the pour edge above this band takes its current colour
  useEffect(() => {
    document.documentElement.style.setProperty("--pf-band", baseColor);
  }, [baseColor]);

  // each change: the colour wipe (the bottle cross-fades on its own; no fruit pieces)
  useEffect(() => {
    if (isStatic() || goalId === base) return;
    const wipe = root.current!.querySelector<HTMLElement>(".pf-wipe")!;
    const tl = gsap
      .timeline({ onComplete: () => setBase(goalId) })
      .fromTo(wipe, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 0.8, ease: "power3.inOut" });
    return () => {
      tl.kill();
    };
  }, [goalId, base]);

  return (
    <div ref={pin} className="pf-pin pf-flv-pin" style={{ "--pin": `${PIN}px` } as CSSProperties}>
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
        <div className="pf-flv-head">
          <p className="pf-flv-title">
            <span className="pf-flv-eyebrow">{flavours.eyebrow}</span>
            <span>{flavours.heading}</span>
          </p>
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
              <GoalIcon name={g.icon} />
              {g.label}
              {g.id === goalId && <i className="pf-chip-timer" aria-hidden />}
            </button>
          ))}
        </div>
        </div>

        <div className="pf-ghost font-display" aria-hidden>
          <span key={lead.juice} className="pf-swap">
            {ghostWord[lead.juice]}
          </span>
        </div>

        <div key={`copy-${goalId}`} className="pf-flavour-copy pf-swap">
          <p className="pf-flavour-word mk">{goal.label}</p>
          <h2 className="pf-flv-name font-display">{lead.name}</h2>
          <p className="pf-flv-rate">
            <span aria-hidden>★</span> <b>{lead.rating.toFixed(1)}</b> · {lead.reviews.toLocaleString("en-IN")} reviews
          </p>
          <p className="pf-flavour-desc">{lead.blurb}</p>
          <p className="pf-flv-best">
            {lead.bestFor.map((b) => (
              <em key={b}>{b}</em>
            ))}
            <em>{lead.nutrition.kcal} kcal</em>
          </p>
          <div className="pf-flavour-buy">
            <span className="pf-flavour-price">{rupee(lead.price)}</span>
            <button type="button" className="pf-btn pf-btn-paper" onClick={() => add(lead.id)}>
              Add to bag
            </button>
            <a href="#product" className="pf-flv-details">
              {flavours.details}
            </a>
          </div>
        </div>

        <aside key={`inside-${goalId}`} className="pf-flv-inside pf-swap" aria-label={`${flavours.inside}: ${lead.name}`}>
          <p className="pf-flv-inside-title">{flavours.inside}</p>
          <ul>
            {lead.inside.map((f) => (
              <li key={f.label}>
                <Fruit name={f.fruit} />
                <span className="pf-flv-inside-text">
                  <span>{f.label}</span>
                  <span className="pf-flv-bar">
                    <i style={{ width: `${f.pct}%` }} />
                  </span>
                </span>
                <b>{f.pct}%</b>
              </li>
            ))}
          </ul>
        </aside>

        <div className="pf-flavour-art" aria-hidden>
          <span className="pf-flv-halo" />
          <Bottle key={`bottle-${lead.juice}`} juice={lead.juice} word={lead.word} className="pf-flavour-bottle pf-swap" />
          <Fruit key={`spot-${pa}`} name={pa} className={`pf-fprop pf-fprop-a pf-swap ${lead.juice === "orange" ? "pf-traveller-slot" : `pf-fprop-hero pf-fprop-${pa}`}`} />
          <Fruit name={pb} className="pf-fprop pf-fprop-b" />
          <Fruit name={pc} className="pf-fprop pf-fprop-c" />
          <span className="pf-orange-spot" data-orange-spot aria-hidden />
        </div>

        <ul className="pf-tags">
          {flavours.cards.map((id, i) => {
            const p = products[id];
            const g = goals.find((x) => x.lead === id); // the goal this flavour leads (same word as its chip)
            return (
              <li
                key={id}
                onClick={(e) => {
                  if (g && !(e.target as HTMLElement).closest("button")) choose(g.id);
                }}
                aria-current={id === goal.lead ? "true" : undefined}
                className={`pf-tag pf-tag-in ${id === goal.lead ? "is-match" : ""}`}
                style={{ animationDelay: `${i * 0.07}s` }}
                data-cursor="Shop"
                data-hop={i}
                {...(i === 0 ? { "data-hover-demo": "", "data-hover-hold": "0.8", "data-hover-label": "Price tag" } : {})}
              >
                <span className="pf-card-media" style={{ "--c": juiceColor[p.juice] } as CSSProperties}>
                  <Bottle juice={p.juice} className="pf-card-bottle" />
                </span>
                <span className="pf-card-body">
                  <span className="pf-card-top">
                    <em className="pf-card-goal">{g ? g.label : p.goal}</em>
                    <span className="pf-card-rate">
                      ★ {p.rating.toFixed(1)} <small>({p.reviews.toLocaleString("en-IN")})</small>
                    </span>
                  </span>
                  <b className="pf-card-name font-display">{p.name}</b>
                  <small className="pf-card-notes">{p.notes}</small>
                  <span className="pf-card-foot">
                    <span className="pf-card-price">{rupee(p.price)}</span>
                    <button type="button" className="pf-card-add" onClick={() => add(p.id)} aria-label={`Add ${p.name} to bag`}>
                      + {flavours.add}
                    </button>
                  </span>
                </span>
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
    </div>
  );
}
