// All text and data for Pure Juice (pure cold-pressed botanical & fruit juices, ₹ prices).

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
  inside: { fruit: string; label: string; pct: number }[]; // pct: share of the blend (sample values)
  taste: { sweet: number; tangy: number; earthy: number; zing: number }; // 0–5
  bestFor: string[]; // when / why to drink it
  nutrition: { kcal: number; sugar: number; vitC: string; fibre: string };
};

export const products: Record<string, Product> = {
  sunrise: {
    id: "sunrise",
    name: "Valencia Sunrise",
    word: "Sunrise",
    juice: "orange",
    goal: "Immunity",
    taste: { sweet: 3, tangy: 3, earthy: 1, zing: 4 },
    bestFor: ["Morning", "Cold season"],
    price: 149,
    ml: 300,
    blurb: "Valencia orange, sweet heirloom carrot, cold-crushed turmeric and ginger. Your morning vitality boost, bottled fresh at dawn.",
    inside: [
      { fruit: "orange", label: "4 sun-ripened oranges", pct: 55 },
      { fruit: "carrot", label: "2 sweet carrots", pct: 25 },
      { fruit: "ginger", label: "Highland ginger", pct: 8 },
      { fruit: "lemon-half", label: "½ Meyer lemon", pct: 12 },
    ],
    nutrition: { kcal: 126, sugar: 21, vitC: "195%", fibre: "2 g" },
  },
  berry: {
    id: "berry",
    name: "Wild Berry Rush",
    word: "Berry",
    juice: "berry",
    goal: "Radiance",
    taste: { sweet: 4, tangy: 3, earthy: 1, zing: 1 },
    bestFor: ["Afternoon", "Skin glow"],
    price: 169,
    ml: 300,
    blurb: "Hill strawberry, antioxidant blueberries, crisp Fuji apple and ruby pomegranate. Rich in polyphenols for an instant skin glow.",
    inside: [
      { fruit: "strawberry", label: "14 handpicked strawberries", pct: 45 },
      { fruit: "apple-red", label: "2 crisp red apples", pct: 30 },
      { fruit: "beet", label: "¼ young beetroot", pct: 10 },
      { fruit: "lime-half", label: "½ Persian lime", pct: 15 },
    ],
    nutrition: { kcal: 138, sugar: 23, vitC: "135%", fibre: "3 g" },
  },
  green: {
    id: "green",
    name: "Emerald Guava",
    word: "Guava",
    juice: "green",
    goal: "Cleanse",
    taste: { sweet: 2, tangy: 3, earthy: 3, zing: 2 },
    bestFor: ["Morning", "Digestion"],
    price: 159,
    ml: 300,
    blurb: "Crisp pink guava, Granny Smith apple, hydroponic baby spinach, English cucumber and garden mint. Refreshing alkalising purity.",
    inside: [
      { fruit: "apple-green", label: "2 tart green apples", pct: 40 },
      { fruit: "spinach", label: "Tender baby spinach", pct: 25 },
      { fruit: "cucumber", label: "Crisp garden cucumber", pct: 25 },
      { fruit: "mint", label: "Peppermint leaves", pct: 10 },
    ],
    nutrition: { kcal: 92, sugar: 14, vitC: "85%", fibre: "3 g" },
  },
  beet: {
    id: "beet",
    name: "Ruby Beet Elixir",
    word: "Beet",
    juice: "beet",
    goal: "Stamina",
    taste: { sweet: 2, tangy: 1, earthy: 5, zing: 3 },
    bestFor: ["Pre-workout", "Endurance"],
    price: 159,
    ml: 300,
    blurb: "Mineral-rich root beet, crisp orchard apple, juicy orange and fiery ginger. Natural nitrates formulated for athletic endurance.",
    inside: [
      { fruit: "beet", label: "2 organic garden beets", pct: 45 },
      { fruit: "carrot", label: "2 sweet farm carrots", pct: 25 },
      { fruit: "apple-red", label: "1 orchard red apple", pct: 20 },
      { fruit: "ginger", label: "Crushed ginger root", pct: 10 },
    ],
    nutrition: { kcal: 114, sugar: 19, vitC: "55%", fibre: "3 g" },
  },
  gold: {
    id: "gold",
    name: "Golden Mango Nectar",
    word: "Mango",
    juice: "gold",
    goal: "Vitality",
    taste: { sweet: 5, tangy: 2, earthy: 1, zing: 2 },
    bestFor: ["Midday", "Energy"],
    price: 149,
    ml: 300,
    blurb: "Alphonso gold mango, ripe Queen pineapple, cold-pressed lime and wild honey notes. Tropical decadence with zero refined sugar.",
    inside: [
      { fruit: "pineapple", label: "½ sweet pineapple", pct: 50 },
      { fruit: "lemon-half", label: "1 juicy lemon", pct: 20 },
      { fruit: "ginger", label: "Fresh yellow ginger", pct: 15 },
      { fruit: "mint", label: "Spearmint sprigs", pct: 15 },
    ],
    nutrition: { kcal: 134, sugar: 22, vitC: "165%", fibre: "2 g" },
  },
  melon: {
    id: "melon",
    name: "Watermelon Hydrate",
    word: "Melon",
    juice: "melon",
    goal: "Hydration",
    taste: { sweet: 3, tangy: 2, earthy: 1, zing: 1 },
    bestFor: ["Hot days", "Hydration"],
    price: 139,
    ml: 300,
    blurb: "Seedless field watermelon, cold lime zest and steeped Moroccan mint. Deeply cellular hydration for warm sunny days.",
    inside: [
      { fruit: "lime-half", label: "1 freshly squeezed lime", pct: 30 },
      { fruit: "mint", label: "Field mint leaves", pct: 20 },
      { fruit: "cucumber", label: "½ cooling cucumber", pct: 35 },
      { fruit: "citrus-leaves", label: "Fragrant lime leaf", pct: 15 },
    ],
    nutrition: { kcal: 82, sugar: 15, vitC: "45%", fibre: "1 g" },
  },
};

