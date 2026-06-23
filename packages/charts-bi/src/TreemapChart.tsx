import React from "react";
import {
  Treemap,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface TreemapChartProps {
  title: string;
  description?: string;
  data: Array<{ name: string; value: number; children?: any[] }>;
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

function CustomizedContent(props: any) {
  const { root, depth, x, y, width, height, index, colors, name } = props;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : "none",
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10)
        }}
        fill={colors[index % colors.length]}
      />
      {width > 40 && height > 20 ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={14}
          dominantBaseline="central"
          style={{ pointerEvents: 'none' }}
        >
          {name}
        </text>
      ) : null}
    </g>
  );
}

export function TreemapChart({
  title,
  description,
  data,
  colors = defaultColors,
  className
}: TreemapChartProps) {
  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="value"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent colors={colors} />}
          >
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
          </Treemap>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
