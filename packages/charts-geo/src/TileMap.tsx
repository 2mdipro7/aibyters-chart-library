import { WidgetCard } from "@aibyters/layout";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in leaflet
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export interface TileMapProps {
  title: string;
  description?: string;
  data: Array<{
    name: string;
    coordinates: [number, number]; // [lat, lng] for Leaflet
    value?: number;
    details?: string;
  }>;
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  tileUrl?: string;
  attribution?: string;
  className?: string;
}

export function TileMap({
  title,
  description,
  data,
  center = [20, 0],
  zoom = 2,
  tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  ...props
}: TileMapProps) {
  return (
    <WidgetCard title={title} description={description} className={props.className}>
      <div style={{ width: "100%", height: 400, position: "relative", zIndex: 1 }}>
        <MapContainer 
          center={center} 
          zoom={zoom} 
          style={{ width: "100%", height: "100%", borderRadius: "8px" }}
          scrollWheelZoom={false}
        >
          <TileLayer attribution={attribution} url={tileUrl} />
          {data.map((point, idx) => (
            <CircleMarker
              key={idx}
              center={point.coordinates}
              radius={point.value ? Math.max(Math.sqrt(point.value) * 2, 5) : 8}
              fillColor="#3b82f6"
              fillOpacity={0.6}
              color="#2563eb"
              weight={2}
            >
              <Popup>
                <div style={{ padding: "4px" }}>
                  <strong>{point.name}</strong>
                  {point.value !== undefined && <div>Value: {point.value}</div>}
                  {point.details && <div style={{ marginTop: '4px', fontSize: '12px' }}>{point.details}</div>}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </WidgetCard>
  );
}
