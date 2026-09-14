import { createContext, useContext, useLayoutEffect, useMemo, useState } from "react";

// Chart palettes per theme (recharts needs concrete color strings).
export const CHART_COLORS = {
  light: { c1: "#4361ee", c2: "#7c3aed", c3: "#9d6bf5", c4: "#c4b5fd", grid: "#ece7f5", axis: "#6e6880" },
  dark:  { c1: "#7aa2ff", c2: "#b98bff", c3: "#9d6bf5", c4: "#6d5bd0", grid: "#2e2840", axis: "#a79fbb" },
  vivid: { c1: "#ec4899", c2: "#facc15", c3: "#16a34a", c4: "#d4a017", grid: "#f3d9e6", axis: "#8a5a6f" },
};

export const THEMES = [
  { id: "light", label: "Light", swatch: ["#7c3aed", "#4361ee", "#ffffff"] },
  { id: "dark", label: "Dark", swatch: ["#a78bfa", "#7aa2ff", "#1e1a29"] },
];

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Apply attributes before paint so charts read the right palette.
  useLayoutEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-theme", theme);
    el.setAttribute("data-a11y-text", largeText ? "large" : "normal");
    el.setAttribute("data-a11y-motion", reduceMotion ? "reduce" : "full");
  }, [theme, largeText, reduceMotion]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      largeText,
      setLargeText,
      reduceMotion,
      setReduceMotion,
      colors: CHART_COLORS[theme],
    }),
    [theme, largeText, reduceMotion]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
