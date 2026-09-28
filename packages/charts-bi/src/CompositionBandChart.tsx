import { useState } from "react";
import { ChartCard } from "@aibyters/layout";
import { chartVars, labelFits, resolveColors, resolveDataLabels, truncateToWidth, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";
import { listHeight, listStyles, useReportHeight } from "./internal/useContentHeight";

export interface CompositionBandDatum {
  name: string;
  value: number;
}

export interface CompositionBandChartProps extends BaseChartProps {
  data: CompositionBandDatum[];
  /** Band thickness in px. Default 28. */
  bandHeight?: number;
  /** Show the key grid (name, %, absolute) under the band. Default true. */
  showKey?: boolean;
  /** Decimal places for percentages. Default 1. */
  percentDecimals?: number;
  onItemClick?: (item: CompositionBandDatum, index: number) => void;
}

interface PlotProps {
  ctx: ChartContextValue;
  data: CompositionBandDatum[];
  palette: string[];
  bandHeight: number;
  showKey: boolean;
  percentDecimals: number;
  fmt: (v: number) => string;
  labelMode: "auto" | "always" | "never";
  onItemClick?: (item: CompositionBandDatum, index: number) => void;
  onHeight: (h: number) => void;
  title: string;
}

function CompositionBandPlot({ ctx, data, palette, bandHeight, showKey, percentDecimals, fmt, labelMode, onItemClick, onHeight, title }: PlotProps) {
  const ref = useReportHeight<HTMLDivElement>(onHeight);
  const { fontSize } = ctx.settings;
  const width = ctx.width || 320;
  const visible = data.map((d, i) => ({ ...d, i, key: `s${i}` })).filter((d) => !ctx.hiddenSeries.has(d.key) && d.value > 0);
  const total = visible.reduce((a, d) => a + d.value, 0);
  const pct = (v: number) => (total > 0 ? `${((v / total) * 100).toFixed(percentDecimals)}%` : "–");
  const gap = 2;
  let cursor = 0;
  const segments = visible.map((d) => {
    const w = total > 0 ? (d.value / total) * (width - gap * (visible.length - 1)) : 0;
    const x = cursor;
    cursor += w + gap;
    return { ...d, x, w };
  });
  const labelFont = Math.max(10, fontSize - 1);

  return (
    <div style={listStyles.scroller}>
      <div ref={ref} style={{ fontFamily: chartVars.fontBody, fontSize }}>
        <svg width="100%" height={bandHeight} viewBox={`0 0 ${width} ${bandHeight}`} preserveAspectRatio="none" role="img" aria-label={`${title}. ${segments.map((s) => `${s.name} ${pct(s.value)}`).join(", ")}`} style={{ display: "block", borderRadius: 6, overflow: "hidden" }}>
          {segments.map((s) => {
            const dim = ctx.highlightedSeries !== null && ctx.highlightedSeries !== s.key;
            return (
              <g key={s.key} opacity={dim ? 0.35 : 1} style={{ transition: "opacity 120ms", cursor: onItemClick ? "pointer" : "default" }} onClick={() => onItemClick?.(data[s.i], s.i)}>
                <rect x={s.x} y={0} width={Math.max(0, s.w)} height={bandHeight} fill={palette[s.i]} rx={2} />
                <title>{`${s.name}: ${fmt(s.value)} (${pct(s.value)})`}</title>
              </g>
            );
          })}
        </svg>
        {/* Labels live in HTML so preserveAspectRatio="none" cannot stretch the glyphs. */}
        <div style={{ position: "relative", height: 0 }} aria-hidden>
          {labelMode !== "never" &&
            segments.map((s) => {
              const text = `${truncateToWidth(s.name, Math.max(0, s.w - 40), labelFont)} ${pct(s.value)}`;
              const fits = labelFits(text, s.w, bandHeight, labelFont, 4);
              if (!fits && labelMode === "auto") return null;
              if (!fits) return null;
              return (
                <span
                  key={s.key}
                  style={{
                    position: "absolute",
                    left: s.x,
                    width: s.w,
                    top: -bandHeight,
                    height: bandHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: labelFont,
                    fontWeight: 600,
                    color: "var(--vi-color-text-onAccent, #fff)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    mixBlendMode: "normal",
                  }}
                >
                  {text}
                </span>
              );
            })}
        </div>
        {showKey && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${ctx.settings.breakpoint === "xs" ? 120 : 150}px, 1fr))`, gap: "8px 12px", marginTop: 12 }}>
            {visible.map((s) => {
              const row = (
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, minWidth: 0 }}>
                  <span aria-hidden style={{ flex: "none", width: 10, height: 10, borderRadius: 2, background: palette[s.i], marginTop: 4 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: chartVars.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={s.name}>
                      {s.name}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "baseline", fontVariantNumeric: "tabular-nums" }}>
                      <span style={{ color: chartVars.textPrimary, fontWeight: 600 }}>{pct(s.value)}</span>
                      <span style={{ color: chartVars.textMuted, fontSize: Math.max(9, fontSize - 1) }}>{fmt(s.value)}</span>
                    </div>
                  </div>
                </div>
              );
              return onItemClick ? (
                <button key={s.key} type="button" onClick={() => onItemClick(data[s.i], s.i)} style={{ ...listStyles.resetButton, padding: 2, minHeight: ctx.isTouch ? 44 : undefined }}>
                  {row}
                </button>
              ) : (
                <div key={s.key}>{row}</div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Single horizontal 100 % stacked band ("position mix") with in-segment labels where they fit and
 * a key grid (name, share, absolute) below. Legend toggles recompute the shares.
 */
export function CompositionBandChart({ data, bandHeight = 28, showKey = true, percentDecimals = 1, onItemClick, colors, valueFormatter, dataLabels, height, minHeight, exportData, ...card }: CompositionBandChartProps) {
  const [measured, setMeasured] = useState(0);
  const fmt = valueFormatter ?? ((v: number) => formatCompactNumber(v));
  const palette = resolveColors(colors, data.length);
  const labels = resolveDataLabels(dataLabels, "auto");
  const series: SeriesDescriptor[] = data.map((d, i) => ({ key: `s${i}`, label: d.name, color: palette[i], shape: "square" }));
  return (
    <ChartCard {...card} height={listHeight(height, measured, bandHeight + (showKey ? 80 : 0))} minHeight={minHeight ?? 24} series={series} isEmpty={data.length === 0} exportData={exportData ?? data}>
      {(ctx) => (
        <CompositionBandPlot ctx={ctx} data={data} palette={palette} bandHeight={bandHeight} showKey={showKey} percentDecimals={percentDecimals} fmt={labels.formatter ? (v) => labels.formatter!(v) : fmt} labelMode={labels.mode} onItemClick={onItemClick} onHeight={setMeasured} title={card.title} />
      )}
    </ChartCard>
  );
}
