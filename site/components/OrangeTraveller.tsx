"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { fruit } from "@/site/content";
import { clamp, isStatic, lerp, smooth } from "@/site/lib/motion";
import { PICK_AT } from "./MixCrate";

/*
 * TRAVELLING ORANGE (F1 waypoint travel + M717 fruit-to-juice), scroll-linked, forward and backward.
 * One orange travels down the page and becomes the juice:
 *   Hero: it lifts, spins and rolls out → Flavours: lands on the featured-orange spot, hops along the four price tags
 *   (right → left, squash on each landing) and rolls into a free lane → Mix: drops into crate cell 1 and becomes the
 *   Orange pick → Farm: appears at step 3 (Cut), splits into two halves; at step 4 (Press) the halves squeeze into one
 *   juice drop → Benefits: the drop runs along "Fruit per bottle" and fills it → Cleanse: down the right margin, along
 *   the seam, falls into a bottle in the crate photo with a small splash → Footer: a final orange rolls in and
 *   becomes a round stamp beside PURE JUICE.
 * One driver, one fixed layer (lesson 31): every frame the waypoints are measured LIVE from their anchor elements and
 * the state is interpolated by scroll position, so any scroll speed, a stop or scrolling back gives the same frame.
 * The orange replaces each section's own orange (slots get .pf-traveller-slot and are hidden), routes only through
 * free space (lessons 53, 99) and is hidden in ?static=1 (sections show their normal final state).
 */

type St = { x: number; y: number; size: number; rot: number; o: number; whole: number; halves: number; split: number; drop: number; splash: number; stamp: number };
type Key = St & { s: number; hop?: number; squash?: boolean };

const ORANGE: St = { x: 0, y: 0, size: 120, rot: 0, o: 1, whole: 1, halves: 0, split: 0, drop: 0, splash: 0, stamp: 0 };
const DROP_SCALE = 0.33; // drop width = size × this

const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;
const centre = (el: Element, fx = 0.5, fy = 0.5) => {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width * fx, y: r.top + r.height * fy, w: r.width, h: r.height, top: r.top, left: r.left };
};
/** a point given in the photo's own pixels, through object-fit: cover */
function coverPoint(img: HTMLImageElement, px: number, py: number) {
  const r = img.getBoundingClientRect();
  const k = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
  return { x: r.left + (r.width - img.naturalWidth * k) / 2 + px * k, y: r.top + (r.height - img.naturalHeight * k) / 2 + py * k };
}

