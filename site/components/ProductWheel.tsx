"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { juiceColor, pdp, products, rupee } from "@/site/content";
import { clamp, isStatic, lerp, onScreen, pinProgress, smooth } from "@/site/lib/motion";
import { Arrow, Bottle, Fruit, RollNumber, Stamp } from "./bits";

const PIN = 700; // px pinned
const STEP_END = 0.72; // the drum reaches its last flavour here; the rest of the pin is for size + Add to bag
const SMALL_H = 58; // px per wheel row when it is not the current flavour
const BIG_H = 168; // px for the current flavour (two big lines)
const ANCHOR = 330; // px from the wheel top where the current flavour's centre sits
const FIRST = 0; // drum starts on Berry Bright
const LAST = pdp.wheel.indexOf(pdp.start); // and lands on Sunrise Orange

const mixHex = (a: string, b: string, t: number) => gsap.utils.interpolate(a, b, t) as string;

/**
 * PS11 · flavour names on a curved wheel left (M267 drum, stepped by scroll), bottle on a colour disc centre,
 * fruit cut-outs and an "inside" row, buy box right (size rows, Add to bag, printed nutrition label).
 * Pinned (CSS sticky). The drum position, the bottle cross-fade (pixel-aligned stills) and the disc colour all follow
 * the scroll continuously (never stepped, lesson 10); the name, inside row and buy box swap whole (lesson 100).
 */
