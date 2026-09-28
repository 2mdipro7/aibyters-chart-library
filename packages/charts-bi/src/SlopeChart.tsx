import { useState } from "react";
import { ChartCard } from "@aibyters/layout";
import { chartVars, estimateTextWidth, resolveColors, spreadLabelsVertically, truncateToWidth, type BaseChartProps, type ChartContextValue, type LabelBox, type SeriesDescriptor } from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";

export interface SlopeDatum {
  name: string;
  start: number;
  end: number;
}

export interface SlopeChartProps extends BaseChartProps {
  data: SlopeDatum[];
  /** Column heading for the first period. Default "Before". */
  startLabel?: string;
  /** Column heading for the second period. Default "After". */
  endLabel?: string;
  /** "entity" colours each line from the palette; "direction" uses positive / negative. Default "direction". */
  colorBy?: "entity" | "direction";
  onItemClick?: (item: SlopeDatum, index: number) => void;
}

interface PlotProps {
  ctx: ChartContextValue;
  data: SlopeDatum[];
  startLabel: string;
  endLabel: string;
  lineColor: (d: SlopeDatum, i: number) => string;
  fmt: (v: number) => string;
  onItemClick?: (item: SlopeDatum, index: number) => void;
  title: string;
}

function SlopePlot({ ctx, data, startLabel, endLabel, lineColor, fmt, onItemClick, title }: PlotProps) {
  const [hover, setHover] = useState<number | null>(null);
  const width = ctx.width;
  if (!width) return null;
  const { fontSize, breakpoint } = ctx.settings;
  const height = ctx.height;
  const compact = breakpoint === "xs";
  const rows = data.map((d, i) => ({ ...d, i, key: `s${i}` })).filter((d) => !ctx.hiddenSeries.has(d.key));
  const labelFont = Math.max(9, fontSize - 1);
  const lineH = labelFont + 4;
  const leftTexts = rows.map((d) => (compact ? fmt(d.start) : `${d.name}  ${fmt(d.start)}`));
  const rightTexts = rows.map((d) => (compact ? fmt(d.end) : `${fmt(d.end)}  ${d.name}`));
  const maxLabel = Math.floor(width * 0.3);
  const leftW = Math.min(maxLabel, Math.ceil(Math.max(0, ...leftTexts.map((t) => estimateTextWidth(t, labelFont)))) + 10);
  const rightW = Math.min(maxLabel, Math.ceil(Math.max(0, ...rightTexts.map((t) => estimateTextWidth(t, labelFont)))) + 10);
  const headH = fontSize + 10;
  const top = headH + lineH / 2;
  const bottom = height - lineH / 2 - 4;
  const x0 = leftW;
  const x1 = width - rightW;
  const vals = rows.flatMap((d) => [d.start, d.end]);
  const min = Math.min(...vals, 0);
  const max = Math.max(...vals, 1);
  const y = (v: number) => bottom - ((v - min) / (max - min || 1)) * (bottom - top);

  const leftBoxes: LabelBox[] = rows.map((d) => ({ id: d.key, x: 0, y: y(d.start) - lineH / 2, width: leftW, height: lineH }));
  const rightBoxes: LabelBox[] = rows.map((d) => ({ id: d.key, x: x1, y: y(d.end) - lineH / 2, width: rightW, height: lineH }));
  const leftY = new Map(spreadLabelsVertically(leftBoxes, headH, height - 2, 1).map((b) => [b.id, b.y + lineH / 2]));
  const rightY = new Map(spreadLabelsVertically(rightBoxes, headH, height - 2, 1).map((b) => [b.id, b.y + lineH / 2]));
  const dotR = ctx.isTouch ? 5 : 3.5;

  return (
    <svg width={width} height={height} role="img" aria-label={`${title}. ${rows.map((d) => `${d.name}: ${fmt(d.start)} to ${fmt(d.end)}`).join("; ")}`} style={{ display: "block", fontFamily: chartVars.fontBody }} onMouseLeave={() => setHover(null)}>
      <text x={x0} y={fontSize} textAnchor="middle" fontSize={fontSize} fontWeight={600} fill={chartVars.textSecondary}>
        {startLabel}
      </text>
      <text x={x1} y={fontSize} textAnchor="middle" fontSize={fontSize} fontWeight={600} fill={chartVars.textSecondary}>
        {endLabel}
      </text>
      <line x1={x0} x2={x0} y1={headH} y2={height} stroke={chartVars.grid} />
      <line x1={x1} x2={x1} y1={headH} y2={height} stroke={chartVars.grid} />
      {rows.map((d) => {
        const c = lineColor(d, d.i);
        const active = hover === d.i || ctx.highlightedSeries === d.key;
        const dim = (hover !== null || ctx.highlightedSeries !== null) && !active;
        return (
          <g
            key={d.key}
            opacity={dim ? 0.25 : 1}
            style={{ transition: "opacity 120ms", cursor: onItemClick ? "pointer" : "default" }}
            onMouseEnter={() => setHover(d.i)}
            onClick={() => onItemClick?.(data[d.i], d.i)}
          >
            {/* Invisible fat stroke keeps the hit target usable on touch. */}
            <line x1={x0} y1={y(d.start)} x2={x1} y2={y(d.end)} stroke="transparent" strokeWidth={ctx.isTouch ? 24 : 12} />
            <line x1={x0} y1={y(d.start)} x2={x1} y2={y(d.end)} stroke={c} strokeWidth={active ? 3 : 1.75} strokeLinecap="round" />
            <circle cx={x0} cy={y(d.start)} r={dotR} fill={c} />
            <circle cx={x1} cy={y(d.end)} r={dotR} fill={c} />
            <text x={x0 - 8} y={leftY.get(d.key)} dy="0.35em" textAnchor="end" fontSize={labelFont} fontWeight={active ? 600 : 400} fill={chartVars.textPrimary} style={{ fontVariantNumeric: "tabular-nums" }}>
              {truncateToWidth(leftTexts[rows.indexOf(d)], leftW - 10, labelFont)}
            </text>
            <text x={x1 + 8} y={rightY.get(d.key)} dy="0.35em" textAnchor="start" fontSize={labelFont} fontWeight={active ? 600 : 400} fill={chartVars.textPrimary} style={{ fontVariantNumeric: "tabular-nums" }}>
              {truncateToWidth(rightTexts[rows.indexOf(d)], rightW - 10, labelFont)}
            </text>
            <title>{`${d.name}: ${fmt(d.start)} → ${fmt(d.end)}`}</title>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Slope chart: one line per entity between two periods, with collision-resolved labels at both
 * ends. Hovering a line (or a legend item) highlights it and dims the rest.
 */
export function SlopeChart({ data, startLabel = "Before", endLabel = "After", colorBy = "direction", onItemClick, colors, valueFormatter, height, legend, exportData, ...card }: SlopeChartProps) {
  const fmt = valueFormatter ?? ((v: number) => formatCompactNumber(v));
  const palette = resolveColors(colors, data.length);
  const upColor = colors?.[0] ?? chartVars.positive;
  const downColor = colors?.[1] ?? chartVars.negative;
  const flatColor = chartVars.textMuted;
  const lineColor = (d: SlopeDatum, i: number) => (colorBy === "entity" ? palette[i] : d.end > d.start ? upColor : d.end < d.start ? downColor : flatColor);
  const series: SeriesDescriptor[] =
    colorBy === "entity"
      ? data.map((d, i) => ({ key: `s${i}`, label: d.name, color: palette[i], shape: "line" }))
      : [];
  const directionLegend = colorBy === "direction" && legend !== false;
  return (
    <ChartCard
      {...card}
      height={height ?? Math.max(200, Math.min(520, data.length * 24 + 60))}
      legend={colorBy === "entity" ? legend : false}
      series={series}
      isEmpty={data.length === 0}
      exportData={exportData ?? data}
      footer={
        directionLegend ? (
          <span style={{ display: "inline-flex", gap: 14, flexWrap: "wrap" }}>
            <span><span aria-hidden style={{ display: "inline-block", width: 14, height: 3, background: upColor, verticalAlign: "middle", marginRight: 6, borderRadius: 2 }} />Increase</span>
            <span><span aria-hidden style={{ display: "inline-block", width: 14, height: 3, background: downColor, verticalAlign: "middle", marginRight: 6, borderRadius: 2 }} />Decrease</span>
            {card.footer}
          </span>
        ) : (
          card.footer
        )
      }
    >
      {(ctx) => <SlopePlot ctx={ctx} data={data} startLabel={startLabel} endLabel={endLabel} lineColor={lineColor} fmt={fmt} onItemClick={onItemClick} title={card.title} />}
    </ChartCard>
  );
}