export const fruit = (name: string) => img(`fruit-${name}`);

// ── Nav ─────────────────────────────────────────────
export const nav = {
  links: [
    { label: "Botanicals", href: "#flavours" },
    { label: "Custom Blend", href: "#mix" },
    { label: "Combos", href: "#cleanses" },
    { label: "Our Process", href: "#farm" },
  ],
  bagCount: 0,
  bag: [] as { id: string; qty: number }[],
};

// ── Hero ────────────────────────────────────────────
export const hero = {
  lines: ["Cold-pressed", "at first light."],
  lead: "Handcrafted unpasteurised cold-pressed juice from organic, regenerative orchards. Zero additives, zero heat, zero compromise.",
  primary: "Explore Flavours",
  secondary: "Curate a Cleanse",
  chalk: ["Daily Batch", "₹149", "per 300ml bottle"],
  badges: ["Bottled This Morning", "100% Raw & Unheated", "Recyclable Glass"],
  // Two diagonal rows of the bottle wall (they slide opposite ways in Round 2).
  rowA: ["beet", "sunrise", "berry", "melon"],
  rowB: ["gold", "green", "sunrise"],
};

// ── Flavours (goal chips) ───────────────────────────
export const goals = [
  { id: "detox", label: "Detox", lead: "green", cards: ["green", "beet", "sunrise", "gold"] },
  { id: "immunity", label: "Immunity", lead: "sunrise", cards: ["sunrise", "gold", "berry", "green"] },
  { id: "energy", label: "Energy", lead: "gold", cards: ["gold", "sunrise", "berry", "green"] },
  { id: "glow", label: "Radiance", lead: "berry", cards: ["berry", "melon", "green", "sunrise"] },
] as const;
export const startGoal = "immunity";
export const ghostWord: Record<Juice, string> = {
  orange: "Valencia",
  berry: "Berries",
  green: "Guava",
  beet: "Beetroot",
  gold: "Mango",
  melon: "Melon",
};

