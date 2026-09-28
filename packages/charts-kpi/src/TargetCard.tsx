import { WidgetCard } from "@aibyters/layout";
import { containerStyle, fmt, Skeleton, valueStyle, tone, type KpiBaseProps, type KpiFormat } from "./internal/kpi";

export interface TargetCardProps extends KpiBaseProps {
  value: number;
  target: number;
  format?: KpiFormat;
  /** Colour thresholds on attainment: below `warnBelow` = warning, below `dangerBelow` = negative. */
  warnBelow?: number;
  dangerBelow?: number;
}

export function TargetCard({ title, description, value, target, format = "number", warnBelow = 0.9, dangerBelow = 0.7, className, style, variant, headerAction, footer, size, loading, ...f }: TargetCardProps) {
  const ratio = target > 0 ? value / target : 0;
  const pct = Math.min(1, Math.max(0, ratio));
  const color = ratio < dangerBelow ? tone.negative : ratio < warnBelow ? tone.warning : tone.positive;
  return (
    <WidgetCard title={title} description={description} className={className} style={style} variant={variant} headerAction={headerAction} footer={footer}>
      <div style={containerStyle} className="vi-kpi">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          {loading ? <Skeleton /> : <span className="vi-kpi-value" style={valueStyle(size)}>{fmt(value, format, f)}</span>}
          <span style={{ fontSize: 12, color: tone.neutral, fontVariantNumeric: "tabular-nums" }}>Target {fmt(target, format, f)}</span>
        </div>
        <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)} aria-label={`${Math.round(ratio * 100)}% of target`} style={{ height: 8, width: "100%", borderRadius: 999, background: tone.track, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct * 100}%`, background: color, borderRadius: 999, transition: "width 400ms ease" }} />
        </div>
        <div style={{ fontSize: 12, color: tone.neutral, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{(ratio * 100).toFixed(1)}% achieved</div>
      </div>
    </WidgetCard>
  );
}
