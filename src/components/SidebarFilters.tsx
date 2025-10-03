import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Settings, Clock, Droplets } from "lucide-react";
import SearchBox from "@/components/SearchBox";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function SidebarFilters({
  locationText,
  dateISO,
  startHour,
  endHour,
  mm,
  computing,
  onLocationPick,
  onSelectLatLon,
  onChange,    // <- un seul callback pour tout changement
  onCompute,
}: {
  locationText: string;
  dateISO: string;
  startHour: number;
  endHour: number;
  mm: number;
  computing?: boolean;
  onLocationPick?: (name: string) => void;
  onSelectLatLon?: (lat: number, lon: number) => void;
  onChange: (p: { locationText?: string; dateISO?: string; startHour?: number; endHour?: number; mm?: number }) => void;
  onCompute: (p: { locationText: string; dateISO: string; startHour: number; endHour: number; mm: number }) => void;
}) {
  const canRun = locationText.trim().length > 0 && dateISO.length > 0 && startHour < endHour && mm > 0 && !computing;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold">
          <Settings className="h-6 w-6 text-primary" />
          Select Parameters
        </h2>
        <p className="text-sm text-muted-foreground">Configure your rain risk query</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <SearchBox
            value={locationText}
            onSelect={(it) => {
              onChange({ locationText: it.name });
              onLocationPick?.(it.name);
              onSelectLatLon?.(it.lat, it.lon);
            }}
            placeholder="City, Country"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Day (date)
          </Label>
          <Input
            type="date"
            value={dateISO}
            onChange={(e) => onChange({ dateISO: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Hour interval
          </Label>
          <div className="flex gap-2">
            <Select value={String(startHour)} onValueChange={(v) => onChange({ startHour: parseInt(v) })}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Start" /></SelectTrigger>
              <SelectContent>
                {HOURS.map((h) => <SelectItem key={h} value={String(h)}>{h.toString().padStart(2, "0")}:00</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={String(endHour)} onValueChange={(v) => onChange({ endHour: parseInt(v) })}>
              <SelectTrigger className="w-full"><SelectValue placeholder="End" /></SelectTrigger>
              <SelectContent>
                {HOURS.map((h) => <SelectItem key={h} value={String(h)}>{h.toString().padStart(2, "0")}:00</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">Example: 14:00 → 18:00</p>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Threshold (mm)
          </Label>
          <Input
            type="number"
            step="0.1"
            min="0.1"
            value={mm}
            onChange={(e) => onChange({ mm: parseFloat(e.target.value) || 0 })}
            placeholder="e.g. 1.0"
          />
          <p className="text-xs text-muted-foreground">Rain threshold used by /risk (mm)</p>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <Button
          className="w-full"
          variant="hero"
          disabled={!canRun}
          onClick={() => onCompute({ locationText, dateISO, startHour, endHour, mm })}
        >
          {computing ? "Computing..." : "Compute Risk"}
        </Button>

        {!canRun && (
          <div className="text-xs text-muted-foreground">
            {locationText.trim().length === 0 ? "Pick a location (search or map). " : ""}
            {dateISO.length === 0 ? "Choose a date. " : ""}
            {startHour >= endHour ? "Start hour must be < end hour. " : ""}
            {mm <= 0 ? "Threshold (mm) must be > 0." : ""}
          </div>
        )}
      </div>
    </div>
  );
}
