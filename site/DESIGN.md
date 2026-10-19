# Pure Juice · Day 17 · DESIGN.md

**Mode: FULL (Max)**: recorded 1440×900 reels from Round 2 (must PASS), full screenshots and reports.

**Status: Round 0 approved by the user (2026-10-10). Round 1 (static build) done 2026-10-11. Rebranded to Pure Juice and restyled to "Studio Press" (minimal) on 2026-10-15 at the user's request; layouts and motion unchanged. The style overrides live in the last block of `site/site.css`.**

Cold-pressed juice brand (fictional, ₹ prices). Direction: **Layout B "Market Crate"**, picked by the user from three full-page mockups (`day17/refs/layouts/b-market-crate.html`). Hero and Flavours come from the user's own references (hero-1, shop-1); every other section is ours, built around them.

Uniqueness: **8 of 8 different** from each of the last 3 sites, see the sites log. Travelling object added in Round 3 at the user's request: **F9 / M717 travelling orange** (path below).

## Choices

| Menu | Pick | Why (this site) |
|---|---|---|
| Look | **Studio Press (minimal restyle, 2026-10-15, user request)**: warm white page, hairline borders, soft shadows, no textures, tilts, tape or stamps; full-colour flavour bands kept. Replaces the first build's L24 "market stall" collage | the user asked for a more minimal, industry-level look; the product colours carry the energy, everything else steps back |
| Palette | **Warm white & ink + one orange**: page `#F6F4EF`, stone surface `#ECE9E2`, cards `#FFFFFF`, hairline `#DFDBD2`, ink `#141414`, muted `#69665F`, dark band `#161616`, accent `#E8541E` (fills under white text `#C4441A`, lesson 124). Flavour bands (on purpose): orange `#E9741C`, berry `#D7192E`, green `#5FA02B`, beet `#6B1B3D`, gold `#F7C336` | one accent on a quiet neutral base; flavour colours only fill whole bands |
| Type | **Inter Tight (variable, 500–650)** for headings and text, sentence case, tracking −0.035em; **Instrument Serif italic** for a few accent words (hero "sunrise", flavour goal, blend name, quotes). Prices always in the sans with tabular figures (`@fontsource-variable/inter-tight`, `@fontsource/instrument-serif`) | a calm grotesk reads premium and modern; the serif italic adds warmth without the market-hand look |
| Nav | **N1 family as NV18**: stamped logo left, links centre, Bag pill right with a mini-cart flyout | a shop nav whose Bag reacts on camera when a bottle lands in it |
| Hero | **HR23 (H4 family)**: headline left, a diagonal wall of bottles in two rows on paint blobs right, leaves + citrus, chalkboard price sign | from the user's hero-1; the two rows slide opposite ways (no orbit, no spin, no single centred bottle) |
| Section shape | **S7 full-colour bands, clean seams** (the wooden slat strips were removed; the X96 juice-pour edge stays) | bands meet paper directly, which keeps the page quiet |
| Cards | **White cards, 16 px radius, hairline + soft shadow**; pills for buttons, chips and tags (one radius rule) | product cards and plan rows look like a real shop UI |
| Signature | **Mix your own: crate-to-bottle fill** (new motion, see Motion map) | the visitor builds a juice: 3 fruits leave the crate, the bottle fills layer by layer, the chalkboard writes the blend's name and price |
| Loader | **Logo pour** (replaced I34 drop-and-splash): the JUICE logo builds itself, the orange drops in and squeezes, juice pours into the U and fills it, with a real 0–100 counter | a short, juicy opener built from the brand's own logo that hands straight over to the hero |
| Travelling object | **F9 / M717 travelling orange** (added in Round 3, user's request): one orange travels the page and becomes the juice | it tells the farm-to-bottle story in one object |

**Eases:** arrivals `cubic-bezier(0.22,1,0.36,1)` (0.6–0.9 s), swaps `cubic-bezier(0.77,0,0.175,1)` (0.5–0.8 s), drawers `cubic-bezier(0.32,0.72,0,1)`; linear only for scrub, marquees and progress. Normal, confident speed (not slowed). Small squash only on the loader drop and fruit landings (market playful, never bouncy elsewhere).

## Section plan (9 sections + loader + nav)

| # | Section | Layout | Reference | Starts from → restyled how |
|---|---|---|---|---|
| 1 | Hero | **HR23** | **hero-1 (mine)**: headline left, diagonal bottle wall on paint blobs, leaves + citrus, badge row | `components/sections` HR23 tilted card wall → bottles instead of cards, two diagonal rows, paint-blob shapes, stamped badges, chalkboard price sign; huge Barlow Condensed headline "Squeezed at sunrise." |
| 2 | Flavours (goal chips) | **PS03** | **shop-1 (mine)**: full-colour flavour stage, giant faded flavour name, hand-lettered flavour word, 01 counter, next colour peeking in | PS03 variant switcher → goal chips Detox · Immunity · Energy · Glow on top, 4 kraft price-tag cards at the bottom (ours) |
| 3 | Mix your own (signature) | **PS10** | ours | PS10 mix-your-case builder → a wooden crate of 9 fruit bins (picks numbered 1-2-3), the empty bottle centre, a chalkboard on a wooden frame right |
| 4 | Product detail | **PS11** | ours | PS11 wheel label picker → flavour names on a curved wheel left, bottle on a colour disc centre with fruit cut-outs, buy box right (size rows, Add to bag, printed nutrition label) |
| 5 | Farm → bottle | **PD07** | ours | PD07 big-number ledger steps → giant tomato step number, a ledger of 5 timed rows (5:00 am Farm … 7:30 am Bottle), a taped photo that changes per step |
| 6 | Benefits in numbers | **ST06** | ours | ST06 comparison bars → chalkboard band, "Fresh vs a carton" (heat, added sugar, fruit per bottle, days since pressed) |
| 7 | Cleanse & subscription | **PR14** | ours | PR14 radio plan list → crate photo left, plan rows with hand-lettered prices, delivery frequency chips, running total, Subscribe |
| 8 | Reviews | **SP10** | ours | SP10 stacked review cards → taped paper notes in marker handwriting (sample reviews, fruit badges instead of faces); small note under the stack: "Sample values · concept site" |
| 9 | Footer | **FO03** | ours | FO03 newsletter strip + columns + socials → tomato sign-up strip, link columns, crate-stencil wordmark sinking off the corner
| — | Nav | **NV18** | ours | NV18 nav with mini-cart dropdown → stamped logo, Bag pill with count + flyout |

No layout code twice, none used by Days 14–16. Ideas mixed from the two references + our own; nothing copied from a real brand's site (hero-1 is a real juice brand's page: we take only "diagonal bottles on paint blobs"; our bottles, labels, blobs, type and layout are ours, no logo, no copy).

