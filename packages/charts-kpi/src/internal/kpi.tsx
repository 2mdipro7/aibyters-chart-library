import type { CSSProperties, ReactNode } from "react";
import { formatValue, type ValueFormat } from "@aibyters/spec";

export type KpiFormat = ValueFormat;

export interface KpiBaseProps {
  title: string;
  description?: string;
  className?: string;
  style?: CSSProperties;
  variant?: "card" | "plain";
  headerAction?: ReactNode;
  footer?: ReactNode;
  /** Currency code for `format="currency"`. Default USD. */
  currency?: string;
  locale?: string;
  /** Override formatting entirely. */
  valueFormatter?: (value: number) => string;
  /** Visual size. "auto" scales the value with the container. Default "md". */
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function fmt(value: number, format: KpiFormat = "number", p: Pick<KpiBaseProps, "currency" | "locale" | "valueFormatter">): string {
  if (p.valueFormatter) return p.valueFormatter(value);
  return formatValue(value, format, { currency: p.currency, locale: p.locale });
}

export const tone = {
  positive: "var(--vi-color-positive-main, #22c55e)",
  negative: "var(--vi-color-critical-main, #ef4444)",
  warning: "var(--vi-color-warning-main, #eab308)",
  info: "var(--vi-color-info-main, #3b82f6)",
  neutral: "var(--vi-color-text-secondary, #64748b)",
  primary: "var(--vi-color-primary, #6366f1)",
  text: "var(--vi-color-text-primary, #0f172a)",
  muted: "var(--vi-color-text-muted, #94a3b8)",
  track: "var(--vi-color-surface-cardHover, #f1f5f9)",
  font: "var(--vi-font-body, system-ui, sans-serif)",
} as const;

export const valueSize: Record<NonNullable<KpiBaseProps["size"]>, string> = {
  sm: "clamp(18px, 4.5cqw, 24px)",
  md: "clamp(22px, 6cqw, 34px)",
  lg: "clamp(28px, 8cqw, 44px)",
};

/** Big number style: tabular figures, tight leading, wraps instead of overflowing. */
export function valueStyle(size: KpiBaseProps["size"] = "md"): CSSProperties {
  return {
    fontSize: valueSize[size],
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.01em",
    color: tone.text,
    fontVariantNumeric: "tabular-nums",
    fontFamily: "var(--vi-font-heading, inherit)",
    overflowWrap: "anywhere",
    minWidth: 0,
  };
}

/** Enables container query units (cqw) for the value size. */
export const containerStyle: CSSProperties = { containerType: "inline-size", display: "flex", flexDirection: "column", justifyContent: "center", flex: "1 1 auto", minWidth: 0, gap: 6, fontFamily: tone.font };

export function Skeleton({ height = 34, width = "60%" }: { height?: number; width?: string | number }) {
  return <div aria-busy="true" style={{ height, width, borderRadius: 6, background: tone.track }} />;
}

export function DeltaBadge({ delta, invert = false, suffix = "" }: { delta: number; invert?: boolean; suffix?: string }) {
  const up = delta > 0;
  const down = delta < 0;
  const good = invert ? down : up;
  const color = delta === 0 ? tone.neutral : good ? tone.positive : tone.negative;
  const text = `${up ? "+" : down ? "−" : ""}${new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(Math.abs(delta))}`;
  return (
    <span aria-label={`${up ? "up" : down ? "down" : "unchanged"} ${text}`} style={{ display: "inline-flex", alignItems: "center", gap: 3, color, fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums", padding: "2px 6px", borderRadius: 999, background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
      <span aria-hidden>{up ? "▲" : down ? "▼" : "•"}</span>
      {text}
      {suffix && <span style={{ fontWeight: 400, color: tone.neutral }}>{suffix}</span>}
    </span>
  );
}