export default function ProductWheel() {
  const [id, setId] = useState(pdp.start);
  const [size, setSize] = useState(pdp.sizes[0].id);
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const manual = useRef<{ q: number; y: number } | null>(null);
  const p = products[id];
  const s = pdp.sizes.find((x) => x.id === size)!;

  // adds exactly what is selected: flavour + size
  const add = () => window.dispatchEvent(new CustomEvent("pf:add", { detail: { id, size } }));

  useEffect(() => {
    const root = stage.current!;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".pf-wheel li"));
    const bottles = Array.from(root.querySelectorAll<HTMLElement>("[data-pdp-bottle]"));
    const disc = root.querySelector<HTMLElement>(".pf-disc")!;
    const discNew = root.querySelector<HTMLElement>(".pf-disc-new")!;
    const colors = pdp.wheel.map((w) => mixHex(juiceColor[products[w].juice], "#F6F4EF", 0.72));
    let shown = -1;
    let wipe: gsap.core.Timeline | null = null;

    // Flavour change = one quick pour-wipe from the bottom (never a crossfade, so no muddy in-between colour):
    // the new bottle and the new disc colour rise over the old ones in 0.38 s, and every text (label, title, copy,
    // ingredients, prices, nutrition) switches at the same moment the pour starts. Bottle stills share one mask and
    // a blank kraft band; the single printed label sits above them all, so label and title can never disagree.
    const show = (i: number, instant: boolean) => {
      wipe?.progress(1).kill();
      setId(pdp.wheel[i]);
      const prev = shown;
      shown = i;
      if (instant || prev < 0) {
        bottles.forEach((el, k) => {
          el.style.opacity = k === i ? "1" : "0";
          el.style.clipPath = "none";
          el.style.zIndex = k === i ? "2" : "1";
        });
        disc.style.background = colors[i];
        discNew.style.clipPath = "inset(100% 0 0 0)";
        return;
      }
      const inc = bottles[i];
      bottles.forEach((el, k) => (el.style.zIndex = k === i ? "3" : k === prev ? "2" : "1"));
      inc.style.opacity = "1";
      discNew.style.background = colors[i];
      wipe = gsap
        .timeline({
          onComplete: () => {
            bottles.forEach((el, k) => (el.style.opacity = k === i ? "1" : "0"));
            disc.style.background = colors[i];
            gsap.set(discNew, { clipPath: "inset(100% 0 0 0)" });
          },
        })
        .fromTo(inc, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.38, ease: "power2.inOut" }, 0)
        .fromTo(discNew, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.38, ease: "power2.inOut" }, 0);
    };

    const draw = (q: number) => {
      const w = items.map((_, i) => clamp(1 - Math.abs(i - q)));
      // one name layer at a time: the small line has faded out before the big two-line name fades in
      const big = w.map((v) => smooth(0.56, 0.95, v));
      const small = w.map((v) => 1 - smooth(0.3, 0.54, v));
      const h = w.map((v) => lerp(SMALL_H, BIG_H, smooth(0.12, 0.56, v))); // full height before the big name shows
      const tops: number[] = [];
      h.reduce((acc, v, i) => ((tops[i] = acc), acc + v), 0);
      const i0 = Math.floor(clamp(q, 0, items.length - 1));
      const i1 = Math.min(items.length - 1, i0 + 1);
      const f = q - i0;
      const centre = lerp(tops[i0] + h[i0] / 2, tops[i1] + h[i1] / 2, f);
      items.forEach((el, i) => {
        const d = Math.abs(i - q);
        el.style.transform = `translate(${6 + (2 - Math.min(d, 2)) * 20}px, ${ANCHOR - centre + tops[i]}px)`;
        el.style.setProperty("--w", String(big[i]));
        el.style.setProperty("--s", String(small[i]));
        el.style.opacity = String(clamp(1.25 - d * 0.32, 0.2, 1));
      });
      const near = Math.round(clamp(q, 0, items.length - 1));
      if (near !== shown) show(near, isStatic());
    };

    if (isStatic()) {
      draw(LAST);
      return;
    }
    const tick = () => {
      if (!onScreen(root)) return;
      const pr = pinProgress(pin.current!);
      let q = lerp(FIRST, LAST, clamp(pr / STEP_END));
      const m = manual.current;
      if (m && Math.abs(window.scrollY - m.y) < 40) q = m.q;
      else manual.current = null;
      draw(q);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      wipe?.kill();
    };
  }, []);

  // A click on a name turns the drum to it (until the visitor scrolls on).
  const choose = (i: number) => {
    const from = { q: manual.current?.q ?? pdp.wheel.indexOf(id) };
    manual.current = { q: from.q, y: window.scrollY };
    gsap.to(from, { q: i, duration: 0.6, ease: "power3.inOut", onUpdate: () => manual.current && (manual.current.q = from.q) });
  };

  return (
    <div ref={pin} className="pf-pin" style={{ "--pin": `${PIN}px` } as CSSProperties}>
      <span className="pf-marker" style={{ top: 0 }} data-record-time="1.2" data-record-label="Product arrives (pinned)" aria-hidden />
      <span
        className="pf-marker"
        style={{ top: Math.round(PIN * STEP_END) }}
        data-record-time="1.5"
        data-record-hold="1.0"
        data-record-label="Wheel lands on Sunrise · size click"
        aria-hidden
      />
      <span className="pf-marker" style={{ top: PIN }} data-record-time="0.5" data-record-hold="1.2" data-record-label="Add to bag" aria-hidden />

      <section
        id="product"
        ref={stage}
        className="pf-pdp pf-sticky pf-life"
        data-section="product"
        style={{ "--c": juiceColor[p.juice] } as CSSProperties}
      >
        <div className="pf-stage">
          <ol className="pf-wheel" aria-label="Flavours">
            {pdp.wheel.map((w, i) => (
              <li key={w}>
                <button type="button" className={`pf-wheel-name font-display ${w === id ? "is-on" : ""}`} onClick={() => choose(i)} aria-current={w === id}>
                  <span className="pf-wheel-small">{products[w].name}</span>
                  <span className="pf-wheel-big">{products[w].name}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="pf-disc-wrap" aria-hidden>
            <span className="pf-disc" />
            <span className="pf-disc pf-disc-new" />
            <span className="pf-pdp-bottles">
              {pdp.wheel.map((w, i) => (
                <span key={w} className="pf-pdp-bottle" data-pdp-bottle={i} style={{ opacity: w === pdp.start ? 1 : 0 }}>
                  <Bottle juice={products[w].juice} />
                </span>
              ))}
              {/* one printed label above every bottle still: it always names the flavour in the title */}
              <span className="pf-pdp-label">
                <Bottle juice="empty" word={p.word} labelOnly />
              </span>
              {/* cold water drops sliding slowly down the glass */}
              <span className="pf-drops" aria-hidden>
                {[0, 1, 2, 3, 4].map((k) => (
                  <i key={k} style={{ "--k": k } as CSSProperties} />
                ))}
              </span>
            </span>
            <span key={`props-${id}`} className="pf-swap">
              <Fruit name={p.inside[0].fruit} className="pf-disc-prop pf-disc-prop-a" />
              <Fruit name={p.inside[2].fruit} className="pf-disc-prop pf-disc-prop-b" />
            </span>
          </div>

          <div key={`inside-${id}`} className="pf-inside pf-swap">
            <span className="pf-label-caps">Inside</span>
            {p.inside.map((f) => (
              <div key={f.label} className="pf-inside-item">
                <Fruit name={f.fruit} />
                <span>{f.label}</span>
              </div>
            ))}
          </div>

          <div className="pf-buy">
            <Stamp className="pf-buy-stamp">{pdp.stamp}</Stamp>
            <div key={`title-${id}`} className="pf-swap">
              <h2 className="pf-buy-title font-display">{p.name}</h2>
              <p className="pf-buy-blurb">{p.blurb}</p>
            </div>
            <p className="pf-label-caps">Pick a size</p>
            <div className="pf-sizes" role="radiogroup" aria-label="Size">
              {pdp.sizes.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={x.id === size}
                  className={`pf-size ${x.id === size ? "is-on" : ""}`}
                  onClick={() => setSize(x.id)}
                  {...(x.id === "cleanse" ? { "data-hover-demo": "click", "data-hover-hold": "1.0", "data-hover-label": "3-Day Cleanse size" } : {})}
                >
                  <b className="font-display">{x.label}</b>
                  <span>
                    {x.note} · {rupee(x.id === "single" ? p.price : x.price)}
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="pf-btn pf-btn-tomato pf-btn-block pf-add"
              onClick={add}
              data-magnetic
              data-hover-demo="click"
              data-hover-hold="1.2"
              data-hover-label="Add to bag"
            >
              Add to bag · <RollNumber key={id} value={rupee(s.id === "single" ? p.price : s.price)} /> <Arrow />
            </button>
            <div className="pf-nfl">
              <h3 className="font-display">Nutrition facts</h3>
              <dl key={`nfl-${id}`} className="pf-swap">
                <div>
                  <dt>Per bottle</dt>
                  <dd>{p.ml} ml</dd>
                </div>
                <div>
                  <dt>Calories</dt>
                  <dd>{p.nutrition.kcal}</dd>
                </div>
                <div>
                  <dt>Sugars (natural)</dt>
                  <dd>{p.nutrition.sugar} g</dd>
                </div>
                <div>
                  <dt>Added sugar</dt>
                  <dd>0 g</dd>
                </div>
                <div>
                  <dt>Vitamin C</dt>
                  <dd>{p.nutrition.vitC}</dd>
                </div>
              </dl>
            </div>
            <p className="pf-sample">{pdp.sample}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
