"use client";

import { useState } from "react";
import { img, plans, rupee } from "@/site/content";
import { Arrow, RollNumber, Stamp } from "./bits";

/**
 * PR14 · crate photo left, radio plan rows with hand-lettered prices, delivery frequency chips, running total.
 * Round 3 (M231): the rows hinge up like tags lifted off a table, then chips and total slide in.
 */
export default function CleansePlans() {
  const [plan, setPlan] = useState(plans.start);
  const [freq, setFreq] = useState(plans.startFreq);
  const row = plans.rows.find((r) => r.id === plan)!;
  const f = plans.freq.find((x) => x.id === freq)!;
  const total = Math.round(row.price * (1 - f.off));

  return (
    <section id="cleanses" className="pf-plans pf-life" data-section="plans" data-record-time="2.0" data-record-hold="1.0" data-record-label="Cleanse plans (hover)">
      <div className="pf-stage">
        <figure className="pf-plans-pic">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("crate-box")} alt="A wooden crate of cold-pressed juice bottles on kraft paper" data-orange-bottle="427,400" />
          <Stamp className="pf-plans-stamp">{plans.stamp}</Stamp>
        </figure>

        <div className="pf-plans-side">
          <h2 className="pf-h2 font-display">{plans.title}</h2>
          <div className="pf-radios" role="radiogroup" aria-label="Cleanse plan">
            {plans.rows.map((r) => (
              <button
                key={r.id}
                type="button"
                role="radio"
                aria-checked={r.id === plan}
                className={`pf-radio ${r.id === plan ? "is-on" : ""}`}
                onClick={() => setPlan(r.id)}
                {...(r.id === "cleanse3" ? { "data-hover-demo": "", "data-hover-label": "3-Day Cleanse plan" } : {})}
              >
                <span className="pf-dot" aria-hidden />
                <span className="pf-radio-text">
                  <b className="font-display">{r.name}</b>
                  <span>{r.note}</span>
                </span>
                <span className="pf-radio-price mk">{rupee(r.price)}</span>
              </button>
            ))}
          </div>
          <p className="pf-label-caps">Deliver it</p>
          <div className="pf-freq" role="radiogroup" aria-label="Delivery">
            {plans.freq.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={x.id === freq}
                className={`pf-freq-chip font-display ${x.id === freq ? "is-on" : ""}`}
                onClick={() => setFreq(x.id)}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="pf-total">
            <span>
              <span className="pf-label-caps">Total</span>
              <span className="pf-total-line">
                <b className="mk">
                  <RollNumber value={rupee(total)} />
                </b>
                {f.off > 0 && <s>{rupee(row.price)}</s>}
              </span>
            </span>
            <button type="button" className="pf-btn pf-btn-tomato" data-magnetic>
              {plans.cta} <Arrow />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
