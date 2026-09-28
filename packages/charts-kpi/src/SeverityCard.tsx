import type { ReactNode } from "react";
import { WidgetCard } from "@aibyters/layout";
import { containerStyle, tone, type KpiBaseProps } from "./internal/kpi";

export type Severity = "critical" | "warning" | "info" | "success" | "neutral";

export interface SeverityCardProps extends KpiBaseProps {
  status: Severity;
  message: ReactNode;
  /** Short label shown as a pill, defaults to the status name. */
  label?: string;
  /** Optional count / value shown large next to the pill. */
  value?: number | string;
  /** Call-to-action. */
  action?: ReactNode;
}

const colors: Record<Severity, string> = { critical: tone.negative, warning: tone.warning, info: tone.info, success: tone.positive, neutral: tone.neutral };

export function SeverityCard({ title, description, status, message, label, value, action, className, style, variant, headerAction, footer }: SeverityCardProps) {
  const color = colors[status];
  return (
    <WidgetCard title={title} description={description} className={className} style={style} variant={variant} headerAction={headerAction} footer={footer}>
      <div style={{ ...containerStyle, gap: 10 }} role="status" className="vi-kpi">
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, color, background: `color-mix(in srgb, ${color} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 35%, transparent)` }}>
            <span aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
            {label ?? status[0].toUpperCase() + status.slice(1)}
          </span>
          {value !== undefined && <span className="vi-kpi-value" style={{ fontSize: 22, fontWeight: 700, color: tone.text, fontVariantNumeric: "tabular-nums" }}>{typeof value === "number" ? value.toLocaleString() : value}</span>}
        </div>
        <div style={{ color: tone.text, fontSize: 14, lineHeight: 1.5, borderLeft: `3px solid ${color}`, paddingLeft: 10 }}>{message}</div>
        {action && <div>{action}</div>}
      </div>
    </WidgetCard>
  );
}
