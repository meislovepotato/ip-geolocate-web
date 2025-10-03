"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  type MapContainerProps,
  type TileLayerProps,
  type MarkerProps,
  type PopupProps,
  useMap,
} from "react-leaflet";

const MapContainer = dynamic<MapContainerProps>(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic<TileLayerProps>(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic<MarkerProps>(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic<PopupProps>(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

type GeoInfo = {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string; // "lat,lng"
};

function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom()); // keeps zoom level
  }, [center, map]);
  return null;
}

export default function GeoMap({ geo }: { geo: GeoInfo | null }) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");

      const DefaultIcon = leaflet.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      leaflet.Marker.prototype.options.icon = DefaultIcon;
      setL(leaflet);
    })();
  }, []);

  if (!geo?.loc || !L) return null;

  const [lat, lng] = geo.loc.split(",").map(Number);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">📍 Location on Map</h2>
      <MapContainer
        center={[lat, lng]}
        zoom={10}
        style={{ height: "400px", width: "100%" }}
      >
        <ChangeMapView center={[lat, lng]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>
            <b>{geo.ip}</b> <br />
            {geo.city}, {geo.region}, {geo.country}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
