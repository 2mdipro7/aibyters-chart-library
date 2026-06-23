import React, { useMemo } from 'react';
import { WidgetCard } from '@aibyters/layout';

export interface ViolinChartProps {
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

function kernel(u: number) {
  return Math.abs(u) <= 1 ? 0.75 * (1 - u * u) : 0;
}

function computeKDE(data: number[], min: number, max: number, steps: number, bandwidth: number) {
  const stepSize = (max - min) / steps;
  const points = [];
  let maxDensity = 0;
  
  for (let i = 0; i <= steps; i++) {
    const x = min + i * stepSize;
    let sum = 0;
    for (const v of data) {
      sum += kernel((x - v) / bandwidth);
    }
    const density = sum / (data.length * bandwidth);
    points.push({ x, density });
    if (density > maxDensity) maxDensity = density;
  }
  
  return { points, maxDensity };
}

export function ViolinChart({
  title,
  description,
  data,
  color = defaultColors[0],
  className
}: ViolinChartProps) {
  
  const processedData = useMemo(() => {
    let globalMin = Infinity;
    let globalMax = -Infinity;
    
    data.forEach(group => {
      group.values.forEach(v => {
        if (v < globalMin) globalMin = v;
        if (v > globalMax) globalMax = v;
      });
    });
    
    if (globalMin === Infinity) globalMin = 0;
    if (globalMax === -Infinity) globalMax = 1;
    if (globalMin === globalMax) {
      globalMin -= 1;
      globalMax += 1;
    }
    
    const range = globalMax - globalMin;
    const pad = range * 0.1;
    globalMin -= pad;
    globalMax += pad;
    
    const bandwidth = range * 0.15;
    
    let maxGlobalDensity = 0;
    const groups = data.map(group => {
      const { points, maxDensity } = computeKDE(group.values, globalMin, globalMax, 40, bandwidth);
      if (maxDensity > maxGlobalDensity) maxGlobalDensity = maxDensity;
      return { label: group.label, points };
    });
    
    return { groups, globalMin, globalMax, maxGlobalDensity };
  }, [data]);

  const { groups, globalMin, globalMax, maxGlobalDensity } = processedData;

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
            {groups.map((g, i) => {
              const groupWidth = 100 / groups.length;
              const xCenter = i * groupWidth + groupWidth / 2;
              
              const scaleY = (val: number) => 100 - ((val - globalMin) / (globalMax - globalMin)) * 100;
              
              const maxViolinWidth = groupWidth * 0.45; 
              
              let rightPath = "";
              let leftPath = "";
              
              g.points.forEach((p, pi) => {
                const y = scaleY(p.x);
                const xOffset = maxGlobalDensity > 0 ? (p.density / maxGlobalDensity) * maxViolinWidth : 0;
                
                if (pi === 0) {
                  rightPath += `M ${xCenter + xOffset} ${y} `;
                  leftPath += `M ${xCenter - xOffset} ${y} `;
                } else {
                  rightPath += `L ${xCenter + xOffset} ${y} `;
                  leftPath += `L ${xCenter - xOffset} ${y} `;
                }
              });
              
              rightPath += `L ${xCenter} ${scaleY(globalMax)} L ${xCenter} ${scaleY(globalMin)} Z`;
              leftPath += `L ${xCenter} ${scaleY(globalMax)} L ${xCenter} ${scaleY(globalMin)} Z`;

              return (
                <g key={g.label}>
                  <path d={rightPath} fill={`${color}80`} stroke={color} strokeWidth="0.5" />
                  <path d={leftPath} fill={`${color}80`} stroke={color} strokeWidth="0.5" />
                  <line x1={xCenter} y1={0} x2={xCenter} y2={100} stroke="var(--vi-color-surface-border)" strokeDasharray="1 1" strokeWidth="0.5" />
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{ display: 'flex', width: '100%', height: '24px' }}>
          {groups.map(g => (
            <div key={g.label} style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: 'var(--vi-color-text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {g.label}
            </div>
          ))}
        </div>
      </div>
    </WidgetCard>
  );
}
