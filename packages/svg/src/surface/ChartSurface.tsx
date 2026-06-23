import React, { useRef } from "react";
import { useContainerSize, Margins, computeInnerDimensions } from "@aibyters/core";

export interface ChartSurfaceProps {
  children: (props: {
    width: number;
    height: number;
    innerWidth: number;
    innerHeight: number;
    margins: Margins;
  }) => React.ReactNode;
  margins?: Margins;
  className?: string;
}

export function ChartSurface({
  children,
  margins = { top: 20, right: 20, bottom: 40, left: 40 },
  className = "",
}: ChartSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerSize(containerRef);

  const { innerWidth, innerHeight } = computeInnerDimensions(width, height, margins);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full relative ${className}`}
      style={{ minHeight: "200px", minWidth: "200px" }}
    >
      {width > 0 && height > 0 && (
        <svg width={width} height={height} className="block overflow-visible">
          <g transform={`translate(${margins.left},${margins.top})`}>
            {children({ width, height, innerWidth, innerHeight, margins })}
          </g>
        </svg>
      )}
    </div>
  );
}
