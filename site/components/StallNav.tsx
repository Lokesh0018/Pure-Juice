"use client";

import { useEffect, useRef, useState } from "react";
import { nav, pdp, products, rupee, type Juice } from "@/site/content";
import { Bottle, RollNumber } from "./bits";

/** A bag line: a product (+ size), or a custom line such as a cleanse plan (its own name, note, price and bottle). */
type Item = { key: string; id: string; size: string; qty: number; name?: string; note?: string; price?: number; juice?: Juice };
type AddDetail = { id: string; size?: string; name?: string; note?: string; price?: number; juice?: Juice };
const AUTO_CLOSE = 2500; // ms

const sizeOf = (size: string) => pdp.sizes.find((s) => s.id === size) ?? pdp.sizes[0];
const priceOf = (it: Item) => it.price ?? (it.size === "single" ? products[it.id].price : sizeOf(it.size).price);
const lineOf = (it: Item) => it.note ?? `${sizeOf(it.size).label} · ${sizeOf(it.size).note}`;
const nameOf = (it: Item) => it.name ?? products[it.id]?.name ?? it.id;
const juiceOf = (it: Item): Juice => it.juice ?? products[it.id]?.juice ?? "orange";

/**
 * NV18 · stamped logo left, links centre, Bag pill right. The cart is a full-height drawer from the right screen edge
 * over a light dim: a new item lands on top with a short highlight, the total and the count roll up. It closes on ×,
 * on a click outside, or by itself after 2.5 s. Listens for "pf:add": { id, size } for a product, or
 * { id, size, name, note, price, juice } for a custom line (cleanse plans).
 */
export default function StallNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [fresh, setFresh] = useState<string | null>(null);
  const close = useRef(0);

  const [current, setCurrent] = useState<string | null>(null);
  const linksRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  // which section is on screen: the last one whose top (its pin wrapper's, for pinned sections) has passed 40% of
  // the window. Above the first linked section (the hero) nothing is current.
  useEffect(() => {
    const ids = nav.links.map((l) => l.href);
    const spy = () => {
      let cur: string | null = null;
      for (const href of ids) {
        const el = document.querySelector<HTMLElement>(href);
        if (!el) continue;
        const box = (el.closest(".pf-pin") as HTMLElement | null) ?? el;
        if (box.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = href;
      }
      setCurrent(cur);
    };
    spy();
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    return () => {
      window.removeEventListener("scroll", spy);
      window.removeEventListener("resize", spy);
    };
  }, []);

  // the highlight pill slides to the current link (measured, so any label length fits)
  useEffect(() => {
    const a = current ? linksRef.current?.querySelector<HTMLElement>(`a[href="${current}"]`) : null;
    setPill(a ? { x: a.offsetLeft, w: a.offsetWidth } : null);
  }, [current]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onAdd = (e: Event) => {
      const d = (e as CustomEvent<AddDetail>).detail ?? { id: "sunrise" };
      const size = d.size ?? "single";
      const key = `${d.id}-${size}`;
      setItems((list) => {
        const hit = list.find((i) => i.key === key);
        const rest = list.filter((i) => i.key !== key);
        const line: Item = { key, id: d.id, size, qty: (hit?.qty ?? 0) + 1, name: d.name, note: d.note, price: d.price, juice: d.juice };
        return [line, ...rest]; // the new item goes on top
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
  const removeItem = (key: string) => {
    setItems((list) => list.filter((i) => i.key !== key));
  };
  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + priceOf(i) * i.qty, 0);

  return (
    <>
      <header className={`pf-nav ${scrolled ? "is-scrolled" : ""}`} data-nav>
        <a href="#top" className="pf-logo" aria-label="Pure Juice home">
          <img src="/logo.webp" alt="Pure Juice" className="pf-logo-img" />
        </a>
        <nav ref={linksRef} className="pf-nav-links" aria-label="Main">
          <span
            className={`pf-nav-pill ${pill ? "is-on" : ""}`}
            style={pill ? { transform: `translateX(${pill.x}px)`, width: pill.w } : undefined}
            aria-hidden
          />
          {nav.links.map((l) => (
            <a key={l.href} href={l.href} className={`pf-nav-link ${current === l.href ? "is-current" : ""}`} aria-current={current === l.href ? "location" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="pf-bag-wrap">
          <button type="button" className={`pf-bag ${fresh && open ? "is-bump" : ""}`} aria-expanded={open} onClick={() => setOpen((o) => !o)} data-bag>
            <svg className="pf-bag-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
              <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
            </svg>
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
        {items.length === 0 ? (
          <div className="pf-drawer-empty" style={{ padding: "48px 24px", textAlign: "center", color: "var(--muted)" }}>
            <p className="font-display" style={{ fontSize: "20px", marginBottom: "8px", color: "var(--text)" }}>
              Your crate is empty
            </p>
            <p style={{ fontSize: "14px" }}>Add bottles from the flavours or cleanse plans below.</p>
          </div>
        ) : (
          <ul className="pf-drawer-list">
            {items.map((it) => {
              const name = nameOf(it);
              return (
                <li key={it.key} className={it.key === fresh ? "is-fresh" : ""}>
                  <Bottle juice={juiceOf(it)} className="pf-cart-bottle" />
                  <span className="pf-drawer-text">
                    <b className="font-display">{name}</b>
                    <small>{lineOf(it)}</small>
                    <small>
                      {it.qty} × {rupee(priceOf(it))}
                    </small>
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <span className="mk pf-drawer-price">{rupee(priceOf(it) * it.qty)}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(it.key)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--muted)", textDecoration: "underline", padding: "2px" }}
                      aria-label={`Remove ${name}`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
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
          <p className="pf-sample">Free chilled insulated delivery on orders over ₹999</p>
        </div>
      </aside>
    </>
  );
}
