"use client";

import { useEffect, useRef, useState } from "react";
import { nav, pdp, products, rupee } from "@/site/content";
import { Bottle, PureMark, RollNumber } from "./bits";

type Item = { key: string; id: string; size: string; qty: number };
const AUTO_CLOSE = 2500; // ms

const sizeOf = (size: string) => pdp.sizes.find((s) => s.id === size) ?? pdp.sizes[0];
const priceOf = (it: Item) => (it.size === "single" ? products[it.id].price : sizeOf(it.size).price);
const lineOf = (it: Item) => `${sizeOf(it.size).label} · ${sizeOf(it.size).note}`;

/**
 * NV18 · stamped logo left, links centre, Bag pill right. The cart is a full-height drawer from the right screen edge
 * over a light dim: a new item lands on top with a short highlight, the total and the count roll up. It closes on ×,
 * on a click outside, or by itself after 2.5 s. Listens for "pf:add" ({ id, size }).
 */
export default function StallNav() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>(nav.bag.map((b) => ({ key: `${b.id}-single`, id: b.id, size: "single", qty: b.qty })));
  const [fresh, setFresh] = useState<string | null>(null);
  const close = useRef(0);

  useEffect(() => {
    const onAdd = (e: Event) => {
      const d = (e as CustomEvent<{ id: string; size?: string }>).detail ?? { id: "sunrise" };
      const size = d.size ?? "single";
      const key = `${d.id}-${size}`;
      setItems((list) => {
        const hit = list.find((i) => i.key === key);
        const rest = list.filter((i) => i.key !== key);
        return [{ key, id: d.id, size, qty: (hit?.qty ?? 0) + 1 }, ...rest]; // the new item goes on top
      });
      setFresh(key);
      setOpen(true);
      clearTimeout(close.current);
      close.current = window.setTimeout(() => setOpen(false), AUTO_CLOSE);
    };
    window.addEventListener("pf:add", onAdd);
    return () => {
      window.removeEventListener("pf:add", onAdd);
      clearTimeout(close.current);
    };
  }, []);

  const shut = () => {
    clearTimeout(close.current);
    setOpen(false);
  };
  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + priceOf(i) * i.qty, 0);

  return (
    <>
      <header className="pf-nav" data-nav>
        <a href="#top" className="pf-logo" aria-label="Pure Juice home">
          <PureMark className="pf-logo-mark" />
          <span>Pure</span>
          <span>Juice</span>
        </a>
        <nav className="pf-nav-links" aria-label="Main">
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className="pf-scribble">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="pf-bag-wrap">
          <button type="button" className={`pf-bag ${fresh && open ? "is-bump" : ""}`} aria-expanded={open} onClick={() => setOpen((o) => !o)} data-bag>
            <span className="pf-bag-label">Bag</span>
            <b className="pf-bag-count">
              <RollNumber value={String(count)} />
            </b>
          </button>
        </div>
      </header>

      <div className={`pf-dim ${open ? "is-open" : ""}`} onClick={shut} aria-hidden />
      <aside className={`pf-drawer ${open ? "is-open" : ""}`} aria-label="Your crate" aria-hidden={!open}>
        <div className="pf-drawer-head">
          <p className="font-display">Your crate</p>
          <button type="button" className="pf-drawer-x" onClick={shut} aria-label="Close the bag">
            ×
          </button>
        </div>
        <ul className="pf-drawer-list">
          {items.map((it) => {
            const p = products[it.id];
            return (
              <li key={it.key} className={it.key === fresh ? "is-fresh" : ""}>
                <Bottle juice={p.juice} className="pf-cart-bottle" />
                <span className="pf-drawer-text">
                  <b className="font-display">{p.name}</b>
                  <small>{lineOf(it)}</small>
                  <small>
                    {it.qty} × {rupee(priceOf(it))}
                  </small>
                </span>
                <span className="mk pf-drawer-price">{rupee(priceOf(it) * it.qty)}</span>
              </li>
            );
          })}
        </ul>
        <div className="pf-drawer-foot">
          <div className="pf-cart-total">
            <span>Total</span>
            <b className="mk">
              <RollNumber value={rupee(total)} />
            </b>
          </div>
          <button type="button" className="pf-btn pf-btn-tomato pf-btn-block">
            Checkout
          </button>
          <p className="pf-sample">Free cold delivery over ₹999 · concept site</p>
        </div>
      </aside>
    </>
  );
}
