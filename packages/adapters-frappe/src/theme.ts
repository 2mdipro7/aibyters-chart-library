/**
 * Bridges Frappe Desk's CSS variables to the library's `--vi-*` tokens so charts inherit the
 * site's theme (including dark mode and custom themes) with no configuration.
 *
 * Frappe Desk (v14–v16) defines variables on `:root` / `[data-theme="dark"]` such as
 * `--text-color`, `--text-muted`, `--bg-color`, `--card-bg`, `--border-color`, `--primary`,
 * `--heading-color`, `--subtle-fg`, `--font-stack`. We map those and keep literal fallbacks.
 */

export interface FrappeThemeOptions {
  /** Brand chart palette override (8 colours). Defaults to the library palette. */
  palette?: string[];
  /** Use Frappe's `--primary` as chart colour 0. Default true. */
  primaryAsFirstSeries?: boolean;
}

const v = (name: string, fallback: string) => `var(${name}, ${fallback})`;

export function frappeThemeOverrides(opts: FrappeThemeOptions = {}): Record<string, string> {
  const { palette, primaryAsFirstSeries = true } = opts;
  const overrides: Record<string, string> = {
    "--vi-font-body": v("--font-stack", "'Inter', system-ui, sans-serif"),
    "--vi-font-heading": v("--font-stack", "'Inter', system-ui, sans-serif"),
    "--vi-color-text-primary": v("--text-color", "#1f272e"),
    "--vi-color-text-secondary": v("--text-muted", "#626b6f"),
    "--vi-color-text-tertiary": v("--text-light", "#74808b"),
    "--vi-color-text-muted": v("--text-light", "#74808b"),
    "--vi-color-surface-background": v("--bg-color", "#f3f3f3"),
    "--vi-color-surface-card": v("--card-bg", "#ffffff"),
    "--vi-color-surface-elevated": v("--fg-color", "#ffffff"),
    "--vi-color-surface-cardHover": v("--subtle-fg", "#f8f8f8"),
    "--vi-color-surface-border": v("--border-color", "#e2e6e9"),
    "--vi-color-surface-borderLight": v("--border-color", "#e2e6e9"),
    "--vi-color-surface-grid": v("--border-color", "#e2e6e9"),
    "--vi-color-primary": v("--primary", "#171717"),
    "--vi-color-accent-500": v("--primary", "#171717"),
    "--vi-color-positive-main": v("--green-500", "#29a745"),
    "--vi-color-critical-main": v("--red-500", "#e24c4c"),
    "--vi-color-warning-main": v("--yellow-500", "#e5a000"),
    "--vi-color-info-main": v("--blue-500", "#2490ef"),
    "--vi-radius-lg": v("--border-radius-lg", "10px"),
    "--vi-radius-md": v("--border-radius-md", "8px"),
    "--vi-shadow-card": v("--card-shadow", "0 1px 3px rgba(0,0,0,0.08)"),
  };
  if (palette) palette.forEach((c, i) => (overrides[`--vi-color-chart-${i}`] = c));
  else if (primaryAsFirstSeries) overrides["--vi-color-chart-0"] = v("--primary", "#6366f1");
  return overrides;
}

/** Reads Desk's current colour scheme from `<html data-theme>` ("light" | "dark" | "automatic"). */
export function readFrappeTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const attr = document.documentElement.getAttribute("data-theme") || document.documentElement.getAttribute("data-theme-mode");
  if (attr === "dark") return "dark";
  if (attr === "automatic" && typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

/** Subscribes to Desk theme switches (Frappe toggles the `data-theme` attribute on <html>). */
export function onFrappeThemeChange(cb: (theme: "light" | "dark") => void): () => void {
  if (typeof MutationObserver === "undefined") return () => {};
  const mo = new MutationObserver(() => cb(readFrappeTheme()));
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-theme-mode"] });
  return () => mo.disconnect();
}
