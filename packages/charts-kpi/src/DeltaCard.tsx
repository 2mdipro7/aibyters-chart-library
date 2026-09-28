import { WidgetCard } from "@aibyters/layout";
import { containerStyle, DeltaBadge, fmt, Skeleton, valueStyle, tone, type KpiBaseProps, type KpiFormat } from "./internal/kpi";

export interface DeltaCardProps extends KpiBaseProps {
  value: number;
  /** Relative change as a fraction, e.g. 0.05 = +5%. */
  delta: number;
  format?: KpiFormat;
  /** Treat a decrease as good (churn, cost, latency). */
  invertColors?: boolean;
  /** Text after the badge, e.g. "vs last month". */
  deltaLabel?: string;
  /** Previous value, shown under the delta when provided. */
  previousValue?: number;
}

export function DeltaCard({ title, description, value, delta, format = "number", invertColors = false, deltaLabel, previousValue, className, style, variant, headerAction, footer, size, loading, ...f }: DeltaCardProps) {
  return (
    <WidgetCard title={title} description={description} className={className} style={style} variant={variant} headerAction={headerAction} footer={footer}>
      <div style={containerStyle} className="vi-kpi">
        {loading ? <Skeleton /> : <span className="vi-kpi-value" style={valueStyle(size)}>{fmt(value, format, f)}</span>}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <DeltaBadge delta={delta} invert={invertColors} />
          {deltaLabel && <span style={{ fontSize: 12, color: tone.neutral }}>{deltaLabel}</span>}
        </div>
        {previousValue !== undefined && <div style={{ fontSize: 12, color: tone.muted }}>Previous: {fmt(previousValue, format, f)}</div>}
      </div>
    </WidgetCard>
  );
}
