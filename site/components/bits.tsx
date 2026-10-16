import type { CSSProperties, ReactNode } from "react";
import { bottle, fruit, type Juice } from "@/site/content";



/**
 * One juice bottle: a pixel-aligned colour still (all share one cut-out mask), with the brand + flavour
 * printed onto the blank kraft label band in code (label sits at 46.5–77.5 % of the bottle height).
 */
export function Bottle({
  juice,
  word,
  className = "",
  style,
  eager,
  labelOnly,
}: {
  juice: Juice | "empty" | "glass";
  word?: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
  /** only the printed label (no bottle still): laid over stacked stills */
  labelOnly?: boolean;
}) {
  return (
    <span className={`pf-bottle ${className}`} style={style}>
      {!labelOnly && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={bottle(juice)} alt="" draggable={false} loading={eager === false ? "lazy" : "eager"} decoding="async" />
      )}
      {word && (
        <span className="pf-label" aria-hidden>
          <span className="pf-label-brand">Pure Juice</span>
          <span className="pf-label-word">{word}</span>
          <span className="pf-label-ml">300 ml · cold-pressed</span>
        </span>
      )}
    </span>
  );
}

export function Fruit({ name, className = "", style }: { name: string; className?: string; style?: CSSProperties }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={fruit(name)} alt="" className={`pf-fruit ${className}`} style={style} draggable={false} decoding="async" />;
}

/** Small pill tag with an accent dot. */
export function Stamp({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span className={`pf-stamp ${className}`} style={style}>
      {children}
    </span>
  );
}


export function Arrow() {
  return (
    <svg className="pf-arrow" width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden>
      <path d="M1 6h15M11 1l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


/**
 * A price / number whose digits roll to the new value (transform only, no layout jump). Each digit cell is sized to
 * its final digit (lesson 73) and spaces stay non-breaking (lesson 86). ?static=1 simply shows the value.
 */
export function RollNumber({ value, className = "" }: { value: string; className?: string }) {
  const chars = value.replace(/ /g, " ").split("");
  return (
    <span className={`pf-roll ${className}`} aria-label={value}>
      {chars.map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={`${chars.length}-${i}`} className="pf-roll-cell" aria-hidden>
            <span className="pf-roll-ghost">{ch}</span>
            <span className="pf-roll-strip" style={{ transform: `translateY(${-Number(ch) * 10}%)` }}>
              {"0123456789".split("").map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={`${chars.length}-${i}`} aria-hidden>
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
