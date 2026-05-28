'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { Icon } from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });
import { useMap as _useMap } from 'react-leaflet';

type GeoInfo = {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string; // "lat,lng"
};

function ChangeMapView({ center }: { center: [number, number] }) {
  // `useMap` is dynamically loaded so cast to any for runtime call
  // this component only renders on the client where react-leaflet is available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map: any = (_useMap as any)();
  useEffect(() => {
    if (map) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function GeoMap({ geo }: { geo: GeoInfo | null }) {
  const [defaultIcon, setDefaultIcon] = useState<Icon | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const L = await import('leaflet');
      const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      if (mounted) setDefaultIcon(icon);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!geo?.loc) return null;
  const [lat, lng] = geo.loc.split(',').map(Number);
  if (!defaultIcon) {
    return (
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">📍 Location on Map</h2>
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">📍 Location on Map</h2>
      <MapContainer center={[lat, lng]} zoom={10} style={{ height: '400px', width: '100%' }}>
        <ChangeMapView center={[lat, lng]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={defaultIcon}>
          <Popup>
            <b>{geo.ip}</b>
            <br />
            {geo.city}, {geo.region}, {geo.country}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
