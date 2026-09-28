import { useMemo } from "react";

export interface YAxisProps {
  scale: any; // d3-scale instance
  innerWidth: number;
  ticks?: number;
  tickFormat?: (d: any) => string;
  className?: string;
  title?: string;
}

export function YAxis({
  scale,
  innerWidth,
  ticks = 5,
  tickFormat,
  className = "",
  title
}: YAxisProps) {
  const tickVals = useMemo(() => {
    if (scale.ticks) return scale.ticks(ticks);
    return scale.domain();
  }, [scale, ticks]);

  return (
    <g className={`vi-yaxis ${className}`}>
      <line 
        y1={scale.range()[0]} 
        y2={scale.range()[1]} 
        stroke="var(--vi-color-surface-borderLight)" 
        strokeWidth={1} 
      />
      
      {tickVals.map((tick: any, i: number) => {
        const isBand = scale.bandwidth !== undefined;
        const offset = isBand ? scale.bandwidth() / 2 : 0;
        const yPos = (scale(tick) ?? 0) + offset;
        
        return (
          <g key={i} transform={`translate(0, ${yPos})`}>
            {/* Grid line */}
            <line 
              x2={innerWidth} 
              stroke="var(--vi-color-surface-borderLight)" 
              strokeDasharray="4 4"
              opacity={0.3}
            />
            {/* Tick line */}
            <line 
              x2={-6} 
              stroke="var(--vi-color-surface-borderLight)" 
            />
            {/* Label */}
            <text
              x={-10}
              dy="0.32em"
              textAnchor="end"
              fill="var(--vi-color-text-secondary)"
              fontSize="var(--vi-text-xs)"
            >
              {tickFormat ? tickFormat(tick) : String(tick)}
            </text>
          </g>
        );
      })}

      {title && (
        <text
          x={-scale.range()[0] / 2}
          y={-30}
          transform="rotate(-90)"
          textAnchor="middle"
          fill="var(--vi-color-text-muted)"
          fontSize="var(--vi-text-sm)"
        >
          {title}
        </text>
      )}
    </g>
  );
}
