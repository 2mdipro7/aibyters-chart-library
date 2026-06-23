import React from "react";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber, formatCurrency, formatPercent } from "@aibyters/spec";

export interface TargetCardProps {
  title: string;
  value: number;
  target: number;
  format?: "number" | "currency" | "percent";
  description?: string;
  className?: string;
}

export function TargetCard({
  title,
  value,
  target,
  format = "number",
  description,
  className,
}: TargetCardProps) {
  let displayValue = String(value);
  let displayTarget = String(target);
  
  if (format === "number") {
    displayValue = formatCompactNumber(value);
    displayTarget = formatCompactNumber(target);
  }
  if (format === "currency") {
    displayValue = formatCurrency(value);
    displayTarget = formatCurrency(target);
  }
  if (format === "percent") {
    displayValue = formatPercent(value);
    displayTarget = formatPercent(target);
  }

  const progressPercent = Math.min(100, Math.max(0, (value / target) * 100));

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div className="flex flex-col justify-center h-full space-y-4">
        <div className="flex items-end justify-between">
          <div className="text-4xl font-bold text-[var(--vi-color-text-primary)]">
            {displayValue}
          </div>
          <div className="text-sm font-medium text-[var(--vi-color-text-tertiary)] mb-1">
            Target: {displayTarget}
          </div>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-2 w-full rounded-full bg-[var(--vi-color-surface-background)] overflow-hidden">
          <div 
            className="h-full bg-[var(--vi-color-brand-primary)] rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        <div className="text-xs text-right font-medium text-[var(--vi-color-text-secondary)]">
          {progressPercent.toFixed(1)}% Achieved
        </div>
      </div>
    </WidgetCard>
  );
}
