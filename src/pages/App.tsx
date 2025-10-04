import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Gauge, Download, MapPin, Menu, AlertTriangle, CalendarDays, Info, Droplets, Timer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getSkySummary } from "@/lib/rain_to_sky";
import { Sun, CloudSun, Cloud, CloudDrizzle, CloudRain, CloudLightning } from "lucide-react";
import SidebarFilters from "@/components/SidebarFilters";
import MapPicker, { LatLng } from "@/components/MapPicker";
import { fetchRisk, RiskResponse } from "@/lib/api";
import AlternativeSuggestion from "@/components/AlternativeSuggestion";
import { ThemeToggle } from "@/components/ThemeToggle";

const SkyIcon = ({
  name,
  className,
}: {
  name: ReturnType<typeof getSkySummary>["icon"];
  className?: string;
}) => {
  const icons = { Sun, CloudSun, Cloud, CloudDrizzle, CloudRain, CloudLightning };
  const Icon = icons[name];
  return <Icon className={className} />;
};


const todayISO = () => new Date().toISOString().slice(0,10);
const toCSV = (obj: Record<string, any>) => {
  const keys = Object.keys(obj);
  const values = keys.map((k) => JSON.stringify(obj[k] ?? ""));
  return keys.join(",") + "\n" + values.join(",") + "\n";
};

