import React from "react";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface GaugeChartProps {
  title: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  thresholds?: Array<{ value: number; color: string }>;
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
  return d;
}

export function GaugeChart({
  title,
  description,
  value,
  min = 0,
  max = 100,
  thresholds,
  className
}: GaugeChartProps) {
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = (clampedValue - min) / (max - min);
  const angle = percentage * 180;

  let activeColor = defaultColors[0];
  if (thresholds && thresholds.length > 0) {
    const sorted = [...thresholds].sort((a, b) => b.value - a.value);
    const threshold = sorted.find((t) => clampedValue >= t.value);
    if (threshold) {
      activeColor = threshold.color;
    }
  }

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 200 120" style={{ width: '100%', maxHeight: '100%' }}>
          {/* Background Arc */}
          <path
            d={describeArc(100, 100, 80, 0, 180)}
            fill="none"
            stroke="var(--vi-color-surface-borderLight)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Foreground Arc */}
          {angle > 0 && (
            <path
              d={describeArc(100, 100, 80, 0, angle)}
              fill="none"
              stroke={activeColor}
              strokeWidth="20"
              strokeLinecap="round"
            />
          )}
          {/* Value Text */}
          <text
            x="100"
            y="90"
            textAnchor="middle"
            fill="var(--vi-color-text-primary)"
            fontSize="24"
            fontWeight="bold"
          >
            {formatCompactNumber(value)}
          </text>
        </svg>
      </div>
    </WidgetCard>
  );
}
