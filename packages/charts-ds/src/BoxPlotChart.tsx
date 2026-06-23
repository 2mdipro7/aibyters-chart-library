import React, { useMemo } from 'react';
import { WidgetCard } from '@aibyters/layout';

export interface BoxPlotChartProps {
  title: string;
  description?: string;
  data: Array<{ label: string; values: number[] }>;
  color?: string;
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

function getPercentile(sortedValues: number[], percentile: number) {
  const index = (percentile / 100) * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (upper >= sortedValues.length) return sortedValues[lower];
  return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
}

export function BoxPlotChart({
  title,
  description,
  data,
  color = defaultColors[0],
  className
}: BoxPlotChartProps) {
  const processedData = useMemo(() => {
    return data.map(group => {
      const sorted = [...group.values].sort((a, b) => a - b);
      if (sorted.length === 0) return { label: group.label, min: 0, q1: 0, median: 0, q3: 0, max: 0, outliers: [] };
      
      const q1 = getPercentile(sorted, 25);
      const median = getPercentile(sorted, 50);
      const q3 = getPercentile(sorted, 75);
      const iqr = q3 - q1;
      
      const lowerFence = q1 - 1.5 * iqr;
      const upperFence = q3 + 1.5 * iqr;
      
      const nonOutliers = sorted.filter(v => v >= lowerFence && v <= upperFence);
      const min = nonOutliers.length > 0 ? Math.min(...nonOutliers) : lowerFence;
      const max = nonOutliers.length > 0 ? Math.max(...nonOutliers) : upperFence;
      
      const outliers = sorted.filter(v => v < lowerFence || v > upperFence);
      
      return { label: group.label, min, q1, median, q3, max, outliers };
    });
  }, [data]);

  const globalMin = Math.min(...processedData.map(d => Math.min(d.min, ...d.outliers)));
  const globalMax = Math.max(...processedData.map(d => Math.max(d.max, ...d.outliers)));
  const range = globalMax - globalMin || 1;
  const padding = range * 0.1;
  const yMin = globalMin - padding;
  const yMax = globalMax + padding;

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            {processedData.map((d, i) => {
              const groupWidth = 100 / processedData.length;
              const xCenter = i * groupWidth + groupWidth / 2;
              const boxWidth = groupWidth * 0.5;
              const xStart = xCenter - boxWidth / 2;

              const scaleY = (val: number) => 100 - ((val - yMin) / (yMax - yMin)) * 100;
              
              const minH = scaleY(d.min);
              const q1H = scaleY(d.q1);
              const medianH = scaleY(d.median);
              const q3H = scaleY(d.q3);
              const maxH = scaleY(d.max);

              return (
                <g key={d.label}>
                  <line x1={xCenter} y1={maxH} x2={xCenter} y2={q3H} stroke="var(--vi-color-text-secondary)" strokeWidth="0.5" />
                  <line x1={xCenter} y1={minH} x2={xCenter} y2={q1H} stroke="var(--vi-color-text-secondary)" strokeWidth="0.5" />
                  
                  <line x1={xCenter - boxWidth/4} y1={maxH} x2={xCenter + boxWidth/4} y2={maxH} stroke="var(--vi-color-text-secondary)" strokeWidth="0.5" />
                  <line x1={xCenter - boxWidth/4} y1={minH} x2={xCenter + boxWidth/4} y2={minH} stroke="var(--vi-color-text-secondary)" strokeWidth="0.5" />
                  
                  <rect 
                    x={xStart} 
                    y={q3H} 
                    width={boxWidth} 
                    height={Math.max(q1H - q3H, 0.1)} 
                    fill={`${color}40`} 
                    stroke={color}
                    strokeWidth="0.5" 
                  />
                  
                  <line x1={xStart} y1={medianH} x2={xStart + boxWidth} y2={medianH} stroke={color} strokeWidth="1" />
                  
                  {d.outliers.map((o, oi) => (
                    <circle key={oi} cx={xCenter} cy={scaleY(o)} r="0.8" fill={color} />
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{ display: 'flex', width: '100%', height: '24px' }}>
          {processedData.map(d => (
            <div key={d.label} style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: 'var(--vi-color-text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {d.label}
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}
