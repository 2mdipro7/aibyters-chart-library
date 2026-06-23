import React from "react";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export interface BubbleMapProps {
  title: string;
  description?: string;
  data: Array<{ name: string; coordinates: [number, number]; value: number }>;
  color?: string;
  className?: string;
}

const defaultColors = [
  "#6366f1", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#64748b"
];

export function BubbleMap({
  title,
  description,
  data,
  color = defaultColors[0],
  ...props
}: BubbleMapProps) {
  
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const maxRadius = 15;

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

            {data.map(({ name, coordinates, value }, i) => {
              const r = Math.max(Math.sqrt(value / maxVal) * maxRadius, 2);
              return (
                <Marker key={i} coordinates={coordinates}>
                  <circle 
                    r={r} 
                    fill={color} 
                    fillOpacity={0.7} 
                    stroke="var(--vi-color-surface-card)"
                    strokeWidth={1}
                  >
                    <title>{name}: {formatCompactNumber(value)}</title>
                  </circle>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </WidgetCard>
  );
}
