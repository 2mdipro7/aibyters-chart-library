import type { CSSProperties } from "react";
import { WidgetCard } from "@aibyters/layout";

export type InsightSeverity = "critical" | "warning" | "info" | "success";

export interface InsightCardProps {
  title: string;
  severity: InsightSeverity;
  summary: string;
  metric?: string;
  metricValue?: string;
  description?: string;
  className?: string;
  style?: CSSProperties;
  /** Override the badge text for the severity. */
  severityLabel?: string;
  /** Render without card chrome (border, background, padding). */
  variant?: "card" | "plain";
}

/*
 * Every colour comes from a theme CSS variable with a literal fallback, and every style is
 * inline, so the card renders identically in hosts with or without Tailwind or @aibyters/theme.
 */
const SEVERITY: Record<InsightSeverity, { bg: string; text: string; label: string }> = {
  critical: { bg: "var(--vi-color-critical-light, #fee2e2)", text: "var(--vi-color-critical-dark, #991b1b)", label: "Critical" },
  warning: { bg: "var(--vi-color-warning-light, #fef9c3)", text: "var(--vi-color-warning-dark, #854d0e)", label: "Warning" },
  info: { bg: "var(--vi-color-info-light, #dbeafe)", text: "var(--vi-color-info-dark, #1e40af)", label: "Info" },
  success: { bg: "var(--vi-color-positive-light, #dcfce7)", text: "var(--vi-color-positive-dark, #166534)", label: "Success" },
};

const styles = {
  body: { display: "flex", flexDirection: "column", gap: 12, marginTop: 4, fontFamily: "var(--vi-font-body, system-ui, sans-serif)" } as CSSProperties,
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "var(--vi-radius-sm, 4px)",
    fontSize: "var(--vi-text-xs, 12px)",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    lineHeight: 1.5,
  } as CSSProperties,
  summary: { color: "var(--vi-color-text-primary, #0f172a)", fontSize: "var(--vi-text-base, 15px)", lineHeight: 1.5, overflowWrap: "anywhere" } as CSSProperties,
  metricRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: 8,
    marginTop: 4,
    paddingTop: 12,
    borderTop: "1px solid var(--vi-color-surface-border, #e2e8f0)",
  } as CSSProperties,
  metricLabel: { color: "var(--vi-color-text-secondary, #64748b)", fontSize: "var(--vi-text-sm, 14px)" } as CSSProperties,
  metricValue: { color: "var(--vi-color-text-primary, #0f172a)", fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" } as CSSProperties,
};

export function InsightCard({ title, severity, summary, metric, metricValue, description, className, style, severityLabel, variant }: InsightCardProps) {
  const cfg = SEVERITY[severity] ?? SEVERITY.info;
  return (
    <WidgetCard title={title} description={description} className={className} style={style} variant={variant}>
      <div style={styles.body} className="vi-insight-card" data-severity={severity}>
        <div>
          <span role="status" style={{ ...styles.badge, backgroundColor: cfg.bg, color: cfg.text }}>
            {severityLabel ?? cfg.label}
          </span>
        </div>
        <div style={styles.summary}>{summary}</div>
        {metric && metricValue && (
          <div style={styles.metricRow}>
            <span style={styles.metricLabel}>{metric}:</span>
            <span style={styles.metricValue}>{metricValue}</span>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}
