import { useMemo } from "react";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { chartVars, labelFits, layoutPieLabels, rechartsTooltip, resolveColors, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { formatCompactNumber } from "@aibyters/spec";
import { animationProps, resolveLabelMode, splitCardProps, type CardKey } from "./internal/cartesian";

export interface PieChartProps extends BaseChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  /** Inner radius as a fraction of the outer radius (0 = pie, 0.6 = donut). Default 0. */
  innerRadiusRatio?: number;
  /** What the slice labels show. Default "percent". */
  labelContent?: "percent" | "value" | "name" | "name-percent";
  /** Slices below this share are merged into "Other". Default 0 (off). */
  otherThreshold?: number;
  /** Show the value / share next to each legend item. Default true. */
  legendValues?: boolean;
  /** Centre content (donut only). */
  centerValue?: string;
  centerLabel?: string;
  onSliceClick?: (datum: any) => void;
  /** Kept for backwards compatibility; prefer `dataLabels`. */
  showLabels?: boolean;
}

const DEG = Math.PI / 180;

export function PieChart(props: PieChartProps) {
  const [card, plot] = splitCardProps(props);
  const { data, dataKey, nameKey, colors, otherThreshold = 0, legendValues = true, valueFormatter = formatCompactNumber } = props;
  const prepared = useMemo(() => prepare(data, dataKey, nameKey, otherThreshold), [data, dataKey, nameKey, otherThreshold]);
  const palette = resolveColors(colors, prepared.length);
  const series: SeriesDescriptor[] = prepared.map((d, i) => ({ key: d.__key, label: String(d[nameKey]), color: palette[i], shape: "circle" }));
  const total = prepared.reduce((a, d) => a + (Number(d[dataKey]) || 0), 0);
  const values = legendValues ? Object.fromEntries(prepared.map((d) => [d.__key, `${valueFormatter(Number(d[dataKey]) || 0)} · ${total ? Math.round(((Number(d[dataKey]) || 0) / total) * 100) : 0}%`])) : undefined;
  const height = card.height ?? 260;
  return (
    <ChartCard {...card} height={height} legend={card.legend ?? { position: "right" }} series={series} legendValues={values} isEmpty={prepared.length === 0} exportData={props.exportData ?? data}>
      {(ctx) => <PiePlot ctx={ctx} series={series} prepared={prepared} total={total} {...plot} />}
    </ChartCard>
  );
}

function prepare(data: any[], dataKey: string, nameKey: string, otherThreshold: number) {
  const rows = (data ?? []).filter((d) => Number.isFinite(Number(d?.[dataKey])) && Number(d[dataKey]) > 0).map((d, i) => ({ ...d, __key: `${d[nameKey]}__${i}` }));
  if (!otherThreshold) return rows;
  const total = rows.reduce((a, d) => a + Number(d[dataKey]), 0);
  const big = rows.filter((d) => Number(d[dataKey]) / total >= otherThreshold);
  const small = rows.filter((d) => Number(d[dataKey]) / total < otherThreshold);
  if (small.length <= 1) return rows;
  return [...big, { [nameKey]: "Other", [dataKey]: small.reduce((a, d) => a + Number(d[dataKey]), 0), __key: "__other", __members: small }];
}

