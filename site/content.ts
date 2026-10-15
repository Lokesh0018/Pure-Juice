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
  inside: { fruit: string; label: string }[];
  nutrition: { kcal: number; sugar: number; vitC: string; fibre: string };
};

export const products: Record<string, Product> = {
  sunrise: {
    id: "sunrise",
    name: "Valencia Sunrise",
    word: "Sunrise",
    juice: "orange",
    goal: "Immunity",
    price: 149,
    ml: 300,
    blurb: "Valencia orange, sweet heirloom carrot, cold-crushed turmeric and ginger. Your morning vitality boost, bottled fresh at dawn.",
    inside: [
      { fruit: "orange", label: "4 sun-ripened oranges" },
      { fruit: "carrot", label: "2 sweet carrots" },
      { fruit: "ginger", label: "Highland ginger" },
      { fruit: "lemon-half", label: "½ Meyer lemon" },
    ],
    nutrition: { kcal: 126, sugar: 21, vitC: "195%", fibre: "2 g" },
  },
  berry: {
    id: "berry",
    name: "Wild Berry Rush",
    word: "Berry",
    juice: "berry",
    goal: "Radiance",
    price: 169,
    ml: 300,
    blurb: "Hill strawberry, antioxidant blueberries, crisp Fuji apple and ruby pomegranate. Rich in polyphenols for an instant skin glow.",
    inside: [
      { fruit: "strawberry", label: "14 handpicked strawberries" },
      { fruit: "apple-red", label: "2 crisp red apples" },
      { fruit: "beet", label: "¼ young beetroot" },
      { fruit: "lime-half", label: "½ Persian lime" },
    ],
    nutrition: { kcal: 138, sugar: 23, vitC: "135%", fibre: "3 g" },
  },
  green: {
    id: "green",
    name: "Emerald Guava",
    word: "Guava",
    juice: "green",
    goal: "Cleanse",
    price: 159,
    ml: 300,
    blurb: "Crisp pink guava, Granny Smith apple, hydroponic baby spinach, English cucumber and garden mint. Refreshing alkalising purity.",
    inside: [
      { fruit: "apple-green", label: "2 tart green apples" },
      { fruit: "spinach", label: "Tender baby spinach" },
      { fruit: "cucumber", label: "Crisp garden cucumber" },
      { fruit: "mint", label: "Peppermint leaves" },
    ],
    nutrition: { kcal: 92, sugar: 14, vitC: "85%", fibre: "3 g" },
  },
  beet: {
    id: "beet",
    name: "Ruby Beet Elixir",
    word: "Beet",
    juice: "beet",
    goal: "Stamina",
    price: 159,
    ml: 300,
    blurb: "Mineral-rich root beet, crisp orchard apple, juicy orange and fiery ginger. Natural nitrates formulated for athletic endurance.",
    inside: [
      { fruit: "beet", label: "2 organic garden beets" },
      { fruit: "carrot", label: "2 sweet farm carrots" },
      { fruit: "apple-red", label: "1 orchard red apple" },
      { fruit: "ginger", label: "Crushed ginger root" },
    ],
    nutrition: { kcal: 114, sugar: 19, vitC: "55%", fibre: "3 g" },
  },
  gold: {
    id: "gold",
    name: "Golden Mango Nectar",
    word: "Mango",
    juice: "gold",
    goal: "Vitality",
    price: 149,
    ml: 300,
    blurb: "Alphonso gold mango, ripe Queen pineapple, cold-pressed lime and wild honey notes. Tropical decadence with zero refined sugar.",
    inside: [
      { fruit: "pineapple", label: "½ sweet pineapple" },
      { fruit: "lemon-half", label: "1 juicy lemon" },
      { fruit: "ginger", label: "Fresh yellow ginger" },
      { fruit: "mint", label: "Spearmint sprigs" },
    ],
    nutrition: { kcal: 134, sugar: 22, vitC: "165%", fibre: "2 g" },
  },
  melon: {
    id: "melon",
    name: "Watermelon Hydrate",
    word: "Melon",
    juice: "melon",
    goal: "Hydration",
    price: 139,
    ml: 300,
    blurb: "Seedless field watermelon, cold lime zest and steeped Moroccan mint. Deeply cellular hydration for warm sunny days.",
    inside: [
      { fruit: "lime-half", label: "1 freshly squeezed lime" },
      { fruit: "mint", label: "Field mint leaves" },
      { fruit: "cucumber", label: "½ cooling cucumber" },
      { fruit: "citrus-leaves", label: "Fragrant lime leaf" },
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
    { label: "Cleanse Programs", href: "#cleanses" },
    { label: "Harvest Trace", href: "#farm" },
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
    { id: "single", label: "Individual", note: "300 ml bottle", price: 149 },
    { id: "six", label: "Weekly 6-Pack", note: "6 × 300 ml", price: 799 },
    { id: "cleanse", label: "3-Day Reboot", note: "18 cold-packed bottles", price: 2249 },
  ],
  stamp: "Hand-pressed today",
  sample: "Pure botanical ingredients · 100% natural",
};

// ── Farm → bottle ───────────────────────────────────
export const farm = {
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
  title: ["Pure Press vs", "store carton."],
  ours: "Pure Juice",
  theirs: "Commercial Carton",
  rows: [
    { label: "Thermal Processing", ours: "Zero Heat (Cold-Pressed)", theirs: "Ultra-Pasteurised (95 °C)", a: 0, b: 85 },
    { label: "Refined Added Sugars", ours: "0 g (Whole Fruit Only)", theirs: "26 g per serving", a: 2, b: 78 },
    { label: "Raw Fruit per Bottle", ours: "1.4 kg organic produce", theirs: "0.25 kg concentrate", a: 95, b: 20 },
    { label: "Shelf Life Since Press", ours: "3 Days (Fresh & Active)", theirs: "180+ Days (Preserved)", a: 3, b: 96 },
  ],
  note: "Nutrient analysis based on third-party laboratory tests · Pure Juice standards",
};

// ── Cleanse & subscription ──────────────────────────
export const plans = {
  title: "Targeted cleanse rituals.",
  stamp: "Chilled insulated delivery",
  rows: [
    { id: "reset", name: "1-Day Cleanse Reset", note: "6 tailored bottles · botanical detox & green hydration", price: 799 },
    { id: "cleanse3", name: "3-Day Cellular Reboot", note: "18 bottles · includes thermal chiller bag & guide", price: 2249 },
    { id: "reboot", name: "5-Day Deep Metabolism", note: "30 bottles · delivered in two fresh dawn drops", price: 3499 },
  ],
  start: "cleanse3",
  freq: [
    { id: "once", label: "Single Box", off: 0 },
    { id: "weekly", label: "Weekly (Save 15%)", off: 0.15 },
    { id: "fortnight", label: "Fortnightly (Save 10%)", off: 0.1 },
    { id: "monthly", label: "Monthly (Save 5%)", off: 0.05 },
  ],
  startFreq: "weekly",
  cta: "Begin Your Ritual",
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
