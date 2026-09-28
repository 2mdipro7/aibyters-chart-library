import { useMemo } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { chartVars, computeAxisWidth, planCategoryTicks, rechartsTooltip, resolveColors, truncateToWidth, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";

export interface ParetoDatum {
  name: string;
  value: number;
}

export interface ParetoChartProps extends BaseChartProps {
  data: ParetoDatum[];
  /** Legend label for the bars. Default "Value". */
  barLabel?: string;
  /** Legend label for the cumulative line. Default "Cumulative %". */
  lineLabel?: string;
  /** Threshold reference line as a percentage. Default 80. Pass null to hide. */
  threshold?: number | null;
  onItemClick?: (item: ParetoDatum, index: number) => void;
}

interface Row extends ParetoDatum {
  cumulative: number;
}

interface PlotProps {
  ctx: ChartContextValue;
  rows: Row[];
  barLabel: string;
  lineLabel: string;
  threshold: number | null;
  colors: [string, string];
  fmt: (v: number) => string;
  labelFormatter?: (l: string | number) => string;
  onItemClick?: (item: ParetoDatum, index: number) => void;
}

const pctFmt = (v: number) => `${Math.round(v)}%`;

function ParetoPlot({ ctx, rows, barLabel, lineLabel, threshold, colors, fmt, labelFormatter, onItemClick }: PlotProps) {
  const width = ctx.width;
  if (!width) return null;
  const { fontSize, tickCount, padding } = ctx.settings;
  const showBars = !ctx.hiddenSeries.has("value");
  const showLine = !ctx.hiddenSeries.has("cumulative");
  const leftW = computeAxisWidth(rows.map((r) => r.value), fmt, { fontSize, tickCount });
  const rightW = computeAxisWidth([0, 100], pctFmt, { fontSize, tickCount, min: 32 });
  const labels = rows.map((r) => (labelFormatter ? labelFormatter(r.name) : r.name));
  const plan = planCategoryTicks(labels, width - leftW - rightW, fontSize);
  const slot = (width - leftW - rightW) / Math.max(rows.length, 1);
  const tickText = (v: string | number) => {
    const t = labelFormatter ? labelFormatter(v) : String(v);
    return plan.angle === 0 ? truncateToWidth(t, slot - 4, fontSize) : truncateToWidth(t, plan.height * 1.3, fontSize);
  };

  return (
    <ComposedChart
      width={width}
      height={ctx.height}
      data={rows}
      margin={{ top: 8, right: padding, bottom: 0, left: padding }}
      style={{ fontFamily: chartVars.fontBody, cursor: onItemClick ? "pointer" : undefined }}
      onClick={(state: any) => {
        if (!onItemClick || !state || state.activeTooltipIndex === undefined) return;
        const i = Number(state.activeTooltipIndex);
        if (rows[i]) onItemClick({ name: rows[i].name, value: rows[i].value }, i);
      }}
    >
      <CartesianGrid vertical={false} stroke={chartVars.grid} />
      <XAxis
        dataKey="name"
        interval={plan.interval}
        angle={plan.angle}
        height={plan.height}
        textAnchor={plan.angle === 0 ? "middle" : "end"}
        tick={{ fontSize, fill: chartVars.axisText }}
        tickFormatter={tickText}
        axisLine={{ stroke: chartVars.axisLine }}
        tickLine={false}
      />
      <YAxis yAxisId="left" width={leftW} tickCount={tickCount} tickFormatter={(v: number) => fmt(v)} tick={{ fontSize, fill: chartVars.axisText }} axisLine={false} tickLine={false} />
      <YAxis yAxisId="right" orientation="right" width={rightW} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={pctFmt} tick={{ fontSize, fill: chartVars.axisText }} axisLine={false} tickLine={false} />
      <Tooltip
        cursor={{ fill: chartVars.surfaceHover, opacity: 0.6 }}
        content={rechartsTooltip({
          valueFormatter: (v, key) => (key === "cumulative" ? `${v.toFixed(1)}%` : fmt(v)),
          nameMap: { value: barLabel, cumulative: lineLabel },
          hidden: ctx.hiddenSeries,
        })}
        wrapperStyle={{ outline: "none", zIndex: 10 }}
      />
      {threshold !== null && showLine && (
        <ReferenceLine
          yAxisId="right"
          y={threshold}
          stroke={chartVars.textMuted}
          strokeDasharray="4 4"
          label={{ value: `${threshold}%`, position: "insideTopRight", fontSize: Math.max(9, fontSize - 1), fill: chartVars.textMuted }}
        />
      )}
      <Bar yAxisId="left" dataKey="value" fill={colors[0]} radius={[3, 3, 0, 0]} maxBarSize={48} isAnimationActive={ctx.animate} hide={!showBars} />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="cumulative"
        stroke={colors[1]}
        strokeWidth={ctx.settings.strokeWidth}
        dot={rows.length <= 24 ? { r: 3, fill: colors[1], strokeWidth: 0 } : false}
        activeDot={{ r: ctx.settings.dotRadius }}
        isAnimationActive={ctx.animate}
        hide={!showLine}
      />
    </ComposedChart>
  );
}

/**
 * Pareto chart: categories sorted by value with a cumulative-percentage line on a secondary axis
 * and an 80 % reference line, to show which few causes drive most of the total.
 */
export function ParetoChart({ data, barLabel = "Value", lineLabel = "Cumulative %", threshold = 80, onItemClick, colors, valueFormatter, labelFormatter, height, exportData, ...card }: ParetoChartProps) {
  const fmt = valueFormatter ?? ((v: number) => formatCompactNumber(v));
  const [c0, c1] = resolveColors(colors, 2);
  const rows = useMemo<Row[]>(() => {
    const sorted = [...data].filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
    const total = sorted.reduce((a, d) => a + d.value, 0);
    let acc = 0;
    return sorted.map((d) => {
      acc += d.value;
      return { ...d, cumulative: total > 0 ? (acc / total) * 100 : 0 };
    });
  }, [data]);
  const series: SeriesDescriptor[] = [
    { key: "value", label: barLabel, color: c0, shape: "square" },
    { key: "cumulative", label: lineLabel, color: c1, shape: "line" },
  ];
  return (
    <ChartCard {...card} height={height} series={series} isEmpty={rows.length === 0} exportData={exportData ?? rows}>
      {(ctx) => <ParetoPlot ctx={ctx} rows={rows} barLabel={barLabel} lineLabel={lineLabel} threshold={threshold} colors={[c0, c1]} fmt={fmt} labelFormatter={labelFormatter} onItemClick={onItemClick} />}
    </ChartCard>
  );
}
