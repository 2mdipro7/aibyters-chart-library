import React from "react";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber, formatCurrency, formatPercent, formatDelta } from "@aibyters/spec";

export interface DeltaCardProps {
  title: string;
  value: number;
  delta: number; // e.g. 0.05 for 5% increase
  format?: "number" | "currency" | "percent";
  description?: string;
  invertColors?: boolean; // If true, positive is red, negative is green (e.g. churn rate)
  className?: string;
}

export function DeltaCard({
  title,
  value,
  delta,
  format = "number",
  description,
  invertColors = false,
  className,
}: DeltaCardProps) {
  let displayValue = String(value);
  if (format === "number") displayValue = formatCompactNumber(value);
  if (format === "currency") displayValue = formatCurrency(value);
  if (format === "percent") displayValue = formatPercent(value);

  const isPositive = delta > 0;
  const isNegative = delta < 0;
  const isNeutral = delta === 0;

  // Semantic color logic
  let deltaColorClass = "text-[var(--vi-color-text-secondary)]";
  if (isPositive) {
    deltaColorClass = invertColors ? "text-[var(--vi-color-semantic-danger)]" : "text-[var(--vi-color-semantic-success)]";
  } else if (isNegative) {
    deltaColorClass = invertColors ? "text-[var(--vi-color-semantic-success)]" : "text-[var(--vi-color-semantic-danger)]";
  }

  const deltaText = formatDelta(delta);

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div className="flex flex-col justify-center h-full space-y-2">
        <div className="text-4xl font-bold text-[var(--vi-color-text-primary)]">
          {displayValue}
        </div>
        <div className={`flex items-center text-sm font-semibold ${deltaColorClass}`}>
          {isPositive && <span className="mr-1">↑</span>}
          {isNegative && <span className="mr-1">↓</span>}
          {isNeutral && <span className="mr-1">−</span>}
          {deltaText}
        </div>
      </div>
    </WidgetCard>
  );
}