function build(vh: number, vw: number): Key[] | null {
  const q = <T extends Element = HTMLElement>(sel: string) => document.querySelector<T & HTMLElement>(sel);
  const heroOrange = q(".pf-hero-orange");
  const spot = q("[data-orange-spot]");
  const hops = Array.from(document.querySelectorAll<HTMLElement>("[data-hop]"));
  const flav = q("#flavours");
  const mixStage = q("#mix");
  const bin = q('[data-bin="orange"] .pf-bin-fruit');
  const farmStage = q("#farm");
  const farmSpot = q("[data-orange-farm]");
  const compareEl = q("[data-section=compare]");
  const track = q("[data-run-track]");
  const plans = q("[data-section=plans]");
  const photo = q<HTMLImageElement>("[data-orange-bottle]");
  const stampSpot = q("[data-orange-stamp]");
  if (!heroOrange || !spot || hops.length < 4 || !flav || !mixStage || !bin || !farmStage || !farmSpot || !compareEl || !track || !plans || !photo || !stampSpot) return null;

  const keys: Key[] = [];
  const k = (s: number, p: Partial<Key>) => keys.push({ ...ORANGE, ...p, s } as Key);
  const s0 = window.scrollY;
  const max = document.documentElement.scrollHeight - vh;

  // ── Hero
  const ho = centre(heroOrange);
  k(0, { x: ho.x, y: ho.y, size: ho.w, rot: 0 });
  const H = flav.getBoundingClientRect().top + s0; // flavours top (doc)
  k(H * 0.3, { x: ho.x + 60, y: ho.y - 150, size: ho.w, rot: 200 });
  k(H - vh * 0.55, { x: vw - 140, y: vh * 0.56, size: 128, rot: 560 });
  // ── Flavours: the featured-orange spot, then hops along the card tops (right → left), then a free lane
  const sp = centre(spot);
  const FT = H;
  const cardsIn = FT + flav.offsetHeight - vh + 40;
  k(FT - vh * 0.1, { x: sp.x, y: sp.y, size: 140, rot: 720, squash: true });
  k(cardsIn, { x: sp.x, y: sp.y, size: 140, rot: 720 });
  const order = [3, 2, 1, 0];
  order.forEach((i, n) => {
    const c = centre(hops[i]);
    k(cardsIn + 70 * (n + 1), { x: c.x, y: c.top + 14 - 48, size: 96, rot: 720 - 120 * (n + 1), hop: n === 0 ? 70 : 34, squash: true });
  });
  // ── Mix your own: ONE lane (the gap between the crate and the bottle, which also clears card 2's name), reached
  // by gliding right just above the card row, then straight down it and left across the top row into cell 1.
  // A single lane means no sideways snap between two lanes and only one change of direction after the hops.
  const c2 = centre(hops[1]);
  const afterHops = cardsIn + 70 * 4;
  const mixTop = docTop(mixStage.parentElement!);
  const PIN = mixStage.parentElement!.offsetHeight - vh;
  const b = centre(bin);
  const cellY = b.y - 6; // the fruit rests a little high in its bin
  const crate = q(".pf-crate");
  const mixBottle = q(".pf-mix-bottle");
  const lane = crate && mixBottle ? (centre(crate).left + centre(crate).w + centre(mixBottle).left) / 2 : c2.left + c2.w - 90;
  k(afterHops + 130, { x: lane, y: c2.top + 14 - 48, size: 92, rot: 720 - 120 * 4 + 200 });
  k(mixTop - vh * 0.3, { x: lane, y: vh * 0.4, size: 84, rot: 470 });
  // land on where cell 1 WILL be once the stage pins (not where it is now while still scrolling up), so the drop is one
  // clean downward move instead of sinking past the cell and riding back up with it
  const cellAtPin = s0 < mixTop ? cellY - (mixTop - s0) : cellY;
  k(mixTop, { x: lane, y: cellAtPin, size: 74, rot: 380 });
  k(mixTop + PIN * 0.115, { x: b.x, y: cellY, size: 74, rot: -260, squash: true });
  k(mixTop + PIN * (PICK_AT[0] - 0.008), { x: b.x, y: cellY, size: 74, rot: -260 });
  k(mixTop + PIN * (PICK_AT[0] + 0.004), { x: b.x, y: cellY, size: 74, rot: -260, o: 0 });
  // ── Farm → bottle (pinned, 5 steps): appears at Cut, splits, squeezes into a drop at Press
  const farmTop = docTop(farmStage.parentElement!);
  const FPIN = farmStage.parentElement!.offsetHeight - vh;
  const fs = centre(farmSpot);
  const fy = fs.y;
  const step = (f: number) => farmTop + FPIN * (f / 4);
  k(step(1.45), { x: fs.x, y: fy, size: 120, rot: -40, o: 0 });
  k(step(1.85), { x: fs.x, y: fy, size: 120, rot: 0 });
  k(step(2.1), { x: fs.x, y: fy, size: 120, rot: 10 });
  k(step(2.5), { x: fs.x, y: fy, size: 120, rot: 10, whole: 0, halves: 1, split: 1 });
  k(step(2.9), { x: fs.x, y: fy, size: 120, rot: 10, whole: 0, halves: 1, split: 1 });
  k(step(3.45), { x: fs.x, y: fy, size: 96, rot: 0, whole: 0, halves: 0, split: 0.1, drop: 1 });
  k(step(4), { x: fs.x, y: fy, size: 96, rot: 0, whole: 0, drop: 1 });
  // ── Benefits: the drop runs along the "Fruit per bottle" bar (window.__pfRun fills it)
  const cTop = docTop(compareEl);
  const tr = centre(track);
  const runStart = cTop - vh * 0.45;
  const runEnd = cTop - vh * 0.1;
  const trackY = () => tr.y;
  const dropAbove = -4; // the drop sits on the bar; its tip stays clear of the row label above
  const D = { whole: 0, drop: 1, size: 96, rot: 0 };
  // down the clear column between the title side and the bars (no label is ever crossed), then onto the bar
  const colX = tr.left - 30;
  k(step(4) + 70, { ...D, x: colX, y: vh * 0.86 });
  k(runStart - 50, { ...D, x: colX, y: trackY() - dropAbove });
  k(runStart, { ...D, x: tr.left, y: trackY() - dropAbove });
  k(runEnd, { ...D, x: tr.left + tr.w * 0.92, y: trackY() - dropAbove });
  // ── End of Benefits bar: drop gently dissolves at the end of the track
  k(runEnd + 40, { ...D, x: tr.left + tr.w * 0.95, y: trackY() - dropAbove, o: 0.5 });
  k(runEnd + 80, { ...D, x: tr.left + tr.w, y: trackY() - dropAbove, o: 0 });
  // ── Footer: a final orange rolls in from the right and becomes a round stamp
  const st = centre(stampSpot);
  k(max - 250, { x: st.x + 380, y: st.y, size: 130, rot: 0, o: 0 });
  k(max - 240, { x: st.x + 360, y: st.y, size: 130, rot: 0 });
  k(max - 60, { x: st.x, y: st.y, size: 130, rot: -620, squash: true });
  k(max, { x: st.x, y: st.y, size: 150, rot: -620, whole: 0, stamp: 1 });

  // Every anchor point is measured LIVE at the current scroll: at a key's own scroll it is exactly that key's spot,
  // and between two keys both anchors ride with the page, so the path follows the page at any scroll speed.
  return keys.sort((a, b2) => a.s - b2.s);
}

