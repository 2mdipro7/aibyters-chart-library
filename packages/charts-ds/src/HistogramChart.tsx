import React, { useMemo } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { WidgetCard } from '@aibyters/layout';
import { formatCompactNumber } from '@aibyters/spec';

export interface HistogramChartProps {
  title: string;
  description?: string;
  data: number[];
  bins?: number;
  color?: string;
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

export function HistogramChart({
  title,
  description,
  data,
  bins = 10,
  color = defaultColors[0],
  className
}: HistogramChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    
    if (min === max) {
      return [{ binLabel: `${min}`, count: data.length }];
    }
    
    const binSize = (max - min) / bins;
    const counts = new Array(bins).fill(0);
    
    data.forEach(val => {
      let index = Math.floor((val - min) / binSize);
      if (index === bins) index--; // Put max value in last bin
      counts[index]++;
    });
    
    return counts.map((count, i) => {
      const binMin = min + i * binSize;
      const binMax = min + (i + 1) * binSize;
      const label = `${Math.round(binMin * 10) / 10} - ${Math.round(binMax * 10) / 10}`;
      return { binLabel: label, count };
    });
  }, [data, bins]);

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--vi-color-surface-border)" />
            <XAxis 
              dataKey="binLabel" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
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
              cursor={{ fill: "var(--vi-color-surface-hover)" }}
            />
            <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
