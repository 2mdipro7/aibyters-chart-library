import { WidgetCard } from "@aibyters/layout";
import { containerStyle, fmt, tone, type KpiBaseProps, type KpiFormat } from "./internal/kpi";

export interface ProgressCardProps extends KpiBaseProps {
  value: number;
  max: number;
  type?: "circular" | "linear";
  color?: string;
  format?: KpiFormat;
  /** Label under the percentage, e.g. "of quota". */
  caption?: string;
}

export function ProgressCard({ title, description, value, max, type = "linear", color = tone.primary, format = "count", caption, className, style, variant, headerAction, footer, ...f }: ProgressCardProps) {
  const pct = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const pctText = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 }).format(pct);
  const detail = `${fmt(value, format, f)} / ${fmt(max, format, f)}`;
  const r = 40;
  const c = 2 * Math.PI * r;
  return (
    <WidgetCard title={title} description={description} className={className} style={style} variant={variant} headerAction={headerAction} footer={footer}>
      {type === "linear" ? (
        <div style={containerStyle} className="vi-kpi">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
            <span className="vi-kpi-value" style={{ color: tone.text, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{detail}</span>
            <span style={{ color: tone.neutral, fontVariantNumeric: "tabular-nums" }}>{pctText}</span>
          </div>
          <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)} style={{ width: "100%", height: 8, background: tone.track, borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${pct * 100}%`, height: "100%", background: color, transition: "width 400ms ease" }} />
          </div>
          {caption && <div style={{ fontSize: 12, color: tone.muted }}>{caption}</div>}
        </div>
      ) : (
        <div style={{ ...containerStyle, alignItems: "center" }} className="vi-kpi">
          <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)} style={{ position: "relative", width: "min(140px, 60cqw)", aspectRatio: "1 / 1" }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }} aria-hidden>
              <circle cx="50" cy="50" r={r} fill="none" stroke={tone.track} strokeWidth="9" />
              <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="9" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 400ms ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              <span className="vi-kpi-value" style={{ fontSize: "clamp(16px, 5cqw, 24px)", fontWeight: 700, color: tone.text, fontVariantNumeric: "tabular-nums" }}>{pctText}</span>
              <span style={{ fontSize: 11, color: tone.neutral, fontVariantNumeric: "tabular-nums" }}>{detail}</span>
            </div>
          </div>
          {caption && <div style={{ fontSize: 12, color: tone.muted }}>{caption}</div>}
        </div>
      )}
    </WidgetCard>
  );
}
