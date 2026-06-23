import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface StackedAreaChartProps {
  title: string;
  description?: string;
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

export function StackedAreaChart({
  title,
  description,
  data,
  index,
  categories,
  colors = defaultColors,
  valueFormatter = formatCompactNumber,
  className
}: StackedAreaChartProps) {
  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--vi-color-surface-borderLight)" vertical={false} />
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
              dx={-10}
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
              formatter={(value: any, name: any) => [valueFormatter(value as number), name]}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px", fontSize: "14px", color: "var(--vi-color-text-secondary)" }}
            />
            {categories.map((category, i) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stackId="1"
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]}
                fillOpacity={0.6}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
