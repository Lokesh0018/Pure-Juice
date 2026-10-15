"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { farm, img } from "@/site/content";
import { clamp, isStatic, onScreen, pinProgress } from "@/site/lib/motion";
import { Stamp } from "./bits";

const PIN = 1200; // px pinned: 5 steps
const ROW_H = 63; // ledger row height (px), for the sliding highlight

/**
 * PD07 · giant tomato step number, a ledger of 5 timed rows, a taped photo that changes per step.
 * Pinned (CSS sticky), M94 tied to scroll across the whole pin (lesson 9): the highlight slides down the ledger, the
 * photos cross-fade (scrubbed, never stepped, lesson 10) and the photo nudges like paper. On each step change the
 * digit rolls in 0.3 s inside its own clipped box (a paused frame never shows two half-numbers), the polaroid tilts
 * and settles, and the word swaps whole: the old word lifts out, then the new one rises in (lessons 85, 100).
 * The press photo (step 4) gets the code motion that replaces the skipped Veo loop: a shimmer runs down the
 * juice stream and the tray ripples. ?static=1 shows step 03.
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
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".pf-ledger li"));
    const photos = Array.from(root.querySelectorAll<HTMLElement>("[data-photo]"));
    const photo = root.querySelector<HTMLElement>(".pf-photo")!;
    const word = root.querySelector<HTMLElement>("[data-step-word]")!;
    const stamp = root.querySelector<HTMLElement>("[data-step-stamp]")!;
    let shown = -1;
    let swap: gsap.core.Timeline | null = null;
    const kick = { r: 0, s: 1 };

    const setStep = (i: number, dir: number) => {
      gsap.to(strip, { yPercent: 0, y: -i * cell.offsetHeight, duration: 0.3, ease: "power2.inOut", overwrite: true });
      gsap.fromTo(kick, { r: 4.5 * dir, s: 0.975 }, { r: 0, s: 1, duration: 0.65, ease: "back.out(1.8)", overwrite: true });
      rows.forEach((r, k) => r.classList.toggle("is-on", k === i));
      stamp.textContent = `Step ${String(i + 1).padStart(2, "0")} · ${farm.steps[i].word}`;
      swap?.kill();
      swap = gsap
        .timeline()
        .to(word, { yPercent: -40, autoAlpha: 0, duration: 0.1, ease: "power1.in" })
        .add(() => (word.textContent = farm.steps[i].word))
        .fromTo(word, { yPercent: 0, autoAlpha: 1, clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.15, ease: "power2.out" });
    };

    const tick = () => {
      if (!onScreen(root)) return;
      const f = 4 * pinProgress(pin.current!); // 0 → 4, linear over the whole pin
      gsap.set(bar, { y: f * ROW_H });
      photos.forEach((el, i) => (el.style.opacity = String(clamp(1 - Math.abs(i - f)))));
      gsap.set(photo, { rotate: 1.5 + Math.sin(f * Math.PI) * 1.4 + kick.r, scale: kick.s, y: -6 * Math.sin(f * Math.PI * 0.5) });
      const i = Math.round(f);
      if (i !== shown) {
        if (shown >= 0) setStep(i, i > shown ? 1 : -1);
        else {
          rows.forEach((r, k) => r.classList.toggle("is-on", k === i));
          word.textContent = farm.steps[i].word;
          stamp.textContent = `Step 0${i + 1} · ${farm.steps[i].word}`;
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
          <h2 className="pf-h2 pf-farm-title font-display">
            <span className="pf-line">{farm.title[0]}</span>
            <span className="pf-line">{farm.title[1]}</span>
          </h2>

          <div className="pf-farm-big font-display" aria-hidden>
            <span className="pf-farm-digit">0</span>
            <span className="pf-farm-digit pf-farm-roll">
              <span data-digit-strip style={{ transform: `translateY(${-on * 20}%)` }}>
                {farm.steps.map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </span>
            </span>
          </div>
          <p className="pf-farm-word font-display" aria-hidden>
            <span data-step-word>{step.word}</span>
          </p>

          {/* free spot below the ledger where the travelling orange is cut and pressed */}
          <span className="pf-farm-spot" data-orange-farm aria-hidden />
          <ol className="pf-ledger">
            <span className="pf-ledger-bar" aria-hidden style={{ transform: `translateY(${on * ROW_H}px)` }} />
            {farm.steps.map((s, i) => (
              <li key={s.word} className={i === on ? "is-on" : ""} data-step={i}>
                <b className="font-display">{s.word}</b>
                <span className="pf-ledger-time">{s.time}</span>
                <span>{s.note}</span>
              </li>
            ))}
          </ol>

          <figure className="pf-photo">
            <span className="pf-tape pf-tape-a" aria-hidden />
            <span className="pf-tape pf-tape-b" aria-hidden />
            <div className="pf-photo-frame">
              {farm.steps.map((s, i) => (
                <div key={s.photo} className="pf-photo-layer" data-photo={i} style={{ opacity: i === on ? 1 : 0 }}>
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
            <figcaption>
              <Stamp className="pf-photo-stamp">
                <span data-step-stamp>
                  Step {String(on + 1).padStart(2, "0")} · {step.word}
                </span>
              </Stamp>
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
