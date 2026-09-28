import { useState } from "react";
import { ChartCard } from "@aibyters/layout";
import { ChartTooltip, chartVars, estimateTextWidth, labelFits, planCategoryTicks, resolveColors, resolveDataLabels, truncateToWidth, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";

export interface LollipopDatum {
  name: string;
  value: number;
}

export interface LollipopChartProps extends BaseChartProps {
  data: LollipopDatum[];
  /** Default "horizontal" (stems run left to right, one row per category). */
  orientation?: "horizontal" | "vertical";
  /** Default "desc". */
  sort?: "asc" | "desc" | "none";
  onItemClick?: (item: LollipopDatum, index: number) => void;
}

interface PlotProps {
  ctx: ChartContextValue;
  data: LollipopDatum[];
  orientation: "horizontal" | "vertical";
  color: string;
  fmt: (v: number) => string;
  labelFmt: (v: number) => string;
  labelMode: "auto" | "always" | "never";
  labelFormatter?: (l: string | number) => string;
  onItemClick?: (item: LollipopDatum, index: number) => void;
  title: string;
}

function LollipopPlot({ ctx, data, orientation, color, fmt, labelFmt, labelMode, labelFormatter, onItemClick, title }: PlotProps) {
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const width = ctx.width;
  if (!width) return null;
  const { fontSize, dotRadius } = ctx.settings;
  const height = ctx.height;
  const labels = data.map((d) => (labelFormatter ? labelFormatter(d.name) : d.name));
  const vals = data.map((d) => d.value);
  const min = Math.min(0, ...vals);
  const max = Math.max(1, ...vals);
  const labelFont = Math.max(9, fontSize - 1);
  const r = ctx.isTouch ? dotRadius + 1 : dotRadius;
  const aria = `${title}. ${data.map((d, i) => `${labels[i]}: ${fmt(d.value)}`).join("; ")}`;
  const horizontal = orientation === "horizontal";

  const onMove = (i: number) => (e: React.MouseEvent<SVGGElement>) => {
    const host = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    setHover({ i, x: e.clientX - (host?.left ?? 0), y: e.clientY - (host?.top ?? 0) });
  };

  let body: React.ReactNode;
  if (horizontal) {
    const labelColW = Math.min(Math.ceil(Math.max(...labels.map((l) => estimateTextWidth(l, fontSize)))) + 10, Math.floor(width * 0.34), 180);
    const valuePad = Math.ceil(Math.max(...vals.map((v) => estimateTextWidth(labelFmt(v), labelFont)))) + 10;
    const axisH = fontSize + 12;
    const plotLeft = labelColW;
    const plotRight = width - valuePad - r;
    const plotW = Math.max(10, plotRight - plotLeft);
    const rowH = (height - axisH) / Math.max(data.length, 1);
    const scale = (v: number) => plotLeft + ((v - min) / (max - min || 1)) * plotW;
    const zero = scale(0);
    const ticks = [min, min + (max - min) / 2, max];
    body = (
      <>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={scale(t)} x2={scale(t)} y1={0} y2={height - axisH} stroke={chartVars.grid} strokeDasharray="3 3" />
            <text x={scale(t)} y={height - 4} textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"} fontSize={fontSize} fill={chartVars.axisText}>
              {fmt(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cy = i * rowH + rowH / 2;
          const x = scale(d.value);
          const text = labelFmt(d.value);
          const draw = labelMode !== "never" && (labelMode === "always" || labelFits(text, width - (x + r + 3), rowH, labelFont, 2));
          return (
            <g key={i} onMouseMove={onMove(i)} onClick={() => onItemClick?.(d, i)} style={{ cursor: onItemClick ? "pointer" : "default" }}>
              <rect x={0} y={i * rowH} width={width} height={rowH} fill={hover?.i === i ? chartVars.surfaceHover : "transparent"} />
              <text x={labelColW - 8} y={cy} dy="0.35em" textAnchor="end" fontSize={fontSize} fill={chartVars.textPrimary}>
                {truncateToWidth(labels[i], labelColW - 10, fontSize)}
              </text>
              <line x1={zero} x2={x} y1={cy} y2={cy} stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
              <circle cx={x} cy={cy} r={Math.min(r, rowH / 2 - 1)} fill={color} stroke={chartVars.surface} strokeWidth={1.5} />
              {draw && (
                <text x={x + r + 4} y={cy} dy="0.35em" fontSize={labelFont} fill={chartVars.textSecondary} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {text}
                </text>
              )}
              <title>{`${d.name}: ${fmt(d.value)}`}</title>
            </g>
          );
        })}
      </>
    );
  } else {
    const yAxisW = Math.ceil(Math.max(...[min, max].map((v) => estimateTextWidth(fmt(v), fontSize)))) + 10;
    const plan = planCategoryTicks(labels, width - yAxisW, fontSize);
    const axisH = plan.height;
    const topPad = labelFont + 8;
    const plotTop = topPad;
    const plotBottom = height - axisH;
    const plotH = Math.max(10, plotBottom - plotTop);
    const slot = (width - yAxisW) / Math.max(data.length, 1);
    const scale = (v: number) => plotBottom - ((v - min) / (max - min || 1)) * plotH;
    const zero = scale(0);
    const ticks = [min, min + (max - min) / 2, max];
    body = (
      <>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={yAxisW} x2={width} y1={scale(t)} y2={scale(t)} stroke={chartVars.grid} strokeDasharray="3 3" />
            <text x={yAxisW - 6} y={scale(t)} dy="0.35em" textAnchor="end" fontSize={fontSize} fill={chartVars.axisText}>
              {fmt(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = yAxisW + i * slot + slot / 2;
          const y = scale(d.value);
          const text = labelFmt(d.value);
          const draw = labelMode !== "never" && (labelMode === "always" || labelFits(text, slot, y - r - 2, labelFont, 1));
          const showTick = plan.interval === 0 || i % (plan.interval + 1) === 0;
          const lbl = plan.angle === 0 ? truncateToWidth(labels[i], slot - 4, fontSize) : truncateToWidth(labels[i], axisH * 1.3, fontSize);
          return (
            <g key={i} onMouseMove={onMove(i)} onClick={() => onItemClick?.(d, i)} style={{ cursor: onItemClick ? "pointer" : "default" }}>
              <rect x={yAxisW + i * slot} y={0} width={slot} height={height} fill={hover?.i === i ? chartVars.surfaceHover : "transparent"} />
              <line x1={cx} x2={cx} y1={zero} y2={y} stroke={color} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
              <circle cx={cx} cy={y} r={Math.min(r, slot / 2 - 1)} fill={color} stroke={chartVars.surface} strokeWidth={1.5} />
              {draw && (
                <text x={cx} y={y - r - 4} textAnchor="middle" fontSize={labelFont} fill={chartVars.textSecondary} style={{ fontVariantNumeric: "tabular-nums" }}>
                  {text}
                </text>
              )}
              {showTick && (
                <text
                  x={cx}
                  y={plotBottom + 6}
                  dy={plan.angle === 0 ? "0.9em" : "0.6em"}
                  textAnchor={plan.angle === 0 ? "middle" : "end"}
                  transform={plan.angle === 0 ? undefined : `rotate(-45 ${cx} ${plotBottom + 6})`}
                  fontSize={fontSize}
                  fill={chartVars.axisText}
                >
                  {lbl}
                </text>
              )}
              <title>{`${d.name}: ${fmt(d.value)}`}</title>
            </g>
          );
        })}
      </>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <svg width={width} height={height} role="img" aria-label={aria} style={{ display: "block", fontFamily: chartVars.fontBody }} onMouseLeave={() => setHover(null)}>
        {body}
      </svg>
      {hover && !ctx.isTouch && (
        <div style={{ position: "absolute", left: Math.min(hover.x + 12, Math.max(0, width - 180)), top: Math.min(hover.y + 12, Math.max(0, height - 60)), pointerEvents: "none", zIndex: 5 }}>
          <ChartTooltip title={data[hover.i].name} rows={[{ key: "value", label: "Value", value: data[hover.i].value, color }]} valueFormatter={(v) => fmt(v)} />
        </div>
      )}
    </div>
  );
}

