import React, { useMemo } from 'react';
import { WidgetCard } from '@aibyters/layout';

export interface HeatmapChartProps {
  title: string;
  description?: string;
  data: Array<{ x: string; y: string; value: number }>;
  colorScale?: { min: string; max: string };
  className?: string;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

export function HeatmapChart({
  title,
  description,
  data,
  colorScale = { min: "#eff6ff", max: "#1d4ed8" },
  className
}: HeatmapChartProps) {
  const { xLabels, yLabels, grid, minValue, maxValue } = useMemo(() => {
    const xSet = new Set<string>();
    const ySet = new Set<string>();
    let min = Infinity;
    let max = -Infinity;

    data.forEach(d => {
      xSet.add(d.x);
      ySet.add(d.y);
      if (d.value < min) min = d.value;
      if (d.value > max) max = d.value;
    });

    const xArr = Array.from(xSet);
    const yArr = Array.from(ySet);
    
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 1;
    if (min === max) {
        min = 0;
    }

    const map = new Map<string, number>();
    data.forEach(d => map.set(`${d.x}-${d.y}`, d.value));

    return { xLabels: xArr, yLabels: yArr, grid: map, minValue: min, maxValue: max };
  }, [data]);

  const getColor = (value: number) => {
    const ratio = (value - minValue) / (maxValue - minValue);
    const c1 = hexToRgb(colorScale.min);
    const c2 = hexToRgb(colorScale.max);
    
    const r = Math.round(c1.r + ratio * (c2.r - c1.r));
    const g = Math.round(c1.g + ratio * (c2.g - c1.g));
    const b = Math.round(c1.b + ratio * (c2.b - c1.b));
    
    return `rgb(${r},${g},${b})`;
  };

  const cellWidth = 100 / Math.max(xLabels.length, 1);
  const cellHeight = 100 / Math.max(yLabels.length, 1);

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <div style={{ width: '60px', display: 'flex', flexDirection: 'column', paddingRight: '8px' }}>
            {yLabels.map(y => (
              <div key={y} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: '12px', color: 'var(--vi-color-text-secondary)', overflow: 'hidden' }}>
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{y}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              {yLabels.map((y, yi) => 
                xLabels.map((x, xi) => {
                  const val = grid.get(`${x}-${y}`);
                  if (val === undefined) return null;
                  return (
                    <rect
                      key={`${x}-${y}`}
                      x={xi * cellWidth}
                      y={yi * cellHeight}
                      width={cellWidth}
                      height={cellHeight}
                      fill={getColor(val)}
                      stroke="var(--vi-color-surface-card)"
                      strokeWidth="0.5"
                    >
                      <title>{`${x}, ${y}: ${val}`}</title>
                    </rect>
                  );
                })
              )}
            </svg>
          </div>
        </div>
        <div style={{ display: 'flex', height: '24px', marginLeft: '60px' }}>
          {xLabels.map(x => (
            <div key={x} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '4px', fontSize: '12px', color: 'var(--vi-color-text-secondary)', overflow: 'hidden' }}>
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{x}</span>
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}
