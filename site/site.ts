import type { SiteMeta, Theme } from "@/lib/site";

// Pure Juice · Day 17 · "Studio Press" (see site/DESIGN.md).

export const meta: SiteMeta = {
  name: "Pure Juice",
  title: "Pure Juice · Cold-pressed at sunrise",
  description: "Cold-pressed juice, pressed every morning from market-fresh fruit. Flavours, mix your own, cleanses. Concept website.",
  loaderText: "Pure Juice",
  // The site draws its own loader: the logo builds itself and juice fills the U (site/components/SplashLoader.tsx).
  loader: false,
  cursor: false,
  record: { duration: 36 },
};

export const theme: Theme = {
  bg: "#F6F4EF",
  surface: "#ECE9E2",
  text: "#141414",
  muted: "#69665F",
  accent: "#E8541E",
  accentText: "#FFFFFF",
  line: "#DFDBD2",
  fontDisplay: "'Inter Tight Variable', 'Inter Tight', system-ui, sans-serif",
  fontBody: "'Inter Tight Variable', 'Inter Tight', system-ui, sans-serif",
  radius: 14,
  uppercaseHeadings: false,
};
