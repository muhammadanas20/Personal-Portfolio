import { createContext, useContext } from "react";

/**
 * Theme engine — core
 * ───────────────────
 * Two themes — "light" (the printed-paper default) and "dark".
 *
 * • The choice is stored in localStorage and survives reloads.
 * • With nothing stored, the OS preference (`prefers-color-scheme`) wins.
 * • The OS preference keeps tracking until the visitor picks a side, so
 *   someone who never touches the toggle always sees their system theme.
 * • An inline script in index.html applies the theme before first paint,
 *   so there is never a flash of the wrong palette.
 */

export const THEME_KEY = "anastrix-theme";
export const THEMES = ["light", "dark"];

export const ThemeContext = createContext(null);

/** Colours handed to the browser chrome (address bar, splash screens). */
export const THEME_COLOR = { light: "#f2eee7", dark: "#131110" };

export const safeStorage = {
  get() {
    try {
      return window.localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  },
  set(value) {
    try {
      window.localStorage.setItem(THEME_KEY, value);
    } catch {
      /* private mode — the theme simply won't persist */
    }
  },
};

export const systemTheme = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

/** Stored choice if it is valid, otherwise the system preference. */
export const preferredTheme = () => {
  const stored = safeStorage.get();
  return THEMES.includes(stored) ? stored : systemTheme();
};

/** Writes the theme onto <html> and syncs the browser chrome colour. */
export const applyTheme = (theme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[theme] ?? THEME_COLOR.light);
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
};
