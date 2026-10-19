import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applyTheme,
  preferredTheme,
  safeStorage,
  THEMES,
  ThemeContext,
} from "@/lib/theme";

/**
 * ThemeProvider — holds the active theme, mirrors it onto <html> and
 * exposes `theme`, `isDark`, `setTheme` and `toggleTheme`.
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(preferredTheme);

  // Apply on every change (also covers the very first render).
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Follow the OS while the visitor has not made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => {
      if (!THEMES.includes(safeStorage.get())) {
        setThemeState(event.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return;
    safeStorage.set(next);
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === "dark" ? "light" : "dark";
      safeStorage.set(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, isDark: theme === "dark", setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
