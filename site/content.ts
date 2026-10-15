// All text and data for Pure Juice (fictional cold-pressed juice brand, sample ₹ prices).

const IMG = "/images/pure-juice";
export const img = (name: string) => `${IMG}/${name}.webp`;

export type Juice = "orange" | "berry" | "green" | "beet" | "gold" | "melon";

/** Bottle stills: pixel-aligned colour edits of one master bottle (one shared cut-out mask). */
export const bottle = (j: Juice | "empty" | "glass") => img(`bottle-${j}`);

/** Band colours (whole bands only, never small accents). */
export const juiceColor: Record<Juice, string> = {
  orange: "#E9741C",
  berry: "#D7192E",
  green: "#5FA02B",
  beet: "#6B1B3D",
  gold: "#F7C336",
  melon: "#F08A8A",
};

export type Product = {
  id: string;
  name: string;
  word: string; // short word printed on the bottle label
  juice: Juice;
  goal: string; // the goal shown on its price tag
  price: number;
  ml: number;
  blurb: string;
  inside: { fruit: string; label: string }[];
  nutrition: { kcal: number; sugar: number; vitC: string; fibre: string };
};

export const products: Record<string, Product> = {
  sunrise: {
    id: "sunrise",
    name: "Sunrise Orange",
    word: "Sunrise",
    juice: "orange",
    goal: "Immunity",
    price: 149,
    ml: 300,
    blurb: "Orange, carrot, ginger and lemon. Your morning vitamin C, pressed before you wake up.",
    inside: [
      { fruit: "orange", label: "4 oranges" },
      { fruit: "carrot", label: "2 carrots" },
      { fruit: "ginger", label: "Ginger" },
      { fruit: "lemon-half", label: "½ lemon" },
    ],
    nutrition: { kcal: 132, sugar: 24, vitC: "180%", fibre: "1 g" },
  },
  berry: {
    id: "berry",
    name: "Berry Bright",
    word: "Berry",
    juice: "berry",
    goal: "Glow",
    price: 169,
    ml: 300,
    blurb: "Strawberry, red apple and a little beet. Sweet, deep and quick: the pick-me-up after a long day.",
    inside: [
      { fruit: "strawberry", label: "12 strawberries" },
      { fruit: "apple-red", label: "2 red apples" },
      { fruit: "beet", label: "¼ beet" },
      { fruit: "lime-half", label: "½ lime" },
    ],
    nutrition: { kcal: 141, sugar: 27, vitC: "120%", fibre: "2 g" },
  },
  green: {
    id: "green",
    name: "Green Glow",
    word: "Green",
    juice: "green",
    goal: "Detox",
    price: 159,
    ml: 300,
    blurb: "Green apple, spinach, cucumber and mint. Crisp, clean and gentle on a slow morning.",
    inside: [
      { fruit: "apple-green", label: "2 green apples" },
      { fruit: "spinach", label: "Spinach" },
      { fruit: "cucumber", label: "½ cucumber" },
      { fruit: "mint", label: "Mint" },
    ],
    nutrition: { kcal: 98, sugar: 16, vitC: "60%", fibre: "2 g" },
  },
  beet: {
    id: "beet",
    name: "Beet Rush",
    word: "Beet",
    juice: "beet",
    goal: "Detox",
    price: 159,
    ml: 300,
    blurb: "Beetroot, carrot, red apple and ginger. Earthy, bright and made for the run before work.",
    inside: [
      { fruit: "beet", label: "2 beets" },
      { fruit: "carrot", label: "2 carrots" },
      { fruit: "apple-red", label: "1 red apple" },
      { fruit: "ginger", label: "Ginger" },
    ],
    nutrition: { kcal: 118, sugar: 21, vitC: "40%", fibre: "2 g" },
  },
  gold: {
    id: "gold",
    name: "Golden Pine",
    word: "Gold",
    juice: "gold",
    goal: "Energy",
    price: 149,
    ml: 300,
    blurb: "Pineapple, lemon and a kick of ginger. Sunshine in a bottle, sharp and sweet.",
    inside: [
      { fruit: "pineapple", label: "½ pineapple" },
      { fruit: "lemon-half", label: "1 lemon" },
      { fruit: "ginger", label: "Ginger" },
      { fruit: "mint", label: "Mint" },
    ],
    nutrition: { kcal: 128, sugar: 23, vitC: "150%", fibre: "1 g" },
  },
  melon: {
    id: "melon",
    name: "Melon Cool",
    word: "Melon",
    juice: "melon",
    goal: "Glow",
    price: 139,
    ml: 300,
    blurb: "Watermelon, lime and mint. Light, pink and cold: the one for a hot afternoon.",
    inside: [
      { fruit: "lime-half", label: "1 lime" },
      { fruit: "mint", label: "Mint" },
      { fruit: "cucumber", label: "¼ cucumber" },
      { fruit: "citrus-leaves", label: "Lime leaves" },
    ],
    nutrition: { kcal: 86, sugar: 17, vitC: "35%", fibre: "0 g" },
  },
};

