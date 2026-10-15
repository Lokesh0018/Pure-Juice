import type { CSSProperties } from "react";

/**
 * Footer meadow: grass blades and small plants along the bottom edge, swaying in a soft wind.
 * Pure SVG + CSS (no JS per frame). Every blade shares one sway period and its delay follows its x position, so a
 * gust visibly travels left → right through the grass; plants sway slower and wider. A seeded random keeps the
 * layout identical on every load. ?static=1 stops the motion (html.is-static rule in site.css).
 */

const W = 1440;
const H = 140;

// tiny seeded random (mulberry32), so the meadow never reshuffles between renders
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Blade = { d: string; fill: string; a: number; delay: number; dur: number };
type Plant = { x: number; s: number; flip: boolean; kind: "sprig" | "fern" | "bud"; delay: number };

const GREENS_BACK = ["#1c3320", "#21402a", "#26472b"];
const GREENS_FRONT = ["#2f5a33", "#3a6b3a", "#4b7f41", "#5f9447"];

function blades(seed: number, count: number, minH: number, maxH: number, colours: string[], period: number): Blade[] {
  const r = rng(seed);
  return Array.from({ length: count }, (_, i) => {
    const x = (i / count) * W + r() * (W / count);
    const h = minH + r() * (maxH - minH);
    const w = 2.2 + r() * 2.6;
    const lean = (r() - 0.5) * h * 0.5;
    const d = `M${(x - w).toFixed(1)} ${H} Q${(x - w * 0.2 + lean * 0.4).toFixed(1)} ${(H - h * 0.55).toFixed(1)} ${(x + lean).toFixed(1)} ${(H - h).toFixed(1)} Q${(x + w * 0.5 + lean * 0.4).toFixed(1)} ${(H - h * 0.55).toFixed(1)} ${(x + w).toFixed(1)} ${H} Z`;
    return {
      d,
      fill: colours[Math.floor(r() * colours.length)],
      a: 3 + r() * 4, // sway amplitude in degrees
      // the wave: delay grows with x, shifted negative so the meadow is already moving on the first frame
      delay: (x / W) * period * 0.9 - period * 2,
      dur: period * (0.92 + r() * 0.16),
    };
  });
}

const BACK = blades(7, 210, 34, 86, GREENS_BACK, 4.4);
const FRONT = blades(19, 170, 20, 54, GREENS_FRONT, 3.6);

const PLANTS: Plant[] = [
  { x: 70, s: 1.0, flip: false, kind: "fern", delay: -1.2 },
  { x: 190, s: 0.8, flip: true, kind: "bud", delay: -3.1 },
  { x: 330, s: 0.9, flip: false, kind: "sprig", delay: -0.4 },
  { x: 505, s: 0.75, flip: true, kind: "fern", delay: -2.2 },
  { x: 640, s: 0.85, flip: false, kind: "bud", delay: -4.0 },
  { x: 800, s: 1.05, flip: true, kind: "sprig", delay: -1.7 },
  { x: 960, s: 0.8, flip: false, kind: "fern", delay: -3.6 },
  { x: 1090, s: 0.9, flip: true, kind: "bud", delay: -0.9 },
  { x: 1230, s: 1.0, flip: false, kind: "sprig", delay: -2.8 },
  { x: 1370, s: 0.85, flip: true, kind: "fern", delay: -1.4 },
];

function PlantShape({ kind }: { kind: Plant["kind"] }) {
  if (kind === "fern") {
    // a curved stem with paired leaflets getting smaller toward the tip
    const leaves = [0, 1, 2, 3, 4];
    return (
      <g>
        <path d="M0 0 Q -4 -40 6 -78" fill="none" stroke="#4b7f41" strokeWidth="2.2" strokeLinecap="round" />
        {leaves.map((i) => {
          const y = -14 - i * 14;
          const x = -1 + i * 1.4;
          const len = 20 - i * 3;
          return (
            <g key={i}>
              <ellipse cx={x - len / 2} cy={y} rx={len / 2} ry={3.6 - i * 0.4} fill="#4b7f41" transform={`rotate(-24 ${x} ${y})`} />
              <ellipse cx={x + len / 2} cy={y - 3} rx={len / 2} ry={3.6 - i * 0.4} fill="#5f9447" transform={`rotate(24 ${x} ${y - 3})`} />
            </g>
          );
        })}
      </g>
    );
  }
  if (kind === "bud") {
    // two thin stems with small orange buds: the one warm accent in the meadow
    return (
      <g>
        <path d="M0 0 Q 2 -34 -6 -62" fill="none" stroke="#3a6b3a" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 0 Q 8 -26 16 -46" fill="none" stroke="#3a6b3a" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="-8" cy="-30" rx="9" ry="3.6" fill="#4b7f41" transform="rotate(-30 -8 -30)" />
        <circle cx="-6" cy="-65" r="5.5" fill="#e8541e" />
        <circle cx="16" cy="-49" r="4" fill="#f28a3c" />
      </g>
    );
  }
  // sprig: a straight-ish stem with broad leaves
  return (
    <g>
      <path d="M0 0 Q 3 -30 0 -58" fill="none" stroke="#3a6b3a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M0 -18 C -18 -22 -24 -36 -22 -42 C -10 -40 -2 -30 0 -18 Z" fill="#4b7f41" />
      <path d="M1 -32 C 18 -34 26 -46 24 -54 C 12 -52 3 -44 1 -32 Z" fill="#5f9447" />
      <path d="M0 -50 C -10 -56 -10 -66 -6 -72 C 0 -66 2 -58 0 -50 Z" fill="#6ea052" />
    </g>
  );
}

export default function Meadow() {
  return (
    <svg className="pf-meadow" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
      <g className="pf-meadow-back">
        {BACK.map((b, i) => (
          <path key={i} d={b.d} fill={b.fill} className="pf-blade" style={{ "--a": `${b.a}deg`, animationDelay: `${b.delay.toFixed(2)}s`, animationDuration: `${b.dur.toFixed(2)}s` } as CSSProperties} />
        ))}
      </g>
      {PLANTS.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${H}) scale(${p.flip ? -p.s * 1.25 : p.s * 1.25} ${p.s * 1.25})`}>
          <g className="pf-plant" style={{ animationDelay: `${p.delay}s` }}>
            <PlantShape kind={p.kind} />
          </g>
        </g>
      ))}
      <g className="pf-meadow-front">
        {FRONT.map((b, i) => (
          <path key={i} d={b.d} fill={b.fill} className="pf-blade" style={{ "--a": `${b.a}deg`, animationDelay: `${b.delay.toFixed(2)}s`, animationDuration: `${b.dur.toFixed(2)}s` } as CSSProperties} />
        ))}
      </g>
    </svg>
  );
}
