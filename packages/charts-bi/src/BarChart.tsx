import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface BarChartProps {
  title: string;
  description?: string;
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  stacked?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

const defaultColors = [
  "#6366f1",  // indigo
  "#06b6d4",  // cyan
  "#22c55e",  // green
  "#f59e0b",  // amber
  "#ef4444"   // red
];

export function BarChart({
  title,
  description,
  data,
  index,
  categories,
  colors = defaultColors,
  stacked = false,
  valueFormatter = formatCompactNumber,
  className
}: BarChartProps) {
  return (
    <WidgetCard title={title} description={description} className={className}>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart layout="vertical" data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={false} 
              stroke="var(--vi-color-surface-borderLight)" 
            />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
              tickFormatter={valueFormatter}
            />
            <YAxis 
              type="category"
              dataKey={index} 
              axisLine={false}
              tickLine={false}
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
              cursor={{ fill: "var(--vi-color-surface-cardHover)" }}
              formatter={(value: any, name: any) => [valueFormatter(value as number), name]}
            />
            <Legend 
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px", fontSize: "14px", color: "var(--vi-color-text-secondary)" }}
            />
            {categories.map((category, i) => (
              <Bar
                key={category}
                dataKey={category}
                fill={colors[i % colors.length]}
                stackId={stacked ? "a" : undefined}
                radius={stacked ? [0, 0, 0, 0] : [0, 4, 4, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
