import React, { useEffect, useMemo, useState } from "react";
import { darkThemeVars } from "./themes/dark";
import { lightThemeVars } from "./themes/light";
import { aibytersDarkThemeVars } from "./themes/aibyters-dark";
import "./global.css";

export type Theme = "dark" | "light" | "aibyters" | "system" | "custom";

export interface ThemeProviderProps {
  /** "system" follows the OS colour scheme and updates live. Default "dark". */
  theme?: Theme;
  /** CSS variable overrides, e.g. `{ "--vi-color-chart-0": "#c49837" }`. Applied on top of the theme. */
  overrides?: Record<string, string>;
  /**
   * Inject the Google Fonts stylesheet for Inter / Poppins. Off by default: enterprise hosts
   * typically forbid third-party font requests (CSP, offline, GDPR) and ship their own fonts.
   * The library falls back to the host's font stack via `--vi-font-body`.
   */
  loadFonts?: boolean;
  /** Render as a `display: contents` wrapper so the provider does not affect host layout. Default false. */
  unstyled?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const themeVars: Record<Exclude<Theme, "system" | "custom">, Record<string, string>> = {
  dark: darkThemeVars,
  light: lightThemeVars,
  aibyters: aibytersDarkThemeVars,
};

function useSystemScheme(): "dark" | "light" {
  const [scheme, setScheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => setScheme(mql.matches ? "dark" : "light");
    apply();
    mql.addEventListener?.("change", apply);
    return () => mql.removeEventListener?.("change", apply);
  }, []);
  return scheme;
}

/**
 * Builds the CSS variable map for a theme without rendering anything.
 * Useful for SSR, static CSS generation, or applying the theme to `document.documentElement`.
 */
export function getThemeVars(theme: Exclude<Theme, "system" | "custom"> = "dark", overrides?: Record<string, string>): Record<string, string> {
  return { ...themeVars[theme], ...overrides };
}

/** Serialises a theme to a CSS block, e.g. for a `<style>` tag or a stylesheet build step. */
export function themeToCss(theme: Exclude<Theme, "system" | "custom"> = "dark", selector = ":root", overrides?: Record<string, string>): string {
  const vars = getThemeVars(theme, overrides);
  return `${selector}{${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(";")}}`;
}

export function ThemeProvider({ theme = "dark", overrides, loadFonts = false, unstyled = false, children, className, style }: ThemeProviderProps) {
  const system = useSystemScheme();
  const resolved: Exclude<Theme, "system" | "custom"> = theme === "system" ? system : theme === "custom" ? "dark" : theme;

  const styleVars = useMemo(() => ({ ...themeVars[resolved], ...overrides }) as React.CSSProperties, [resolved, overrides]);

  useEffect(() => {
    if (!loadFonts || typeof document === "undefined") return;
    const id = "vi-theme-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap";
    document.head.appendChild(link);
  }, [loadFonts]);

  return (
    <div
      className={`vi-theme-root ${unstyled ? "vi-theme-root--unstyled" : ""} ${className || ""}`.trim()}
      style={{ ...styleVars, ...(unstyled ? { display: "contents" } : {}), ...style }}
      data-theme={resolved}
      data-color-scheme={resolved === "light" ? "light" : "dark"}
    >
      {children}
    </div>
  );
}
