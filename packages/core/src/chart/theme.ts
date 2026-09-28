/**
 * Theme access for charts.
 * Every colour a chart draws must come from a CSS custom property so a host application
 * can re-skin the library by overriding variables, without touching component code.
 */

export const chartVars = {
  axisText: "var(--vi-color-text-secondary)",
  axisLine: "var(--vi-color-surface-border)",
  grid: "var(--vi-color-surface-grid, var(--vi-color-surface-borderLight))",
  textPrimary: "var(--vi-color-text-primary)",
  textSecondary: "var(--vi-color-text-secondary)",
  textMuted: "var(--vi-color-text-muted)",
  surface: "var(--vi-color-surface-card)",
  surfaceHover: "var(--vi-color-surface-cardHover)",
  border: "var(--vi-color-surface-border)",
  positive: "var(--vi-color-positive-main)",
  negative: "var(--vi-color-critical-main)",
  warning: "var(--vi-color-warning-main)",
  info: "var(--vi-color-info-main)",
  accent: "var(--vi-color-accent-500)",
  fontBody: "var(--vi-font-body, system-ui, sans-serif)",
  fontMono: "var(--vi-font-mono, ui-monospace, monospace)",
} as const;

/** Palette used when nothing else is configured. Mirrors `tokens.colors.chart`. */
export const FALLBACK_PALETTE = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#a855f7", "#ec4899", "#14b8a6", "#f97316", "#64748b",
  "#0ea5e9", "#84cc16",
];

/**
 * Returns `count` series colours. Each entry is a CSS `var()` expression that resolves to the
 * theme's `--vi-color-chart-N` variable and falls back to the built-in palette, so charts pick up
 * a host theme automatically while still rendering correctly when no theme is loaded.
 *
 * Because the value is a plain string, it works anywhere an SVG `fill` / `stroke` works.
 */
export function themePalette(count: number = FALLBACK_PALETTE.length): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const fallback = FALLBACK_PALETTE[i % FALLBACK_PALETTE.length];
    out.push(`var(--vi-color-chart-${i % FALLBACK_PALETTE.length}, ${fallback})`);
  }
  return out;
}

/** Resolve the series colour list: explicit `colors` prop wins, otherwise the theme palette. */
export function resolveColors(colors: string[] | undefined, count: number): string[] {
  if (colors && colors.length > 0) {
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  }
  return themePalette(Math.max(count, 1));
}

/**
 * Reads the *computed* value of a CSS variable from an element (or documentElement).
 * Use only where a literal colour is required (canvas, export, colour maths).
 */
export function readCssVar(name: string, el?: Element | null, fallback = ""): string {
  if (typeof window === "undefined" || typeof getComputedStyle === "undefined") return fallback;
  const target = el ?? document.documentElement;
  const v = getComputedStyle(target).getPropertyValue(name).trim();
  return v || fallback;
}

export const tooltipStyle = {
  backgroundColor: chartVars.surface,
  border: `1px solid ${chartVars.border}`,
  borderRadius: 8,
  color: chartVars.textPrimary,
  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.15)",
  fontSize: 12,
  fontFamily: chartVars.fontBody,
  padding: "8px 12px",
} as const;
