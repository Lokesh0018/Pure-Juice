"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { hero, juiceColor, products, rupee, type Juice } from "@/site/content";
import { clamp, isStatic, onLift, onScreen } from "@/site/lib/motion";
import { Arrow, Bottle, Fruit, Stamp } from "./bits";

// The signature blends featured in the spotlight switcher, in cycle order (Sunrise → Berry → Guava → Mango → Beet → Melon)
const SPOTLIGHT_FLAVOURS = ["sunrise", "berry", "green", "gold", "beet", "melon"] as const;
const CYCLE = 3200; // ms per bottle while the hero is on screen
const PAUSE_AFTER_CLICK = 7000; // ms a chosen flavour holds before the cycle resumes

// fruits around the bottle per flavour: [main (on the travelling orange's spot), lower right, upper left, upper right]
const HERO_FRUITS: Record<string, [string, string, string, string]> = {
  sunrise: ["orange", "orange-half", "citrus-leaves", "mint"],
  berry: ["strawberry", "apple-red", "mint", "strawberry"],
  green: ["gauva", "cucumber", "mint", "spinach"],
  gold: ["mango", "pineapple", "mint", "lemon-half"],
  beet: ["beet", "carrot", "ginger", "mint"],
  melon: ["lime-half", "cucumber", "mint", "lime-half"],
};

