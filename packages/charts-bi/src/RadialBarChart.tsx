import React from "react";
import {
  RadialBarChart as RechartsRadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface RadialBarChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

export function RadialBarChart({
  title,
  description,
  data,
  dataKey,
  nameKey,
  colors = defaultColors,
  className
}: RadialBarChartProps) {
  const mappedData = data.map((d, i) => ({
    ...d,
    fill: colors[i % colors.length]
  }));

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={10} data={mappedData}>
            <RadialBar
              label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
              background
              dataKey={dataKey}
            />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              wrapperStyle={{ top: 0, right: 0, lineHeight: '24px', fontSize: "14px", color: "var(--vi-color-text-secondary)" }}
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
              formatter={(value: any, name: any) => [formatCompactNumber(value as number), name]}
            />
          </RechartsRadialBarChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
