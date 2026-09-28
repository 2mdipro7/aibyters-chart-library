import { useState } from "react";
import { ChartCard } from "@aibyters/layout";
import { chartVars, estimateTextWidth, resolveColors, truncateToWidth, TOUCH_TARGET, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";
import { listHeight, listStyles, useReportHeight } from "./internal/useContentHeight";

export interface PairedBarDatum {
  name: string;
  a: number;
  b: number;
  meta?: string;
}

export interface PairedBarChartProps extends BaseChartProps {
  data: PairedBarDatum[];
  /** Label for the first (top) bar. Default "A". */
  aLabel?: string;
  /** Label for the second (bottom) bar. Default "B". */
  bLabel?: string;
  /** Delta shown at the right. Default a - b. */
  deltaFormatter?: (delta: number, item: PairedBarDatum) => string;
  /** Sort by absolute delta. Default "none". */
  sort?: "asc" | "desc" | "none";
  /** Bar thickness in px. Default 6. */
  barThickness?: number;
  onItemClick?: (item: PairedBarDatum, index: number) => void;
}

interface PlotProps {
  ctx: ChartContextValue;
  data: PairedBarDatum[];
  colors: [string, string];
  aLabel: string;
  bLabel: string;
  fmt: (v: number) => string;
  deltaFmt: (delta: number, item: PairedBarDatum) => string;
  labelFormatter?: (l: string | number) => string;
  barThickness: number;
  onItemClick?: (item: PairedBarDatum, index: number) => void;
  onHeight: (h: number) => void;
}

function PairedBarPlot({ ctx, data, colors, aLabel, bLabel, fmt, deltaFmt, labelFormatter, barThickness, onItemClick, onHeight }: PlotProps) {
  const ref = useReportHeight<HTMLDivElement>(onHeight);
  const { fontSize, breakpoint } = ctx.settings;
  const stacked = breakpoint === "xs";
  const showA = !ctx.hiddenSeries.has("a");
  const showB = !ctx.hiddenSeries.has("b");
  const max = Math.max(1, ...data.flatMap((d) => [showA ? d.a : 0, showB ? d.b : 0]));
  const labels = data.map((d) => (labelFormatter ? labelFormatter(d.name) : d.name));
  const deltas = data.map((d) => deltaFmt(d.a - d.b, d));
  const deltaW = Math.ceil(Math.max(0, ...deltas.map((t) => estimateTextWidth(t, fontSize)))) + 8;
  const labelW = stacked ? 0 : Math.min(Math.ceil(Math.max(0, ...labels.map((t) => estimateTextWidth(t, fontSize)))) + 6, Math.max(64, Math.floor((ctx.width || 320) * 0.32)));
  const cols = stacked ? "1fr" : `${labelW}px minmax(40px, 1fr) ${deltaW}px`;
  const rowMinH = ctx.isTouch ? TOUCH_TARGET : 34;
  const tiny = Math.max(9, fontSize - 2);

  return (
    <div style={listStyles.scroller}>
      <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 2, fontFamily: chartVars.fontBody, fontSize }}>
        {data.map((d, i) => {
          const delta = d.a - d.b;
          const deltaColor = delta > 0 ? chartVars.positive : delta < 0 ? chartVars.negative : chartVars.textMuted;
          const bar = (v: number, color: string, label: string) => (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }} title={`${label}: ${fmt(v)}`}>
              <div style={{ flex: "1 1 auto", position: "relative", height: barThickness, borderRadius: barThickness, background: chartVars.grid, overflow: "hidden" }} aria-hidden>
                <div style={{ position: "absolute", inset: 0, width: `${(Math.max(0, v) / max) * 100}%`, background: color, borderRadius: barThickness, transition: ctx.animate ? "width 400ms ease-out" : undefined }} />
              </div>
              <span style={{ flex: "none", fontSize: tiny, color: chartVars.textSecondary, fontVariantNumeric: "tabular-nums", minWidth: 34, textAlign: "right" }}>{fmt(v)}</span>
            </div>
          );
          const bars = (
            <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
              {showA && bar(d.a, colors[0], aLabel)}
              {showB && bar(d.b, colors[1], bLabel)}
            </div>
          );
          const deltaEl = (
            <span style={{ color: deltaColor, fontWeight: 600, fontVariantNumeric: "tabular-nums", textAlign: "right", whiteSpace: "nowrap" }}>{deltas[i]}</span>
          );
          const labelEl = (
            <div style={{ minWidth: 0 }} title={d.name}>
              <span style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: chartVars.textPrimary, fontWeight: 500 }}>{stacked ? labels[i] : truncateToWidth(labels[i], labelW - 6, fontSize)}</span>
              {d.meta && <span style={{ display: "block", fontSize: tiny, color: chartVars.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.meta}</span>}
            </div>
          );
          const content = (
            <div style={{ display: "grid", gridTemplateColumns: cols, columnGap: 10, alignItems: "center", minHeight: rowMinH, padding: "4px 4px", boxSizing: "border-box" }}>
              {stacked ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
                    {labelEl}
                    {deltaEl}
                  </div>
                  <div style={{ marginTop: 4 }}>{bars}</div>
                </>
              ) : (
                <>
                  {labelEl}
                  {bars}
                  {deltaEl}
                </>
              )}
            </div>
          );
          const aria = `${d.name}: ${aLabel} ${fmt(d.a)}, ${bLabel} ${fmt(d.b)}, delta ${deltas[i]}`;
          return onItemClick ? (
            <button
              key={i}
              type="button"
              aria-label={aria}
              onClick={() => onItemClick(d, i)}
              style={listStyles.resetButton}
              onMouseEnter={(e) => (e.currentTarget.style.background = chartVars.surfaceHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {content}
            </button>
          ) : (
            <div key={i} role="listitem" aria-label={aria}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Paired-row chart: for each row, two thin bars (source A over source B) and the delta at the
 * right, colour-coded by sign. Ideal for side-by-side reconciliation of two systems.
 */
export function PairedBarChart({ data, aLabel = "A", bLabel = "B", deltaFormatter, sort = "none", barThickness = 6, onItemClick, colors, valueFormatter, labelFormatter, height, minHeight, exportData, ...card }: PairedBarChartProps) {
  const [measured, setMeasured] = useState(0);
  const fmt = valueFormatter ?? ((v: number) => formatCompactNumber(v));
  const deltaFmt = deltaFormatter ?? ((delta: number) => (delta > 0 ? `+${fmt(delta)}` : delta < 0 ? `−${fmt(Math.abs(delta))}` : fmt(0)));
  const [ca, cb] = resolveColors(colors, 2);
  const rows = sort === "none" ? data : [...data].sort((x, y) => (sort === "asc" ? Math.abs(x.a - x.b) - Math.abs(y.a - y.b) : Math.abs(y.a - y.b) - Math.abs(x.a - x.b)));
  const series: SeriesDescriptor[] = [
    { key: "a", label: aLabel, color: ca, shape: "square" },
    { key: "b", label: bLabel, color: cb, shape: "square" },
  ];
  return (
    <ChartCard {...card} height={listHeight(height, measured, rows.length * 40)} minHeight={minHeight ?? 24} series={series} isEmpty={data.length === 0} exportData={exportData ?? data}>
      {(ctx) => <PairedBarPlot ctx={ctx} data={rows} colors={[ca, cb]} aLabel={aLabel} bLabel={bLabel} fmt={fmt} deltaFmt={deltaFmt} labelFormatter={labelFormatter} barThickness={barThickness} onItemClick={onItemClick} onHeight={setMeasured} />}
    </ChartCard>
  );
}
