import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Settings, Clock, Droplets, Calculator, CheckCircle, AlertCircle } from "lucide-react";
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
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Configure Analysis</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Set your parameters to analyze rain risk for your event
        </p>
      </div>

      <Separator className="my-4" />

      {/* Location Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Location</Label>
        </div>
        <div className="space-y-2">
          <SearchBox
            value={locationText}
            onSelect={(it) => {
              onChange({ locationText: it.name });
              onLocationPick?.(it.name);
              onSelectLatLon?.(it.lat, it.lon);
            }}
            placeholder="Search for a city or place"
          />
          {locationText && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Location selected
            </div>
          )}
        </div>
      </div>

      {/* Date Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Event Date</Label>
        </div>
        <div className="space-y-2">
          <Input
            type="date"
            value={dateISO}
            onChange={(e) => onChange({ dateISO: e.target.value })}
            className="w-full"
          />
          {dateISO && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              {new Date(dateISO).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
        </div>
      </div>

      {/* Time Window Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Time Window</Label>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Start Time</Label>
              <Select value={String(startHour)} onValueChange={(v) => onChange({ startHour: parseInt(v) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {h.toString().padStart(2, "0")}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">End Time</Label>
              <Select value={String(endHour)} onValueChange={(v) => onChange({ endHour: parseInt(v) })}>
                <SelectTrigger>
                  <SelectValue placeholder="End" />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={String(h)}>
                      {h.toString().padStart(2, "0")}:00
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {startHour < endHour && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Duration: {endHour - startHour} hours
            </div>
          )}
          {startHour >= endHour && (
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <AlertCircle className="h-3 w-3" />
              Start time must be before end time
            </div>
          )}
        </div>
      </div>

      {/* Threshold Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-primary" />
          <Label className="text-sm font-medium">Rain Threshold</Label>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <Input
              type="number"
              step="0.1"
              min="0.1"
              max="50"
              value={mm}
              onChange={(e) => onChange({ mm: parseFloat(e.target.value) || 0 })}
              placeholder="1.0"
              className="pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              mm
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Typical values: 0.5mm (light), 1.0mm (moderate), 5.0mm (heavy)</span>
          </div>
          {mm > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-green-500" />
              Threshold: ≥ {mm}mm of rain
            </div>
          )}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Compute Section */}
      <div className="space-y-3">
        <Button
          className="w-full h-12 text-base font-medium"
          variant={canRun ? "default" : "secondary"}
          disabled={!canRun}
          onClick={() => onCompute({ locationText, dateISO, startHour, endHour, mm })}
        >
          {computing ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Computing Risk...
            </>
          ) : (
            <>
              <Calculator className="mr-2 h-4 w-4" />
              Compute Risk Assessment
            </>
          )}
        </Button>

        {!canRun && (
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3 mt-0.5 text-orange-500" />
              <div className="space-y-1">
                {!locationText.trim() && <div>✓ Select a location</div>}
                {!dateISO && <div>✓ Choose an event date</div>}
                {startHour >= endHour && <div>✓ Set valid time window</div>}
                {mm <= 0 && <div>✓ Set rain threshold &gt; 0</div>}
              </div>
            </div>
          </div>
        )}

        {canRun && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
              <CheckCircle className="h-4 w-4" />
              Ready to compute risk assessment
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