export default function BottleWallHero() {
  const root = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>("sunrise");
  const [added, setAdded] = useState(false);
  const addTimer = useRef(0);
  const activeProduct = products[activeId] ?? products.sunrise;

  const [cycleKey, setCycleKey] = useState(0); // restarts the chip timer bar
  const [paused, setPaused] = useState(false);

  const handleSelectFlavour = (id: string) => {
    setActiveId(id);
    setPaused(true);
    setCycleKey((k) => k + 1);
  };

  // continuous bottle change: next flavour every CYCLE ms while the hero is on screen; a click holds for a while
  useEffect(() => {
    if (isStatic()) return;
    const t = window.setTimeout(
      () => {
        if (paused) {
          setPaused(false);
        } else {
          const r = root.current!.getBoundingClientRect();
          if (r.bottom > window.innerHeight * 0.4) {
            setActiveId((cur) => SPOTLIGHT_FLAVOURS[(SPOTLIGHT_FLAVOURS.indexOf(cur as (typeof SPOTLIGHT_FLAVOURS)[number]) + 1) % SPOTLIGHT_FLAVOURS.length]);
          }
        }
        setCycleKey((k) => k + 1);
      },
      paused ? PAUSE_AFTER_CLICK : CYCLE,
    );
    return () => clearTimeout(t);
  }, [cycleKey, paused]);


  const handleQuickAdd = () => {
    window.dispatchEvent(new CustomEvent("pf:add", { detail: { id: activeId, size: "single" } }));
    setAdded(true);
    clearTimeout(addTimer.current);
    addTimer.current = window.setTimeout(() => setAdded(false), 1600);
  };

  useEffect(() => () => clearTimeout(addTimer.current), []);

  // fit the 1440 × 900 design to the window (width and height below the nav); layout, so it runs in ?static=1 too
  useEffect(() => {
    const el = root.current!;
    const fit = () =>
      el.style.setProperty("--fit", String(Math.min(1, document.documentElement.clientWidth / 1440, (window.innerHeight - 76) / (900 - 76))));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    if (isStatic()) return;
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const depth1 = q("[data-depth='1']");
    const depth2 = q("[data-depth='2']");
    const depth3 = q("[data-depth='3']");
    const copy = q(".pf-hero-copy")[0];
    const stageBox = q(".pf-hero-centerpiece")[0];

    gsap.set(q(".pf-line-in"), { yPercent: 110 });
    gsap.set(q("[data-hero-in]"), { autoAlpha: 0, y: 26 });

    let introStart = -1;
    const offLift = onLift(() => {
      introStart = performance.now();
      gsap
        .timeline()
        .to(q(".pf-line-in"), { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.12 })
        .to(q("[data-hero-in]"), { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 0.35);
    });

    const tick = () => {
      if (!onScreen(el)) return;
      const s = clamp(window.scrollY / el.offsetHeight);
      gsap.set(depth1, { y: -50 * s });
      gsap.set(depth2, { y: -110 * s });
      gsap.set(depth3, { y: -180 * s });
      gsap.set(copy, { y: -70 * s });
      if (stageBox) gsap.set(stageBox, { y: -40 * s });
    };
    gsap.ticker.add(tick);

    // Spotlight 3D tilt on mouse movement across the hero section
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = clamp((e.clientX - (r.left + r.width * 0.7)) / (r.width * 0.35), -1, 1);
      const dy = clamp((e.clientY - (r.top + r.height * 0.5)) / (r.height * 0.5), -1, 1);
      el.style.setProperty("--hero-tilt-x", `${(-dy * 7).toFixed(2)}deg`);
      el.style.setProperty("--hero-tilt-y", `${(dx * 8).toFixed(2)}deg`);
    };
    const leave = () => {
      el.style.setProperty("--hero-tilt-x", "0deg");
      el.style.setProperty("--hero-tilt-y", "0deg");
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);

    return () => {
      offLift();
      gsap.ticker.remove(tick);
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <section id="top" ref={root} className="pf-hero pf-hero-spotlight" data-section="hero" data-record-time="0" data-record-hold="1.4" data-record-label="Hero intro">
      <div className="pf-stage">
        {/* Ambient atmospheric backdrop */}
        <div className="pf-hero-art" aria-hidden>
          <span data-depth="1" className="pf-depth">
            <span
              className="pf-hero-glow"
              style={{
                "--glow-c": juiceColor[activeProduct.juice] ?? "#E9741C",
              } as CSSProperties}
            />
          </span>
          <span data-depth="2" className="pf-depth">
            <span className="pf-hero-pedestal" />
          </span>

          {/* Floating Organic Botanical Elements */}
          <span data-depth="3" className="pf-depth">
            {(() => {
              const [main, low, upL, upR] = HERO_FRUITS[activeId] ?? HERO_FRUITS.sunrise;
              return (
                <>
                  <span key={`ul-${activeId}`} className="pf-hero-fruit-swap">
                    <Fruit name={upL} className={`pf-hero-prop pf-hero-leaf-a pf-hf-${upL}`} />
                  </span>
                  <span key={`ur-${activeId}`} className="pf-hero-fruit-swap">
                    <Fruit name={upR} className={`pf-hero-prop pf-hero-leaf-b pf-hf-${upR}`} />
                  </span>
                  <span key={`main-${activeId}`} className="pf-hero-fruit-swap">
                    <Fruit name={main} className={`pf-hero-prop pf-hero-orange pf-hf-${main} ${activeId === "sunrise" ? "pf-traveller-slot" : ""}`} />
                  </span>
                  <span key={`low-${activeId}`} className="pf-hero-fruit-swap">
                    <Fruit name={low} className={`pf-hero-prop pf-hero-half pf-hf-${low}`} />
                  </span>
                </>
              );
            })()}
          </span>
        </div>

        {/* Left Editorial Copy & Actions */}
        <div className="pf-hero-copy">
          <div className="pf-hero-eyebrow-pill" data-hero-in>
            <span className="pf-live-dot" />
            <span>Today&apos;s Press · Fresh Batch at Dawn</span>
          </div>

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

          {/* Interactive Botanical Flavour Switcher Chips */}
          <div className="pf-hero-switcher" data-hero-in>
            <span className="pf-hero-switcher-label">Choose your press</span>
            <div className="pf-hero-chips" role="tablist" aria-label="Hero juice flavour switcher">
              {SPOTLIGHT_FLAVOURS.map((id) => {
                const p = products[id];
                const isActive = id === activeId;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`pf-hero-chip ${isActive ? "is-active" : ""}`}
                    onClick={() => handleSelectFlavour(id)}
                    style={{
                      "--chip-accent": juiceColor[p.juice],
                    } as CSSProperties}
                  >
                    <span className="pf-hero-chip-dot" />
                    <span>{p.word}</span>
                    {isActive && (
                      <i
                        key={cycleKey}
                        className={`pf-hero-chip-timer ${paused ? "is-held" : ""}`}
                        style={{ animationDuration: `${paused ? PAUSE_AFTER_CLICK : CYCLE}ms` }}
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="pf-hero-cta" data-hero-in>
            <button
              type="button"
              className={`pf-btn ${added ? "pf-btn-ink" : "pf-btn-tomato"}`}
              onClick={handleQuickAdd}
              data-magnetic
            >
              {added ? "Added to Bag ✓" : `Order Fresh · ${rupee(activeProduct.price)}`} <Arrow />
            </button>
            <a href="#cleanses" className="pf-btn pf-btn-line">
              {hero.secondary}
            </a>
          </div>

          <div className="pf-hero-badges" data-hero-in>
            {hero.badges.map((b) => (
              <Stamp key={b}>{b}</Stamp>
            ))}
          </div>

        </div>

        {/* Centerpiece 3D Stage Right */}
        <div className="pf-hero-centerpiece pf-hero-stage-in">
          <div className="pf-spotlight-disc" />

          {/* Master Spotlight Bottle */}
          <div className="pf-spotlight-bottle-wrap pf-spotlight-stack">
            {SPOTLIGHT_FLAVOURS.map((id) => (
              <Bottle
                key={id}
                juice={products[id].juice}
                word={products[id].word}
                className={`pf-spotlight-bottle ${id === activeId ? "is-on" : ""}`}
                eager
              />
            ))}
          </div>

          {/* Floating Live Taste Profile Micro-Card */}
          <div className="pf-spotlight-card pf-spotlight-card-taste">
            <div className="pf-spotlight-card-top">
              <span className="pf-spotlight-tag">{activeProduct.goal}</span>
              <span className="pf-spotlight-rating">★ {activeProduct.rating.toFixed(1)}</span>
            </div>
            <p className="pf-spotlight-name font-display">{activeProduct.name}</p>
            <p className="pf-spotlight-notes">{activeProduct.notes}</p>
            <div className="pf-spotlight-bars">
              <div className="pf-spotlight-bar-row">
                <span>Sweet</span>
                <div className="pf-spotlight-track">
                  <i style={{ width: `${(activeProduct.taste.sweet / 5) * 100}%` }} />
                </div>
              </div>
              <div className="pf-spotlight-bar-row">
                <span>Tangy</span>
                <div className="pf-spotlight-track">
                  <i style={{ width: `${(activeProduct.taste.tangy / 5) * 100}%` }} />
                </div>
              </div>
              <div className="pf-spotlight-bar-row">
                <span>Zing</span>
                <div className="pf-spotlight-track">
                  <i style={{ width: `${(activeProduct.taste.zing / 5) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Fresh Quality Seal Badge */}
          <div className="pf-spotlight-card pf-spotlight-card-seal" aria-hidden>
            <span className="pf-seal-cal">{activeProduct.nutrition.kcal} kcal</span>
            <span className="pf-seal-note">100% Raw · Unfiltered</span>
            <span className="pf-seal-price">{rupee(activeProduct.price)}</span>
          </div>
        </div>
      </div>

      {/* Record stop marker */}
      <span className="pf-marker" style={{ top: 150 }} data-record-time="0.45" data-record-hold="0.9" data-record-label="Hero hover" aria-hidden />
    </section>
  );
}