export default function OrangeTraveller() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStatic()) return;
    const el = root.current!;
    document.documentElement.classList.add("has-traveller");
    const whole = el.querySelector<HTMLElement>("[data-t=whole]")!;
    const halfA = el.querySelector<HTMLElement>("[data-t=half-a]")!;
    const halfB = el.querySelector<HTMLElement>("[data-t=half-b]")!;
    const drop = el.querySelector<HTMLElement>("[data-t=drop]")!;
    const splash = el.querySelector<HTMLElement>("[data-t=splash]")!;
    const stamp = el.querySelector<HTMLElement>("[data-t=stamp]")!;
    let bin: HTMLElement | null = null;

    const tick = () => {
      const vh = window.innerHeight;
      const vw = document.documentElement.clientWidth;
      const keys = build(vh, vw);
      if (!keys) return;
      const s = window.scrollY;
      // crate cell 1 stays empty until the orange hands over (never two of the same orange)
      const mixStage = document.querySelector<HTMLElement>("#mix")!;
      const mixTop = docTop(mixStage.parentElement!);
      const PIN = mixStage.parentElement!.offsetHeight - vh;
      bin = bin ?? document.querySelector<HTMLElement>('[data-bin="orange"]');
      bin?.classList.toggle("is-traveller-home", s < mixTop + PIN * PICK_AT[0]);

      // monotone cubic (Fritsch–Carlson) for x / y: the speed carries through waypoints instead of easing to a stop
      // at each one; it only rests where the path turns or holds, and at landings (squash keys)
      const slope = (k0: number, axis: "x" | "y") => {
        const a0 = keys[k0];
        const a1 = keys[k0 + 1];
        if (!a0 || !a1) return 0;
        return (a1[axis] - a0[axis]) / Math.max(1, a1.s - a0.s);
      };
      const tangent = (k0: number, axis: "x" | "y") => {
        if (keys[k0]?.squash) return 0;
        const d0 = slope(k0 - 1, axis);
        const d1 = slope(k0, axis);
        return d0 * d1 > 0 ? 2 / (1 / d0 + 1 / d1) : 0;
      };
      const curve = (k0: number, axis: "x" | "y", t: number) => {
        const a0 = keys[k0];
        const a1 = keys[k0 + 1];
        const h = Math.max(1, a1.s - a0.s);
        const t2 = t * t;
        const t3 = t2 * t;
        return (2 * t3 - 3 * t2 + 1) * a0[axis] + (t3 - 2 * t2 + t) * h * tangent(k0, axis) + (-2 * t3 + 3 * t2) * a1[axis] + (t3 - t2) * h * tangent(k0 + 1, axis);
      };

      let i = keys.findIndex((kk) => kk.s > s) - 1;
      if (i < -1) i = keys.length - 1;
      let st: St;
      if (i < 0) st = keys[0];
      else if (i >= keys.length - 1) st = keys[keys.length - 1];
      else {
        const a = keys[i];
        const b = keys[i + 1];
        const t = clamp((s - a.s) / Math.max(1, b.s - a.s));
        const e = smooth(0, 1, t);
        st = {} as St;
        (Object.keys(ORANGE) as (keyof St)[]).forEach((key) => (st[key] = lerp(a[key], b[key], key === "rot" ? t : e)));
        st.x = curve(i, "x", t);
        st.y = curve(i, "y", t);
        if (b.hop) st.y -= b.hop * 4 * t * (1 - t);
      }
      // squash near every landing (scroll-linked, symmetric forward/back)
      let sq = 0;
      keys.forEach((kk) => {
        if (kk.squash) sq = Math.max(sq, 1 - Math.abs(s - kk.s) / 36);
      });
      const sy = 1 - 0.16 * Math.max(0, sq);
      const sx = 1 + 0.09 * Math.max(0, sq);
      const z = st.size;
      el.style.opacity = String(clamp(st.o));
      el.style.transform = `translate3d(${st.x - z / 2}px, ${st.y - z / 2 + (z * (1 - sy)) / 2}px, 0)`;
      el.style.width = el.style.height = `${z}px`;
      whole.style.opacity = String(clamp(st.whole));
      whole.style.transform = `scale(${sx}, ${sy}) rotate(${st.rot}deg)`;
      const sep = st.split * z * 0.42;
      halfA.style.opacity = halfB.style.opacity = String(clamp(st.halves));
      halfA.style.transform = `translateX(${-sep}px) rotate(${-14 * st.split}deg) scale(${0.62 + 0.3 * st.halves})`;
      halfB.style.transform = `translateX(${sep}px) rotate(${14 * st.split}deg) scale(${-(0.62 + 0.3 * st.halves)}, ${0.62 + 0.3 * st.halves})`;
      drop.style.opacity = String(clamp(st.drop));
      drop.style.transform = `scale(${(DROP_SCALE * sx) / 0.33}, ${(DROP_SCALE * sy) / 0.33})`;
      splash.style.opacity = String(clamp(st.splash > 0 ? 1 - Math.max(0, st.splash - 0.6) / 0.4 : 0));
      splash.style.transform = `scale(${0.6 + 0.8 * st.splash})`;
      stamp.style.opacity = String(clamp(st.stamp));
      stamp.style.transform = `scale(${1.15 - 0.15 * st.stamp}) rotate(${-8 + 0 * st.stamp}deg)`;
      // the bar is filled by the drop
      const cmp = document.querySelector("[data-section=compare]");
      if (cmp) {
        const cTop = docTop(cmp);
        window.__pfRun = clamp((s - (cTop - vh * 0.45)) / (vh * 0.35));
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      document.documentElement.classList.remove("has-traveller");
    };
  }, []);

  return (
    <div ref={root} className="pf-traveller" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-t="whole" src={fruit("orange")} alt="" className="pf-t-layer" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-t="half-a" src={fruit("orange-half")} alt="" className="pf-t-layer" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-t="half-b" src={fruit("orange-half")} alt="" className="pf-t-layer" />
      <svg data-t="drop" className="pf-t-drop" viewBox="0 0 40 54">
        <defs>
          <radialGradient id="pf-drop-g" cx="35%" cy="62%" r="70%">
            <stop offset="0" stopColor="#FFC060" />
            <stop offset="0.55" stopColor="#F28A1C" />
            <stop offset="1" stopColor="#C9530F" />
          </radialGradient>
        </defs>
        <path d="M20 2c7 12 17 22 17 33a17 17 0 0 1-34 0C3 24 13 14 20 2Z" fill="url(#pf-drop-g)" />
        <ellipse cx="13" cy="36" rx="3.5" ry="6" fill="#fff" opacity="0.55" />
      </svg>
      <svg data-t="splash" className="pf-t-splash" viewBox="0 0 120 80">
        <g fill="#F28A1C">
          <path d="M28 70c-4-14 2-24 9-28-1 10 2 18 8 26ZM92 70c4-14-2-24-9-28 1 10-2 18-8 26ZM52 68c-3-20 3-32 8-40 5 8 11 20 8 40Z" />
          <circle cx="20" cy="36" r="4" />
          <circle cx="100" cy="32" r="5" />
          <circle cx="44" cy="18" r="3" />
          <circle cx="78" cy="14" r="3.5" />
        </g>
      </svg>
      <svg data-t="stamp" className="pf-t-stamp" viewBox="0 0 200 200">
        <defs>
          <path id="pf-stamp-ring" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
        </defs>
        <circle cx="100" cy="100" r="94" fill="none" stroke="#E8541E" strokeWidth="5" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="#E8541E" strokeWidth="2.5" />
        {/* the lettered ring turns slowly so the last screen keeps moving (lessons 35, 55) */}
        <g className="pf-t-stamp-ring">
          <text fill="#E8541E" fontFamily="'Inter Tight Variable', sans-serif" fontWeight="600" fontSize="19" letterSpacing="4.6">
            <textPath href="#pf-stamp-ring">PRESSED AT SUNRISE · PURE JUICE · NAGPUR ·</textPath>
          </text>
        </g>
        <g transform="translate(100 100)" fill="#E8541E">
          <circle r="30" />
          <path d="M-4-30c2-10 10-14 18-12-4 6-10 10-18 12Z" fill="#7BAA3C" />
          <circle r="22" fill="#F7A14A" />
          <path d="M0-22V22M-22 0H22M-15-15L15 15M15-15L-15 15" stroke="#E8541E" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
