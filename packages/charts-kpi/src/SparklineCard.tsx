import React from 'react';
import { WidgetCard } from '@aibyters/layout';
import { formatCompactNumber, formatCurrency, formatPercent } from '@aibyters/spec';

export interface SparklineCardProps {
  title: string;
  value: number;
  data: number[];
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'currency' | 'percent';
  description?: string;
  className?: string;
}

export function SparklineCard({
  title,
  value,
  data,
  color = '#6366f1',
  trend = 'neutral',
  format = 'number',
  description,
  className,
}: SparklineCardProps) {
  const formattedValue = format === 'currency' 
    ? formatCurrency(value) 
    : format === 'percent' 
      ? formatPercent(value) 
      : formatCompactNumber(value);

  const height = 60;
  const width = 100;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const trendColor = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#64748b';
  const TrendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--vi-color-text-primary)' }}>
            {formattedValue}
          </span>
          {trend !== 'neutral' && (
            <span style={{ color: trendColor, fontSize: '14px', fontWeight: 500 }}>
              {TrendIcon}
            </span>
          )}
        </div>
        <div style={{ width: '100%', height: '60px', marginTop: '8px' }}>
          <svg viewBox={`0 -5 ${width} ${height + 10}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={points}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    </WidgetCard>
  );
}