// ── Mix your own ────────────────────────────────────
export const mix = {
  title: ["Custom", "cold press."],
  lead: "Select three fresh botanicals from the crate. Our hydraulic press crafts your signature blend in seconds.",
  bins: [
    { id: "orange", label: "Valencia Orange", liquid: "#F39A1E" },
    { id: "apple-green", label: "Granny Smith", liquid: "#9CC54A" },
    { id: "strawberry", label: "Hill Strawberry", liquid: "#E0313F" },
    { id: "beet", label: "Organic Beetroot", liquid: "#7A1F45" },
    { id: "carrot", label: "Sweet Carrot", liquid: "#E2561B" },
    { id: "pineapple", label: "Queen Pineapple", liquid: "#F6C540" },
    { id: "lime-half", label: "Persian Lime", liquid: "#B9D661" },
    { id: "mint", label: "Garden Mint", liquid: "#6FAF5A" },
    { id: "ginger", label: "Highland Ginger", liquid: "#EBCB6E" },
  ],
  picks: ["orange", "carrot", "ginger"],
  blend: { name: ["Sunrise", "Vitality"], recipe: "Valencia orange + sweet carrot + highland ginger", price: 149 },
};

// ── Product detail ──────────────────────────────────
export const pdp = {
  wheel: ["berry", "green", "sunrise", "beet", "gold"],
  start: "sunrise",
  sizes: [
    { id: "single", label: "Individual", note: "300 ml bottle", price: 149, count: 1 },
    { id: "six", label: "Weekly 6-Pack", note: "6 × 300 ml", price: 799, count: 6 },
    { id: "cleanse", label: "3-Day Reboot", note: "18 cold-packed bottles", price: 2249, count: 18 },
  ],
  stamp: "Today's Specials",
  rating: { score: "4.9", count: "3,800+ reviews" },
  trust: ["Free chilled delivery over ₹999", "Pressed the morning it ships"],
  promise: { order: "Order by 9 pm", arrive: "at your door by 8:30 am" },
  storage: "Best within 3 days · keep at 2–4 °C",
  tasteLabels: { sweet: "Sweet", tangy: "Tangy", earthy: "Earthy", zing: "Zing" },
  sample: "Pure botanical ingredients · 100% natural",
};

// ── Farm → bottle ───────────────────────────────────
export const farm = {
  eyebrow: "Our process · 5 phases",
  title: ["Orchard to bottle", "before your alarm."],
  steps: [
    { word: "Harvest", time: "4:30 am", note: "picked ripe in certified organic groves", photo: "farm-orchard" },
    { word: "Purify", time: "5:45 am", note: "triple cold-spring water rinse", photo: "farm-wash" },
    { word: "Prep", time: "6:20 am", note: "artisan hand-cut with peel & fiber intact", photo: "farm-cut" },
    { word: "Press", time: "6:50 am", note: "hydraulic cold-press, zero pasteurisation", photo: "farm-press" },
    { word: "Bottle", time: "7:25 am", note: "nitrogen-flushed amber glass bottles", photo: "farm-bottles" },
  ],
  start: 2,
};

// ── Benefits (fresh vs carton) ──────────────────────
export const compare = {
  eyebrow: "The difference",
  title: ["Pure Press vs", "store carton."],
  lead: "Same fruit, two very different bottles. This is what changes when juice is never heated.",
  ours: "Pure Juice",
  theirs: "Commercial Carton",
  // value (counts up when it starts with a number) + a short note; a / b = bar length in %
  rows: [
    { label: "Thermal processing", ours: "Zero heat", oursNote: "Cold-pressed", theirs: "95 °C", theirsNote: "Ultra-pasteurised", a: 0, b: 85 },
    { label: "Refined added sugar", ours: "0 g", oursNote: "Whole fruit only", theirs: "26 g", theirsNote: "Per serving", a: 2, b: 78 },
    { label: "Raw fruit per bottle", ours: "1.4 kg", oursNote: "Organic produce", theirs: "0.25 kg", theirsNote: "From concentrate", a: 95, b: 20 },
    { label: "Shelf life since press", ours: "3 days", oursNote: "Fresh & active", theirs: "180+ days", theirsNote: "Preserved", a: 3, b: 96 },
  ],
  note: "Nutrient analysis based on third-party laboratory tests · Pure Juice standards",
};

