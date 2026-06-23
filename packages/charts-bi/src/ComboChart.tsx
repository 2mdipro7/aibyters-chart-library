import React from "react";
import {
  ComposedChart,
  Line,
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

export interface ComboChartProps {
  title: string;
  description?: string;
  data: any[];
  index: string;
  barCategories: string[];
  lineCategories: string[];
  colors?: string[];
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

export function ComboChart({
  title,
  description,
  data,
  index,
  barCategories,
  lineCategories,
  colors = defaultColors,
  valueFormatter = formatCompactNumber,
  className
}: ComboChartProps) {
  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="var(--vi-color-surface-borderLight)" 
            />
            <XAxis 
              dataKey={index} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
              tickFormatter={valueFormatter}
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
            {barCategories.map((category, i) => (
              <Bar
                key={category}
                dataKey={category}
                fill={colors[i % colors.length]}
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            ))}
            {lineCategories.map((category, i) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={colors[(i + barCategories.length) % colors.length]}
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