export const fruit = (name: string) => img(`fruit-${name}`);

// ── Nav ─────────────────────────────────────────────
export const nav = {
  links: [
    { label: "Flavours", href: "#flavours" },
    { label: "Mix your own", href: "#mix" },
    { label: "Cleanses", href: "#cleanses" },
    { label: "Our farms", href: "#farm" },
  ],
  bagCount: 2,
  bag: [
    { id: "green", qty: 1 },
    { id: "beet", qty: 1 },
  ],
};

// ── Hero ────────────────────────────────────────────
export const hero = {
  lines: ["Squeezed", "at sunrise."],
  lead: "Cold-pressed every morning from market-fresh fruit. No heat, no water, no added sugar.",
  primary: "Shop flavours",
  secondary: "Build a cleanse",
  chalk: ["Today's press", "₹149", "a bottle"],
  badges: ["Pressed today", "0 g added sugar", "Glass bottles"],
  // Two diagonal rows of the bottle wall (they slide opposite ways in Round 2).
  rowA: ["beet", "sunrise", "berry", "melon"],
  rowB: ["gold", "green", "sunrise"],
};

// ── Flavours (goal chips) ───────────────────────────
export const goals = [
  // the chip, its featured bottle and its cards always match: each card shows its own goal
  { id: "detox", label: "Detox", lead: "green", cards: ["green", "beet", "sunrise", "gold"] },
  { id: "immunity", label: "Immunity", lead: "sunrise", cards: ["sunrise", "gold", "berry", "green"] },
  { id: "energy", label: "Energy", lead: "gold", cards: ["gold", "sunrise", "berry", "green"] },
  { id: "glow", label: "Glow", lead: "berry", cards: ["berry", "melon", "green", "sunrise"] },
] as const;
export const startGoal = "immunity";
export const ghostWord: Record<Juice, string> = {
  orange: "Orange",
  berry: "Berry",
  green: "Green",
  beet: "Beet",
  gold: "Pine",
  melon: "Melon",
};

// ── Mix your own ────────────────────────────────────
export const mix = {
  title: ["Mix", "your own."],
  lead: "Grab three from the crate. We press them together and chalk up a name.",
  bins: [
    { id: "orange", label: "Orange", liquid: "#F39A1E" },
    { id: "apple-green", label: "Green apple", liquid: "#9CC54A" },
    { id: "strawberry", label: "Strawberry", liquid: "#E0313F" },
    { id: "beet", label: "Beetroot", liquid: "#7A1F45" },
    { id: "carrot", label: "Carrot", liquid: "#E2561B" },
    { id: "pineapple", label: "Pineapple", liquid: "#F6C540" },
    { id: "lime-half", label: "Lime", liquid: "#B9D661" },
    { id: "mint", label: "Mint", liquid: "#6FAF5A" },
    { id: "ginger", label: "Ginger", liquid: "#EBCB6E" },
  ],
  // The demo blend (record cursor picks these in Round 4); ?static=1 shows it finished.
  picks: ["orange", "carrot", "ginger"],
  blend: { name: ["Sunrise", "Kick"], recipe: "orange + carrot + ginger", price: 149 },
};