const AppPage = () => {
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ---- État centralisé (source de vérité) ----
  const [picked, setPicked] = useState<LatLng | undefined>(undefined);
  const [locationText, setLocationText] = useState("");
  const [dateISO, setDateISO] = useState(todayISO());
  const [startHour, setStartHour] = useState(14);
  const [endHour, setEndHour] = useState(18);
  const [mm, setMm] = useState(1.0);

  const [computing, setComputing] = useState(false);
  const [result, setResult] = useState<RiskResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const latlonLabel = picked ? `${picked.lat.toFixed(4)}°, ${picked.lon.toFixed(4)}°` : "No point selected";
  const canCompute = useMemo(
    () => !!picked && !!dateISO && startHour < endHour && mm > 0,
    [picked, dateISO, startHour, endHour, mm]
  );

  async function runCompute(dateISO_: string, startHour_: number, endHour_: number, mm_: number) {
    if (!picked) { setErrorMsg("Select a point (search or map)."); return; }
    if (!dateISO_ && !dateISO) { setErrorMsg("Choose a date."); return; }
    if (startHour_ >= endHour_) { setErrorMsg("Start hour must be < end hour."); return; }
    if (mm_ <= 0) { setErrorMsg("Threshold (mm) must be > 0."); return; }

    setErrorMsg("");
    setComputing(true);
    try {
      const data = await fetchRisk({
        lat: picked.lat,
        lon: picked.lon,
        dateISO: dateISO_ || dateISO,
        h1: startHour_,
        h2: endHour_,
        mm: mm_,
      });
      setResult(data);
    } catch (e: any) {
      setResult(null);
      setErrorMsg(e?.message || "Request failed.");
    } finally {
      setComputing(false);
    }
  }

  const riskColor = (level?: RiskResponse["risk_level"]) =>
    level === "high" ? "text-red-600"
    : level === "elevated" ? "text-orange-500"
    : level === "moderate" ? "text-amber-500"
    : "text-emerald-600";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9"><Menu className="h-5 w-5" /></Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto z-[1000]">
                  <SidebarFilters
                    locationText={locationText}
                    dateISO={dateISO}
                    startHour={startHour}
                    endHour={endHour}
                    mm={mm}
                    computing={computing}
                    onLocationPick={(name) => setLocationText(name)}
                    onSelectLatLon={(lat, lon) => setPicked({ lat, lon })}
                    onChange={(p) => {
                      if (p.locationText !== undefined) setLocationText(p.locationText);
                      if (p.dateISO !== undefined) setDateISO(p.dateISO);
                      if (p.startHour !== undefined) setStartHour(p.startHour);
                      if (p.endHour !== undefined) setEndHour(p.endHour);
                      if (p.mm !== undefined) setMm(p.mm);
                    }}
                    onCompute={async (p) => {
                      // onCompute reflète déjà le state parent puisqu'il est contrôlé
                      if (!picked) return;
                      await runCompute(p.dateISO, p.startHour, p.endHour, p.mm);
                      setMobileOpen(false);
                    }}
                  />
                </SheetContent>
              </Sheet>
            )}
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="ClimaTrack" className="h-7 w-7 rounded-full object-cover border border-border/60" />
              <span className="font-semibold">ClimaTrack</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-sm text-muted-foreground mr-2">Plan with probabilities, not hopes.</div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar desktop */}
        {!isMobile && (
          <aside className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm p-6 overflow-y-auto">
            <SidebarFilters
              locationText={locationText}
              dateISO={dateISO}
              startHour={startHour}
              endHour={endHour}
              mm={mm}
              computing={computing}
              onLocationPick={(name) => setLocationText(name)}
              onSelectLatLon={(lat, lon) => setPicked({ lat, lon })}
              onChange={(p) => {
                if (p.locationText !== undefined) setLocationText(p.locationText);
                if (p.dateISO !== undefined) setDateISO(p.dateISO);
                if (p.startHour !== undefined) setStartHour(p.startHour);
                if (p.endHour !== undefined) setEndHour(p.endHour);
                if (p.mm !== undefined) setMm(p.mm);
              }}
              onCompute={async (p) => {
                if (!picked) return;
                await runCompute(p.dateISO, p.startHour, p.endHour, p.mm);
              }}
            />
          </aside>
        )}

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto grid max-w-6xl gap-4 md:gap-6">
            {/* Map */}
            <Card className="p-6 gradient-card border-border/50 shadow-elevated">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                Pick a location on the map
              </h3>
              <div className="relative z-0">
                <MapPicker
                  value={picked}
                  onChange={setPicked}
                  onReverseName={(placeName) => setLocationText(placeName)}
                  height="20rem"
                  zoom={8}
                />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{latlonLabel}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  onClick={() => runCompute(dateISO, startHour, endHour, mm)}
                  disabled={!canCompute || computing}
                >
                  {computing ? "Computing..." : "Compute with current selection"}
                </Button>
              </div>

              {!canCompute && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {(!picked) ? "Pick a location (search or map). " : ""}
                  {(!dateISO) ? "Choose a date. " : ""}
                  {(startHour >= endHour) ? "Start hour must be < end hour. " : ""}
                  {(mm <= 0) ? "Threshold (mm) must be > 0." : ""}
                </div>
              )}
              {errorMsg && (
                <div className="mt-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}
            </Card>

            {/* Risk card */}
            <Card className="gradient-card border-border/50 p-4 shadow-elevated md:p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold md:mb-6 md:text-xl">
                <Gauge className="h-5 w-5 text-primary" />
                Rain Risk
              </h3>

              {!result ? (
                <div className="rounded-lg border border-border/50 bg-muted/20 p-6 text-sm text-muted-foreground">
                  No data yet. Pick a point, choose a date & hour range, set threshold, then compute.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex flex-col items-center justify-center rounded-lg border border-border/50 p-4">
                    <div className={`mb-1 text-4xl font-bold ${riskColor(result.risk_level)}`}>
                      {result.probability_percent.toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Probability ≥ {result.threshold_mm}mm</div>
                  </div>

                  <div className="rounded-lg border border-border/50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm">
                      <AlertTriangle className={`h-4 w-4 ${riskColor(result.risk_level)}`} />
                      <span className="uppercase tracking-wide font-semibold">{result.risk_level}</span>
                    </div>
                    <p className="text-sm">{result.message}</p>
                  </div>

                  <div className="rounded-lg border border-border/50 p-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /><span>{result.date}</span></div>
                    <div className="flex items-center gap-2"><Timer className="h-4 w-4" /><span>{result.window}</span></div>
                    <div className="flex items-center gap-2"><Droplets className="h-4 w-4" /><span>{result.threshold_mm} mm</span></div>
                    <div className="flex items-center gap-2"><Info className="h-4 w-4" /><span className="capitalize">{result.source} · {result.confidence} confidence</span></div>
                  </div>
                </div>
              )}
            </Card>

            {/* Alternative Suggestion - Afficher si probabilité > 60% */}
            {result && result.probability_percent > 60 && picked && (
              <AlternativeSuggestion
                lat={picked.lat}
                lon={picked.lon}
                date={dateISO}
                h1={startHour}
                h2={endHour}
                currentRisk={result.probability_percent}
                onSelectLocation={(lat, lon, name) => {
                  setPicked({ lat, lon });
                  setLocationText(name);
                  // Scroll to map
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Summary */}
            <Card className="gradient-card border-border/50 p-4 shadow-elevated md:p-6">
              <h3 className="mb-3 text-lg font-semibold md:mb-4 md:text-xl">Summary</h3>
              <p className="text-sm md:text-lg">
                {result ? (
                  <>
                    On <span className="font-semibold text-primary">{result.date}</span> at{" "}
                    <span className="font-semibold text-primary">{latlonLabel}</span> between{" "}
                    <span className="font-semibold text-primary">{result.window}</span>, risk level is{" "}
                    <span className={`font-bold ${riskColor(result.risk_level)}`}>{result.risk_level}</span> with{" "}
                    <span className={`font-bold ${riskColor(result.risk_level)}`}>{result.probability_percent.toFixed(1)}%</span>{" "}
                    chance of rain ≥ {result.threshold_mm}mm ({result.source}, {result.confidence}).
                  </>
                ) : (
                  <>No computed summary yet.</>
                )}
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!result}
                  onClick={() => {
                    if (!result) return;
                    const blob = new Blob([toCSV(result as any)], { type: "text/csv;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `risk_${result.date}_${result.location.lat.toFixed(3)}_${result.location.lon.toFixed(3)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!result}
                  onClick={() => {
                    if (!result) return;
                    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `risk_${result.date}_${result.location.lat.toFixed(3)}_${result.location.lon.toFixed(3)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  JSON
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppPage;
