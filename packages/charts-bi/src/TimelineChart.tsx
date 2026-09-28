import { WidgetCard } from "@aibyters/layout";

export interface TimelineChartProps {
  title: string;
  description?: string;
  events: Array<{ date: string; label: string; category?: string; description?: string }>;
  colors?: string[];
  className?: string;
}

import { themePalette } from "@aibyters/core";
const defaultColors = themePalette(10);

export function TimelineChart({
  title,
  description,
  events,
  colors = defaultColors,
  ...props
}: TimelineChartProps) {
  
  const width = 800;
  const height = 200;
  
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const startX = 50;
  const endX = width - 50;
  const yLine = height / 2;

  const categories = Array.from(new Set(sortedEvents.map(e => e.category).filter(Boolean)));

  return (
    <WidgetCard title={title} description={description} className={props.className}>
      <div style={{ width: '100%', height: 250, overflowX: 'auto', overflowY: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ minWidth: 600, width: '100%', height: '100%' }}>
          {/* Main timeline line */}
          <line
            x1={startX}
            y1={yLine}
            x2={endX}
            y2={yLine}
            stroke="var(--vi-color-surface-border)"
            strokeWidth={4}
            strokeLinecap="round"
          />
          
          {/* Events */}
          {sortedEvents.map((evt, i) => {
            // Distribute evenly for simple timeline, or based on time if desired.
            // Distributing evenly is safer if dates vary wildly.
            const x = startX + (i / Math.max(sortedEvents.length - 1, 1)) * (endX - startX);
            const isTop = i % 2 === 0;
            const sign = isTop ? -1 : 1;
            
            const catIndex = evt.category ? categories.indexOf(evt.category) : 0;
            const color = colors[catIndex % colors.length];

            return (
              <g key={`evt-${i}`} transform={`translate(${x},${yLine})`}>
                {/* Marker line */}
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={sign * 20}
                  stroke={color}
                  strokeWidth={2}
                />
                {/* Marker dot */}
                <circle
                  cx={0}
                  cy={0}
                  r={6}
                  fill="var(--vi-color-surface-card)"
                  stroke={color}
                  strokeWidth={3}
                />
                {/* Date text */}
                <text
                  x={0}
                  y={sign * 35}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight="bold"
                  fill="var(--vi-color-text-secondary)"
                >
                  {evt.date}
                </text>
                {/* Label text */}
                <text
                  x={0}
                  y={sign * 50}
                  textAnchor="middle"
                  fontSize={12}
                  fill="var(--vi-color-text-primary)"
                >
                  {evt.label}
                </text>
                {/* Description text (optional) */}
                {evt.description && (
                  <text
                    x={0}
                    y={sign * 65}
                    textAnchor="middle"
                    fontSize={10}
                    fill="var(--vi-color-text-secondary)"
                  >
                    {evt.description}
                  </text>
                )}
                <title>{evt.date} - {evt.label}</title>
              </g>
            );
          })}
        </svg>
      </div>
    </WidgetCard>
  );
}
