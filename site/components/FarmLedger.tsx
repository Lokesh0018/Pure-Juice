"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { farm, img } from "@/site/content";
import { clamp, isStatic, onScreen, pinProgress } from "@/site/lib/motion";

const PIN = 1200; // px pinned: 5 steps
const N = farm.steps.length;
const pad = (n: number) => String(n).padStart(2, "0");

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}

/**
 * PD07 · "Orchard to bottle": a vertical timeline of 5 timed steps (left) and the photo of the current step (right),
 * with a card on the photo holding the rolling step number, the step word and its time.
 * Pinned (CSS sticky): the pin is split into 5 equal phases. Entering a phase changes everything for it at once: its
 * photo cross-fades in (with a settle-in zoom), the highlight glides to its row (measured, so wrapped or resized rows
 * never misalign), the rail fills to its dot and finished steps get a check. On each step change the digit rolls in 0.3 s inside its own
 * clipped box and the word swaps whole (lessons 85, 100). The press photo keeps its juice-stream shimmer.
 * ?static=1 shows step 03.
 */
export default function FarmLedger() {
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const on = farm.start;
  const step = farm.steps[on];

  useEffect(() => {
    if (isStatic()) return;
    const root = stage.current!;
    const strip = root.querySelector<HTMLElement>("[data-digit-strip]")!;
    const cell = root.querySelector<HTMLElement>(".pf-farm-digit")!;
    const bar = root.querySelector<HTMLElement>(".pf-ledger-bar")!;
    const fill = root.querySelector<HTMLElement>(".pf-rail-fill")!;
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".pf-ledger li"));
    const photos = Array.from(root.querySelectorAll<HTMLElement>("[data-photo]"));
    const photo = root.querySelector<HTMLElement>(".pf-photo")!;
    const word = root.querySelector<HTMLElement>("[data-step-word]")!;
    const stepN = root.querySelector<HTMLElement>("[data-step-n]")!;
    const stepTime = root.querySelector<HTMLElement>("[data-step-time]")!;
    let shown = -1;
    let swap: gsap.core.Timeline | null = null;
    const kick = { s: 1 };

    // everything belonging to one phase changes together: row state, photo, highlight, rail
    const mark = (i: number) => {
      rows.forEach((r, k) => {
        r.classList.toggle("is-on", k === i);
        r.classList.toggle("is-done", k < i);
      });
      photos.forEach((el, k) => el.classList.toggle("is-on", k === i));
      stepN.textContent = pad(i + 1);
      stepTime.textContent = farm.steps[i].time;
    };

    const setStep = (i: number) => {
      gsap.to(strip, { yPercent: 0, y: -i * cell.offsetHeight, duration: 0.3, ease: "power2.inOut", overwrite: true });
      gsap.fromTo(kick, { s: 0.985 }, { s: 1, duration: 0.65, ease: "power3.out", overwrite: true });
      mark(i);
      gsap.to(bar, { y: rows[i].offsetTop, height: rows[i].offsetHeight, duration: 0.5, ease: "power3.out", overwrite: true });
      gsap.to(fill, { scaleY: i / (N - 1), duration: 0.5, ease: "power3.out", overwrite: true });
      swap?.kill();
      swap = gsap
        .timeline()
        .to(word, { yPercent: -40, autoAlpha: 0, duration: 0.1, ease: "power1.in" })
        .add(() => (word.textContent = farm.steps[i].word))
        .fromTo(word, { yPercent: 0, autoAlpha: 1, clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.15, ease: "power2.out" });
    };

    const tick = () => {
      if (!onScreen(root)) return;
      // the pin is split into 5 equal phases; each phase owns its photo until the next one starts
      const p = pinProgress(pin.current!);
      const i = Math.min(N - 1, Math.floor(clamp(p) * N));
      gsap.set(photo, { scale: kick.s, y: -6 * Math.sin(p * Math.PI * 2) }); // a calm lift while the phase holds
      if (i !== shown) {
        if (shown >= 0) setStep(i);
        else {
          mark(i);
          gsap.set(bar, { y: rows[i].offsetTop, height: rows[i].offsetHeight });
          gsap.set(fill, { scaleY: i / (N - 1) });
          word.textContent = farm.steps[i].word;
          gsap.set(strip, { yPercent: 0, y: -i * cell.offsetHeight }); // lesson 105: clear the parsed static %
        }
        shown = i;
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      swap?.kill();
    };
  }, []);

  return (
    <div ref={pin} className="pf-pin" style={{ "--pin": `${PIN}px` } as CSSProperties}>
      <span className="pf-marker" style={{ top: 0 }} data-record-time="1.2" data-record-label="Farm arrives (pinned)" aria-hidden />
      <span className="pf-marker" style={{ top: PIN }} data-record-time="4.0" data-record-label="Farm: 5 steps" aria-hidden />

      <section id="farm" ref={stage} className="pf-farm pf-sticky pf-life" data-section="farm">
        <div className="pf-stage">
          <div className="pf-farm-head">
            <span className="pf-farm-eyebrow">{farm.eyebrow}</span>
            <h2 className="pf-farm-heading font-display">
              <span className="pf-line">{farm.title[0]}</span>
              <span className="pf-line">
                <em>{farm.title[1]}</em>
              </span>
            </h2>
          </div>

          <ol className="pf-ledger">
            <span className="pf-rail" aria-hidden>
              <i className="pf-rail-fill" style={{ transform: `scaleY(${on / (N - 1)})` }} />
            </span>
            {/* starting position for ?static=1 (rows are 72 px); the scroll then sets it from the measured rows */}
            <span className="pf-ledger-bar" aria-hidden style={{ transform: `translateY(${on * 72}px)` }} />
            {farm.steps.map((s, i) => (
              <li key={s.word} className={i === on ? "is-on" : i < on ? "is-done" : ""} data-step={i}>
                <span className="pf-ledger-dot" aria-hidden>
                  <Check />
                </span>
                <span className="pf-ledger-n">{pad(i + 1)}</span>
                <b className="font-display">{s.word}</b>
                <span className="pf-ledger-time">{s.time}</span>
                <span className="pf-ledger-note">{s.note}</span>
              </li>
            ))}
          </ol>

          {/* free spot below the timeline where the travelling orange is cut and pressed */}
          <span className="pf-farm-spot" data-orange-farm aria-hidden />

          <figure className="pf-photo">
            <div className="pf-photo-frame">
              {farm.steps.map((s, i) => (
                <div key={s.photo} className={`pf-photo-layer ${i === on ? "is-on" : ""}`} data-photo={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(s.photo)} alt={`${s.word}: ${s.note}`} />
                  {s.photo === "farm-press" && (
                    <svg className="pf-stream" viewBox="0 0 896 1200" preserveAspectRatio="xMidYMid slice" aria-hidden>
                      <path className="pf-stream-shine" d="M470 622 C 452 660 444 700 441 760 S 432 880 429 972" />
                      <ellipse className="pf-stream-ripple" cx="428" cy="968" rx="34" ry="9" />
                      <ellipse className="pf-stream-ripple pf-stream-ripple-2" cx="428" cy="968" rx="34" ry="9" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <figcaption className="pf-farm-card">
              <div className="pf-farm-big font-display" aria-hidden>
                <span className="pf-farm-digit">0</span>
                <span className="pf-farm-digit pf-farm-roll">
                  <span data-digit-strip style={{ transform: `translateY(${(-on * 100) / N}%)` }}>
                    {farm.steps.map((_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </span>
                </span>
              </div>
              <div className="pf-farm-card-text">
                <span className="pf-farm-card-meta">
                  Step <span data-step-n>{pad(on + 1)}</span> of {pad(N)} · <span data-step-time>{step.time}</span>
                </span>
                <p className="pf-farm-word font-display">
                  <span data-step-word>{step.word}</span>
                </p>
              </div>
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
