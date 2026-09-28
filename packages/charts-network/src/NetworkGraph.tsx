import { useEffect, useRef, useState } from "react";
import { WidgetCard } from "@aibyters/layout";

export interface NetworkGraphProps {
  title: string;
  description?: string;
  nodes: Array<{ id: string; label: string; group?: number }>;
  links: Array<{ source: string; target: string; value?: number }>;
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

interface NodeSim {
  id: string;
  label: string;
  group: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function NetworkGraph({
  title,
  description,
  nodes,
  links,
  colors = defaultColors,
  ...props
}: NetworkGraphProps) {
  
  const width = 800;
  const height = 400;
  
  const [simNodes, setSimNodes] = useState<NodeSim[]>([]);
  const reqRef = useRef<number>();

  useEffect(() => {
    // Initialize nodes with random positions
    const initialNodes = nodes.map(n => ({
      ...n,
      group: n.group ?? 0,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100,
      vx: 0,
      vy: 0
    }));

    const simLinks = links.map(l => ({
      ...l,
      sourceIndex: initialNodes.findIndex(n => n.id === l.source),
      targetIndex: initialNodes.findIndex(n => n.id === l.target)
    })).filter(l => l.sourceIndex !== -1 && l.targetIndex !== -1);

    let currentNodes = [...initialNodes];
    let alpha = 1;

    const tick = () => {
      alpha *= 0.95; // cooling factor

      // Repulsion (n^2)
      for (let i = 0; i < currentNodes.length; i++) {
        for (let j = i + 1; j < currentNodes.length; j++) {
          const dx = currentNodes[i].x - currentNodes[j].x;
          const dy = currentNodes[i].y - currentNodes[j].y;
          let distSq = dx * dx + dy * dy;
          if (distSq === 0) distSq = 0.01;
          const force = 1000 / distSq; // repulsion strength
          const fx = (dx / Math.sqrt(distSq)) * force * alpha;
          const fy = (dy / Math.sqrt(distSq)) * force * alpha;
          
          currentNodes[i].vx += fx;
          currentNodes[i].vy += fy;
          currentNodes[j].vx -= fx;
          currentNodes[j].vy -= fy;
        }
      }

      // Attraction (springs)
      for (const link of simLinks) {
        const source = currentNodes[link.sourceIndex];
        const target = currentNodes[link.targetIndex];
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = (dist - 50) * 0.05 * alpha; // target distance 50, strength 0.05
        
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      }

      // Center gravity
      for (let i = 0; i < currentNodes.length; i++) {
        const dx = width / 2 - currentNodes[i].x;
        const dy = height / 2 - currentNodes[i].y;
        currentNodes[i].vx += dx * 0.02 * alpha;
        currentNodes[i].vy += dy * 0.02 * alpha;
      }

      // Apply velocity and damping
      for (let i = 0; i < currentNodes.length; i++) {
        currentNodes[i].vx *= 0.8; // friction
        currentNodes[i].vy *= 0.8;
        currentNodes[i].x += currentNodes[i].vx;
        currentNodes[i].y += currentNodes[i].vy;
      }

      setSimNodes([...currentNodes]);

      if (alpha > 0.01) {
        reqRef.current = requestAnimationFrame(tick);
      }
    };

    reqRef.current = requestAnimationFrame(tick);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [nodes, links]);

  return (
    <WidgetCard title={title} description={description} className={props.className}>
      <div style={{ width: '100%', height: 300, overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
          {/* Links */}
          {links.map((link, i) => {
            const source = simNodes.find(n => n.id === link.source);
            const target = simNodes.find(n => n.id === link.target);
            if (!source || !target) return null;
            return (
              <line
                key={`link-${i}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="var(--vi-color-surface-border)"
                strokeWidth={Math.max(1, (link.value || 1) * 0.5)}
                opacity={0.6}
              />
            );
          })}
          
          {/* Nodes */}
          {simNodes.map(node => (
            <g key={node.id} transform={`translate(${node.x},${node.y})`}>
              <circle
                r={8}
                fill={colors[node.group % colors.length]}
                stroke="var(--vi-color-surface-card)"
                strokeWidth={2}
              />
              <text
                y={15}
                textAnchor="middle"
                fontSize={10}
                fill="var(--vi-color-text-primary)"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </WidgetCard>
  );
}
