import React, { useMemo } from 'react';
import { WidgetCard } from '@aibyters/layout';

export interface CandlestickChartProps {
  title: string;
  description?: string;
  data: Array<{ date: string; open: number; high: number; low: number; close: number }>;
  colors?: { up: string; down: string };
  className?: string;
}

export function CandlestickChart({
  title,
  description,
  data,
  colors = { up: "#22c55e", down: "#ef4444" },
  className
}: CandlestickChartProps) {
  
  const { min, max } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    data.forEach(d => {
      if (d.low < min) min = d.low;
      if (d.high > max) max = d.high;
    });
    if (min === Infinity) min = 0;
    if (max === -Infinity) max = 1;
    if (min === max) {
      min -= 1;
      max += 1;
    }
    const pad = (max - min) * 0.1;
    return { min: min - pad, max: max + pad };
  }, [data]);

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            {data.map((d, i) => {
              const cellWidth = 100 / Math.max(data.length, 1);
              const xCenter = i * cellWidth + cellWidth / 2;
              const candleWidth = cellWidth * 0.6;
              const xStart = xCenter - candleWidth / 2;
              
              const scaleY = (val: number) => 100 - ((val - min) / (max - min)) * 100;
              
              const isUp = d.close >= d.open;
              const color = isUp ? colors.up : colors.down;
              
              const yHigh = scaleY(d.high);
              const yLow = scaleY(d.low);
              const yTop = scaleY(Math.max(d.open, d.close));
              const yBottom = scaleY(Math.min(d.open, d.close));
              
              return (
                <g key={d.date}>
                  <line x1={xCenter} y1={yHigh} x2={xCenter} y2={yLow} stroke={color} strokeWidth="0.5" />
                  <rect 
                    x={xStart} 
                    y={yTop} 
                    width={candleWidth} 
                    height={Math.max(yBottom - yTop, 0.5)} 
                    fill={color} 
                  />
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{ display: 'flex', width: '100%', height: '24px', overflow: 'hidden' }}>
          {data.map((d, i) => {
            const showLabel = data.length <= 10 || i % Math.ceil(data.length / 5) === 0;
            return (
              <div key={d.date} style={{ flex: 1, position: 'relative' }}>
                {showLabel && (
                  <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'var(--vi-color-text-secondary)', whiteSpace: 'nowrap' }}>
                    {d.date}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </WidgetCard>
  );
}
