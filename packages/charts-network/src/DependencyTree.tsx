import { useMemo } from "react";
import { WidgetCard } from "@aibyters/layout";

export interface DependencyTreeProps {
  title: string;
  description?: string;
  data: { name: string; children?: any[] };
  orientation?: 'vertical' | 'horizontal';
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

interface TreeNode {
  name: string;
  depth: number;
  x: number;
  y: number;
  children?: TreeNode[];
}

export function DependencyTree({
  title,
  description,
  data,
  orientation = 'horizontal',
  colors = defaultColors,
  ...props
}: DependencyTreeProps) {

  const width = 800;
  const height = 400;

  // Simple layout computation
  const rootNode = useMemo(() => {
    // 1. Calculate max depth and node counts per depth
    const nodesByDepth: Record<number, any[]> = {};
    let maxDepth = 0;
    
    const assignDepth = (node: any, depth: number) => {
      if (!nodesByDepth[depth]) nodesByDepth[depth] = [];
      nodesByDepth[depth].push(node);
      if (depth > maxDepth) maxDepth = depth;
      if (node.children) {
        node.children.forEach((c: any) => assignDepth(c, depth + 1));
      }
    };
    
    assignDepth(data, 0);

    // 2. Assign positions
    const buildTree = (node: any, depth: number, indexInLevel: number, totalInLevel: number): TreeNode => {
      // Calculate x, y based on orientation
      let x, y;
      if (orientation === 'horizontal') {
        const xStep = width / (maxDepth + 1);
        x = xStep * depth + xStep / 2;
        const yStep = height / totalInLevel;
        y = yStep * indexInLevel + yStep / 2;
      } else {
        const yStep = height / (maxDepth + 1);
        y = yStep * depth + yStep / 2;
        const xStep = width / totalInLevel;
        x = xStep * indexInLevel + xStep / 2;
      }

      let builtChildren: TreeNode[] | undefined;
      if (node.children) {
        builtChildren = node.children.map((c: any) => {
          // find this child's index in the global depth list
          const childLevelList = nodesByDepth[depth + 1];
          const childGlobalIndex = childLevelList.findIndex(x => x === c);
          return buildTree(c, depth + 1, childGlobalIndex, childLevelList.length);
        });
      }

      return {
        name: node.name,
        depth,
        x,
        y,
        children: builtChildren
      };
    };

    return buildTree(data, 0, 0, 1);
  }, [data, orientation, width, height]);

  // Flatten for rendering
  const nodes: TreeNode[] = [];
  const edges: { source: TreeNode, target: TreeNode }[] = [];

  const traverse = (node: TreeNode) => {
    nodes.push(node);
    if (node.children) {
      node.children.forEach(c => {
        edges.push({ source: node, target: c });
        traverse(c);
      });
    }
  };
  traverse(rootNode);

  const getPath = (source: TreeNode, target: TreeNode) => {
    if (orientation === 'horizontal') {
      // Cubic bezier
      return `M ${source.x} ${source.y} C ${(source.x + target.x) / 2} ${source.y}, ${(source.x + target.x) / 2} ${target.y}, ${target.x} ${target.y}`;
    } else {
      return `M ${source.x} ${source.y} C ${source.x} ${(source.y + target.y) / 2}, ${target.x} ${(source.y + target.y) / 2}, ${target.x} ${target.y}`;
    }
  };

  return (
    <WidgetCard title={title} description={description} className={props.className}>
      <div style={{ width: '100%', height: 300, overflow: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', minWidth: 600 }}>
          {edges.map((edge, i) => (
            <path
              key={`edge-${i}`}
              d={getPath(edge.source, edge.target)}
              fill="none"
              stroke="var(--vi-color-surface-border)"
              strokeWidth={1.5}
            />
          ))}
          {nodes.map((node, i) => (
            <g key={`node-${i}`} transform={`translate(${node.x},${node.y})`}>
              <circle
                r={6}
                fill={colors[node.depth % colors.length]}
                stroke="var(--vi-color-surface-card)"
                strokeWidth={2}
              />
              <text
                x={orientation === 'horizontal' ? (node.children ? -10 : 10) : 0}
                y={orientation === 'horizontal' ? 4 : (node.children ? -12 : 16)}
                textAnchor={orientation === 'horizontal' ? (node.children ? 'end' : 'start') : 'middle'}
                fontSize={12}
                fill="var(--vi-color-text-primary)"
              >
                {node.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </WidgetCard>
  );
}