## Motion map

| # | Section | Layout | Motion | How it plays here | Record mode |
|---|---|---|---|---|---|
| 0 | Loader | — | **Logo pour** (was I34) | letters rise, the orange drops in and squeezes, a juice stream falls into the U and fills it bottom-up with a wavy surface (logo layers in `public/images/loader/`); real 0→100 counter (hero images load behind it, lesson 3); CSS motion from the first paint (lesson 11) | fixed 2.4 s, wipes off while the hero intro already moves |
| 1 | Nav | NV18 | **M383** text morph | the Bag pill label morphs "Bag 2" → "Added" → "Bag 3" (shared letters glide) when a bottle lands; the mini-cart flyout drops open for a beat (U54) | plays on the Add-to-bag click |
| 2 | Hero | HR23 | **M42** split opposite scroll | the bottle wall's two diagonal rows slide in opposite directions along the diagonal, tied to scroll, while the blobs and leaves drift at 3 depths and the headline lines rise in from masks; a self-playing intro starts on the loader's last frame and runs until the scroll overtakes it (lessons 4, 64) | intro 1.4 s, then scrub; hover stop on one bottle |
| 3 | Flavours | PS03 | **M543** clip-path wipe carousel | a goal-chip click wipes the next flavour colour in from the peeking right strip over the stage (0.8 s), the giant faded name swaps whole, the bottle and fruit cross-fade to the new flavour; with scroll the ghost word drifts sideways and the bottle rises (scrub). Cards change with **X38** sequential category slide (old tags leave one by one, new ones arrive): tiles never reflow (lesson 52) | cursor clicks "Energy" (orange → berry); normal mode auto-advances every 4 s while on screen |
| 4 | Mix your own | PS10 | **M716 NEW · crate-to-bottle fill** (added to MOTION-MENU in Round 2) | pinned: each picked fruit lifts out of its bin, arcs into the bottle neck (MotionPath) and dissolves into a new liquid layer that rises with a soft wavy surface; after the 3rd the seams blend into the mix colour, the chalkboard writes the name by hand (**M110** supporting) and the price chalks in. Different from Day 3's scoop stack: nothing stacks as objects, the fruit becomes liquid | cursor clicks Orange → Carrot → Ginger; normal mode auto-mixes once if nobody clicks |
| 5 | Product detail | PS11 | **M267** flip-words drum (scroll-stepped) | the flavour wheel steps Berry Bright → Green Glow → Sunrise Orange with scroll; the bottle and colour disc cross-fade to each flavour, the "inside" fruit row swaps; size row highlight slides (Flip on the highlight frame only); Add to bag sends the bottle along an arc into the Bag (**U65** / F8), count bumps | scrub + cursor click "3-Day Cleanse" row, then Add to bag |
| 6 | Farm → bottle | PD07 | **M94** scroll-scrubbed letter swap | pinned 5 steps: the giant number rolls 01 → 05 and the step word rolls Farm → Wash → Cut → Press → Bottle, tied to scroll; the ledger row lights with its time; the taped photo cross-fades (scrubbed, never stepped, lesson 10) and nudges like paper | scrub, 0.8 s per step |
| 7 | Benefits | ST06 | **M225** bar chart grow (horizontal) | "ours vs carton" bars grow from the left in pairs, values count up beside them, chalk dust drifts slowly on the board | scrub on arrival |
| 8 | Cleanse & subscription | PR14 | **M231** group flip-down | the plan rows hinge up from lying flat like tags lifted off a table (staggered), then the frequency chips and total slide in; the crate photo pushes in slowly | on view; cursor hover on "3-Day Cleanse" |
| 9 | Reviews | SP10 | **M527** flick-to-back stack | the top taped note is flicked off sideways and slides back under the pile, revealing the next (every ~2 s while on screen) | auto, one flick on camera |
| 10 | Footer | FO03 | **M239** ink-stamp reveal | ink blots stamp along the giant wordmark and reveal it on the dark footer; the tomato strip's headline lifts in; a coarse slow-moving light band keeps the last screen alive (lessons 35, 55) | plays on the clock once on screen (lesson 77) |

