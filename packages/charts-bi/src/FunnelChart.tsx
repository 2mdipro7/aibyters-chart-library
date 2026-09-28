import { ChartCard } from "@aibyters/layout";
import { chartVars, labelFits, resolveColors, truncateToWidth, type BaseChartProps, type ChartContextValue, type SeriesDescriptor } from "@aibyters/core";
import { DEFAULT_FORMATTER, splitCardProps, type CardKey } from "./internal/cartesian";

export interface FunnelChartProps extends BaseChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  /** Show conversion % relative to the previous stage. Default true. */
  showConversion?: boolean;
  onStageClick?: (datum: any) => void;
}

/**
 * Conversion funnel drawn with plain SVG: stage name and value sit in a fixed label column
 * so they never overlap the shape, whatever the container width.
 */
export function FunnelChart(props: FunnelChartProps) {
  const [card, plot] = splitCardProps(props);
  const rows = props.data ?? [];
  const palette = resolveColors(props.colors, rows.length);
  const series: SeriesDescriptor[] = rows.map((d, i) => ({ key: `${d[props.nameKey]}__${i}`, label: String(d[props.nameKey]), color: palette[i], shape: "square" }));
  return (
    <ChartCard {...card} height={card.height ?? Math.max(180, rows.length * 44 + 20)} legend={card.legend ?? false} series={series} isEmpty={rows.length === 0} exportData={props.exportData ?? rows}>
      {(ctx) => <FunnelPlot ctx={ctx} series={series} {...plot} />}
    </ChartCard>
  );
}

function FunnelPlot({ ctx, data, dataKey, nameKey, valueFormatter = DEFAULT_FORMATTER, showConversion = true, onStageClick, series }: Omit<FunnelChartProps, CardKey> & { ctx: ChartContextValue; series: SeriesDescriptor[] }) {
  const w = ctx.width || 400;
  const h = ctx.height;
  const fs = ctx.settings.fontSize;
  const compact = ctx.settings.breakpoint === "xs";
  const labelCol = compact ? 0 : Math.min(180, w * 0.34);
  const max = Math.max(1, ...data.map((d) => Number(d[dataKey]) || 0));
  const rowH = h / Math.max(1, data.length);
  const shapeW = w - labelCol - 8;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Funnel" style={{ fontFamily: chartVars.fontBody, display: "block" }}>
      {data.map((d, i) => {
        const v = Number(d[dataKey]) || 0;
        const next = Number(data[i + 1]?.[dataKey]);
        const prev = Number(data[i - 1]?.[dataKey]);
        const wTop = (v / max) * shapeW;
        const wBot = (Number.isFinite(next) ? next / max : v / max) * shapeW;
        const y = i * rowH;
        const cx = labelCol + shapeW / 2;
        const gap = 3;
        const pts = `${cx - wTop / 2},${y + gap} ${cx + wTop / 2},${y + gap} ${cx + wBot / 2},${y + rowH - gap} ${cx - wBot / 2},${y + rowH - gap}`;
        const conv = showConversion && Number.isFinite(prev) && prev > 0 ? `${Math.round((v / prev) * 100)}%` : null;
        const valueText = valueFormatter(v);
        const name = String(d[nameKey]);
        const insideText = compact ? `${truncateToWidth(name, wTop - 12, fs)} · ${valueText}` : valueText;
        const inside = labelFits(insideText, wTop, rowH - gap * 2, fs, 4);
        return (
          <g key={series[i].key} onClick={() => onStageClick?.(d)} style={{ cursor: onStageClick ? "pointer" : "default" }}>
            <polygon points={pts} fill={series[i].color} opacity={0.9}>
              <title>{`${name}: ${valueText}${conv ? ` (${conv} of previous)` : ""}`}</title>
            </polygon>
            {!compact && (
              <>
                <text x={labelCol - 10} y={y + rowH / 2 - (conv ? 6 : 0)} textAnchor="end" dominantBaseline="central" fontSize={fs} fill={chartVars.textPrimary} fontWeight={600}>
                  {truncateToWidth(name, labelCol - 14, fs)}
                </text>
                {conv && (
                  <text x={labelCol - 10} y={y + rowH / 2 + 8} textAnchor="end" dominantBaseline="central" fontSize={fs - 1} fill={chartVars.textMuted}>
                    {conv} of previous
                  </text>
                )}
              </>
            )}
            {inside ? (
              <text x={cx} y={y + rowH / 2} textAnchor="middle" dominantBaseline="central" fontSize={fs} fill="#fff" style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.35)", strokeWidth: 2, pointerEvents: "none" }}>
                {insideText}
              </text>
            ) : (
              <text x={cx + wTop / 2 + 6} y={y + rowH / 2} textAnchor="start" dominantBaseline="central" fontSize={fs} fill={chartVars.textSecondary} style={{ pointerEvents: "none" }}>
                {cx + wTop / 2 + 6 + insideText.length * fs * 0.55 < w ? insideText : valueText}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