/** Lollipop chart: thin stem + circle head, ranked. Horizontal by default, vertical on request. */
export function LollipopChart({ data, orientation = "horizontal", sort = "desc", onItemClick, colors, valueFormatter, labelFormatter, dataLabels, height, legend, exportData, ...card }: LollipopChartProps) {
  const fmt = valueFormatter ?? ((v: number) => formatCompactNumber(v));
  const [color] = resolveColors(colors, 1);
  const labels = resolveDataLabels(dataLabels, "auto");
  const rows = sort === "none" ? data : [...data].sort((a, b) => (sort === "asc" ? a.value - b.value : b.value - a.value));
  const defaultH = orientation === "horizontal" ? Math.max(160, Math.min(520, rows.length * 30 + 30)) : 260;
  return (
    <ChartCard {...card} legend={legend ?? false} height={height ?? defaultH} isEmpty={data.length === 0} exportData={exportData ?? data}>
      {(ctx) => (
        <LollipopPlot ctx={ctx} data={rows} orientation={orientation} color={color} fmt={fmt} labelFmt={labels.formatter ? (v) => labels.formatter!(v) : fmt} labelMode={labels.mode} labelFormatter={labelFormatter} onItemClick={onItemClick} title={card.title} />
      )}
    </ChartCard>
  );
}
