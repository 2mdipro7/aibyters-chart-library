import React, { useMemo } from "react";
import { WidgetCard } from "@aibyters/layout";

export interface ChordDiagramProps {
  title: string;
  description?: string;
  matrix: number[][];
  labels: string[];
  colors?: string[];
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

// Helper to create an SVG arc path
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: cx + (r * Math.cos(angleInRadians)),
      y: cy + (r * Math.sin(angleInRadians))
    };
  };

  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

// Helper to create ribbon path
function describeRibbon(cx: number, cy: number, r: number, sa1: number, ea1: number, sa2: number, ea2: number) {
  const polarToCartesian = (rad: number, angle: number) => {
    const a = (angle - 90) * Math.PI / 180.0;
    return { x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) };
  };

  const p1 = polarToCartesian(r, sa1);
  const p2 = polarToCartesian(r, ea1);
  const p3 = polarToCartesian(r, sa2);
  const p4 = polarToCartesian(r, ea2);

  // Bezier curve to origin and back to edge
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} Q ${cx} ${cy} ${p4.x} ${p4.y} A ${r} ${r} 0 0 1 ${p3.x} ${p3.y} Q ${cx} ${cy} ${p1.x} ${p1.y} Z`;
}

export function ChordDiagram({
  title,
  description,
  matrix,
  labels,
  colors = defaultColors,
  ...props
}: ChordDiagramProps) {

  const width = 400;
  const height = 400;
  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = Math.min(width, height) / 2 - 40;
  const innerRadius = outerRadius - 15;

  const { arcs, ribbons } = useMemo(() => {
    // 1. Calculate row sums and total
    const rowSums = matrix.map(row => row.reduce((a, b) => a + b, 0));
    const total = rowSums.reduce((a, b) => a + b, 0);

    // 2. Assign angles for each group (with padding)
    const padding = 2; // degrees
    const totalAngle = 360 - padding * matrix.length;
    
    let currentAngle = 0;
    const groups = rowSums.map((sum, i) => {
      const angle = (sum / total) * totalAngle;
      const startAngle = currentAngle;
      const endAngle = startAngle + angle;
      currentAngle += angle + padding;
      return { index: i, startAngle, endAngle, value: sum, currentAngle: startAngle };
    });

    // 3. Build ribbons
    const ribbonData = [];
    
    // To match chords correctly, we need two passes or just a simple symmetric ribbon if undirected
    // For simplicity, we draw ribbon for matrix[i][j] where i <= j
    // We update currentAngle for each group as we consume its arc segment
    
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i; j < matrix[i].length; j++) {
        const val1 = matrix[i][j];
        const val2 = matrix[j][i];
        
        if (val1 === 0 && val2 === 0) continue;

        // Group i segment
        const angle1 = (val1 / total) * totalAngle;
        const sa1 = groups[i].currentAngle;
        const ea1 = sa1 + angle1;
        groups[i].currentAngle += angle1;

        // Group j segment
        let sa2, ea2;
        if (i === j) {
           sa2 = groups[i].currentAngle;
           ea2 = sa2 + (val2 / total) * totalAngle;
           groups[i].currentAngle += (val2 / total) * totalAngle;
        } else {
           const angle2 = (val2 / total) * totalAngle;
           sa2 = groups[j].currentAngle;
           ea2 = sa2 + angle2;
           groups[j].currentAngle += angle2;
        }

        ribbonData.push({
          sourceGroup: i,
          targetGroup: j,
          sa1, ea1, sa2, ea2,
          value: val1 + val2
        });
      }
    }

    return { arcs: groups, ribbons: ribbonData };
  }, [matrix]);

  return (
    <WidgetCard title={title} description={description} className={props.className}>
      <div style={{ width: '100%', height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%', maxWidth: '400px' }}>
          {/* Ribbons */}
          {ribbons.map((ribbon, i) => (
            <path
              key={`ribbon-${i}`}
              d={describeRibbon(cx, cy, innerRadius, ribbon.sa1, ribbon.ea1, ribbon.sa2, ribbon.ea2)}
              fill={colors[ribbon.sourceGroup % colors.length]}
              opacity={0.5}
              stroke="var(--vi-color-surface-background)"
              strokeWidth={0.5}
              style={{ transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
            >
              <title>{labels[ribbon.sourceGroup]} ↔ {labels[ribbon.targetGroup]}: {ribbon.value}</title>
            </path>
          ))}
          
          {/* Arcs */}
          {arcs.map((arc, i) => {
            const midAngle = (arc.startAngle + arc.endAngle) / 2;
            const labelRadius = outerRadius + 10;
            const lx = cx + labelRadius * Math.cos((midAngle - 90) * Math.PI / 180);
            const ly = cy + labelRadius * Math.sin((midAngle - 90) * Math.PI / 180);
            const textAnchor = lx > cx ? 'start' : 'end';
            
            return (
              <g key={`arc-${i}`}>
                <path
                  d={describeArc(cx, cy, outerRadius, arc.startAngle, arc.endAngle)}
                  fill="none"
                  stroke={colors[i % colors.length]}
                  strokeWidth={outerRadius - innerRadius}
                >
                  <title>{labels[i]}: {arc.value}</title>
                </path>
                <text
                  x={lx}
                  y={ly}
                  fontSize={12}
                  fill="var(--vi-color-text-primary)"
                  textAnchor={textAnchor}
                  alignmentBaseline="middle"
                >
                  {labels[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </WidgetCard>
  );
}
