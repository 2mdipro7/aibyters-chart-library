import { useEffect, useState } from "react";

/**
 * Breakpoints are based on the *chart container width*, never the viewport.
 * A chart in a 3-column desktop grid and a chart on a phone both get "xs" treatment
 * when they have 360px to work with.
 */
export type ChartBreakpoint = "xs" | "sm" | "md" | "lg";

export const CHART_BREAKPOINTS: Record<ChartBreakpoint, number> = {
  xs: 0,
  sm: 400,
  md: 640,
  lg: 960,
};

export function breakpointFor(width: number): ChartBreakpoint {
  if (width >= CHART_BREAKPOINTS.lg) return "lg";
  if (width >= CHART_BREAKPOINTS.md) return "md";
  if (width >= CHART_BREAKPOINTS.sm) return "sm";
  return "xs";
}

export interface ResponsiveChartSettings {
  breakpoint: ChartBreakpoint;
  /** Font size for axis ticks and legend text. */
  fontSize: number;
  /** Suggested tick count for numeric axes. */
  tickCount: number;
  /** Line stroke width. */
  strokeWidth: number;
  /** Radius of hover / active dots. */
  dotRadius: number;
  /** Whether a side legend should be moved to the bottom to preserve plot width. */
  collapseSideLegend: boolean;
  /** Maximum legend items before the legend truncates with a "+N" overflow control. */
  legendMaxItems: number;
  /** Outer padding around the plot. */
  padding: number;
  /** Whether pie / donut labels should be drawn outside (needs horizontal room). */
  outsidePieLabels: boolean;
}

export function responsiveSettings(width: number, isTouch: boolean): ResponsiveChartSettings {
  const bp = breakpointFor(width);
  const base: ResponsiveChartSettings = {
    breakpoint: bp,
    fontSize: 12,
    tickCount: 6,
    strokeWidth: 2.5,
    dotRadius: isTouch ? 7 : 5,
    collapseSideLegend: false,
    legendMaxItems: 12,
    padding: 8,
    outsidePieLabels: true,
  };
  switch (bp) {
    case "xs":
      return { ...base, fontSize: 10, tickCount: 4, strokeWidth: 2, collapseSideLegend: true, legendMaxItems: 6, padding: 4, outsidePieLabels: false };
    case "sm":
      return { ...base, fontSize: 11, tickCount: 5, strokeWidth: 2, collapseSideLegend: true, legendMaxItems: 8, padding: 6, outsidePieLabels: false };
    case "md":
      return { ...base, fontSize: 11, tickCount: 5, collapseSideLegend: false, legendMaxItems: 10 };
    default:
      return base;
  }
}

function subscribeMedia(query: string, cb: (matches: boolean) => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia(query);
  const handler = (e: MediaQueryListEvent) => cb(e.matches);
  cb(mql.matches);
  if (mql.addEventListener) mql.addEventListener("change", handler);
  else mql.addListener(handler);
  return () => {
    if (mql.removeEventListener) mql.removeEventListener("change", handler);
    else mql.removeListener(handler);
  };
}

/** True on devices whose primary pointer is coarse (touch). Safe during SSR (false). */
export function useIsTouchDevice(): boolean {
  const [touch, setTouch] = useState(false);
  useEffect(() => subscribeMedia("(pointer: coarse)", setTouch), []);
  return touch;
}

/** Honour the OS "reduce motion" preference. Charts skip mount animation when true. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => subscribeMedia("(prefers-reduced-motion: reduce)", setReduced), []);
  return reduced;
}

/** Minimum interactive target size recommended by WCAG 2.5.8 / Apple HIG. */
export const TOUCH_TARGET = 44;
