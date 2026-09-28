import { ChartCard } from "@aibyters/layout";
import { chartVars, estimateTextWidth, truncateToWidth, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, splitCardProps } from "./internal/cartesian";

export interface BulletRow {
  label: string;
  actual: number;
  target: number;
  /** Qualitative range boundaries, ascending (e.g. poor / satisfactory / good). */
  ranges?: number[];
  /** Optional comparative marker (e.g. last year). */
  comparative?: number;
}

export interface BulletChartProps extends BaseChartProps {
  /** One or many rows. Single-row usage: pass `actual`, `target`, `ranges`, `label` directly. */
  rows?: BulletRow[];
  actual?: number;
  target?: number;
  ranges?: number[];
  label?: string;
  /** Shared maximum for all rows; defaults to the largest range / value. */
  max?: number;
}

/** Actual vs target with qualitative ranges (Stephen Few bullet graph). Stacks rows on narrow screens. */
export function BulletChart(props: BulletChartProps) {
  const [card, plot] = splitCardProps(props);
  const rows: BulletRow[] = props.rows ?? [{ label: props.label ?? props.title, actual: props.actual ?? 0, target: props.target ?? 0, ranges: props.ranges }];
  return (
    <ChartCard {...card} height={card.height ?? Math.max(72, rows.length * 56 + 16)} legend={false} isEmpty={rows.length === 0} exportData={props.exportData ?? rows}>
      {(ctx) => <BulletPlot ctx={ctx} rows={rows} max={plot.max} valueFormatter={plot.valueFormatter} />}
    </ChartCard>
  );
}

function BulletPlot({ ctx, rows, max, valueFormatter = DEFAULT_FORMATTER }: { ctx: ChartContextValue; rows: BulletRow[]; max?: number; valueFormatter?: (v: number) => string }) {
  const w = ctx.width || 400;
  const fs = ctx.settings.fontSize;
  const compact = ctx.settings.breakpoint === "xs";
  const labelCol = compact ? 0 : Math.min(140, Math.max(...rows.map((r) => estimateTextWidth(r.label, fs))) + 16);
  const valueCol = Math.max(...rows.map((r) => estimateTextWidth(valueFormatter(r.actual), fs))) + 12;
  const top = max ?? Math.max(1, ...rows.flatMap((r) => [r.actual, r.target, r.comparative ?? 0, ...(r.ranges ?? [])]));
  const trackW = Math.max(40, w - labelCol - valueCol);
  const rowH = ctx.height / rows.length;
  const barH = Math.min(14, rowH * 0.3);
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${ctx.height}`} role="img" aria-label="Bullet chart" style={{ display: "block", fontFamily: chartVars.fontBody }}>
      {rows.map((r, i) => {
        const y0 = i * rowH;
        const yMid = y0 + rowH / 2 + (compact ? fs * 0.4 : 0);
        const ranges = [...(r.ranges ?? [])].sort((a, b) => a - b);
        const x = (v: number) => labelCol + (Math.min(v, top) / top) * trackW;
        return (
          <g key={i}>
            {compact ? (
              <text x={labelCol} y={y0 + fs} fontSize={fs} fill={chartVars.textPrimary} fontWeight={600}>{truncateToWidth(r.label, w * 0.6, fs)}</text>
            ) : (
              <text x={labelCol - 10} y={yMid} textAnchor="end" dominantBaseline="central" fontSize={fs} fill={chartVars.textPrimary} fontWeight={600}>{truncateToWidth(r.label, labelCol - 12, fs)}</text>
            )}
            <rect x={labelCol} y={yMid - barH * 1.5} width={trackW} height={barH * 3} rx={3} fill="var(--vi-color-surface-cardHover)" />
            {ranges.map((rg, j) => (
              <rect key={j} x={labelCol} y={yMid - barH * 1.5} width={x(rg) - labelCol} height={barH * 3} rx={3} fill={chartVars.textSecondary} fillOpacity={0.12 + (ranges.length - j) * 0.08}>
                <title>Range up to {valueFormatter(rg)}</title>
              </rect>
            ))}
            <rect x={labelCol} y={yMid - barH / 2} width={x(r.actual) - labelCol} height={barH} rx={2} fill={chartVars.accent}>
              <title>Actual {valueFormatter(r.actual)}</title>
            </rect>
            {r.comparative !== undefined && <rect x={x(r.comparative) - 1.5} y={yMid - barH * 1.1} width={3} height={barH * 2.2} fill={chartVars.textMuted}><title>Comparative {valueFormatter(r.comparative)}</title></rect>}
            <rect x={x(r.target) - 1.5} y={yMid - barH * 1.4} width={3} height={barH * 2.8} fill={chartVars.textPrimary}><title>Target {valueFormatter(r.target)}</title></rect>
            <text x={w} y={yMid} textAnchor="end" dominantBaseline="central" fontSize={fs} fill={chartVars.textPrimary} style={{ fontVariantNumeric: "tabular-nums" }}>{valueFormatter(r.actual)}</text>
          </g>
        );
      })}
    </svg>
  );
}