function PiePlot({ ctx, prepared, series, total, dataKey, nameKey, innerRadiusRatio = 0, labelContent = "percent", valueFormatter = formatCompactNumber, dataLabels, showLabels, centerValue, centerLabel, onSliceClick }: Omit<PieChartProps, CardKey | "data"> & { ctx: ChartContextValue; series: SeriesDescriptor[]; prepared: any[]; total: number }) {
  const labelMode = resolveLabelMode(dataLabels ?? (showLabels === false ? false : undefined), "auto");
  const w = ctx.width || 300;
  const h = ctx.height;
  const outside = labelMode.mode !== "never" && ctx.settings.outsidePieLabels && innerRadiusRatio < 0.5;
  // Reserve horizontal room for outside labels.
  const labelRoom = outside ? Math.min(110, w * 0.28) : 0;
  const outerR = Math.max(30, Math.min(h / 2 - 12, (w - labelRoom * 2) / 2 - 8));
  const innerR = Math.round(outerR * innerRadiusRatio);
  const cx = w / 2;
  const cy = h / 2;
  const visible = prepared.filter((d) => !ctx.hiddenSeries.has(d.__key));
  const visibleTotal = visible.reduce((a, d) => a + Number(d[dataKey]), 0) || 1;

  const text = (d: any) => {
    const pct = `${Math.round((Number(d[dataKey]) / visibleTotal) * 100)}%`;
    switch (labelContent) {
      case "value": return valueFormatter(Number(d[dataKey]));
      case "name": return String(d[nameKey]);
      case "name-percent": return `${d[nameKey]} ${pct}`;
      default: return pct;
    }
  };

  // Geometry mirrors Recharts: startAngle 90, clockwise.
  const slices = useMemo(() => {
    let angle = 90;
    return visible.map((d) => {
      const share = Number(d[dataKey]) / visibleTotal;
      const sweep = share * 360;
      const mid = angle - sweep / 2;
      angle -= sweep;
      return { d, share, mid };
    });
  }, [visible, visibleTotal, dataKey]);

  const outsideLabels = outside
    ? layoutPieLabels(slices.map((s) => ({ id: s.d.__key, midAngle: s.mid, percent: s.share, text: text(s.d) })), cx, cy, outerR, { fontSize: labelMode.fontSize, minPercent: 0.025, labelOffset: 16, minY: 4, maxY: h - 4 })
    : [];

  const insideLabels = !outside && labelMode.mode !== "never"
    ? slices.map((s) => {
        const r = innerR + (outerR - innerR) * 0.55;
        const x = cx + r * Math.cos(-s.mid * DEG);
        const y = cy + r * Math.sin(-s.mid * DEG);
        const t = text(s.d);
        const arc = (outerR - innerR) * 0.9;
        const chord = 2 * r * Math.sin((s.share * 360 * DEG) / 2);
        const fits = labelMode.mode === "always" || labelFits(t, Math.max(chord, 0), arc, labelMode.fontSize, 2);
        return { id: s.d.__key, x, y, t, visible: fits && s.share >= 0.04 };
      })
    : [];

  const byKey = new Map(series.map((s) => [s.key, s]));
  const center = (centerValue || centerLabel) && innerRadiusRatio > 0;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={visible}
            dataKey={dataKey}
            nameKey={nameKey}
            cx={cx}
            cy={cy}
            innerRadius={innerR}
            outerRadius={outerR}
            startAngle={90}
            endAngle={-270}
            paddingAngle={visible.length > 1 ? 1 : 0}
            stroke="var(--vi-color-surface-card)"
            strokeWidth={1}
            label={false}
            labelLine={false}
            onClick={(d: any) => onSliceClick?.(d?.payload ?? d)}
            cursor={onSliceClick ? "pointer" : undefined}
            {...animationProps(ctx)}
          >
            {visible.map((d) => (
              <Cell key={d.__key} fill={byKey.get(d.__key)?.color} fillOpacity={ctx.highlightedSeries && ctx.highlightedSeries !== d.__key ? 0.3 : 1} />
            ))}
          </Pie>
          <Tooltip content={rechartsTooltip({ valueFormatter: (v) => `${valueFormatter(v)} (${Math.round((v / (total || 1)) * 100)}%)` })} />
        </RechartsPieChart>
      </ResponsiveContainer>
      <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
        {outsideLabels.filter((l) => l.visible).map((l) => (
          <g key={String(l.id)}>
            <polyline points={`${l.anchorX},${l.anchorY} ${l.elbowX},${l.elbowY} ${l.x - (l.side === "right" ? 4 : -4)},${l.y}`} fill="none" stroke={chartVars.axisLine} strokeWidth={1} />
            <text x={l.x} y={l.y} textAnchor={l.textAnchor} dominantBaseline="central" fontSize={labelMode.fontSize} fill={chartVars.textSecondary} fontFamily={chartVars.fontBody}>
              {l.text}
            </text>
          </g>
        ))}
        {insideLabels.filter((l) => l.visible).map((l) => (
          <text key={String(l.id)} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="central" fontSize={labelMode.fontSize} fill="#fff" fontFamily={chartVars.fontBody} style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.35)", strokeWidth: 2 }}>
            {l.t}
          </text>
        ))}
      </svg>
      {center && (
        <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none", maxWidth: innerR * 1.7, fontFamily: chartVars.fontBody }}>
          {centerValue && <div style={{ fontSize: Math.max(12, Math.min(28, innerR / 2.2, (innerR * 1.7) / (String(centerValue).length * 0.62))), fontWeight: 700, color: chartVars.textPrimary, lineHeight: 1.1, fontVariantNumeric: "tabular-nums", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{centerValue}</div>}
          {centerLabel && <div style={{ fontSize: Math.max(10, Math.min(12, innerR / 5)), color: chartVars.textSecondary, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{centerLabel}</div>}
        </div>
      )}
    </div>
  );
}
