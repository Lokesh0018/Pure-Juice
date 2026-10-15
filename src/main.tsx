import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@/app/globals.css";
import "@/site/fonts";
import "@/site/site.css";
import { theme } from "@/site/site";

function Root() {
  useEffect(() => {
    const t = theme;
    const isDark = (hex: string) => {
      const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
      return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 < 140;
    };

    const root = document.documentElement;
    root.style.setProperty("--bg", t.bg);
    root.style.setProperty("--surface", t.surface);
    root.style.setProperty("--text", t.text);
    root.style.setProperty("--muted", t.muted);
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-text", t.accentText);
    root.style.setProperty("--line", t.line);
    root.style.setProperty("--hero-text", t.heroText ?? (isDark(t.bg) ? t.text : "#fbf8f3"));
    root.style.setProperty("--radius", `${t.radius ?? 0}px`);
    root.style.setProperty("--font-display-family", t.fontDisplay);
    root.style.setProperty("--font-body-family", t.fontBody);
    root.style.setProperty("--heading-case", t.uppercaseHeadings ? "uppercase" : "none");
    root.style.setProperty("--heading-tracking", t.uppercaseHeadings ? "0.04em" : "0.005em");
  }, []);

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
