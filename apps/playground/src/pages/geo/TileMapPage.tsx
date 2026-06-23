import React from 'react';
import { ChartPageLayout } from '../../components/ChartPageLayout';
import { PropsTable, type PropDef } from '../../components/PropsTable';
import { TileMap } from '@aibyters/charts-geo';

const sampleData = [
  { name: 'London Office', coordinates: [51.5074, -0.1276] as [number, number], value: 120, details: 'European HQ' },
  { name: 'New York Office', coordinates: [40.7128, -74.006] as [number, number], value: 85, details: 'Americas Hub' },
  { name: 'Tokyo Office', coordinates: [35.6895, 139.6917] as [number, number], value: 65, details: 'APAC Center' }
];

const codeExample = `import { TileMap } from "@aibyters/charts-geo";

<TileMap
  title="Global Offices"
  description="Interactive map with OpenStreetMap tiles"
  data={sampleData}
  center={[30, 0]}
  zoom={2}
/>`;

const propsData: PropDef[] = [
  { name: 'title', type: 'string', required: true, default: '-', description: 'Chart heading' },
  { name: 'description', type: 'string', required: false, default: '-', description: 'Optional subtitle' },
  { name: 'data', type: 'Array<{ name, coordinates: [lat, lng], value?, details? }>', required: true, default: '-', description: 'Map markers' },
  { name: 'center', type: '[number, number]', required: false, default: '[20, 0]', description: 'Initial center coordinates [lat, lng]' },
  { name: 'zoom', type: 'number', required: false, default: '2', description: 'Initial zoom level' },
  { name: 'tileUrl', type: 'string', required: false, default: 'OSM Tile URL', description: 'Custom tile server URL' },
];

export default function TileMapPage() {
  return (
    <ChartPageLayout
      title="GIS Tile Map"
      description="True GIS map component utilizing Leaflet for deep zoom, panning, and tile layer support."
      category="geo"
      code={codeExample}
    >
      <TileMap 
        title="Global Offices" 
        description="Interactive map with OpenStreetMap tiles" 
        data={sampleData} 
        center={[30, 0]}
        zoom={2}
      />
      <div style={{ marginTop: 24 }}>
        <PropsTable data={propsData} />
      </div>
    </ChartPageLayout>
  );
}
