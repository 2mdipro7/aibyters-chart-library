import { Treemap, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { chartVars, labelFits, rechartsTooltip, resolveColors, truncateToWidth, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, splitCardProps, type CardKey } from "./internal/cartesian";

export interface TreemapNode {
  name: string;
  value?: number;
  children?: TreemapNode[];
}

export interface TreemapChartProps extends BaseChartProps {
  data: TreemapNode[];
  /** Show the value under the name when it fits. Default true. */
  showValues?: boolean;
  onNodeClick?: (node: TreemapNode) => void;
}

export function TreemapChart(props: TreemapChartProps) {
  const [card, plot] = splitCardProps(props);
  return (
    <ChartCard {...card} legend={false} isEmpty={!props.data || props.data.length === 0} exportData={props.exportData ?? props.data.map((d) => ({ name: d.name, value: d.value ?? sum(d) }))}>
      {(ctx) => <TreemapPlot ctx={ctx} {...plot} />}
    </ChartCard>
  );
}

function sum(n: TreemapNode): number {
  return n.value ?? (n.children ?? []).reduce((a, c) => a + sum(c), 0);
}

function TreemapPlot({ ctx, data, colors, valueFormatter = DEFAULT_FORMATTER, showValues = true, onNodeClick }: Omit<TreemapChartProps, CardKey> & { ctx: ChartContextValue }) {
  const palette = resolveColors(colors, Math.max(1, data.length));
  const fs = ctx.settings.fontSize;
  const Content = (p: any) => {
    const { x, y, width, height, name, value, depth, root, index } = p;
    if (width <= 0 || height <= 0) return null;
    const topIndex = depth <= 1 ? index : (root?.children ?? []).findIndex((c: any) => c.name === (p.parent?.name ?? name));
    const fill = palette[(topIndex >= 0 ? topIndex : index) % palette.length];
    const label = truncateToWidth(String(name ?? ""), width - 8, fs);
    const val = valueFormatter(Number(value) || 0);
    const showName = labelFits(label, width, height, fs, 4);
    const showVal = showValues && showName && labelFits(val, width, height - fs - 6, fs - 1, 4);
    return (
      <g onClick={() => onNodeClick?.({ name, value })} style={{ cursor: onNodeClick ? "pointer" : "default" }}>
        <rect x={x} y={y} width={width} height={height} rx={2} fill={fill} fillOpacity={depth > 1 ? 0.75 : 1} stroke="var(--vi-color-surface-card)" strokeWidth={depth > 1 ? 1 : 2} />
        {showName && (
          <text x={x + width / 2} y={y + height / 2 - (showVal ? fs * 0.6 : 0)} textAnchor="middle" dominantBaseline="central" fontSize={fs} fill="#fff" fontFamily={chartVars.fontBody} style={{ pointerEvents: "none", paintOrder: "stroke", stroke: "rgba(0,0,0,0.3)", strokeWidth: 2 }}>
            {label}
          </text>
        )}
        {showVal && (
          <text x={x + width / 2} y={y + height / 2 + fs * 0.7} textAnchor="middle" dominantBaseline="central" fontSize={fs - 1} fill="#fff" fillOpacity={0.85} fontFamily={chartVars.fontBody} style={{ pointerEvents: "none" }}>
            {val}
          </text>
        )}
      </g>
    );
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap data={data as any} dataKey="value" nameKey="name" aspectRatio={4 / 3} content={<Content />} {...animationProps(ctx)}>
        <Tooltip content={rechartsTooltip({ valueFormatter })} />
      </Treemap>
    </ResponsiveContainer>
  );
}
