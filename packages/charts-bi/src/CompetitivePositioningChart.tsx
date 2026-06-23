import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from "recharts";
import { WidgetCard } from "@aibyters/layout";

export interface CompetitivePositioningChartProps {
  title: string;
  description?: string;
  data: Array<{
    name: string;
    x: number;
    y: number;
    z?: number;
    fill?: string;
  }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  quadrantLabels?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
  };
  className?: string;
}

export function CompetitivePositioningChart({
  title,
  description,
  data,
  xAxisLabel = "Completeness of Vision",
  yAxisLabel = "Ability to Execute",
  quadrantLabels = {
    topLeft: "Challengers",
    topRight: "Leaders",
    bottomLeft: "Niche Players",
    bottomRight: "Visionaries"
  },
  className
}: CompetitivePositioningChartProps) {
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: "var(--vi-color-surface-card)",
          borderColor: "var(--vi-color-surface-border)",
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: "8px",
          padding: "8px 12px",
          color: "var(--vi-color-text-primary)",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
        }}>
          <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>{data.name}</p>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--vi-color-text-secondary)" }}>
            {xAxisLabel}: {data.x}
          </p>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--vi-color-text-secondary)" }}>
            {yAxisLabel}: {data.y}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: "100%", height: 350, position: "relative" }}>
        {/* Quadrant Labels */}
        <div style={{ position: "absolute", top: 10, left: 20, fontSize: 12, fontWeight: 600, color: "var(--vi-color-text-tertiary)", opacity: 0.5, pointerEvents: "none" }}>{quadrantLabels.topLeft}</div>
        <div style={{ position: "absolute", top: 10, right: 20, fontSize: 12, fontWeight: 600, color: "var(--vi-color-text-tertiary)", opacity: 0.5, pointerEvents: "none" }}>{quadrantLabels.topRight}</div>
        <div style={{ position: "absolute", bottom: 40, left: 20, fontSize: 12, fontWeight: 600, color: "var(--vi-color-text-tertiary)", opacity: 0.5, pointerEvents: "none" }}>{quadrantLabels.bottomLeft}</div>
        <div style={{ position: "absolute", bottom: 40, right: 20, fontSize: 12, fontWeight: 600, color: "var(--vi-color-text-tertiary)", opacity: 0.5, pointerEvents: "none" }}>{quadrantLabels.bottomRight}</div>

        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--vi-color-surface-borderLight)" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name={xAxisLabel} 
              domain={[0, 100]} 
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 11 }}
              axisLine={{ stroke: "var(--vi-color-surface-border)" }}
              tickLine={false}
              label={{ value: xAxisLabel, position: "bottom", fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={yAxisLabel} 
              domain={[0, 100]} 
              tick={{ fill: "var(--vi-color-text-secondary)", fontSize: 11 }}
              axisLine={{ stroke: "var(--vi-color-surface-border)" }}
              tickLine={false}
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft", fill: "var(--vi-color-text-secondary)", fontSize: 12 }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 500]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
            
            {/* Crosshairs */}
            <ReferenceLine x={50} stroke="var(--vi-color-surface-border)" strokeWidth={2} />
            <ReferenceLine y={50} stroke="var(--vi-color-surface-border)" strokeWidth={2} />

            <Scatter name="Competitors" data={data}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || "var(--vi-color-primary)"} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
