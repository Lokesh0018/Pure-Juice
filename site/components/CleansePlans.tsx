"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { img, plans, rupee } from "@/site/content";
import { Arrow, RollNumber, Stamp } from "./bits";

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}

/**
 * PR14 · cleanse programs: product photo left (with what every box includes), the whole purchase decision right and
 * on one screen: plan cards (days, bottles, price per day, "Most popular"), a delivery-frequency segmented control
 * with a sliding highlight, and a summary card with the running total, the saving and the call to action.
 */
export default function CleansePlans() {
  const [plan, setPlan] = useState(plans.start);
  const [freq, setFreq] = useState(plans.startFreq);
  const row = plans.rows.find((r) => r.id === plan)!;
  const fi = plans.freq.findIndex((x) => x.id === freq);
  const f = plans.freq[fi];
  const total = Math.round(row.price * (1 - f.off));
  const saved = row.price - total;

  // add the chosen plan (with its delivery choice and discounted total) to the bag, then confirm on the button
  const [added, setAdded] = useState(false);
  const addedTimer = useRef(0);
  useEffect(() => () => clearTimeout(addedTimer.current), []);
  const addToBag = () => {
    window.dispatchEvent(
      new CustomEvent("pf:add", {
        detail: { id: `plan-${row.id}`, size: f.id, name: row.name, note: `${row.bottles} bottles · ${f.label}`, price: total, juice: row.juice },
      }),
    );
    setAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section id="cleanses" className="pf-plans pf-life" data-section="plans" data-record-time="2.0" data-record-hold="1.0" data-record-label="Cleanse plans (hover)">
      <div className="pf-stage">
        <figure className="pf-plans-pic">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("crate-box")} alt="A box of eight cold-pressed juice bottles with fresh oranges" data-orange-bottle="427,400" />
          <Stamp className="pf-plans-stamp">{plans.stamp}</Stamp>
          <figcaption className="pf-plans-incl">
            <span className="pf-plans-incl-title">Every box includes</span>
            <ul>
              {plans.included.map((t) => (
                <li key={t}>
                  <Check /> {t}
                </li>
              ))}
            </ul>
          </figcaption>
        </figure>

        <div className="pf-plans-side">
          <span className="pf-plans-eyebrow">{plans.eyebrow}</span>
          <h2 className="pf-plans-title font-display">
            {plans.title} <em>{plans.accent}</em>
          </h2>
          <p className="pf-plans-lead">{plans.lead}</p>

          <div className="pf-radios" role="radiogroup" aria-label="Cleanse plan">
            {plans.rows.map((r) => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={r.id === plan}
                className={`pf-radio ${r.id === plan ? "is-on" : ""}`}
                onClick={() => setPlan(r.id)}
                {...(r.id === "cleanse3" ? { "data-hover-demo": "", "data-hover-label": "3-Day plan" } : {})}
              >
                <span className="pf-dot" aria-hidden />
                <span className="pf-radio-text">
                  <b>
                    {r.name}
                    {"badge" in r && r.badge && <span className="pf-radio-badge">{r.badge}</span>}
                  </b>
                  <span>{r.note}</span>
                </span>
                <span className="pf-radio-price">
                  <b>{rupee(r.price)}</b>
                  <small>{rupee(Math.round(r.price / r.days))} / day</small>
                </span>
              </button>
            ))}
          </div>

          <div className="pf-freq-wrap">
            <span className="pf-freq-label">{plans.freqLabel}</span>
            <div className="pf-seg" role="radiogroup" aria-label={plans.freqLabel} style={{ "--i": fi, "--n": plans.freq.length } as CSSProperties}>
              <span className="pf-seg-thumb" aria-hidden />
              {plans.freq.map((x) => (
                <button key={x.id} type="button" role="radio" aria-checked={x.id === freq} className={`pf-seg-opt ${x.id === freq ? "is-on" : ""}`} onClick={() => setFreq(x.id)}>
                  {x.label}
                  {x.off > 0 && <small>−{Math.round(x.off * 100)}%</small>}
                </button>
              ))}
            </div>
          </div>

          <div className="pf-summary">
            <div className="pf-summary-text">
              <span className="pf-summary-label">
                {row.days}-day plan · {row.bottles} bottles · {f.label.toLowerCase()}
              </span>
              <span className="pf-total-line">
                <b>
                  <RollNumber value={rupee(total)} />
                </b>
                {saved > 0 && <s>{rupee(row.price)}</s>}
                {saved > 0 && <span className="pf-save">You save {rupee(saved)}</span>}
              </span>
              <span className="pf-summary-note">{plans.note}</span>
            </div>
            <button type="button" className={`pf-btn pf-btn-tomato ${added ? "is-added" : ""}`} data-magnetic onClick={addToBag} aria-live="polite">
              {added ? (
                <>
                  <Check /> {plans.added}
                </>
              ) : (
                <>
                  {plans.cta} <Arrow />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