// ── Product detail ──────────────────────────────────
export const pdp = {
  wheel: ["berry", "green", "sunrise", "beet", "gold"],
  start: "sunrise",
  sizes: [
    { id: "single", label: "Single", note: "300 ml", price: 149 },
    { id: "six", label: "6-Pack", note: "6 × 300 ml", price: 799 },
    { id: "cleanse", label: "3-Day Cleanse", note: "18 bottles", price: 2249 },
  ],
  stamp: "Pressed today",
  sample: "Sample values · concept site",
};

// ── Farm → bottle ───────────────────────────────────
export const farm = {
  title: ["Farm to bottle", "before breakfast."],
  steps: [
    { word: "Farm", time: "5:00 am", note: "picked in Nagpur", photo: "farm-orchard" },
    { word: "Wash", time: "6:10 am", note: "three cold rinses", photo: "farm-wash" },
    { word: "Cut", time: "6:40 am", note: "by hand, skins on", photo: "farm-cut" },
    { word: "Press", time: "7:00 am", note: "two tonnes, no heat", photo: "farm-press" },
    { word: "Bottle", time: "7:30 am", note: "sealed and chilled", photo: "farm-bottles" },
  ],
  start: 2, // ?static=1 shows step 03
};

// ── Benefits (fresh vs carton) ──────────────────────
export const compare = {
  title: ["Fresh vs", "a carton."],
  ours: "Pure Juice",
  theirs: "Carton juice",
  rows: [
    { label: "Heat used", ours: "None", theirs: "90 °C", a: 0, b: 80 },
    { label: "Added sugar", ours: "0 g", theirs: "22 g", a: 2, b: 70 },
    { label: "Fruit per bottle", ours: "1.2 kg", theirs: "0.3 kg", a: 92, b: 24 },
    { label: "Days since pressed", ours: "1", theirs: "180", a: 3, b: 95 },
  ],
  note: "Typical values for a shelf carton · concept site",
};

// ── Cleanse & subscription ──────────────────────────
export const plans = {
  title: "Pick a cleanse.",
  stamp: "Your box, every week",
  rows: [
    { id: "reset", name: "1-Day Reset", note: "6 bottles · greens, citrus, beet", price: 799 },
    { id: "cleanse3", name: "3-Day Cleanse", note: "18 bottles · free cooler bag", price: 2249 },
    { id: "reboot", name: "5-Day Reboot", note: "30 bottles · two deliveries", price: 3499 },
  ],
  start: "cleanse3",
  freq: [
    { id: "once", label: "Once", off: 0 },
    { id: "weekly", label: "Weekly save 15%", off: 0.15 },
    { id: "fortnight", label: "Fortnightly save 10%", off: 0.1 },
    { id: "monthly", label: "Monthly save 5%", off: 0.05 },
  ],
  startFreq: "weekly",
  cta: "Subscribe",
};

// ── Reviews ─────────────────────────────────────────
export const reviews = {
  title: ["Notes from", "the fridge."],
  meta: "average from 2,400 subscribers.",
  sample: "Sample values · concept site",
  notes: [
    { quote: "Sunrise Kick tastes like the first sip of a holiday. I'm on week six.", who: "Riya · Pune", fruit: "orange" },
    { quote: "Beet Rush before a run. My legs noticed before I did.", who: "Kabir · Mumbai", fruit: "beet" },
    { quote: "My kids fight over the green one. I did not see that coming.", who: "Anika · Bengaluru", fruit: "apple-green" },
    { quote: "The 3-day box came cold, on time, with a note in chalk.", who: "Dev · Delhi", fruit: "lime-half" },
  ],
};

// ── Footer ──────────────────────────────────────────
export const footer = {
  strip: "First pick of the season?",
  placeholder: "Your email",
  join: "Join",
  cols: [
    { title: "Shop", links: ["Flavours", "Cleanses", "Mix your own", "Gift crates"] },
    { title: "About", links: ["Our farms", "How we press", "Journal"] },
    { title: "Help", links: ["Delivery", "Subscriptions", "Bottle returns"] },
  ],
  hours: ["Pressed daily · 5 am", "Delivered by 9 am"],
  socials: ["IG", "YT", "X"],
  wordmark: "Pure Juice",
  note: "Concept website by Triozen Tech · sample prices",
};

export const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
