import { useMemo } from "react";
import { WidgetCard } from "@aibyters/layout";
import { formatCompactNumber } from "@aibyters/spec";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export interface ChoroplethMapProps {
  title: string;
  description?: string;
  data: Array<{ region: string; value: number }>;
  colorScale?: { min: string; max: string };
  className?: string;
}

export function ChoroplethMap({
  title,
  description,
  data,
  colorScale = { min: "#cbd5e1", max: "#3b82f6" },
  ...props
}: ChoroplethMapProps) {
  
  const { minVal, maxVal, dataMap } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    const map: Record<string, number> = {};
    data.forEach(d => {
      if (d.value < min) min = d.value;
      if (d.value > max) max = d.value;
      // We map by ISO-A3 codes or full names depending on the data
      // For simplicity, we just lower-case everything for a broader match
      map[d.region.toLowerCase()] = d.value;
    });
    return { minVal: min === Infinity ? 0 : min, maxVal: max === -Infinity ? 100 : max, dataMap: map };
  }, [data]);

  const getColor = (val: number) => {
    if (val === undefined || maxVal === minVal) return colorScale.min;
    const ratio = (val - minVal) / (maxVal - minVal);
    return `color-mix(in srgb, ${colorScale.max} ${Math.round(ratio * 100)}%, ${colorScale.min})`;
  };

  return (
    <WidgetCard title={title} description={description} className={props.className}>
      <div style={{ width: '100%', height: 340, position: 'relative' }}>
        <ComposableMap projectionConfig={{ scale: 140 }} style={{ width: '100%', height: '100%' }}>
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const countryName = geo.properties.name.toLowerCase();
                  const countryId = geo.id ? geo.id.toLowerCase() : "";
                  const val = dataMap[countryName] !== undefined ? dataMap[countryName] : dataMap[countryId];
                  const fill = val !== undefined ? getColor(val) : "var(--vi-color-surface-hover)";
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={fill}
                      stroke="var(--vi-color-surface-background)"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: val !== undefined ? "var(--vi-color-primary)" : "#94a3b8", outline: "none" },
                        pressed: { outline: "none" }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        
        {/* Legend */}
        <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--vi-color-text-secondary)' }}>
          <span>{formatCompactNumber(minVal)}</span>
          <div style={{ 
            width: '100px', 
            height: '8px', 
            borderRadius: '4px',
            background: `linear-gradient(to right, ${colorScale.min}, ${colorScale.max})`
          }} />
          <span>{formatCompactNumber(maxVal)}</span>
        </div>
      </div>
    </WidgetCard>
  );
}
