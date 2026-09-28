import { useState } from "react";
import { ChartCard } from "@aibyters/layout";
import { ChartTooltip, chartVars, estimateTextWidth, labelFits, resolveColors, resolveDataLabels, truncateToWidth, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";

export interface DumbbellDatum {
  name: string;
  a: number;
  b: number;
}

export interface DumbbellChartProps extends BaseChartProps {
  data: DumbbellDatum[];
  /** Legend label for the first value. Default "A". */
  aLabel?: string;
  /** Legend label for the second value. Default "B". */
  bLabel?: string;
  /** Sort by the gap (b - a). Default "none". */
  sort?: "asc" | "desc" | "none";
  onItemClick?: (item: DumbbellDatum, index: number) => void;
}

interface PlotProps {
  ctx: ChartContextValue;
  data: DumbbellDatum[];
  aLabel: string;
  bLabel: string;
  colors: [string, string];
  fmt: (v: number) => string;
  labelFmt: (v: number) => string;
  labelMode: "auto" | "always" | "never";
  labelFormatter?: (l: string | number) => string;
  onItemClick?: (item: DumbbellDatum, index: number) => void;
  title: string;
}

function DumbbellPlot({ ctx, data, aLabel, bLabel, colors, fmt, labelFmt, labelMode, labelFormatter, onItemClick, title }: PlotProps) {
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const width = ctx.width;
  if (!width) return null;
  const { fontSize, dotRadius } = ctx.settings;
  const showA = !ctx.hiddenSeries.has("a");
  const showB = !ctx.hiddenSeries.has("b");
  const labels = data.map((d) => (labelFormatter ? labelFormatter(d.name) : d.name));
  const labelColW = Math.min(Math.ceil(Math.max(...labels.map((l) => estimateTextWidth(l, fontSize)))) + 10, Math.floor(width * 0.34), 180);
  const vals = data.flatMap((d) => [showA ? d.a : NaN, showB ? d.b : NaN]).filter((v) => Number.isFinite(v));
  const min = Math.min(0, ...vals);
  const max = Math.max(1, ...vals);
  const labelFont = Math.max(9, fontSize - 1);
  const valuePad = Math.ceil(Math.max(...vals.map((v) => estimateTextWidth(labelFmt(v), labelFont)))) + 8;
  const axisH = fontSize + 12;
  const plotLeft = labelColW + valuePad;
  const plotRight = width - valuePad - dotRadius;
  const plotW = Math.max(10, plotRight - plotLeft);
  const rowH = (ctx.height - axisH) / Math.max(data.length, 1);
  const r = Math.min(dotRadius + 1, Math.max(3, rowH / 2 - 2));
  const scale = (v: number) => plotLeft + ((v - min) / (max - min || 1)) * plotW;
  const ticks = [min, min + (max - min) / 2, max];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg width={width} height={ctx.height} role="img" aria-label={`${title}. ${data.map((d, i) => `${labels[i]}: ${aLabel} ${fmt(d.a)}, ${bLabel} ${fmt(d.b)}`).join("; ")}`} style={{ display: "block", fontFamily: chartVars.fontBody }} onMouseLeave={() => setHover(null)}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={scale(t)} x2={scale(t)} y1={0} y2={ctx.height - axisH} stroke={chartVars.grid} strokeDasharray="3 3" />
            <text x={scale(t)} y={ctx.height - 4} textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"} fontSize={fontSize} fill={chartVars.axisText}>
              {fmt(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cy = i * rowH + rowH / 2;
          const xa = scale(d.a);
          const xb = scale(d.b);
          const lo = Math.min(xa, xb);
          const hi = Math.max(xa, xb);
          const loVal = xa <= xb ? d.a : d.b;
          const hiVal = xa <= xb ? d.b : d.a;
          const hovered = hover?.i === i;
          const loText = labelFmt(loVal);
          const hiText = labelFmt(hiVal);
          const drawLo = labelMode !== "never" && (labelMode === "always" || labelFits(loText, lo - r - 2 - labelColW, rowH, labelFont, 2));
          const drawHi = labelMode !== "never" && (labelMode === "always" || labelFits(hiText, width - (hi + r + 2), rowH, labelFont, 2));
          const both = showA && showB;
          return (
            <g
              key={i}
              onMouseMove={(e) => {
                const host = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                setHover({ i, x: e.clientX - (host?.left ?? 0), y: e.clientY - (host?.top ?? 0) });
              }}
              onClick={() => onItemClick?.(d, i)}
              style={{ cursor: onItemClick ? "pointer" : "default" }}
            >
              <rect x={0} y={i * rowH} width={width} height={rowH} fill={hovered ? chartVars.surfaceHover : "transparent"} />
              <text x={labelColW - 8} y={cy} dy="0.35em" textAnchor="end" fontSize={fontSize} fill={chartVars.textPrimary}>
                {truncateToWidth(labels[i], labelColW - 10, fontSize)}
                <title>{d.name}</title>
              </text>
              {both && <line x1={lo} x2={hi} y1={cy} y2={cy} stroke={chartVars.axisLine} strokeWidth={Math.max(2, r * 0.6)} strokeLinecap="round" />}
              {showA && <circle cx={xa} cy={cy} r={r} fill={colors[0]} stroke={chartVars.surface} strokeWidth={1.5} />}
              {showB && <circle cx={xb} cy={cy} r={r} fill={colors[1]} stroke={chartVars.surface} strokeWidth={1.5} />}
              {both && drawLo && (
                <text x={lo - r - 3} y={cy} dy="0.35em" textAnchor="end" fontSize={labelFont} fill={chartVars.textSecondary} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {loText}
                </text>
              )}
              {(both ? drawHi : labelMode !== "never") && (
                <text x={(both ? hi : showA ? xa : xb) + r + 3} y={cy} dy="0.35em" textAnchor="start" fontSize={labelFont} fill={chartVars.textSecondary} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {both ? hiText : labelFmt(showA ? d.a : d.b)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover && !ctx.isTouch && (
        <div style={{ position: "absolute", left: Math.min(hover.x + 12, Math.max(0, width - 200)), top: Math.min(hover.y + 12, Math.max(0, ctx.height - 80)), pointerEvents: "none", zIndex: 5 }}>
          <ChartTooltip
            title={data[hover.i].name}
            rows={[
              { key: "a", label: aLabel, value: data[hover.i].a, color: colors[0] },
              { key: "b", label: bLabel, value: data[hover.i].b, color: colors[1] },
              { key: "delta", label: "Δ", value: data[hover.i].b - data[hover.i].a },
            ]}
            hidden={ctx.hiddenSeries}
            valueFormatter={(v) => fmt(v)}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Dumbbell (connected dot) chart: two values per category joined by a line, so the gap between
 * two sources or two periods reads at a glance. End labels appear only where they fit.
 */
export function DumbbellChart({ data, aLabel = "A", bLabel = "B", sort = "none", onItemClick, colors, valueFormatter, labelFormatter, dataLabels, height, exportData, ...card }: DumbbellChartProps) {
  const fmt = valueFormatter ?? ((v: number) => formatCompactNumber(v));
  const [ca, cb] = resolveColors(colors, 2);
  const labels = resolveDataLabels(dataLabels, "auto");
  const rows = sort === "none" ? data : [...data].sort((x, y) => (sort === "asc" ? x.b - x.a - (y.b - y.a) : y.b - y.a - (x.b - x.a)));
  const series: SeriesDescriptor[] = [
    { key: "a", label: aLabel, color: ca },
    { key: "b", label: bLabel, color: cb },
  ];
  return (
    <ChartCard {...card} height={height ?? Math.max(160, Math.min(520, rows.length * 34 + 30))} series={series} isEmpty={data.length === 0} exportData={exportData ?? data}>
      {(ctx) => (
        <DumbbellPlot ctx={ctx} data={rows} aLabel={aLabel} bLabel={bLabel} colors={[ca, cb]} fmt={fmt} labelFmt={labels.formatter ? (v) => labels.formatter!(v) : fmt} labelMode={labels.mode} labelFormatter={labelFormatter} onItemClick={onItemClick} title={card.title} />
      )}
    </ChartCard>
  );
}
