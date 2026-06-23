import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import { WidgetCard } from '@aibyters/layout';
import { formatCompactNumber } from '@aibyters/spec';

export interface VolcanoPlotDataPoint {
  id: string;
  x: number; // Log2 Fold Change
  y: number; // -Log10 Adjusted P-value
  name?: string;
  [key: string]: any;
}

export interface VolcanoPlotProps {
  title: string;
  description?: string;
  data: VolcanoPlotDataPoint[];
  pThreshold?: number; // e.g., 1.3 for p=0.05 (-log10(0.05))
  fcThreshold?: number; // e.g., 1.0 for Log2FC = 1 (2-fold change)
  colors?: {
    up: string;
    down: string;
    ns: string;
  };
  xAxisLabel?: string;
  yAxisLabel?: string;
  className?: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'var(--vi-color-surface-card)',
        border: '1px solid var(--vi-color-surface-borderLight)',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{ fontWeight: 600, margin: '0 0 8px 0', color: 'var(--vi-color-text-primary)' }}>
          {data.name || data.id}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span style={{ color: 'var(--vi-color-text-secondary)' }}>Log2 FC:</span>
            <span style={{ fontWeight: 500, color: 'var(--vi-color-text-primary)' }}>{data.x.toFixed(3)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span style={{ color: 'var(--vi-color-text-secondary)' }}>-Log10 P-val:</span>
            <span style={{ fontWeight: 500, color: 'var(--vi-color-text-primary)' }}>{data.y.toFixed(3)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function VolcanoPlot({
  title,
  description,
  data,
  pThreshold = 1.3,
  fcThreshold = 1.0,
  colors = { up: '#ef4444', down: '#3b82f6', ns: '#9ca3af' },
  xAxisLabel = 'Log2 Fold Change',
  yAxisLabel = '-Log10 Adjusted P-value',
  className
}: VolcanoPlotProps) {

  const { upData, downData, nsData } = useMemo(() => {
    const up: VolcanoPlotDataPoint[] = [];
    const down: VolcanoPlotDataPoint[] = [];
    const ns: VolcanoPlotDataPoint[] = [];

    data.forEach(point => {
      if (point.y >= pThreshold && point.x >= fcThreshold) {
        up.push(point);
      } else if (point.y >= pThreshold && point.x <= -fcThreshold) {
        down.push(point);
      } else {
        ns.push(point);
      }
    });

    return { upData: up, downData: down, nsData: ns };
  }, [data, pThreshold, fcThreshold]);

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--vi-color-surface-borderLight)" vertical={false} />
            
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Log2 Fold Change" 
              stroke="var(--vi-color-text-tertiary)"
              tick={{ fill: 'var(--vi-color-text-secondary)', fontSize: 12 }}
              label={{ value: xAxisLabel, position: 'bottom', fill: 'var(--vi-color-text-secondary)', fontSize: 13, offset: 0 }}
            />
            
            <YAxis 
              type="number" 
              dataKey="y" 
              name="-Log10 P-value" 
              stroke="var(--vi-color-text-tertiary)"
              tick={{ fill: 'var(--vi-color-text-secondary)', fontSize: 12 }}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'var(--vi-color-text-secondary)', fontSize: 13 }}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: '3 3', stroke: 'var(--vi-color-surface-border)' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />

            <ReferenceLine x={-fcThreshold} stroke="var(--vi-color-surface-border)" strokeDasharray="3 3" />
            <ReferenceLine x={fcThreshold} stroke="var(--vi-color-surface-border)" strokeDasharray="3 3" />
            <ReferenceLine y={pThreshold} stroke="var(--vi-color-surface-border)" strokeDasharray="3 3" />

            <Scatter name="Down" data={downData} fill={colors.down} line={false} shape="circle" />
            <Scatter name="NS" data={nsData} fill={colors.ns} fillOpacity={0.5} line={false} shape="circle" />
            <Scatter name="Up" data={upData} fill={colors.up} line={false} shape="circle" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
