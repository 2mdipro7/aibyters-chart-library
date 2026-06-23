import React from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface ForecastBandProps {
  title: string;
  description?: string;
  data: any[];
  index: string;
  actualKey: string;
  forecastKey: string;
  lowerBandKey: string;
  upperBandKey: string;
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

export function ForecastBand({
  title,
  description,
  data,
  index,
  actualKey,
  forecastKey,
  lowerBandKey,
  upperBandKey,
  colors = defaultColors,
  valueFormatter = formatCompactNumber,
  className
}: ForecastBandProps) {
  // Transform data to support confidence interval Area
  const transformedData = data.map(item => ({
    ...item,
    [actualKey]: item[actualKey],
    [forecastKey]: item[forecastKey],
    _confidenceBand: item[lowerBandKey] && item[upperBandKey] ? [item[lowerBandKey], item[upperBandKey]] : null
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
                if (name === "_confidenceBand") return null;
                return [valueFormatter(value as number), name];
              }}
            />
            <Legend 
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px", fontSize: "14px", color: "var(--vi-color-text-secondary)" }}
            />
            <Area 
              type="monotone" 
              dataKey="_confidenceBand" 
              fill={colors[1]} 
              stroke="none" 
              fillOpacity={0.15} 
              name="Confidence Interval"
            />
            <Line
              type="monotone"
              dataKey={actualKey}
              stroke={colors[0]}
              strokeWidth={3}
              dot={false}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey={forecastKey}
              stroke={colors[1]}
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={false}
              name="Forecast"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
