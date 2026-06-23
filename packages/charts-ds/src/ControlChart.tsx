import React from 'react';
import { ComposedChart, Line, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Scatter } from 'recharts';
import { WidgetCard } from '@aibyters/layout';
import { formatCompactNumber } from '@aibyters/spec';

export interface ControlChartProps {
  title: string;
  description?: string;
  data: any[];
  index: string;
  valueKey: string;
  ucl: number;
  lcl: number;
  mean: number;
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

export function ControlChart({
  title,
  description,
  data,
  index,
  valueKey,
  ucl,
  lcl,
  mean,
  className
}: ControlChartProps) {
  
  const processedData = data.map(d => ({
    ...d,
    isOutlier: d[valueKey] > ucl || d[valueKey] < lcl,
    outlierValue: (d[valueKey] > ucl || d[valueKey] < lcl) ? d[valueKey] : null
  }));

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--vi-color-surface-border)" />
            <XAxis 
              dataKey={index} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
              tickFormatter={formatCompactNumber}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "var(--vi-color-surface-card)",
                borderColor: "var(--vi-color-surface-border)",
                borderRadius: "8px",
                color: "var(--vi-color-text-primary)",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
              }}
              itemStyle={{ color: "var(--vi-color-text-primary)" }}
            />
            <Line 
              type="monotone" 
              dataKey={valueKey} 
              stroke={defaultColors[0]} 
              strokeWidth={2}
              dot={{ r: 3, fill: defaultColors[0], strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
            <Scatter 
              dataKey="outlierValue" 
              fill={defaultColors[4]} 
              isAnimationActive={false}
            />
            
            <ReferenceLine y={ucl} stroke={defaultColors[4]} strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'UCL', fill: defaultColors[4], fontSize: 12 }} />
            <ReferenceLine y={mean} stroke={defaultColors[1]} strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Mean', fill: defaultColors[1], fontSize: 12 }} />
            <ReferenceLine y={lcl} stroke={defaultColors[4]} strokeDasharray="3 3" label={{ position: 'insideBottomLeft', value: 'LCL', fill: defaultColors[4], fontSize: 12 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
