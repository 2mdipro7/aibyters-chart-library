import React from "react";
import { chartVars } from "./theme";

const wrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  minHeight: 120,
  gap: 8,
  color: chartVars.textSecondary,
  fontFamily: chartVars.fontBody,
  fontSize: 13,
  textAlign: "center",
  padding: 16,
  boxSizing: "border-box",
};

export function ChartEmptyState({ message = "No data to display" }: { message?: string }) {
  return (
    <div role="status" style={wrap} className="vi-chart-empty">
      <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden style={{ opacity: 0.5 }}>
        <path d="M3 3v18h18" />
        <path d="M7 15l4-4 3 3 5-6" strokeDasharray="2 2" />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export function ChartErrorState({ error }: { error: string | Error }) {
  const msg = typeof error === "string" ? error : error.message || "Something went wrong";
  return (
    <div role="alert" style={{ ...wrap, color: chartVars.negative }} className="vi-chart-error">
      <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
        <circle cx={12} cy={12} r={9} />
        <path d="M12 8v5M12 16h.01" />
      </svg>
      <span>{msg}</span>
    </div>
  );
}

export function ChartSkeleton({ height = 240 }: { height?: number | string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading chart"
      className="vi-chart-skeleton"
      style={{
        width: "100%",
        height,
        borderRadius: 8,
        background: `linear-gradient(90deg, ${chartVars.surfaceHover} 25%, ${chartVars.surface} 50%, ${chartVars.surfaceHover} 75%)`,
        backgroundSize: "200% 100%",
        animation: "vi-shimmer 1.4s ease-in-out infinite",
      }}
    >
      <style>{`@keyframes vi-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}@media (prefers-reduced-motion: reduce){.vi-chart-skeleton{animation:none !important}}`}</style>
    </div>
  );
}

interface ErrorBoundaryState { error: Error | null }

/** Catches render-time exceptions from a chart so one bad widget cannot take down a dashboard. */
export class ChartErrorBoundary extends React.Component<{ children: React.ReactNode; fallback?: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }
  componentDidCatch(error: Error) {
    if (typeof console !== "undefined") console.error("[aibyters/charts] chart failed to render", error);
  }
  render() {
    if (this.state.error) return this.props.fallback ?? <ChartErrorState error={this.state.error} />;
    return this.props.children;
  }
}
