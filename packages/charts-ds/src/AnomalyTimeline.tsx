import React from "react";
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface AnomalyTimelineProps {
  title: string;
  description?: string;
  data: any[];
  index: string;
  valueKey: string;
  anomalyKey: string;
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

export function AnomalyTimeline({
  title,
  description,
  data,
  index,
  valueKey,
  anomalyKey,
  colors = defaultColors,
  valueFormatter = formatCompactNumber,
  className
}: AnomalyTimelineProps) {
  // Extract anomalies to a separate key that only exists when an anomaly is present
  const transformedData = data.map(item => ({
    ...item,
    _anomalyMarker: item[anomalyKey] ? item[valueKey] : null
  }));

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={transformedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              formatter={(value: any, name: string) => {
                if (name === "_anomalyMarker") return [valueFormatter(value as number), "Anomaly Detected"];
                return [valueFormatter(value as number), name];
              }}
            />
            <Legend 
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px", fontSize: "14px", color: "var(--vi-color-text-secondary)" }}
            />
            <Line
              type="monotone"
              dataKey={valueKey}
              stroke={colors[0]}
              strokeWidth={2}
              dot={false}
              name="Metric Value"
            />
            <Scatter 
              name="Anomalies" 
              dataKey="_anomalyMarker" 
              fill={colors[1]} 
              shape="circle" 
              r={6} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
