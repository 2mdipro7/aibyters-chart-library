import React, { useMemo } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { WidgetCard } from '@aibyters/layout';
import { formatCompactNumber } from '@aibyters/spec';

export interface WaterfallChartProps {
  title: string;
  description?: string;
  data: Array<{ name: string; value: number }>;
  colors?: { increase: string; decrease: string; total: string };
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function WaterfallChart({
  title,
  description,
  data,
  colors = { increase: '#22c55e', decrease: '#ef4444', total: '#6366f1' },
  valueFormatter = formatCompactNumber,
  className
}: WaterfallChartProps) {
  
  const rechartsData = useMemo(() => {
    let runningTotal = 0;
    return data.map((item, index) => {
      const isTotal = index === data.length - 1 && item.name.toLowerCase() === 'total';
      
      if (isTotal) {
        return {
          name: item.name,
          base: 0,
          valueBar: item.value,
          actualValue: item.value,
          color: colors.total,
        };
      }
      
      const start = runningTotal;
      const end = start + item.value;
      runningTotal = end;
      
      const base = Math.min(start, end);
      const valueBar = Math.abs(item.value);
      
      return {
        name: item.name,
        base: base,
        valueBar: valueBar,
        actualValue: item.value,
        color: item.value >= 0 ? colors.increase : colors.decrease,
      };
    });
  }, [data, colors]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'var(--vi-color-surface-card)',
          borderColor: 'var(--vi-color-surface-border)',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: '8px',
          padding: '8px 12px',
          color: 'var(--vi-color-text-primary)',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
        }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: 500 }}>{label}</p>
          <p style={{ margin: 0, color: data.color }}>
            Value: {valueFormatter(data.actualValue)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={rechartsData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--vi-color-surface-border)" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
              tickFormatter={valueFormatter}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="base" stackId="a" fill="transparent" />
            <Bar dataKey="valueBar" stackId="a" radius={[4, 4, 4, 4]}>
              {rechartsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
