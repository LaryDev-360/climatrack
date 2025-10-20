import { useEffect, useMemo, useState, useRef } from "react";
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

// CSS resets for Leaflet to work properly with Tailwind CSS
const leafletStyles = `
  .leaflet-container {
    height: 100% !important;
    width: 100% !important;
    z-index: 1 !important;
    position: relative !important;
  }
  .leaflet-control-container {
    display: none !important;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 0.5rem !important;
  }
  /* Mobile-specific fixes */
  .leaflet-touch .leaflet-control-layers,
  .leaflet-touch .leaflet-bar {
    display: none !important;
  }
  .leaflet-touch .leaflet-control-attribution,
  .leaflet-touch .leaflet-control-scale-line {
    display: none !important;
  }
  /* Ensure proper touch handling on mobile */
  .leaflet-container .leaflet-overlay-pane svg {
    pointer-events: none !important;
  }
  .leaflet-container.leaflet-touch {
    -webkit-tap-highlight-color: transparent !important;
  }
  .leaflet-container.leaflet-touch .leaflet-interactive {
    cursor: pointer !important;
  }
`;

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
      map.setView([point.lat, point.lon], zoom, {
        animate: true,
        duration: 1.5 // Smoother animation
      });
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
  const [mapLoaded, setMapLoaded] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results when a point is selected
  useEffect(() => {
    if (point && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [point]);

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

  // Inject Leaflet CSS fixes
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = leafletStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg border border-border/50">
      {/* Higher z-index for mobile to ensure map is visible */}
      <div className="relative z-10 w-full h-full min-h-[300px]">
        <MapContainer
          center={defaultCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%', minHeight: '300px' }}
          className="bg-muted/20 rounded-lg"
          zoomControl={false}
          attributionControl={false}
          whenReady={() => setMapLoaded(true)}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickCatcher onPick={handlePick} />
          <RecenterOnPoint point={point} zoom={zoom} />
          {point && <Marker position={[point.lat, point.lon]} icon={icon} />}
        </MapContainer>
        {!mapLoaded && (
          <div className="absolute inset-0 bg-muted/50 flex items-center justify-center rounded-lg">
            <div className="text-sm text-muted-foreground">Loading map...</div>
          </div>
        )}
      </div>

      <div ref={resultsRef} className="absolute bottom-2 left-2 right-2 z-20 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border/50">
        <div className="text-xs text-muted-foreground text-center">
          <span className="block sm:hidden">Tap the map to pick a point</span>
          <span className="hidden sm:block">Click the map to pick a point</span>
          {point && (
            <span className="block font-mono text-xs mt-1">
              {point.lat.toFixed(4)}°, {point.lon.toFixed(4)}°
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
