"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useWebSocket } from "@/hooks/useWebSocket";

const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -35],
});

export default function MapComponent() {
  const { markers } = useWebSocket("ws://localhost:5001");

  return (
    <div className="flex flex-col items-center gap-4 p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800">🌍 Карта Петропавловска</h1>
      <div className="w-full max-w-5xl h-[600px] rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={[54.8721, 69.1148]}
          zoom={12} // Чуть уменьшил масштаб для лучшего обзора
          className="w-full h-full"
          maxBounds={[
            [54.75, 68.95], // Юго-западный угол (дальше от центра)
            [55.00, 69.35], // Северо-восточный угол (расширил границы)
          ]}
          maxBoundsViscosity={0.5} // Меньшая вязкость = можно немного выйти за границы
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon}>
              <Popup>{marker.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
