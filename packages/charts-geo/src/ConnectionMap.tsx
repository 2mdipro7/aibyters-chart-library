import React from "react";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export interface ConnectionMapProps {
  title: string;
  description?: string;
  points: Array<{ name: string; coordinates: [number, number] }>;
  connections: Array<{ from: number; to: number; value?: number }>;
  color?: string;
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

export function ConnectionMap({
  title,
  description,
  points,
  connections,
  color = defaultColors[1],
  ...props
}: ConnectionMapProps) {

  return (
    <WidgetCard title={title} description={description} className={props.className}>
      <div style={{ width: '100%', height: 340, position: 'relative' }}>
        <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: '100%', height: '100%' }}>
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="var(--vi-color-surface-hover)"
                    stroke="var(--vi-color-surface-background)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#cbd5e1" },
                      pressed: { outline: "none" }
                    }}
                  />
                ))
              }
            </Geographies>

            {/* Connections */}
            {connections.map((conn, i) => {
              const p1 = points[conn.from];
              const p2 = points[conn.to];
              if (!p1 || !p2) return null;
              
              return (
                <Line
                  key={`conn-${i}`}
                  from={p1.coordinates}
                  to={p2.coordinates}
                  stroke={color}
                  strokeWidth={conn.value ? Math.max(0.5, Math.min(conn.value / 100, 3)) : 1}
                  strokeOpacity={0.6}
                  strokeLinecap="round"
                  style={{ strokeDasharray: 4, animation: 'dash 10s linear infinite' }}
                />
              );
            })}
            
            {/* Points */}
            {points.map((p, i) => (
              <Marker key={`point-${i}`} coordinates={p.coordinates}>
                <circle
                  r={3}
                  fill={color}
                  stroke="var(--vi-color-surface-card)"
                  strokeWidth={1}
                >
                  <title>{p.name}</title>
                </circle>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </WidgetCard>
  );
}