No code used twice. Hero (M42 bottle rows) and signature (M716) repeat no earlier site's hero or signature; the hero is not a "shape grows to full screen".

**Transitions:** 1→2 **X7** diagonal wipe (the orange band slants in along the bottle diagonal) · 2→3 **X48** row cover (bands come in like crate slats, retract onto the kraft Mix section) · 3→4 **X11** liquid wipe (a wavy juice edge pours down into the product section; SVG wave, not a shader) · 4→5 S7 slat seam with overlap (bottom-aligned sticky, lesson 87) · 5→6 **X51** booklet page turn (the ledger page turns over into the chalkboard band) · 6→7 slat seam overlap · 7→8 slat seam overlap · 8→9 tomato strip rises over the notes.

**Details:** magnetic Add to bag and Subscribe buttons (U68) · `data-cursor` labels "Shop" on hero bottles and cards, "Pick" on fruit bins · scribble underline on links (U09) · count bump on the Bag pill · chalk-dust drift on boards.

## Hover map

| Element | Where | Hover effect | From | Record cursor |
|---|---|---|---|---|
| Hero bottle | Hero wall | the bottle slides out of its row along its own axis, label brightens, cursor shows "Shop" | ours | `data-hover-demo` (Sunrise bottle) |
| Price-tag card | Flavours | the tag swings slightly on its string hole, the bottle lifts 8 px, a "+ Add" strip slides up (U58 adapted) | ours | `data-hover-demo` (1st card) |
| Goal chip | Flavours | a highlight pill slides under the hovered chip (U25); click = colour wipe + cards change | shop-1 + ours | `data-hover-demo="click"` ("Energy") |
| Fruit bin | Mix your own | the fruit hops up in its bin with a growing shadow (U03), bin edge lights, cursor shows "Pick"; click = pick | ours | `data-hover-demo="click"` ×3 (Orange, Carrot, Ginger) |
| Flavour wheel name | Product detail | letters roll to the accent colour (U33); click = select flavour | ours | — (wheel steps by scroll) |
| Size row | Product detail | row lifts, a hard ink shadow grows 0 → 5 px; click = the highlight frame slides to it (Flip), price and button label update | ours | `data-hover-demo="click"` ("3-Day Cleanse") |
| Add to bag | Product detail | tomato juice rises into the button with a wavy edge (U38); click = bottle flies to the Bag (U65), count bumps (M383) | ours | `data-hover-demo="click"` |
| Bag pill | Nav | mini-cart flyout opens (U54), items stagger in | ours | opens by itself after the add |
| Plan row | Cleanse | row lifts, hard shadow grows, the radio dot fills with juice, a chalk underline scribbles under the price (U09) | ours | `data-hover-demo` ("3-Day Cleanse") |
| Frequency chip | Cleanse | one sliding pill moves under the hovered chip (U25) | ours | — |
| Review note | Reviews | the note straightens from its tilt and lifts, its tape lightens | ours | — |
| Primary button | everywhere | colour block rises from below, arrow tips forward (U30); magnetic pull (U68) | ours | — |
| Text link | nav, footer | marker scribble draws underneath and erases on leave (U09) | ours | — |
| Social square | Footer | fills tomato, icon nudges up | ours | — |

