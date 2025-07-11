import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  lat: number;
  lng: number;
  zoom?: number;
}

export const MapView: React.FC<MapViewProps> = ({ lat, lng, zoom = 13 }) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lng]}>
        <Popup>Ubicación seleccionada</Popup>
      </Marker>
    </MapContainer>
  );
};