import React, { useMemo } from "react";

export interface XAxisProps {
  scale: any; // d3-scale instance
  innerHeight: number;
  ticks?: number;
  tickFormat?: (d: any) => string;
  className?: string;
  title?: string;
}

export function XAxis({
  scale,
  innerHeight,
  ticks = 5,
  tickFormat,
  className = "",
  title
}: XAxisProps) {
  const tickVals = useMemo(() => {
    if (scale.ticks) return scale.ticks(ticks);
    return scale.domain();
  }, [scale, ticks]);

  return (
    <g 
      className={`vi-xaxis ${className}`} 
      transform={`translate(0,${innerHeight})`}
    >
      <line 
        x1={scale.range()[0]} 
        x2={scale.range()[1]} 
        stroke="var(--vi-color-surface-borderLight)" 
        strokeWidth={1} 
      />
      
      {tickVals.map((tick: any, i: number) => {
        // d3 scaleBand doesn't center automatically for lines/text without bandwidth offset
        const isBand = scale.bandwidth !== undefined;
        const offset = isBand ? scale.bandwidth() / 2 : 0;
        const xPos = (scale(tick) ?? 0) + offset;
        
        return (
          <g key={i} transform={`translate(${xPos}, 0)`}>
            <line 
              y2={6} 
              stroke="var(--vi-color-surface-borderLight)" 
            />
            <text
              y={20}
              textAnchor="middle"
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
          x={scale.range()[1] / 2}
          y={40}
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
