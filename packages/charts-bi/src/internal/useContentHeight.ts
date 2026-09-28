import { useEffect, useRef } from "react";
import type { CSSProperties, RefObject } from "react";

/**
 * Measures the natural height of list-style chart content and reports it upward so the outer
 * component can size the ChartFrame to fit exactly (no clipped rows, no empty space).
 * Must be called from a real component (never inside the ChartCard render prop).
 */
export function useReportHeight<T extends HTMLElement = HTMLDivElement>(onHeight: (h: number) => void): RefObject<T> {
  const ref = useRef<T>(null);
  const cb = useRef(onHeight);
  cb.current = onHeight;
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => cb.current(Math.ceil(el.getBoundingClientRect().height));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return ref;
}

/** Shared inline styles for list-style charts. */
export const listStyles = {
  scroller: {
    position: "absolute",
    inset: 0,
    overflowY: "auto",
    overflowX: "hidden",
  } as CSSProperties,
  resetButton: {
    display: "block",
    width: "100%",
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    font: "inherit",
    color: "inherit",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: 6,
    boxSizing: "border-box",
  } as CSSProperties,
};

/** Default formatter for counts: full digits with locale grouping (8,999 stays 8,999). */
export const defaultCountFormatter = (n: number): string => n.toLocaleString();

/** Resolves the frame height for list charts: explicit prop wins, then the measured content. */
export function listHeight(explicit: number | "auto" | "fill" | undefined, measured: number, fallback: number): number {
  if (typeof explicit === "number") return explicit;
  return measured > 0 ? measured : fallback;
}
