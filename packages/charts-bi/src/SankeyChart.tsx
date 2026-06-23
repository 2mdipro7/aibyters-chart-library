import React from "react";
import {
  Sankey,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";

export interface SankeyChartProps {
  title: string;
  description?: string;
  nodes: Array<{ name: string }>;
  links: Array<{ source: number; target: number; value: number }>;
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

export function SankeyChart({
  title,
  description,
  nodes,
  links,
  colors = defaultColors,
  className
}: SankeyChartProps) {
  const data = { nodes, links };
  return (
    <WidgetCard title={title} description={description} className={className}>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={data}
            nodePadding={50}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            link={{ stroke: 'var(--vi-color-surface-borderLight)' }}
            node={{ fill: colors[0] }}
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
          </Sankey>
        </ResponsiveContainer>
      </div>
    </WidgetCard>
  );
}
