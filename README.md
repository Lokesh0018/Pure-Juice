# Pure Juice

Concept website for a fictional cold-pressed juice brand (sample ₹ prices). Designed at 1440×900, with stacked
layouts for phones and tablets (< 1024 px).
Built with Vite, React, Tailwind CSS v4, GSAP and Lenis.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

URL options: `?static=1` shows every section in its final state with no motion; `?record=1` auto-scrolls the page for screen recording.

## Where things live

| Path | What |
|---|---|
| `site/content.ts` | all text, products, prices and image names |
| `site/site.ts` | page title, meta and theme colours / fonts |
| `site/site.css` | all site styles: one layer grouped by section in page order, then overrides, small screens, keyframes |
| `site/fonts.ts` | Inter Tight + Instrument Serif |
| `site/components/` | the page sections (hero, flavours, mix, product, farm, benefits, cleanses, reviews, footer, nav, loader) |
| `site/lib/motion.ts` | shared motion and layout helpers (pin progress, stage fitting) |
| `site/DESIGN.md` | design decisions, motion map and asset notes |
| `components/engine/` | smooth scroll, data-attribute animations, record mode |
| `lib/` | GSAP setup, loader tracking, site types |
| `app/` | global CSS |
| `public/images/pure-juice/` | product, fruit and photo images (WebP) |
| `public/images/loader/` | the logo cut into layers for the loading screen |
| `public/` | logos, favicons and app icons |