// ── Cleanse & subscription ──────────────────────────
export const plans = {
  eyebrow: "Combos",
  title: "Targeted cleanse",
  accent: "rituals.",
  lead: "Pick a length and how often it arrives. Every bottle is pressed the morning it ships.",
  stamp: "Chilled insulated delivery",
  included: ["Cold-chain delivery", "Day-by-day guide", "Pause or skip anytime"],
  rows: [
    { id: "reset", name: "1-Day Cleanse Reset", note: "6 tailored bottles · botanical detox & green hydration", price: 799, days: 1, bottles: 6, juice: "green" as Juice },
    { id: "cleanse3", name: "3-Day Cellular Reboot", note: "18 bottles · includes thermal chiller bag & guide", price: 2249, days: 3, bottles: 18, badge: "Most popular", juice: "orange" as Juice },
    { id: "reboot", name: "5-Day Deep Metabolism", note: "30 bottles · delivered in two fresh dawn drops", price: 3499, days: 5, bottles: 30, juice: "beet" as Juice },
  ],
  start: "cleanse3",
  freqLabel: "Delivery",
  freq: [
    { id: "once", label: "Single Box", off: 0 },
    { id: "weekly", label: "Weekly", off: 0.15 },
    { id: "fortnight", label: "Fortnightly", off: 0.1 },
    { id: "monthly", label: "Monthly", off: 0.05 },
  ],
  startFreq: "weekly",
  cta: "Begin Your Ritual",
  added: "Added to crate",
  note: "Free chilled delivery · cancel anytime",
};

// ── Reviews ─────────────────────────────────────────
export const reviews = {
  eyebrow: "Customer reviews",
  title: ["Verified reviews", "from"],
  accent: "daily drinkers.",
  rating: {
    score: 4.9,
    meta: "average rating from 3,800+ subscriber deliveries.",
    // share of reviews per star (sample values)
    bars: [
      { stars: 5, pct: 91 },
      { stars: 4, pct: 7 },
      { stars: 3, pct: 1 },
      { stars: 2, pct: 1 },
      { stars: 1, pct: 0 },
    ],
  },
  badge: "Verified subscriber",
  sample: "Verified subscriber experiences",
  notes: [
    { quote: "Valencia Sunrise replaced my espresso ritual entirely. Clean sustained morning energy with zero afternoon crash.", name: "Rhea Sharma", city: "Pune", product: "Valencia Sunrise", fruit: "orange" },
    { quote: "Ruby Beet Elixir before my half-marathon training runs made an undeniable difference in my stamina and recovery.", name: "Kabir Mehta", city: "Mumbai", product: "Ruby Beet Elixir", fruit: "beet" },
    { quote: "Emerald Guava is crisp, beautifully balanced, and surprisingly sweet without a single gram of added sugar.", name: "Ananya Iyer", city: "Bengaluru", product: "Emerald Guava", fruit: "apple-green" },
    { quote: "The 3-Day Reboot arrived frost-cold at 7:30 AM with fresh ice packs and a personalized tasting note.", name: "Devansh Roy", city: "New Delhi", product: "3-Day Reboot", fruit: "lime-half" },
  ],
};

// ── Footer ──────────────────────────────────────────
export const footer = {
  signup: {
    eyebrow: "The press list",
    title: "Join the sunrise press list for",
    accent: "seasonal batches.",
    lead: "New flavours before anyone else, early access to limited presses and one good recipe a month.",
    perks: ["Early access", "Member prices", "Unsubscribe anytime"],
    done: "You're on the list. See you at sunrise.",
  },
  placeholder: "Enter your email address",
  join: "Subscribe",
  cols: [
    { title: "Bottled Juices", links: ["Single Origins", "Cleanse Kits", "Build Your Blend", "Gift Sets"] },
    { title: "Philosophy", links: ["Organic Sourcing", "Zero-Waste Press", "Lab Reports"] },
    { title: "Customer Care", links: ["Cold Shipping", "Subscription Management", "Bottle Upcycling"] },
  ],
  hours: ["Pressed Fresh Daily · 4:30 AM", "Delivered Cold by 8:30 AM"],
  socials: [
    { id: "instagram", label: "Instagram" },
    { id: "youtube", label: "YouTube" },
    { id: "x", label: "Twitter / X" },
  ] as const,
  wordmark: "Pure Juice",
  note: "Crafted by Pure Juice Co. · 100% raw botanical press",
};

export const rupee = (n: number) => `₹${n.toLocaleString("en-IN")}`;
