import { useState } from "react";
import { ChartCard } from "@aibyters/layout";
import { chartVars, labelFits, resolveColors, truncateToWidth, TOUCH_TARGET, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { defaultCountFormatter, listHeight, listStyles, useReportHeight } from "./internal/useContentHeight";

export interface StatusStripDatum {
  label: string;
  status: string;
  count?: number;
}

export interface StatusStripChartProps extends BaseChartProps {
  data: StatusStripDatum[];
  /** Colour per status key. Unknown statuses fall back to semantic names, then the palette. */
  statusColors?: Record<string, string>;
  /** Label of the selected cell (e.g. the current month). */
  selected?: string;
  /** Formatter for the count inside each cell. Default: locale grouping, never compact. */
  countFormatter?: (n: number) => string;
  /** Cell height in px. Default 36. */
  cellHeight?: number;
  onCellClick?: (item: StatusStripDatum, index: number) => void;
}

const SEMANTIC: Record<string, string> = {
  ok: chartVars.positive,
  matched: chartVars.positive,
  success: chartVars.positive,
  complete: chartVars.positive,
  reconciled: chartVars.positive,
  warning: chartVars.warning,
  pending: chartVars.warning,
  partial: chartVars.warning,
  review: chartVars.warning,
  error: chartVars.negative,
  breach: chartVars.negative,
  critical: chartVars.negative,
  failed: chartVars.negative,
  unmatched: chartVars.negative,
  info: chartVars.info,
  open: chartVars.info,
  none: chartVars.textMuted,
  empty: chartVars.textMuted,
};

interface PlotProps {
  ctx: ChartContextValue;
  data: StatusStripDatum[];
  colorOf: (status: string) => string;
  selected?: string;
  countFmt: (n: number) => string;
  cellHeight: number;
  labelFormatter?: (l: string | number) => string;
  onCellClick?: (item: StatusStripDatum, index: number) => void;
  onHeight: (h: number) => void;
}

function StatusStripPlot({ ctx, data, colorOf, selected, countFmt, cellHeight, labelFormatter, onCellClick, onHeight }: PlotProps) {
  const ref = useReportHeight<HTMLDivElement>(onHeight);
  const { fontSize } = ctx.settings;
  const width = ctx.width || 320;
  const gap = 3;
  const minCell = ctx.isTouch ? TOUCH_TARGET : 24;
  const perRow = Math.max(1, Math.min(data.length, Math.floor((width + gap) / (minCell + gap))));
  const cellW = (width - gap * (perRow - 1)) / perRow;
  const h = ctx.isTouch ? Math.max(cellHeight, TOUCH_TARGET) : cellHeight;
  const tiny = Math.max(9, fontSize - 2);
  // Only draw every Nth label when the cells are too narrow for one.
  const labels = data.map((d) => (labelFormatter ? labelFormatter(d.label) : d.label));
  const widest = Math.max(0, ...labels.map((l) => l.length));
  const every = labelFits("M".repeat(Math.min(widest, 4)), cellW, 20, tiny, 1) ? 1 : Math.ceil((tiny * 2.4) / cellW);

  return (
    <div style={listStyles.scroller}>
      <div ref={ref} style={{ display: "flex", flexWrap: "wrap", gap, fontFamily: chartVars.fontBody, fontSize }}>
        {data.map((d, i) => {
          const key = `st:${d.status}`;
          const hidden = ctx.hiddenSeries.has(key);
          const dim = hidden || (ctx.highlightedSeries !== null && ctx.highlightedSeries !== key);
          const color = colorOf(d.status);
          const isSel = selected !== undefined && d.label === selected;
          const countText = d.count !== undefined ? countFmt(d.count) : "";
          const showCount = countText !== "" && labelFits(countText, cellW, h, tiny, 2);
          const cell = (
            <div
              style={{
                height: h,
                borderRadius: 5,
                background: color,
                opacity: dim ? 0.2 : 1,
                outline: isSel ? `2px solid ${chartVars.textPrimary}` : "none",
                outlineOffset: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--vi-color-text-onAccent, #fff)",
                fontSize: tiny,
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                transition: "opacity 120ms",
                boxSizing: "border-box",
              }}
              aria-hidden
            >
              {showCount ? countText : ""}
            </div>
          );
          const showLabel = i % every === 0;
          const labelEl = (
            <div style={{ marginTop: 4, fontSize: tiny, color: isSel ? chartVars.textPrimary : chartVars.textMuted, fontWeight: isSel ? 600 : 400, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", minHeight: tiny + 2 }}>
              {showLabel ? truncateToWidth(labels[i], cellW, tiny) : ""}
            </div>
          );
          const aria = `${d.label}: ${d.status}${d.count !== undefined ? `, ${countText}` : ""}${isSel ? " (selected)" : ""}`;
          const boxStyle = { width: cellW, minWidth: 0, flex: "none" as const };
          return onCellClick ? (
            <button key={i} type="button" aria-label={aria} aria-pressed={isSel} title={aria} onClick={() => onCellClick(d, i)} style={{ ...listStyles.resetButton, ...boxStyle }}>
              {cell}
              {labelEl}
            </button>
          ) : (
            <div key={i} role="listitem" aria-label={aria} title={aria} style={boxStyle}>
              {cell}
              {labelEl}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Timeline-style strip of status cells (e.g. one per month) coloured by category, with the count
 * inside each cell where it fits. Statuses form the legend; the selected cell is outlined.
 */
export function StatusStripChart({ data, statusColors, selected, countFormatter, cellHeight = 36, onCellClick, colors, labelFormatter, height, minHeight, exportData, ...card }: StatusStripChartProps) {
  const [measured, setMeasured] = useState(0);
  const statuses = Array.from(new Set(data.map((d) => d.status)));
  const palette = resolveColors(colors, statuses.length);
  const colorOf = (s: string) => statusColors?.[s] ?? (colors ? palette[statuses.indexOf(s)] : SEMANTIC[s.toLowerCase()] ?? palette[statuses.indexOf(s)]);
  const series: SeriesDescriptor[] = statuses.map((s) => ({ key: `st:${s}`, label: s, color: colorOf(s), shape: "square" }));
  const counts: Record<string, string> = {};
  for (const s of statuses) counts[`st:${s}`] = data.filter((d) => d.status === s).length.toLocaleString();
  return (
    <ChartCard {...card} height={listHeight(height, measured, cellHeight + 24)} minHeight={minHeight ?? 24} series={series} legendValues={counts} isEmpty={data.length === 0} exportData={exportData ?? data}>
      {(ctx) => <StatusStripPlot ctx={ctx} data={data} colorOf={colorOf} selected={selected} countFmt={countFormatter ?? defaultCountFormatter} cellHeight={cellHeight} labelFormatter={labelFormatter} onCellClick={onCellClick} onHeight={setMeasured} />}
    </ChartCard>
  );
}
