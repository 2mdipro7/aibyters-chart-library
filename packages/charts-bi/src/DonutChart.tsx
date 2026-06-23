import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface DonutChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

export function DonutChart({
  title,
  description,
  data,
  dataKey,
  nameKey,
  colors = defaultColors,
  centerLabel,
  centerValue,
  className
}: DonutChartProps) {
  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300, position: 'relative' }}>
        {(centerLabel || centerValue) && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            {centerValue && (
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--vi-color-text-primary)',
                lineHeight: 1.2
              }}>
                {centerValue}
              </div>
            )}
            {centerLabel && (
              <div style={{
                fontSize: '12px',
                color: 'var(--vi-color-text-secondary)',
                marginTop: '4px'
              }}>
                {centerLabel}
              </div>
            )}
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
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
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
