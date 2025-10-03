import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

export type LatLng = { lat: number; lon: number };

type MapPickerProps = {
  value?: LatLng;
  onChange?: (v: LatLng) => void;
  onReverseName?: (name: string) => void; // reverse geocoding
  height?: string; // e.g. "20rem"
  zoom?: number;
};

const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ClickCatcher({ onPick }: { onPick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterOnPoint({ point, zoom }: { point?: LatLng; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (point) {
      map.setView([point.lat, point.lon], zoom, { animate: true });
    }
  }, [point, zoom, map]);
  return null;
}

async function reverseName(lat: number, lon: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const r = await fetch(url, { headers: { "Accept-Language": "en" } });
    if (!r.ok) return null;
    const data = await r.json();
    return data?.display_name ?? null;
  } catch {
    return null;
  }
}

export default function MapPicker({
  value,
  onChange,
  onReverseName,
  height = "20rem",
  zoom = 7,
}: MapPickerProps) {
  const [point, setPoint] = useState<LatLng | undefined>(value);

  // Si "value" change (ex. via SearchBox), on met à jour le marker interne
  useEffect(() => {
    if (value && (value.lat !== point?.lat || value.lon !== point?.lon)) {
      setPoint(value);
    }
  }, [value]); // eslint-disable-line

  const defaultCenter: LatLngExpression = useMemo(
    () => [value?.lat ?? 6.37, value?.lon ?? 2.39],
    [value]
  );

  const handlePick = async (lat: number, lon: number) => {
    const p = { lat, lon };
    setPoint(p);
    onChange?.(p);
    const name = await reverseName(lat, lon);
    if (name && onReverseName) onReverseName(name);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-border/50">
      {/* z-index bas pour ne pas masquer la Sheet mobile */}
      <div className="relative z-0">
        <MapContainer
          center={defaultCenter}
          zoom={zoom}
          style={{ height }}
          className="bg-muted/20"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCatcher onPick={handlePick} />
          <RecenterOnPoint point={point} zoom={zoom} />
          {point && <Marker position={[point.lat, point.lon]} icon={icon} />}
        </MapContainer>
      </div>

      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
        <span>Tap the map to pick a point</span>
        {point && <span>{point.lat.toFixed(4)}°, {point.lon.toFixed(4)}°</span>}
      </div>
    </div>
  );
}
