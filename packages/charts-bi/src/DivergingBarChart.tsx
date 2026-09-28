import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@aibyters/layout";
import {
  chartVars,
  computeCategoryAxisWidth,
  labelFits,
  rechartsTooltip,
  resolveDataLabels,
  truncateToWidth,
  type BaseChartProps,
  type ChartContextValue,
  type SeriesDescriptor,
} from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";

export interface DivergingBarDatum {
  name: string;
  value: number;
}

export interface DivergingBarChartProps extends BaseChartProps {
  data: DivergingBarDatum[];
  /** Legend label for the negative side. Default "Negative". */
  negativeLabel?: string;
  /** Legend label for the positive side. Default "Positive". */
  positiveLabel?: string;
  /** Sort by value. Default "none" (keeps input order). */
  sort?: "asc" | "desc" | "none";
  onItemClick?: (item: DivergingBarDatum, index: number) => void;
}

interface PlotProps {
  ctx: ChartContextValue;
  data: DivergingBarDatum[];
  negColor: string;
  posColor: string;
  fmt: (v: number) => string;
  labelFmt: (v: number) => string;
  labelFormatter?: (l: string | number) => string;
  labelMode: "auto" | "always" | "never";
  labelFontSize: number;
  onItemClick?: (item: DivergingBarDatum, index: number) => void;
}

function DivergingBarPlot({ ctx, data, negColor, posColor, fmt, labelFmt, labelFormatter, labelMode, labelFontSize, onItemClick }: PlotProps) {
  const { fontSize, padding } = ctx.settings;
  const hideNeg = ctx.hiddenSeries.has("negative");
  const hidePos = ctx.hiddenSeries.has("positive");
  const rows = useMemo(
    () => data.filter((d) => (d.value < 0 ? !hideNeg : d.value > 0 ? !hidePos : true)),
    [data, hideNeg, hidePos]
  );
  const width = ctx.width;
  if (!width) return null;

  const labels = rows.map((d) => (labelFormatter ? labelFormatter(d.name) : d.name));
  const maxAxis = Math.min(Math.floor(width * 0.34), 180);
  const axisW = computeCategoryAxisWidth(labels, { fontSize, max: maxAxis, min: 36 });
  const absMax = Math.max(1, ...rows.map((d) => Math.abs(d.value)));
  const margin = { top: 4, right: padding + 8, bottom: 4, left: padding };
  const plotLeft = margin.left + axisW;
  const plotRight = width - margin.right;
  const barSize = Math.max(6, Math.min(22, Math.floor((ctx.height - 30) / Math.max(rows.length, 1)) - 4));

  const renderLabel = (props: any) => {
    if (labelMode === "never") return null;
    const { x, y, width: w, height: h, value, index } = props;
    if (typeof value !== "number" || value === 0) return null;
    const text = labelFmt(value);
    const neg = value < 0;
    // Recharts may hand negative bars a negative width; normalise to left/right edges.
    const left = Math.min(x, x + w);
    const right = Math.max(x, x + w);
    const barStart = neg ? left : right;
    const room = neg ? barStart - plotLeft : plotRight - barStart;
    if (labelMode === "auto" && !labelFits(text, room, Math.max(h, labelFontSize + 4), labelFontSize, 3)) return null;
    return (
      <text
        key={index}
        x={neg ? barStart - 4 : barStart + 4}
        y={y + h / 2}
        dy="0.35em"
        textAnchor={neg ? "end" : "start"}
        fontSize={labelFontSize}
        fill={chartVars.textSecondary}
        fontFamily={chartVars.fontBody}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {text}
      </text>
    );
  };

  return (
    <BarChart
      width={width}
      height={ctx.height}
      data={rows}
      layout="vertical"
      margin={margin}
      barCategoryGap={4}
      onClick={(state: any) => {
        if (!onItemClick || !state || state.activeTooltipIndex === undefined) return;
        const i = Number(state.activeTooltipIndex);
        const item = rows[i];
        if (item) onItemClick(item, data.indexOf(item));
      }}
      style={{ fontFamily: chartVars.fontBody, cursor: onItemClick ? "pointer" : undefined }}
    >
      <CartesianGrid horizontal={false} stroke={chartVars.grid} />
      <XAxis
        type="number"
        domain={[-absMax, absMax]}
        tickCount={ctx.settings.tickCount}
        tickFormatter={(v: number) => fmt(v)}
        tick={{ fontSize, fill: chartVars.axisText }}
        axisLine={{ stroke: chartVars.axisLine }}
        tickLine={false}
      />
      <YAxis
        type="category"
        dataKey="name"
        width={axisW}
        interval={0}
        tick={{ fontSize, fill: chartVars.axisText }}
        tickFormatter={(v: string | number) => truncateToWidth(labelFormatter ? labelFormatter(v) : String(v), axisW - 10, fontSize)}
        axisLine={false}
        tickLine={false}
      />
      <ReferenceLine x={0} stroke={chartVars.axisText} strokeWidth={1} />
      <Tooltip
        cursor={{ fill: chartVars.surfaceHover, opacity: 0.6 }}
        content={rechartsTooltip({ valueFormatter: (v) => fmt(v), nameMap: { value: "Value" } })}
        wrapperStyle={{ outline: "none", zIndex: 10 }}
      />
      <Bar dataKey="value" barSize={barSize} radius={3} isAnimationActive={ctx.animate}>
        {rows.map((d, i) => (
          <Cell key={i} fill={d.value < 0 ? negColor : posColor} />
        ))}
        <LabelList dataKey="value" content={renderLabel} />
      </Bar>
    </BarChart>
  );
}

/**
 * Two-sided bars around a zero axis. Negative values extend left, positive extend right.
 * Value labels appear only where they fit; the tooltip always carries the exact number.
 */
export function DivergingBarChart({
  data,
  negativeLabel = "Negative",
  positiveLabel = "Positive",
  sort = "none",
  onItemClick,
  colors,
  valueFormatter,
  labelFormatter,
  dataLabels,
  height,
  exportData,
  ...card
}: DivergingBarChartProps) {
  const fmt = valueFormatter ?? ((v: number) => formatCompactNumber(v));
  const negColor = colors?.[0] ?? chartVars.negative;
  const posColor = colors?.[1] ?? chartVars.positive;
  const labels = resolveDataLabels(dataLabels, "auto");
  const sorted = useMemo(() => {
    if (sort === "none") return data;
    return [...data].sort((a, b) => (sort === "asc" ? a.value - b.value : b.value - a.value));
  }, [data, sort]);
  const series: SeriesDescriptor[] = [
    { key: "negative", label: negativeLabel, color: negColor, shape: "square" },
    { key: "positive", label: positiveLabel, color: posColor, shape: "square" },
  ];
  const defaultHeight = Math.max(160, Math.min(480, sorted.length * 30 + 40));

  return (
    <ChartCard {...card} height={height ?? defaultHeight} series={series} isEmpty={data.length === 0} exportData={exportData ?? data}>
      {(ctx) => (
        <DivergingBarPlot
          ctx={ctx}
          data={sorted}
          negColor={negColor}
          posColor={posColor}
          fmt={fmt}
          labelFmt={labels.formatter ? (v) => labels.formatter!(v) : fmt}
          labelFormatter={labelFormatter}
          labelMode={labels.mode}
          labelFontSize={Math.min(labels.fontSize, ctx.settings.fontSize)}
          onItemClick={onItemClick}
        />
      )}
    </ChartCard>
  );
}