**Record-cursor path (9 stops):** hero bottle hover → Flavours 1st card hover → click "Energy" chip (cards change, colour wipes orange → berry) → click Orange, Carrot, Ginger in the crate (bottle fills, chalkboard writes "Sunrise Kick · ₹149") → click the "3-Day Cleanse" size row → click Add to bag (bottle flies to the Bag, count 2 → 3, flyout opens) → hover the "3-Day Cleanse" plan row. Every stop sits on a `data-record-hold` ≤ 1.2 s with ambient life during it (lessons 8, 74).

## Product detail plan

| Interaction | Section | How it works here | From |
|---|---|---|---|
| Flavour picker recolours the bottle | Product detail (+ Flavours stage) | wheel / chip changes cross-fade pixel-aligned bottle colour stills (one shared mask) and the colour disc | shop-1 + ours |
| Ingredients per bottle | Product detail | fruit cut-out row ("4 oranges · 2 carrots · ginger · ½ lemon") swaps per flavour | ours |
| Size / pack options | Product detail | rows Single 300 ml ₹149 · 6-Pack ₹799 · 3-Day Cleanse 18 bottles ₹2,249 with a sliding highlight frame (Flip on the frame only) | ours |
| Nutrition facts | Product detail | printed label (calories, natural sugars, 0 g added sugar, vitamin C) updates per flavour; small line under the label: "Sample values · concept site" | ours |
| Add to bag animation | Product detail → nav | bottle copy arcs into the Bag (F8 / U65), count bumps, flyout opens | ours |
| Build-your-own | Mix your own | 3 picks fill the bottle, name + price generated (Orange + Carrot + Ginger = Sunrise Kick · ₹149) | ours (user's request) |
| Subscription | Cleanse | plan rows 1-Day Reset 6 bottles ₹799 · 3-Day Cleanse 18 bottles ₹2,249 · 5-Day Reboot 30 bottles ₹3,499 + chips ONCE · WEEKLY SAVE 15% · FORTNIGHTLY SAVE 10% · MONTHLY SAVE 5% + running total (Weekly: ₹1,912, ₹2,249 struck through) | ours |

## Reel time table (built in Round 2: 36.6 s = 2.4 s loader + 34.2 s record clock; the Round 2 reel measured 37.4 s)

| Clock (s) | Section / step | Move · hold | Cursor |
|---|---|---|---|
| −2.4–0 | Loader logo pour: letters, orange, juice fills the U, real counter, wipe (hero intro starts on the wipe) | fixed 2.4 | — |
| 0–1.4 | Hero intro (rows slide, headline rises) | hold 1.4 | — |
| 1.4–2.75 | Hero: short scroll, hold | 0.45 · 0.9 | **hover** Sunrise bottle |
| 2.75–5.45 | Flavours arrive, hold | 1.5 · 1.2 | **click** "Energy" (orange → berry) |
| 5.45–7.15 | Flavours bottom, hold | 0.9 · 0.8 | **hover** 1st price tag |
| 7.15–8.75 | Mix arrives, pins | 1.6 | — |
| 8.75–14.75 | Mix: 4 short stops inside the pin | 4 × (0.3 · 1.2) | **click** Orange, Carrot, Ginger |
| 14.75–16.0 | Mix: chalk writes "Sunrise Kick · ₹149" | 0.3 · 0.95 | — |
| 16.0–17.2 | Product arrives, pins | 1.2 | — |
| 17.2–19.7 | Drum steps Berry → Green → Sunrise, hold | 1.5 · 1.0 | **click** "3-Day Cleanse" (18 bottles · ₹2,249) |
| 19.7–21.4 | Add to bag, hold (Bag flyout opens) | 0.5 · 1.2 | **click** Add to bag |
| 21.4–26.6 | Farm arrives + 5 pinned steps | 1.2 + 4.0 | — |
| 26.6–27.8 | Benefits | 1.2 | — |
| 27.8–30.8 | Cleanse plans, hold (total ₹1,912 weekly) | 2.0 · 1.0 | **hover** "3-Day Cleanse" plan |
| 30.8–32.2 | Reviews | 1.4 | — |
| 32.2–34.2 | Footer (light band keeps the end alive) | 2.0 | — |

9 cursor stops (6 clicks, 3 hovers). Every hold ≤ 1.2 s (lesson 74); the Mix pin uses several short stops instead of one long hold.

## Round 2 build notes

- **Pins** are CSS sticky (lesson 87): Mix 750 px, Product 700 px, Farm 1200 px of pin, with invisible marker stops for record mode.
- **M716** (added to MOTION-MENU): the record cursor makes the real clicks; normal mode auto-mixes once if nobody clicks. The three layers stay readable after the 3rd pick (user fix 4), instead of blending into one colour.
- **M94 (Farm):** the digit rolls continuously with the scroll; the step **word swaps whole** (lift out, then rise in), never letter by letter (lessons 85, 100).
- **M267 (Product):** drum position, bottle cross-fade (pixel-aligned stills) and disc colour follow the scroll continuously; one name layer shows at a time.
- **V1 replacement:** the press photo has a shimmer running down the juice stream and a ripple in the tray (SVG over the photo), plus a slow push-in.
- **Life layer** (`.pf-life`): soft coarse light bands drift behind the loader, Flavours, Mix, Product and Plans so holds never freeze (lessons 55, 70, 108).

## Round 3 (2026-10-11): hand-scrolled reel

The user films the final reel by scrolling by hand, so **every scroll-linked motion is a pure function of the scroll position** (any speed, a stop, or scrolling back gives the same frame) and **nothing depends on the record cursor**. Mix your own picks Orange → Carrot → Ginger with the scroll (undone when scrolling back); clicks still work.

### Travelling orange (F9 / M717, `site/components/OrangeTraveller.tsx`)

Cut-outs from f1: whole orange + orange half (two mirrored halves); the drop, splash and stamp are SVG. One fixed layer, waypoints measured live from anchor elements each frame. It replaces each section's own orange (`.pf-traveller-slot`, crate cell 1 empty until the hand-over), routes only through free space, and is hidden in `?static=1`.

| # | Section | Path (scroll-linked, forward and back) | Free space it uses | Replaces |
|---|---|---|---|---|
| 1 | Hero | the hero's whole orange lifts, spins and rolls out across the bottle wall | over the wall, never the headline or buttons | hero orange |
| 2 | Flavours | down the right margin, lands on the featured-orange spot beside the bottle, then hops right → left along the four price-tag tops (squash on each landing) | right of the bottle; the strip above the card names | featured orange (orange flavour) |
| 3 | Mix your own | lane right of card 2 → the gap between crate and bottle → drops into crate cell 1 and becomes the Orange pick (first scroll pick) | the crate/bottle gap | the Orange bin fruit |
| 4 | Farm → bottle | appears at step 3 (Cut) under the ledger, splits into two halves; at step 4 (Press) the halves squeeze into one juice drop | below the ledger | — |
| 5 | Fresh vs a carton | down the clear column between the title and the bars, then runs along "Fruit per bottle" and fills it (the bar follows the drop) | gap column, the bar itself | — |
| 6 | Cleanse | right margin, across the seam, falls into a bottle neck in the crate photo with a small splash | margin, photo | — |
| 7 | Footer | a final orange rolls in from the right and becomes a round stamp beside PURE JUICE (the lettered ring keeps turning) | right of the columns, above the wordmark | — |

### New motion this round

| Section | Code | How it plays |
|---|---|---|
| Hero → Flavours | **M14** marquee | "PRESSED TODAY · NO HEAT · NO ADDED SUGAR · GLASS BOTTLES"; follows the scroll direction and speeds up with scroll velocity |
| Hero → Flavours, Farm → Benefits, Cleanse → Reviews | **X96** juice-pour edge (new) | the next section's colour rises over the seam as a wavy liquid surface, scroll-linked; only these three seams |
| Hero | M42 + hover | rows keep a slow drift after the intro; bottles tilt toward the cursor |
| Flavours | **M543** + **M718** (new) | chip click or 4 s auto-advance: colour wipes in from the right edge, copy/bottle/splash swap whole, cards re-enter one by one, a burst of that flavour's fruit pieces; chips ↔ featured ↔ cards always match |
| Mix | M716 | scroll-picked; fruit bobs in its cell on hover, a picked fruit bounces |
| Product | M267 | cold drops slide down the bottle, price digits roll on size change, size rows lift; Add to bag adds flavour + size into a full-height cart drawer (new item on top, highlight, total + count roll, closes on ×, click outside or after 2.5 s) |
| Farm | M94 | digit rolls in 0.3 s inside its clipped glyph box; polaroid tilts and settles on each change; tape lifts on hover |
| Benefits | **M225** | each row fills in turn with its numbers counting, scroll-linked; "Fruit per bottle" is filled by the drop |
| Cleanse | M231 (hover state) | radio fills on hover, total digits roll, crate photo clinks on hover |
| Reviews | **M527** | the scroll picks the top note (flick off / slide back), a click flicks to the next |
| Footer | **M239** | ink blots stamp along PURE JUICE, scroll-linked, complete at the page bottom |

## Assets

Source rule: **Flow stills + code motion. No Blender** (a turntable is not the signature; lesson 113). No video is required; one Veo loop is optional. All stills share one look: soft morning daylight, warm kraft/wood tones, no people, **no faces, no hands**. Every Flow still gets the ✦ check + clean (lessons 92, 112). Cut-outs: `npm run cutout` (BiRefNet, lesson 33), product shots on a plain mid-grey backdrop (lesson 42).

| ID | Source | What it is | Ratio / size | Attach | Used in | Code fallback |
|---|---|---|---|---|---|---|
| B1 | Flow | **Master bottle**: one plain cold-press juice bottle (round shoulders, black ribbed cap), filled orange, blank kraft label band, straight front view on plain mid-grey | 3:4 portrait, ≥ 2000 px tall | — | everything below is cut from it | SVG bottle (mockup `pieces.js`) |
| B2–B6 | Flow edit | Same bottle, liquid recoloured: B2 berry red, B3 green, B4 beet purple, B5 gold, B6 pale melon pink. Pixel-aligned with B1 (shift measured and undone, lesson 92) | same as B1 | B1 | flavour stage, cards, product disc, hero wall, plans, footer | code tint of B1's liquid area through a shared mask |
| B0 | Flow edit | Same bottle **empty and clear**, cap on, blank label | same as B1 | B1 | Mix your own (liquid layers drawn in code inside its mask) | SVG bottle outline |
| F1 | Flow | Fruit sheet 1: whole orange, orange half, strawberry, carrot, ginger root, beetroot with leaves, spaced on mid-grey | 1:1, ≥ 2048 px | — | crate bins, inside rows, splashes, hero props | SVG fruit (mockup) |
| F2 | Flow | Fruit sheet 2: green apple, red apple, pineapple chunk, lime half, lemon half, mint sprig, cucumber slice, spinach leaf, citrus leaves | 1:1, ≥ 2048 px | F1 (same light) | crate bins, inside rows, hero leaves | SVG fruit (mockup) |
| S1 | Flow | Juice splash crown, orange, on mid-grey (cut out) | 16:9 | — | flavour stage behind the bottle | SVG splash dots |
| P1–P5 | Flow | Farm → bottle photos, one look, **no people and no hands in any frame**: P1 orange orchard at sunrise with full wooden crates; P2 fruit in a steel washing trough of water; P3 halved oranges and carrots on a wooden board with a knife; P4 cold press machine with juice running into a steel tray; P5 filled bottles in a row on a chilled steel table | 3:4 portrait, ≥ 1600 px tall | P1 for P2–P5 (same grade) | Farm → bottle taped photo | illustrated SVG stations |
| P6 | Flow | A wooden crate of filled bottles on kraft paper, top-down three-quarter | 3:4 portrait | B1 | Cleanse plan photo | composite of B-cut-outs in a CSS crate |
| T1 | Flow | Textures: kraft paper (seamless), chalkboard (seamless), crate wood | 1:1 each, ≥ 1024 px | — | page paper, boards, crate | CSS noise + gradients |
| ~~V1~~ | **skipped** (user, 2026-10-10) | — | — | — | — | **P4 animated in code**: slow drift/push-in on the still + a shimmer running down the juice stream (masked moving highlight) |
| C0 | live | Reel cover: hero frame from the final reel + one bottle cut-out (`npm run cover`) | 9:16 | — | Instagram cover | — |

## Asset check (2026-10-10)

All 19 files received in `raw/` (originals kept in `raw/_orig/`). `s1-splash.jpg .jpg` renamed to `s1-splash.jpg`.

| File(s) | Size | Ratio | Notes |
|---|---|---|---|
| b0–b6 bottles | 1792×2400 | 3:4 ✓ | ✦ cleaned (edits had 2 marks, b1 one). Aligned with b1: offsets ≤ 0.07 px (phase correlation on edge maps), outlines match in the edge overlay; no shift applied. The liquid line in the neck sits a few px higher/lower per edit (liquid only, not the bottle) |
| f1-fruits | 2048×2048 | 1:1 ✓ | 6 fruits; ✦ cleaned |
| f2-fruits | **1024×1024** | 1:1 | under the ≥ 2048 spec; 9 items at ~250 px each, enough for ≤ 120 px on the page; ✦ cleaned |
| s1-splash | 1376×768 | 16:9 ✓ | ✦ cleaned |
| p1–p6 photos | **896×1200** | 3:4 ✓ | under the ≥ 1600 px spec; fine for the 460×640 taped photo (≈ 1.9×). No people, no hands ✓. ✦ cleaned; p3, p5 re-done with a pixel clone along the edge, p4 with clone + brightness heal across the wall/floor edge (lessons 112, 118) |
| t1 kraft / chalk / wood | 1024×1024 | 1:1 ✓ | ✦ cleaned; check tiling seams in Round 1 |

### Re-check (Round 1, 2026-10-11)

- Every file re-checked at 100 % (original | cleaned | high-pass | diff). **p1** (flat rectangle in the grass) and **p4** (light disc across the wall/floor edge) were re-done from `raw/_orig/`: p4 = pixel clone along the measured wall edge (slope 0.39, source −100/−39 px) with a per-side brightness heal; p1 = the ✦ un-blended (its alpha shape measured on b1's flat backdrop, fitted to p1's mark) + a 3 px rim inpaint, so the real grass shows through. Faint smudges left on b0–b6 and f2 sit on the grey backdrop only and are removed by the cut-outs.
- Alignment re-measured (phase correlation on edge maps vs b1): b0 −0.00/−0.04 px · b2 +0.11/−0.00 · b3 −0.00/−0.06 · b4 +0.29/−0.05 · b5 −0.01/−0.06 · b6 +0.12/+0.00. Cap, label and outline overlap in the edge overlay; **no shift applied** (all < 0.3 px).
- Cut-outs (`raw/cutout/`): 7 bottles (b0–b6) share **one identical alpha mask** (verified byte-equal) + a see-through glass variant of b0; 15 fruits from f1/f2; the s1 splash. Checked on dark and light.
- Web copies in `public/images/pure-juice/` (WebP, 1.6 MB total): bottles 600×1525, fruits ≤ 480 px, photos 896×1200, splash, and the three textures made seamless (half-offset blend; wood only across its left/right seam).
- V1 skipped as agreed: P4 gets code motion in Round 2.

## Prompts (as run)

All Nano Banana Pro, x4, 2K. Recorded 2026-10-11 as pasted by the user (assets delivered 2026-10-10).

**B1 · 3:4** · first run came out 16:9 by mistake (rejected); final = edit of that bottle, attach the 16:9 pick
```
Use the attached image as the reference: the exact same bottle, same shape, same black ribbed cap, same blank kraft label band, same orange juice level, same mid-grey backdrop and light. Reframe it as a tall portrait shot: the bottle standing upright in a straight front view, centred, filling about 80% of the frame height, with even space above and below. Soft shadow below, crisp clean edges, one soft vertical highlight on the glass. Photorealistic, sharp focus. No text, no logo, no brand, no people, no hands.
```

**B1 original** (16:9 run, used only as the reference above)
```
Product photograph of one plain cold-pressed juice bottle standing upright, straight front view, centred: clear glass bottle with soft rounded shoulders and a short neck, a black ribbed screw cap, filled to the shoulder with bright fresh orange juice, a blank plain kraft-paper label band wrapped around the middle with nothing printed on it. Plain seamless mid-grey backdrop (#8A8A8A), soft even daylight from the upper left, a soft shadow below, crisp clean edges, the glass slightly glossy with one soft vertical highlight. The bottle fills about 75% of the frame height with even space around it. Photorealistic, sharp focus. No text, no logo, no brand, no people, no hands.
```

**B2 berry · 3:4** · attach only b1-master
```
Edit the attached image only. Keep every pixel identical: same bottle, cap, label, framing, backdrop, light, highlight and shadow. Change only one thing: the juice inside becomes a deep berry red (#D7192E), same fill level, same glossy look. Do not move, resize or redraw anything. No text, no logos.
```

**B3 green · 3:4** · attach only b1-master
```
Edit the attached image only. Keep every pixel identical: same bottle, cap, label, framing, backdrop, light, highlight and shadow. Change only one thing: the juice inside becomes a fresh bright green (#5FA02B), like a green apple and spinach juice, same fill level, same glossy look. Do not move, resize or redraw anything. No text, no logos.
```

**B4 beet · 3:4** · attach only b1-master
```
Edit the attached image only. Keep every pixel identical: same bottle, cap, label, framing, backdrop, light, highlight and shadow. Change only one thing: the juice inside becomes a deep beetroot purple (#6B1B3D), same fill level, same glossy look. Do not move, resize or redraw anything. No text, no logos.
```

**B5 gold · 3:4** · attach only b1-master
```
Edit the attached image only. Keep every pixel identical: same bottle, cap, label, framing, backdrop, light, highlight and shadow. Change only one thing: the juice inside becomes a warm golden yellow (#F7C336), like pineapple juice, same fill level, same glossy look. Do not move, resize or redraw anything. No text, no logos.
```

**B6 melon · 3:4** · attach only b1-master
```
Edit the attached image only. Keep every pixel identical: same bottle, cap, label, framing, backdrop, light, highlight and shadow. Change only one thing: the juice inside becomes a soft pale melon pink, like watermelon juice, same fill level, same glossy look. Do not move, resize or redraw anything. No text, no logos.
```

**B0 empty · 3:4** · attach only b1-master
```
Edit the attached image only. Keep every pixel identical: same bottle shape, cap, label, framing, backdrop, light and shadow. Change only one thing: the bottle is now completely empty and clean, clear glass with no juice inside, so the grey backdrop shows through the glass. Do not move, resize or redraw anything. No text, no logos.
```

**F1 · 1:1** · no attachment
```
Top-down studio photograph of six fresh items laid out in a neat grid of 3 across and 2 down on a plain seamless mid-grey backdrop (#8A8A8A), with wide even empty space between them so none touch: a whole orange, an orange cut in half showing the juicy inside, a ripe strawberry with its leaves, a whole carrot with a short green top, a fresh ginger root, a small beetroot with its leaves. Each item roughly the same size in frame. Soft even daylight, soft short shadows, bright natural colours, crisp detail. Photorealistic. No hands, no people, no props, no text, no logos.
```

**F2 · 1:1** · attach f1-fruits
```
Use the attached image only as a reference for the light, backdrop and camera angle. Do not copy its fruits. Top-down studio photograph of nine fresh items laid out in a neat grid of 3 across and 3 down on a plain seamless mid-grey backdrop (#8A8A8A), with wide even empty space between them so none touch: a green apple, a red apple, a pineapple chunk, a lime cut in half, a lemon cut in half, a sprig of mint, a cucumber slice, a spinach leaf, two glossy citrus leaves. Each item roughly the same size in frame. Soft even daylight, soft short shadows, bright natural colours, crisp detail. Photorealistic. No hands, no people, no props, no text, no logos.
```

**S1 · 16:9** · no attachment
```
High-speed studio photograph of a single splash of bright orange juice frozen in mid-air: a crown-shaped splash with droplets flying outward, centred, on a plain seamless mid-grey backdrop (#8A8A8A). Crisp sharp droplets, glossy juice, soft even light, nothing else in frame. Photorealistic. No glass, no fruit, no hands, no text, no logos.
```

**P1 · 3:4** · no attachment
```
An orange orchard at sunrise: rows of orange trees heavy with ripe fruit, soft golden low sunlight through the leaves, light morning haze far in the background, and in the foreground three full wooden crates of freshly picked oranges stacked on the grass. Warm, fresh, natural colours, calm and inviting. Photorealistic, shallow depth of field on the crates. No people, no hands, no tractors, no text, no logos.
```

**P2 · 3:4** · attach p1-orchard
```
Use the attached image only as a reference for the light, colour grade and mood. New scene: freshly picked oranges, carrots and apples floating in a large stainless-steel washing trough of clear water, droplets on the fruit, soft morning daylight from a window, a few wooden crates in the soft background. Photorealistic, fresh and clean. No people, no hands, no text, no logos.
```

**P3 · 3:4** · attach p1-orchard
```
Use the attached image only as a reference for the light, colour grade and mood. New scene: halved oranges, sliced carrots and a piece of ginger on a thick wooden chopping board, juicy cut surfaces, a chef's knife lying beside them, soft morning daylight, a wooden crate of whole oranges in the soft background. Photorealistic, fresh. No people, no hands, no text, no logos.
```

**P4 · 3:4** · attach p1-orchard
```
Use the attached image only as a reference for the light, colour grade and mood. New scene: a stainless-steel cold-press juice machine in a clean small workshop, a thin stream of fresh orange juice running from its spout into a steel tray, pressed fruit pulp in a mesh bag above, soft morning daylight. Photorealistic, clean and fresh. No people, no hands, no text, no logos, no brand marks on the machine.
```

**P5 · 3:4** · attach p1-orchard
```
Use the attached image only as a reference for the light, colour grade and mood. New scene: a neat row of filled cold-pressed juice bottles in different colours (orange, red, green, purple, yellow) standing on a chilled stainless-steel table with a light frost, plain blank kraft labels, black caps, soft morning daylight. Photorealistic. No people, no hands, no text on the labels, no logos.
```

**P6 · 3:4** · attach b1-master + p1-orchard
```
Use the first attached image as the reference for the bottle (same shape, black cap, blank kraft label) and the second only for light and colour. New scene: a wooden crate filled with eight of these juice bottles in different juice colours (orange, berry red, green, beet purple, golden yellow), sitting on brown kraft paper, seen from a three-quarter top view, soft morning daylight, a few citrus leaves and an orange half beside the crate. Photorealistic. No people, no hands, no text on the labels, no logos.
```

**T1a kraft · 1:1** · first wording blocked by Flow's filter; this reworded version worked
```
A close-up photo of a sheet of brown wrapping paper lying flat, seen from directly above, filling the whole frame. Soft even daylight, light tan-brown colour, fine natural paper fibres, smooth and flat with no creases. Nothing else in the picture.
```

**T1b chalkboard · 1:1**
```
Seamless flat texture of a dark green-black chalkboard, viewed straight on, evenly lit, with very faint old chalk smudges spread evenly across the surface, no frame, no writing, no drawings, no vignette. Uniform across the whole frame so it can tile. No text, no logos.
```

**T1c crate wood · 1:1**
```
Seamless flat texture of light pine crate wood planks running horizontally, viewed straight on, evenly lit, natural grain and a few small knots, warm honey tone, no nails, no stamps, no vignette. Uniform across the whole frame so it can tile. No text, no logos.
```
