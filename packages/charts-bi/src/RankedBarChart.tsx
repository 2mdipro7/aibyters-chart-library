import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { ChartCard } from "@aibyters/layout";
import { chartVars, resolveColors, truncateToWidth, estimateTextWidth, TOUCH_TARGET, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";
import { listHeight, listStyles, useReportHeight } from "./internal/useContentHeight";

export interface RankedBarDatum {
  name: string;
  value: number;
  /** Optional secondary line under the label (e.g. "12 accounts · 3 breaks"). */
  meta?: string;
}

export interface RankedBarChartProps extends BaseChartProps {
  data: RankedBarDatum[];
  /** The first N rows are rendered bolder (default 0 = none). */
  highlightTop?: number;
  /** Rows shown before a "+N more" toggle appears. */
  maxRows?: number;
  /** Sort order. Default "desc". */
  sort?: "asc" | "desc" | "none";
  /** Called when a row is activated (click / Enter / Space). */
  onItemClick?: (item: RankedBarDatum, index: number) => void;
  /** Bar thickness in px. Default 6. */
  barThickness?: number;
}

interface PlotProps {
  ctx: ChartContextValue;
  rows: RankedBarDatum[];
  total: number;
  color: string;
  highlightTop: number;
  maxRows?: number;
  expanded: boolean;
  onToggle: () => void;
  onItemClick?: (item: RankedBarDatum, index: number) => void;
  fmt: (v: number) => string;
  labelFormatter?: (l: string | number) => string;
  barThickness: number;
  onHeight: (h: number) => void;
  animate: boolean;
}

function RankedBarPlot({ ctx, rows, total, color, highlightTop, maxRows, expanded, onToggle, onItemClick, fmt, labelFormatter, barThickness, onHeight, animate }: PlotProps) {
  const ref = useReportHeight<HTMLDivElement>(onHeight);
  const { fontSize, breakpoint } = ctx.settings;
  const stacked = breakpoint === "xs";
  const max = Math.max(0, ...rows.map((r) => r.value));
  const hidden = maxRows !== undefined && !expanded ? Math.max(0, total - maxRows) : 0;
  const visible = maxRows !== undefined && !expanded ? rows.slice(0, maxRows) : rows;

  // Column widths are decided from the real container width so text never overlaps the bar.
  const valueTexts = visible.map((r) => fmt(r.value));
  const valueColW = Math.ceil(Math.max(0, ...valueTexts.map((t) => estimateTextWidth(t, fontSize))) + 6);
  const labelTexts = visible.map((r) => (labelFormatter ? labelFormatter(r.name) : r.name));
  const widestLabel = Math.max(0, ...labelTexts.map((t) => estimateTextWidth(t, fontSize)));
  const labelColW = stacked ? 0 : Math.min(Math.ceil(widestLabel) + 4, Math.max(64, Math.floor((ctx.width || 320) * 0.38)));
  const rowMinH = ctx.isTouch ? TOUCH_TARGET : 28;
  const gap = 8;
  const gridCols = stacked ? "1fr" : `${labelColW}px minmax(40px, 1fr) ${valueColW}px`;

  return (
    <div style={listStyles.scroller}>
      <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 2, fontFamily: chartVars.fontBody, fontSize }}>
        {visible.map((row, i) => {
          const pct = max > 0 ? Math.max(0, row.value) / max : 0;
          const bold = i < highlightTop;
          const label = stacked ? labelTexts[i] : truncateToWidth(labelTexts[i], labelColW - 4, fontSize);
          const rowStyle: CSSProperties = {
            display: "grid",
            gridTemplateColumns: gridCols,
            alignItems: "center",
            columnGap: gap,
            minHeight: rowMinH,
            padding: "3px 4px",
            borderRadius: 6,
            boxSizing: "border-box",
            color: chartVars.textPrimary,
            fontWeight: bold ? 600 : 400,
          };
          const bar = (
            <div style={{ position: "relative", height: barThickness, borderRadius: barThickness, background: chartVars.grid, overflow: "hidden" }} aria-hidden>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${pct * 100}%`,
                  background: color,
                  borderRadius: barThickness,
                  opacity: bold ? 1 : 0.85,
                  transition: animate ? "width 400ms ease-out" : undefined,
                }}
              />
            </div>
          );
          const value = (
            <span style={{ fontVariantNumeric: "tabular-nums", textAlign: "right", whiteSpace: "nowrap", fontWeight: bold ? 700 : 500 }}>{valueTexts[i]}</span>
          );
          const meta = row.meta ? (
            <span style={{ display: "block", fontSize: Math.max(9, fontSize - 2), color: chartVars.textMuted, fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.meta}
            </span>
          ) : null;
          const content = stacked ? (
            <div style={rowStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline", minWidth: 0 }}>
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row.name}>
                  {label}
                </span>
                {value}
              </div>
              <div style={{ marginTop: 4 }}>{bar}</div>
              {meta}
            </div>
          ) : (
            <div style={rowStyle}>
              <div style={{ minWidth: 0 }} title={row.name}>
                <span style={{ display: "block", whiteSpace: "nowrap" }}>{label}</span>
                {meta}
              </div>
              {bar}
              {value}
            </div>
          );
          const aria = `${i + 1}. ${row.name}: ${valueTexts[i]}${row.meta ? `, ${row.meta}` : ""}`;
          return onItemClick ? (
            <button
              key={`${row.name}-${i}`}
              type="button"
              onClick={() => onItemClick(row, i)}
              aria-label={aria}
              className="vi-ranked-bar-row"
              style={listStyles.resetButton}
              onMouseEnter={(e) => (e.currentTarget.style.background = chartVars.surfaceHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {content}
            </button>
          ) : (
            <div key={`${row.name}-${i}`} role="listitem" aria-label={aria} className="vi-ranked-bar-row">
              {content}
            </div>
          );
        })}
        {maxRows !== undefined && total > maxRows && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            style={{
              ...listStyles.resetButton,
              width: "auto",
              alignSelf: "flex-start",
              minHeight: ctx.isTouch ? TOUCH_TARGET : 28,
              padding: "4px 6px",
              color: chartVars.accent,
              fontSize: Math.max(10, fontSize - 1),
              fontWeight: 500,
            }}
          >
            {expanded ? "Show less" : `+${hidden.toLocaleString()} more`}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Ranked "track + fill" list. Each row shows a truncated label, a thin bar scaled to the largest
 * value, and the value right-aligned with tabular numerals. Switches to a stacked label-over-bar
 * layout when the container is narrower than 400px.
 */
export function RankedBarChart({
  data,
  highlightTop = 0,
  maxRows,
  sort = "desc",
  onItemClick,
  barThickness = 6,
  colors,
  valueFormatter,
  labelFormatter,
  height,
  minHeight,
  exportData,
  animate,
  legend,
  ...card
}: RankedBarChartProps) {
  const [expanded, setExpanded] = useState(false);
  const [measured, setMeasured] = useState(0);
  const fmt = valueFormatter ?? ((v: number) => formatCompactNumber(v));
  const rows = useMemo(() => {
    if (sort === "none") return data;
    const copy = [...data];
    copy.sort((a, b) => (sort === "asc" ? a.value - b.value : b.value - a.value));
    return copy;
  }, [data, sort]);
  const [color] = resolveColors(colors, 1);
  const shown = maxRows !== undefined && !expanded ? Math.min(maxRows, rows.length) : rows.length;
  const fallback = shown * 32 + (maxRows !== undefined && rows.length > maxRows ? 32 : 0);

  return (
    <ChartCard
      {...card}
      legend={legend ?? false}
      height={listHeight(height, measured, fallback)}
      minHeight={minHeight ?? 24}
      isEmpty={data.length === 0}
      exportData={exportData ?? data}
      animate={animate}
    >
      {(ctx) => (
        <RankedBarPlot
          ctx={ctx}
          rows={rows}
          total={rows.length}
          color={color}
          highlightTop={highlightTop}
          maxRows={maxRows}
          expanded={expanded}
          onToggle={() => setExpanded((e) => !e)}
          onItemClick={onItemClick}
          fmt={fmt}
          labelFormatter={labelFormatter}
          barThickness={barThickness}
          onHeight={setMeasured}
          animate={ctx.animate}
        />
      )}
    </ChartCard>
  );
}
