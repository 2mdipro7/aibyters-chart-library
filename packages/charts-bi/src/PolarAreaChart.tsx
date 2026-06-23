import React from "react";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface PolarAreaChartProps {
  title: string;
  description?: string;
  data: Array<{ name: string; value: number }>;
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

function describeArcPath(x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: cx + (r * Math.cos(angleInRadians)),
      y: cy + (r * Math.sin(angleInRadians))
    };
  };

  const startOut = polarToCartesian(x, y, outerRadius, endAngle);
  const endOut = polarToCartesian(x, y, outerRadius, startAngle);
  const startIn = polarToCartesian(x, y, innerRadius, endAngle);
  const endIn = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", startOut.x, startOut.y,
    "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOut.x, endOut.y,
    "L", endIn.x, endIn.y,
    "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startIn.x, startIn.y,
    "Z"
  ].join(" ");
}

export function PolarAreaChart({
  title,
  description,
  data,
  colors = defaultColors,
  ...props
}: PolarAreaChartProps) {

  const width = 400;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 40;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const angleStep = 360 / Math.max(data.length, 1);

  return (
    <WidgetCard title={title} description={description} className={props.className}>
      <div style={{ width: '100%', height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', maxWidth: '400px' }}>
          
          {/* Background grid circles */}
          {[0.25, 0.5, 0.75, 1].map(r => (
            <circle
              key={`grid-${r}`}
              cx={cx}
              cy={cy}
              r={maxRadius * r}
              fill="none"
              stroke="var(--vi-color-surface-border)"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ))}

          {/* Slices */}
          {data.map((d, i) => {
            const r = (d.value / maxVal) * maxRadius;
            const startAngle = i * angleStep;
            const endAngle = (i + 1) * angleStep;
            
            const midAngle = (startAngle + endAngle) / 2;
            const labelRad = Math.max(r + 15, maxRadius * 0.3);
            const lx = cx + labelRad * Math.cos((midAngle - 90) * Math.PI / 180);
            const ly = cy + labelRad * Math.sin((midAngle - 90) * Math.PI / 180);

            return (
              <g key={`slice-${i}`}>
                <path
                  d={describeArcPath(cx, cy, 0, r, startAngle, endAngle)}
                  fill={colors[i % colors.length]}
                  fillOpacity={0.7}
                  stroke="var(--vi-color-surface-card)"
                  strokeWidth={2}
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.fillOpacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.fillOpacity = '0.7';
                  }}
                >
                  <title>{d.name}: {formatCompactNumber(d.value)}</title>
                </path>
                
                {/* Value/Name labels */}
                {r > 20 && (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={12}
                    fill="var(--vi-color-text-primary)"
                    pointerEvents="none"
                    style={{ textShadow: '0px 0px 3px var(--vi-color-surface-card)' }}
                  >
                    {d.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </WidgetCard>
  );
}
