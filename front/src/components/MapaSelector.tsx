import { useState } from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MapaSelectorProps = {
  value: [number, number][];
  onChange: (coords: [number, number][]) => void;
  readOnly?: boolean; // <-- aquí se añade readOnly opcional
};

export const MapaSelector = ({ value, onChange, readOnly = false }: MapaSelectorProps) => {
  const [points, setPoints] = useState<[number, number][]>(value || []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (readOnly) return;  // si está en modo solo lectura, no hacer nada
        const newPoints: [number, number][] = [...points, [e.latlng.lat, e.latlng.lng]];
        setPoints(newPoints);
        onChange(newPoints);
      },
    });
    return null;
  };

  return (
    <div className="h-64">
      <MapContainer
        center={points.length ? points[0] : [-17.7833, -63.1821]}
        zoom={13}
        scrollWheelZoom={!readOnly}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {points.length > 2 && (
          <Polygon
            positions={points}
            pathOptions={{
              color: "blue",
              fillColor: "blue",
              fillOpacity: 0.3,
              weight: 2,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};