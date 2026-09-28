import { WidgetCard } from "@aibyters/layout";
import { containerStyle, DeltaBadge, fmt, Skeleton, valueStyle, tone, type KpiBaseProps, type KpiFormat } from "./internal/kpi";

export interface SparklineCardProps extends KpiBaseProps {
  value: number;
  data: number[];
  color?: string;
  /** Explicit trend; derived from first/last point when omitted. */
  trend?: "up" | "down" | "neutral";
  /** Show change between first and last point as a badge. Default true. */
  showDelta?: boolean;
  invertColors?: boolean;
  format?: KpiFormat;
  /** Fill the area under the line. Default true. */
  area?: boolean;
}

export function SparklineCard({ title, description, value, data, color = tone.primary, trend, showDelta = true, invertColors = false, format = "number", area = true, className, style, variant, headerAction, footer, size, loading, ...f }: SparklineCardProps) {
  const w = 100;
  const h = 32;
  const clean = data.filter(Number.isFinite);
  const min = Math.min(...clean);
  const max = Math.max(...clean);
  const range = max - min || 1;
  const pts = clean.map((v, i) => [(i / Math.max(1, clean.length - 1)) * w, h - ((v - min) / range) * (h - 4) - 2] as const);
  const path = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const delta = clean.length > 1 && clean[0] !== 0 ? (clean[clean.length - 1] - clean[0]) / Math.abs(clean[0]) : 0;
  const t = trend ?? (delta > 0.001 ? "up" : delta < -0.001 ? "down" : "neutral");
  const good = invertColors ? t === "down" : t === "up";
  const lineColor = t === "neutral" ? color : good ? tone.positive : tone.negative;
  const last = pts[pts.length - 1];
  return (
    <WidgetCard title={title} description={description} className={className} style={style} variant={variant} headerAction={headerAction} footer={footer}>
      <div style={{ ...containerStyle, flexDirection: "row", alignItems: "center", gap: 16, flexWrap: "wrap" }} className="vi-kpi">
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: "1 1 120px", minWidth: 0 }}>
          {loading ? <Skeleton /> : <span className="vi-kpi-value" style={valueStyle(size)}>{fmt(value, format, f)}</span>}
          {showDelta && clean.length > 1 && <div><DeltaBadge delta={delta} invert={invertColors} /></div>}
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={`Trend ${t}`} style={{ flex: "1 1 120px", minWidth: 80, height: 44, overflow: "visible" }}>
          {area && pts.length > 1 && <path d={`${path} L${w},${h} L0,${h} Z`} fill={lineColor} fillOpacity={0.12} />}
          {pts.length > 1 && <path d={path} fill="none" stroke={lineColor} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />}
          {last && <circle cx={last[0]} cy={last[1]} r={2.5} fill={lineColor} vectorEffect="non-scaling-stroke" />}
        </svg>
      </div>
    </WidgetCard>
  );
}
