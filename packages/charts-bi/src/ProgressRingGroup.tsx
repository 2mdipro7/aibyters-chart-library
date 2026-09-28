import { ChartCard } from "@aibyters/layout";
import { chartVars, resolveColors, truncateToWidth, TOUCH_TARGET, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";
import { useState } from "react";
import { listHeight, listStyles, useReportHeight } from "./internal/useContentHeight";

export interface ProgressRingDatum {
  name: string;
  value: number;
  /** Denominator for this ring. Defaults to the sum of all values (share of total). */
  max?: number;
  /** Pre-formatted amount shown under the name (e.g. "$1.2M"). Defaults to valueFormatter(value). */
  amount?: string;
}

export interface ProgressRingGroupProps extends BaseChartProps {
  data: ProgressRingDatum[];
  /** Ring diameter in px at desktop widths. Default 96. */
  ringSize?: number;
  /** Ring stroke width in px. Default 8. */
  strokeWidth?: number;
  onItemClick?: (item: ProgressRingDatum, index: number) => void;
}

interface PlotProps {
  ctx: ChartContextValue;
  data: ProgressRingDatum[];
  ringSize: number;
  strokeWidth: number;
  palette: string[];
  fmt: (v: number) => string;
  onItemClick?: (item: ProgressRingDatum, index: number) => void;
  onHeight: (h: number) => void;
}

function ProgressRingPlot({ ctx, data, ringSize, strokeWidth, palette, fmt, onItemClick, onHeight }: PlotProps) {
  const ref = useReportHeight<HTMLDivElement>(onHeight);
  const { fontSize, breakpoint } = ctx.settings;
  const size = breakpoint === "xs" ? Math.min(ringSize, 80) : breakpoint === "sm" ? Math.min(ringSize, 88) : ringSize;
  const sum = data.reduce((a, d) => a + Math.max(0, d.value), 0);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const itemW = Math.max(96, size + 16);
  const highlighted = ctx.highlightedSeries;

  return (
    <div style={listStyles.scroller}>
      <div ref={ref} style={{ display: "flex", flexWrap: "wrap", gap: "12px 8px", justifyContent: "center", fontFamily: chartVars.fontBody }}>
        {data.map((d, i) => {
          const key = `s${i}`;
          if (ctx.hiddenSeries.has(key)) return null;
          const denom = d.max !== undefined && d.max > 0 ? d.max : sum;
          const share = denom > 0 ? Math.min(1, Math.max(0, d.value / denom)) : 0;
          const pctText = `${Math.round(share * 100)}%`;
          const amount = d.amount ?? fmt(d.value);
          const dim = highlighted !== null && highlighted !== key;
          const inner = (
            <>
              <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${d.name}: ${pctText}, ${amount}`} style={{ display: "block", transform: "rotate(-90deg)" }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={chartVars.grid} strokeWidth={strokeWidth} />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={palette[i]}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${circ}`}
                  strokeDashoffset={circ * (1 - share)}
                  style={{ transition: ctx.animate ? "stroke-dashoffset 600ms ease-out" : undefined }}
                />
              </svg>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  width: size,
                  height: size,
                  transform: "translateX(-50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: Math.max(11, Math.round(size * 0.2)),
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                  color: chartVars.textPrimary,
                }}
              >
                {pctText}
              </div>
              <div style={{ marginTop: 6, fontSize, color: chartVars.textPrimary, fontWeight: 500, whiteSpace: "nowrap" }} title={d.name}>
                {truncateToWidth(d.name, itemW - 8, fontSize)}
              </div>
              <div style={{ fontSize: Math.max(9, fontSize - 1), color: chartVars.textSecondary, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                {truncateToWidth(amount, itemW - 8, fontSize - 1)}
              </div>
            </>
          );
          const base = {
            position: "relative" as const,
            width: itemW,
            minHeight: ctx.isTouch ? Math.max(TOUCH_TARGET, size + 40) : undefined,
            textAlign: "center" as const,
            opacity: dim ? 0.35 : 1,
            transition: "opacity 120ms",
            padding: "4px 0",
            boxSizing: "border-box" as const,
          };
          return onItemClick ? (
            <button
              key={key}
              type="button"
              onClick={() => onItemClick(d, i)}
              style={{ ...listStyles.resetButton, ...base, width: itemW, textAlign: "center" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = chartVars.surfaceHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {inner}
            </button>
          ) : (
            <div key={key} style={base}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * A row of small circular progress rings ("tier orbits"). Each ring shows its share of the total
 * (or of its own `max`) in the centre, with the name and amount beneath. Wraps at narrow widths.
 */
export function ProgressRingGroup({ data, ringSize = 96, strokeWidth = 8, onItemClick, colors, valueFormatter, height, minHeight, exportData, ...card }: ProgressRingGroupProps) {
  const [measured, setMeasured] = useState(0);
  const fmt = valueFormatter ?? ((v: number) => formatCompactNumber(v));
  const palette = resolveColors(colors, data.length);
  const series: SeriesDescriptor[] = data.map((d, i) => ({ key: `s${i}`, label: d.name, color: palette[i] }));
  return (
    <ChartCard {...card} height={listHeight(height, measured, ringSize + 56)} minHeight={minHeight ?? 24} series={series} isEmpty={data.length === 0} exportData={exportData ?? data}>
      {(ctx) => <ProgressRingPlot ctx={ctx} data={data} ringSize={ringSize} strokeWidth={strokeWidth} palette={palette} fmt={fmt} onItemClick={onItemClick} onHeight={setMeasured} />}
    </ChartCard>
  );
}
