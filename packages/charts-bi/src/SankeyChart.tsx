import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from "recharts";
import { ChartCard } from "@aibyters/layout";
import { chartVars, rechartsTooltip, resolveColors, truncateToWidth, type BaseChartProps, type ChartContextValue } from "@aibyters/core";
import { DEFAULT_FORMATTER, animationProps, splitCardProps, type CardKey } from "./internal/cartesian";

export interface SankeyChartProps extends BaseChartProps {
  nodes: Array<{ name: string }>;
  links: Array<{ source: number; target: number; value: number }>;
  /** Space between nodes in px. Default 24 (auto-reduced on small screens). */
  nodePadding?: number;
}

export function SankeyChart(props: SankeyChartProps) {
  const [card, plot] = splitCardProps(props);
  const empty = !props.nodes?.length || !props.links?.length;
  return (
    <ChartCard {...card} legend={false} isEmpty={empty} exportData={props.exportData ?? props.links.map((l) => ({ source: props.nodes[l.source]?.name, target: props.nodes[l.target]?.name, value: l.value }))}>
      {(ctx) => <SankeyPlot ctx={ctx} {...plot} />}
    </ChartCard>
  );
}

function SankeyPlot({ ctx, nodes, links, colors, valueFormatter = DEFAULT_FORMATTER, nodePadding }: Omit<SankeyChartProps, CardKey> & { ctx: ChartContextValue }) {
  const palette = resolveColors(colors, nodes.length);
  const fs = ctx.settings.fontSize;
  const w = ctx.width || 400;
  const labelRoom = Math.min(120, w * 0.22);
  const Node = (p: any) => {
    const { x, y, width, height, index, payload, containerWidth } = p;
    const isRight = x + width + 6 > containerWidth - labelRoom;
    const label = truncateToWidth(String(payload.name), labelRoom - 8, fs);
    const showLabel = height >= fs * 0.8;
    return (
      <Layer key={`node-${index}`}>
        <Rectangle x={x} y={y} width={width} height={height} fill={palette[index % palette.length]} fillOpacity={0.95} radius={2} />
        {showLabel && (
          <text x={isRight ? x - 6 : x + width + 6} y={y + height / 2} textAnchor={isRight ? "end" : "start"} dominantBaseline="central" fontSize={fs} fill={chartVars.textPrimary} fontFamily={chartVars.fontBody}>
            {label}
            <title>{`${payload.name}: ${valueFormatter(payload.value)}`}</title>
          </text>
        )}
      </Layer>
    );
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <Sankey
        data={{ nodes, links }}
        nodePadding={nodePadding ?? (ctx.settings.breakpoint === "xs" ? 12 : 24)}
        nodeWidth={ctx.settings.breakpoint === "xs" ? 8 : 12}
        margin={{ top: 6, right: labelRoom, bottom: 6, left: 6 }}
        link={{ stroke: chartVars.textMuted, strokeOpacity: 0.25 }}
        node={<Node />}
        {...animationProps(ctx)}
      >
        <Tooltip content={rechartsTooltip({ valueFormatter })} />
      </Sankey>
    </ResponsiveContainer>
  );
}
