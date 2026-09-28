import React, { useState } from "react";
import type { LegendOptions, SeriesDescriptor } from "./types";
import { chartVars } from "./theme";
import { TOUCH_TARGET } from "./responsive";
import { estimateTextWidth } from "./text-measure";

/** Greedy row packing: how many legend items fit into `maxRows` rows of `width` px. */
function itemsThatFit(series: SeriesDescriptor[], values: Record<string, string> | undefined, fontSize: number, width: number, maxRows: number): number {
  const gap = fontSize;
  let rows = 1;
  let x = 0;
  let count = 0;
  for (const s of series) {
    const label = Math.min(200, estimateTextWidth(s.label, fontSize));
    const value = values?.[s.key] ? estimateTextWidth(values[s.key], fontSize) + 8 : 0;
    const w = 12 + 6 + label + value + 12;
    if (x + w > width && x > 0) {
      rows++;
      x = 0;
      if (rows > maxRows) break;
    }
    x += w + gap;
    count++;
  }
  return count;
}

export interface ChartLegendProps extends Required<Pick<LegendOptions, "position" | "interactive" | "maxRows" | "align">> {
  series: SeriesDescriptor[];
  hidden: ReadonlySet<string>;
  highlighted: string | null;
  onToggle?: (key: string) => void;
  onHighlight?: (key: string | null) => void;
  /** Font size in px, supplied by the responsive settings. */
  fontSize: number;
  /** Items beyond this count collapse behind a "+N more" control. */
  maxItems: number;
  isTouch: boolean;
  /** Optional per-item trailing value (e.g. counts, percentages). */
  values?: Record<string, string>;
  /** Width available to the legend in px, used to decide how many items fit in `maxRows`. */
  availableWidth?: number;
  id?: string;
}

function Swatch({ color, shape, dimmed }: { color: string; shape: SeriesDescriptor["shape"]; dimmed: boolean }) {
  const common: React.CSSProperties = { flex: "none", opacity: dimmed ? 0.35 : 1, transition: "opacity 120ms" };
  if (shape === "line" || shape === "dashed") {
    return (
      <svg width={16} height={10} style={common} aria-hidden>
        <line x1={0} y1={5} x2={16} y2={5} stroke={color} strokeWidth={2.5} strokeDasharray={shape === "dashed" ? "4 3" : undefined} strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <span
      style={{
        ...common,
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: shape === "square" ? 2 : "50%",
        background: color,
      }}
      aria-hidden
    />
  );
}

/**
 * HTML legend rendered outside the SVG plot area.
 *
 * Why not Recharts' `<Legend>`? It lives inside the SVG's fixed height, so a legend that wraps
 * to three rows steals plot height, and a padded wrapper overflows the container and collides
 * with whatever sits below the chart. Rendering the legend as ordinary flex content means the
 * layout engine reserves exactly the space it needs, at every width.
 */
export function ChartLegend({
  series,
  hidden,
  highlighted,
  onToggle,
  onHighlight,
  position,
  interactive,
  maxRows,
  align,
  fontSize,
  maxItems,
  isTouch,
  values,
  availableWidth,
  id,
}: ChartLegendProps) {
  const [expanded, setExpanded] = useState(false);
  if (position === "none" || series.length === 0) return null;

  const vertical = position === "left" || position === "right";
  // Estimate how many items fit in maxRows and collapse the rest behind "+N more".
  const rowHeight = fontSize + 10;
  const cap = vertical ? maxItems : Math.min(maxItems, Math.max(3, itemsThatFit(series, values, fontSize, availableWidth ?? 600, maxRows)));
  const overflow = series.length > cap && !expanded;
  const visibleSeries = overflow ? series.slice(0, cap) : series;
  const minTarget = isTouch ? Math.max(TOUCH_TARGET - 12, rowHeight) : rowHeight;

  const justify = align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";

  return (
    <div
      id={id}
      role="list"
      aria-label="Chart legend"
      className="vi-chart-legend"
      data-position={position}
      style={{
        display: "flex",
        flexWrap: vertical ? "nowrap" : "wrap",
        flexDirection: vertical ? "column" : "row",
        justifyContent: vertical ? "flex-start" : justify,
        alignItems: vertical ? "stretch" : "center",
        gap: vertical ? 2 : `2px ${fontSize}px`,
        // Rows beyond maxRows are collapsed via maxItems ("+N more"), never clipped mid-row.
        maxHeight: vertical ? "100%" : undefined,
        overflow: "visible",
        padding: vertical ? "0 0 0 8px" : "8px 4px 0",
        fontSize,
        lineHeight: 1.2,
        color: chartVars.textSecondary,
        fontFamily: chartVars.fontBody,
        minWidth: 0,
        maxWidth: vertical ? "45%" : "100%",
        // A side legend keeps its content width; the plot absorbs the remaining space.
        flex: vertical ? "0 0 auto" : undefined,
        scrollbarWidth: "thin",
      }}
    >
      {visibleSeries.map((s) => {
        const isHidden = hidden.has(s.key);
        const dimmed = isHidden || (highlighted !== null && highlighted !== s.key);
        const content = (
          <>
            <Swatch color={s.color} shape={s.shape} dimmed={dimmed} />
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textDecoration: isHidden ? "line-through" : "none",
                opacity: dimmed ? 0.55 : 1,
                maxWidth: vertical ? "100%" : 200,
                minWidth: 0,
              }}
              title={s.label}
            >
              {s.label}
            </span>
            {values && values[s.key] !== undefined && (
              <span style={{ marginLeft: "auto", paddingLeft: 8, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", color: chartVars.textPrimary, opacity: dimmed ? 0.55 : 1 }}>
                {values[s.key]}
              </span>
            )}
          </>
        );
        const baseStyle: React.CSSProperties = {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          minHeight: minTarget,
          padding: "0 6px",
          borderRadius: 6,
          maxWidth: "100%",
          minWidth: 0,
          background: "transparent",
          border: 0,
          color: "inherit",
          font: "inherit",
          textAlign: "left",
          cursor: interactive ? "pointer" : "default",
        };
        if (!interactive) {
          return (
            <span key={s.key} role="listitem" style={baseStyle}>
              {content}
            </span>
          );
        }
        return (
          <button
            key={s.key}
            type="button"
            role="listitem"
            aria-pressed={!isHidden}
            aria-label={`${isHidden ? "Show" : "Hide"} ${s.label}`}
            onClick={() => onToggle?.(s.key)}
            onDoubleClick={(e) => e.preventDefault()}
            onMouseEnter={() => !isTouch && onHighlight?.(s.key)}
            onMouseLeave={() => !isTouch && onHighlight?.(null)}
            onFocus={() => onHighlight?.(s.key)}
            onBlur={() => onHighlight?.(null)}
            className="vi-chart-legend-item"
            style={baseStyle}
          >
            {content}
          </button>
        );
      })}
      {series.length > cap && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          style={{
            display: "inline-flex",
            alignItems: "center",
            minHeight: minTarget,
            padding: "0 8px",
            borderRadius: 6,
            border: `1px solid ${chartVars.border}`,
            background: "transparent",
            color: chartVars.textSecondary,
            font: "inherit",
            cursor: "pointer",
          }}
        >
          {expanded ? "Show less" : `+${series.length - cap} more`}
        </button>
      )}
    </div>
  );
}
