import type { CSSProperties } from "react";
import { WidgetCard } from "@aibyters/layout";
import { formatPercent } from "@aibyters/spec";

export type RecommendationImpact = "high" | "medium" | "low";

export interface RecommendationCardProps {
  title: string;
  action: string;
  /** Model confidence in the range 0–1. */
  confidence: number;
  impact: RecommendationImpact;
  reason: string;
  description?: string;
  className?: string;
  style?: CSSProperties;
  /** Label next to the confidence bar. Default "AI Confidence". */
  confidenceLabel?: string;
  /** Override the impact badge text. */
  impactLabel?: string;
  /** Render without card chrome (border, background, padding). */
  variant?: "card" | "plain";
}

/*
 * Every colour comes from a theme CSS variable with a literal fallback, and every style is
 * inline, so the card renders identically in hosts with or without Tailwind or @aibyters/theme.
 */
const IMPACT: Record<RecommendationImpact, { bg: string; text: string; label: string }> = {
  high: { bg: "var(--vi-color-critical-light, #fee2e2)", text: "var(--vi-color-critical-dark, #991b1b)", label: "High Impact" },
  medium: { bg: "var(--vi-color-warning-light, #fef9c3)", text: "var(--vi-color-warning-dark, #854d0e)", label: "Medium Impact" },
  low: { bg: "var(--vi-color-info-light, #dbeafe)", text: "var(--vi-color-info-dark, #1e40af)", label: "Low Impact" },
};

const styles = {
  body: { display: "flex", flexDirection: "column", gap: 16, marginTop: 4, fontFamily: "var(--vi-font-body, system-ui, sans-serif)" } as CSSProperties,
  head: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" } as CSSProperties,
  action: { color: "var(--vi-color-text-primary, #0f172a)", fontSize: 16, fontWeight: 600, lineHeight: 1.4, minWidth: 0, flex: "1 1 200px", overflowWrap: "anywhere" } as CSSProperties,
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "var(--vi-radius-sm, 4px)",
    fontSize: "var(--vi-text-xs, 12px)",
    fontWeight: 600,
    whiteSpace: "nowrap",
    lineHeight: 1.5,
  } as CSSProperties,
  reason: { color: "var(--vi-color-text-secondary, #64748b)", fontSize: "var(--vi-text-sm, 14px)", lineHeight: 1.5, overflowWrap: "anywhere" } as CSSProperties,
  confidenceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 } as CSSProperties,
  confidenceLabel: { color: "var(--vi-color-text-secondary, #64748b)", fontSize: "var(--vi-text-xs, 12px)", fontWeight: 500 } as CSSProperties,
  confidenceValue: { color: "var(--vi-color-text-primary, #0f172a)", fontSize: "var(--vi-text-xs, 12px)", fontWeight: 600, fontVariantNumeric: "tabular-nums" } as CSSProperties,
  track: { width: "100%", height: 6, backgroundColor: "var(--vi-color-surface-border, #e2e8f0)", borderRadius: 3, overflow: "hidden" } as CSSProperties,
  fill: { height: "100%", backgroundColor: "var(--vi-color-accent-500, #6366f1)", borderRadius: 3, transition: "width 300ms ease" } as CSSProperties,
};

export function RecommendationCard({ title, action, confidence, impact, reason, description, className, style, confidenceLabel = "AI Confidence", impactLabel, variant }: RecommendationCardProps) {
  const cfg = IMPACT[impact] ?? IMPACT.low;
  const pct = Math.max(0, Math.min(1, Number.isFinite(confidence) ? confidence : 0));
  return (
    <WidgetCard title={title} description={description} className={className} style={style} variant={variant}>
      <div style={styles.body} className="vi-recommendation-card" data-impact={impact}>
        <div style={styles.head}>
          <div style={styles.action}>{action}</div>
          <span style={{ ...styles.badge, backgroundColor: cfg.bg, color: cfg.text }}>{impactLabel ?? cfg.label}</span>
        </div>
        <div style={styles.reason}>{reason}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={styles.confidenceRow}>
            <span style={styles.confidenceLabel}>{confidenceLabel}</span>
            <span style={styles.confidenceValue}>{formatPercent(pct)}</span>
          </div>
          <div role="progressbar" aria-label={confidenceLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)} style={styles.track}>
            <div style={{ ...styles.fill, width: `${pct * 100}%` }} />
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
