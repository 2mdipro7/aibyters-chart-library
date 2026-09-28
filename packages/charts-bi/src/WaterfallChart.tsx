import { useMemo } from "react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList, ReferenceLine } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { chartVars, rechartsTooltip, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, axisTick, gridProps, makeBarLabel, makeCategoryTick, resolveLabelMode, splitCardProps, useCartesianLayout, type CardKey } from "./internal/cartesian";

export interface WaterfallDatum {
  name: string;
  value: number;
  /** Mark this bar as a subtotal / total drawn from zero. Auto-detected for the last row named "Total". */
  isTotal?: boolean;
}

export interface WaterfallChartProps extends BaseChartProps {
  data: WaterfallDatum[];
  colors?: string[];
  /** Colours for increase / decrease / total bars. Override via theme vars `--vi-color-positive-main` etc. */
  semanticColors?: { increase?: string; decrease?: string; total?: string };
  /** Draw connector lines between bars. Default true. */
  connectors?: boolean;
}

export function WaterfallChart(props: WaterfallChartProps) {
  const [card, plot] = splitCardProps(props);
  const c = { increase: chartVars.positive, decrease: chartVars.negative, total: chartVars.accent, ...props.semanticColors };
  const series: SeriesDescriptor[] = [
    { key: "increase", label: "Increase", color: c.increase, shape: "square" },
    { key: "decrease", label: "Decrease", color: c.decrease, shape: "square" },
    { key: "total", label: "Total", color: c.total, shape: "square" },
  ];
  return (
    <ChartCard {...card} legend={card.legend ?? { interactive: false }} series={series} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data}>
      {(ctx) => <WaterfallPlot ctx={ctx} colorsMap={c} {...plot} />}
    </ChartCard>
  );
}

function WaterfallPlot({ ctx, data, valueFormatter = DEFAULT_FORMATTER, labelFormatter, dataLabels, connectors = true, colorsMap }: Omit<WaterfallChartProps, CardKey> & { ctx: ChartContextValue; colorsMap: { increase: string; decrease: string; total: string } }) {
  const rows = useMemo(() => {
    let running = 0;
    return data.map((item, i) => {
      const isTotal = item.isTotal ?? (i === data.length - 1 && /total|net|end/i.test(item.name));
      if (isTotal) {
        const v = item.value;
        running = v;
        return { name: item.name, base: Math.min(0, v), bar: Math.abs(v), actual: v, kind: "total" as const, prevEnd: v };
      }
      const start = running;
      const end = start + item.value;
      running = end;
      return { name: item.name, base: Math.min(start, end), bar: Math.abs(item.value), actual: item.value, kind: item.value >= 0 ? ("increase" as const) : ("decrease" as const), prevEnd: end };
    });
  }, [data]);
  const layout = useCartesianLayout(rows, ["prevEnd", "base"], "name", valueFormatter, ctx, { labelFormatter, dataLabels: true });
  const labelMode = resolveLabelMode(dataLabels, "auto");
  const fmtSigned = (v: number) => (v > 0 ? "+" : "") + valueFormatter(v);
  const slot = Math.max(40, ((ctx.width || 600) - layout.yAxisWidth) / Math.max(1, rows.length));
  const barLabel = makeBarLabel(labelMode.formatter ?? fmtSigned, labelMode.fontSize, labelMode.mode, "vertical", labelMode.minMarkSize, "outside", slot);
  const totalLabel = makeBarLabel(labelMode.formatter ?? valueFormatter, labelMode.fontSize, labelMode.mode, "vertical", labelMode.minMarkSize, "outside", slot);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={rows} margin={layout.margin} barCategoryGap="30%">
        <CartesianGrid {...gridProps} vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} interval={layout.xAxis.interval} height={layout.xAxis.height} tick={makeCategoryTick(layout.fontSize, layout.xAxis.angle, layout.xAxis.angle === 0 ? slot : 90)} />
        <YAxis axisLine={false} tickLine={false} width={layout.yAxisWidth} tick={axisTick(layout.fontSize)} tickFormatter={valueFormatter} tickCount={layout.tickCount} />
        <ReferenceLine y={0} stroke={chartVars.axisLine} />
        <Tooltip cursor={{ fill: "var(--vi-color-surface-cardHover)", opacity: 0.5 }} content={(p: any) => { const d = p?.payload?.[0]?.payload; if (!p?.active || !d) return null; const Body = rechartsTooltip({}); return <Body active label={d.name} payload={[{ dataKey: "v", name: d.kind === "total" ? "Total" : "Change", value: d.kind === "total" ? valueFormatter(d.actual) : fmtSigned(d.actual), color: colorsMap[d.kind as keyof typeof colorsMap] }, ...(d.kind !== "total" ? [{ dataKey: "e", name: "Running total", value: valueFormatter(d.prevEnd) }] : [])]} />; }} />
        <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={false} />
        <Bar dataKey="bar" stackId="w" radius={[3, 3, 0, 0]} {...animationProps(ctx)}>
          {rows.map((r, i) => <Cell key={i} fill={colorsMap[r.kind]} />)}
          {labelMode.mode !== "never" && <LabelList dataKey="actual" content={(p: any) => (rows[p.index]?.kind === "total" ? totalLabel : barLabel)({ ...p, value: rows[p.index]?.actual })} />}
        </Bar>
        {connectors && rows.slice(0, -1).map((r, i) => (
          <ReferenceLine key={`c${i}`} segment={[{ x: r.name, y: r.prevEnd }, { x: rows[i + 1].name, y: r.prevEnd }]} stroke={chartVars.textMuted} strokeDasharray="2 3" ifOverflow="visible" />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
