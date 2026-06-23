import React from "react";
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface ScatterChartProps {
  title: string;
  description?: string;
  data: any[];
  xKey: string;
  yKey: string;
  nameKey?: string;
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

export function ScatterChart({
  title,
  description,
  data,
  xKey,
  yKey,
  nameKey,
  colors = defaultColors,
  className
}: ScatterChartProps) {
  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsScatterChart margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--vi-color-surface-borderLight)"
            />
            <XAxis
              dataKey={xKey}
              type="number"
              name={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
              tickFormatter={formatCompactNumber}
            />
            <YAxis
              dataKey={yKey}
              type="number"
              name={yKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
              tickFormatter={formatCompactNumber}
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
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value: any, name: any) => [formatCompactNumber(value as number), name]}
            />
            <Scatter
              name={nameKey || title}
              data={data}
              fill={colors[0]}
              strokeWidth={1}
              stroke={colors[0]}
              fillOpacity={0.7}
            />
          </RechartsScatterChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
