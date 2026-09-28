import type { CSSProperties, ReactNode } from "react";
import { WidgetCard } from "@aibyters/layout";
import { ChartEmptyState, ChartErrorState, ChartSkeleton, chartVars, TOUCH_TARGET } from "@aibyters/core";
import { formatCompactNumber, formatCurrency, formatDelta, formatPercent } from "@aibyters/spec";

export type MetricStripTone = "neutral" | "positive" | "negative" | "warning";
export type MetricStripFormat = "number" | "currency" | "percent" | "count";

export interface MetricStripItem {
  label: string;
  /** Raw number (formatted via `format`) or a pre-formatted string. */
  value: string | number;
  /** Small line under the value (e.g. "vs. prior month"). */
  sub?: string;
  /** Relative change as a fraction (0.12 = +12 %). Coloured by sign. */
  delta?: number;
  /** number = compact (1.2M), currency, percent (fraction), count = full digits with grouping. */
  format?: MetricStripFormat;
  tone?: MetricStripTone;
  /** Optional key returned by onItemClick; defaults to the index. */
  id?: string;
}

export interface MetricStripProps {
  title: string;
  description?: string;
  items: MetricStripItem[];
  /** Minimum tile width in px for the auto-fit grid. Default 150. */
  minTileWidth?: number;
  /** Currency code for `format: "currency"`. Default "USD". */
  currency?: string;
  /** Formatter for `format: "count"`. Default locale grouping (8,999). */
  countFormatter?: (n: number) => string;
  /** Formatter for `delta`. Default formatDelta (+12.0 %). */
  deltaFormatter?: (delta: number) => string;
  /** Hide delta indicators. */
  showDelta?: boolean;
  variant?: "card" | "plain";
  loading?: boolean;
  error?: string | Error | null;
  emptyMessage?: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
  exportData?: Record<string, any>[];
  className?: string;
  style?: CSSProperties;
  onItemClick?: (item: MetricStripItem, index: number) => void;
}

const toneColor: Record<MetricStripTone, string> = {
  neutral: chartVars.textPrimary,
  positive: chartVars.positive,
  negative: chartVars.negative,
  warning: chartVars.warning,
};

function formatValue(item: MetricStripItem, currency: string, countFormatter: (n: number) => string): string {
  if (typeof item.value === "string") return item.value;
  switch (item.format) {
    case "currency":
      return formatCurrency(item.value, currency);
    case "percent":
      return formatPercent(item.value);
    case "count":
      return countFormatter(item.value);
    default:
      return formatCompactNumber(item.value);
  }
}

/**
 * A responsive strip of KPI tiles inside one card. Tiles flow with
 * `repeat(auto-fit, minmax(minTileWidth, 1fr))`, use tabular numerals and a kicker-style label.
 */
export function MetricStrip({
  title,
  description,
  items,
  minTileWidth = 150,
  currency = "USD",
  countFormatter = (n) => n.toLocaleString(),
  deltaFormatter = formatDelta,
  showDelta = true,
  variant,
  loading,
  error,
  emptyMessage,
  headerAction,
  footer,
  exportData,
  className,
  style,
  onItemClick,
}: MetricStripProps) {
  let body: ReactNode;
  if (loading) body = <ChartSkeleton height={84} />;
  else if (error) body = <ChartErrorState error={error} />;
  else if (items.length === 0) body = <ChartEmptyState message={emptyMessage} />;
  else {
    body = (
      <div
        role="list"
        className="vi-metric-strip"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(min(${minTileWidth}px, 100%), 1fr))`,
          gap: "12px 16px",
          fontFamily: chartVars.fontBody,
        }}
      >
        {items.map((item, i) => {
          const tone = item.tone ?? "neutral";
          const value = formatValue(item, currency, countFormatter);
          const delta = item.delta;
          const deltaColor = delta === undefined ? chartVars.textMuted : delta > 0 ? chartVars.positive : delta < 0 ? chartVars.negative : chartVars.textMuted;
          const tile = (
            <div style={{ minWidth: 0, padding: "4px 0", borderLeft: `2px solid ${tone === "neutral" ? chartVars.border : toneColor[tone]}`, paddingLeft: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: chartVars.textSecondary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={item.label}
              >
                {item.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
                <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, fontVariantNumeric: "tabular-nums", color: toneColor[tone], whiteSpace: "nowrap" }}>{value}</span>
                {showDelta && delta !== undefined && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: deltaColor, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }} aria-label={`change ${deltaFormatter(delta)}`}>
                    {delta > 0 ? "▲ " : delta < 0 ? "▼ " : ""}
                    {deltaFormatter(delta)}
                  </span>
                )}
              </div>
              {item.sub && (
                <div style={{ fontSize: 12, color: chartVars.textMuted, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={item.sub}>
                  {item.sub}
                </div>
              )}
            </div>
          );
          const aria = `${item.label}: ${value}${delta !== undefined ? `, ${deltaFormatter(delta)}` : ""}${item.sub ? `, ${item.sub}` : ""}`;
          return onItemClick ? (
            <button
              key={item.id ?? i}
              type="button"
              role="listitem"
              aria-label={aria}
              onClick={() => onItemClick(item, i)}
              style={{ background: "none", border: "none", padding: 0, margin: 0, font: "inherit", color: "inherit", textAlign: "left", cursor: "pointer", borderRadius: 6, minHeight: TOUCH_TARGET, minWidth: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = chartVars.surfaceHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {tile}
            </button>
          ) : (
            <div key={item.id ?? i} role="listitem" aria-label={aria} style={{ minWidth: 0 }}>
              {tile}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <WidgetCard title={title} description={description} variant={variant} headerAction={headerAction} footer={footer} exportData={exportData ?? (items.length ? items : undefined)} className={className} style={style}>
      {body}
    </WidgetCard>
  );
}
