import React from "react";
import { chartVars, tooltipStyle } from "./theme";

export interface TooltipRow {
  key: string;
  label: string;
  value: number | string | null | undefined;
  color?: string;
}

export interface ChartTooltipProps {
  title?: React.ReactNode;
  rows: TooltipRow[];
  valueFormatter?: (value: number, key: string) => string;
  hidden?: ReadonlySet<string>;
  /** Show a total row (sum of numeric values). */
  total?: boolean;
  maxRows?: number;
}

/**
 * Shared tooltip body. Renders consistently across every chart package and never depends on
 * host CSS classes.
 */
export function ChartTooltip({ title, rows, valueFormatter, hidden, total, maxRows = 12 }: ChartTooltipProps) {
  const visible = rows.filter((r) => !hidden?.has(r.key) && r.value !== null && r.value !== undefined);
  const shown = visible.slice(0, maxRows);
  const fmt = (v: number | string, key: string) => (typeof v === "number" && valueFormatter ? valueFormatter(v, key) : String(v));
  const sum = total ? visible.reduce((acc, r) => acc + (typeof r.value === "number" ? r.value : 0), 0) : 0;
  return (
    <div style={{ ...tooltipStyle, minWidth: 120, maxWidth: 280, pointerEvents: "none" }} className="vi-chart-tooltip">
      {title !== undefined && title !== null && (
        <div style={{ fontWeight: 600, marginBottom: shown.length ? 6 : 0, color: chartVars.textPrimary }}>{title}</div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "3px 8px", alignItems: "center" }}>
        {shown.map((r) => (
          <React.Fragment key={r.key}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color ?? "transparent", display: "inline-block" }} aria-hidden />
            <span style={{ color: chartVars.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
            <span style={{ fontVariantNumeric: "tabular-nums", textAlign: "right", color: chartVars.textPrimary, fontWeight: 500 }}>{fmt(r.value as any, r.key)}</span>
          </React.Fragment>
        ))}
        {visible.length > maxRows && (
          <span style={{ gridColumn: "1 / -1", color: chartVars.textMuted, fontSize: 11 }}>+{visible.length - maxRows} more</span>
        )}
        {total && visible.length > 1 && (
          <>
            <span />
            <span style={{ color: chartVars.textSecondary, borderTop: `1px solid ${chartVars.border}`, paddingTop: 3 }}>Total</span>
            <span style={{ fontVariantNumeric: "tabular-nums", textAlign: "right", borderTop: `1px solid ${chartVars.border}`, paddingTop: 3, fontWeight: 600 }}>{fmt(sum, "__total")}</span>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Adapter for Recharts' `content` prop: `<Tooltip content={rechartsTooltip({ valueFormatter })} />`.
 */
export function rechartsTooltip(opts: { valueFormatter?: (v: number, key: string) => string; hidden?: ReadonlySet<string>; total?: boolean; labelFormatter?: (l: any) => React.ReactNode; nameMap?: Record<string, string> }) {
  return function RechartsTooltipContent(props: any) {
    const { active, payload, label } = props;
    if (!active || !payload || payload.length === 0) return null;
    const rows: TooltipRow[] = payload.map((p: any) => ({
      key: String(p.dataKey ?? p.name),
      label: opts.nameMap?.[String(p.dataKey ?? p.name)] ?? String(p.name ?? p.dataKey),
      value: p.value,
      color: p.color ?? p.fill ?? p.stroke ?? p.payload?.fill,
    }));
    const title = opts.labelFormatter ? opts.labelFormatter(label) : label;
    return <ChartTooltip title={title} rows={rows} valueFormatter={opts.valueFormatter} hidden={opts.hidden} total={opts.total} />;
  };
}
