import { WidgetCard } from "@aibyters/layout";
import { containerStyle, fmt, Skeleton, valueStyle, tone, type KpiBaseProps, type KpiFormat } from "./internal/kpi";

export interface MetricCardProps extends KpiBaseProps {
  value: number;
  format?: KpiFormat;
  /** Small text after the value (unit, period). */
  suffix?: string;
  /** Secondary line under the value. */
  subtitle?: string;
}

export function MetricCard({ title, description, value, format = "number", suffix, subtitle, className, style, variant, headerAction, footer, size, loading, ...f }: MetricCardProps) {
  return (
    <WidgetCard title={title} description={description} className={className} style={style} variant={variant} headerAction={headerAction} footer={footer}>
      <div style={containerStyle} className="vi-kpi">
        {loading ? <Skeleton /> : (
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
            <span className="vi-kpi-value" style={valueStyle(size)}>{fmt(value, format, f)}</span>
            {suffix && <span style={{ fontSize: 13, color: tone.neutral }}>{suffix}</span>}
          </div>
        )}
        {subtitle && <div style={{ fontSize: 12, color: tone.neutral }}>{subtitle}</div>}
      </div>
    </WidgetCard>
  );
}
