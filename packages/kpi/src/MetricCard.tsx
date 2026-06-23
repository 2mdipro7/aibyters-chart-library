import React from "react";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber, formatCurrency, formatPercent } from "@aibyters/spec";

export interface MetricCardProps {
  title: string;
  value: number;
  format?: "number" | "currency" | "percent";
  description?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  format = "number",
  description,
  className,
}: MetricCardProps) {
  let displayValue = String(value);
  if (format === "number") displayValue = formatCompactNumber(value);
  if (format === "currency") displayValue = formatCurrency(value);
  if (format === "percent") displayValue = formatPercent(value);

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-4xl font-bold text-[var(--vi-color-text-primary)]">
          {displayValue}
        </div>
      </div>
    </WidgetCard>
  );
}
