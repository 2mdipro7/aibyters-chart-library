import React from "react";
import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface RadarChartProps {
  title: string;
  description?: string;
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

export function RadarChart({
  title,
  description,
  data,
  index,
  categories,
  colors = defaultColors,
  className
}: RadarChartProps) {
  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="var(--vi-color-surface-border)" />
            <PolarAngleAxis
              dataKey={index}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 10 }}
              axisLine={false}
            />
            {categories.map((category, i) => (
              <Radar
                key={category}
                name={category}
                dataKey={category}
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--vi-color-surface-card)",
                borderColor: "var(--vi-color-surface-border)",
                borderRadius: "8px",
                color: "var(--vi-color-text-primary)",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
              }}
              itemStyle={{ color: "var(--vi-color-text-primary)" }}
              formatter={(value: any, name: any) => [formatCompactNumber(value as number), name]}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px", fontSize: "14px", color: "var(--vi-color-text-secondary)" }}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
