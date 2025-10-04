import { useMemo, useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Gauge, Download, MapPin, Menu, AlertTriangle, AlertCircle, CalendarDays, Info, Droplets, Timer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/theme-toggle";

import { getSkySummary } from "@/lib/rain_to_sky";
import { Sun, CloudSun, Cloud, CloudDrizzle, CloudRain, CloudLightning } from "lucide-react";
import SidebarFilters from "@/components/SidebarFilters";
import MapPicker, { LatLng } from "@/components/MapPicker";
import { fetchRisk, RiskResponse } from "@/lib/api";
import AlternativeSuggestion from "@/components/AlternativeSuggestion";

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

  const resultsRef = useRef<HTMLDivElement>(null);

  // Scroll to results when computation completes
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [result]);

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

  const getRiskLevelStyles = (level: RiskResponse["risk_level"]) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "elevated":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "moderate":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "low":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

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
            <div className="hidden sm:block text-sm text-muted-foreground">Plan with probabilities, not hopes.</div>
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
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Map Section - Enhanced */}
            <div className="space-y-4">
              <Card className="gradient-card border-border/50 shadow-elevated overflow-hidden">
                <div className="p-6 border-b border-border/50">
                  <h3 className="flex items-center gap-3 text-xl font-semibold">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    Select Your Event Location
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click on the map or search for a city to set your event location
                  </p>
                </div>

                <div className="relative">
                  <div className="aspect-[4/3] sm:aspect-[16/10] w-full">
                    <MapPicker
                      value={picked}
                      onChange={setPicked}
                      onReverseName={(placeName) => setLocationText(placeName)}
                      height="100%"
                      zoom={8}
                    />
                  </div>
                  <div className="absolute top-4 right-4 z-30">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border/50">
                      <div className="text-sm font-medium text-foreground">
                        {latlonLabel}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-border/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => runCompute(dateISO, startHour, endHour, mm)}
                        disabled={!canCompute || computing}
                        size="lg"
                        className="font-medium"
                      >
                        {computing ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Computing Risk...
                          </>
                        ) : (
                          <>
                            <Gauge className="mr-2 h-4 w-4" />
                            Analyze Risk for This Location
                          </>
                        )}
                      </Button>
                    </div>

                    {!canCompute && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        {(!picked || !locationText) && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <AlertCircle className="h-3 w-3" />
                            Select location
                          </span>
                        )}
                        {!dateISO && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <CalendarDays className="h-3 w-3" />
                            Choose date
                          </span>
                        )}
                        {startHour >= endHour && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Timer className="h-3 w-3" />
                            Fix time window
                          </span>
                        )}
                        {mm <= 0 && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Droplets className="h-3 w-3" />
                            Set threshold
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-4">
                      <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                        <AlertTriangle className="h-4 w-4" />
                        {errorMsg}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Risk Assessment Section - Enhanced */}
            {result && (
              <div ref={resultsRef} className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                  <span className="text-sm font-medium text-muted-foreground bg-background px-3">
                    Risk Assessment Results
                  </span>
                  <div className="h-1 flex-1 bg-gradient-to-r from-border via-border to-transparent" />
                </div>

                <Card className="gradient-card border-border/50 shadow-elevated overflow-hidden">
                  <div className="p-6 border-b border-border/50">
                    <h3 className="flex items-center gap-3 text-xl font-semibold">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Gauge className="h-5 w-5 text-primary" />
                      </div>
                      Weather Risk Analysis
                    </h3>
                  </div>

                  <div className="p-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                      {/* Main Probability Display */}
                      <div className="lg:col-span-1">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-border/50">
                          <div className={`text-5xl font-bold mb-2 ${riskColor(result.risk_level)}`}>
                            {result.probability_percent.toFixed(1)}%
                          </div>
                          <div className="text-sm text-muted-foreground mb-4">
                            Probability of ≥ {result.threshold_mm}mm rain
                          </div>
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getRiskLevelStyles(result.risk_level)}`}>
                            <AlertTriangle className="h-4 w-4" />
                            {result.risk_level.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Risk Message & Details */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
                          <p className="text-base leading-relaxed">{result.message}</p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50">
                            <CalendarDays className="h-4 w-4 text-primary" />
                            <div>
                              <div className="text-sm font-medium">Date</div>
                              <div className="text-sm text-muted-foreground">{result.date}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50">
                            <Timer className="h-4 w-4 text-primary" />
                            <div>
                              <div className="text-sm font-medium">Time Window</div>
                              <div className="text-sm text-muted-foreground">{result.window}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50">
                            <Droplets className="h-4 w-4 text-primary" />
                            <div>
                              <div className="text-sm font-medium">Threshold</div>
                              <div className="text-sm text-muted-foreground">{result.threshold_mm} mm</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50">
                            <Info className="h-4 w-4 text-primary" />
                            <div>
                              <div className="text-sm font-medium">Data Source</div>
                              <div className="text-sm text-muted-foreground capitalize">
                                {result.source} • {result.confidence} confidence
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Alternative Suggestion - Show if probability > 50% */}
                {result.probability_percent > 50 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                      <span className="text-sm font-medium text-muted-foreground bg-background px-3">
                        Alternative Locations
                      </span>
                      <div className="h-1 flex-1 bg-gradient-to-r from-border via-border to-transparent" />
                    </div>

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
                  </div>
                )}
              </div>
            )}

            {/* Summary */}
            {result && (
              <Card className="gradient-card border-border/50 shadow-elevated">
                <div className="p-6 border-b border-border/50">
                  <h3 className="text-xl font-semibold">Event Summary</h3>
                </div>
                <div className="p-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-base leading-relaxed">
                      On <span className="font-semibold text-primary">{result.date}</span> at{" "}
                      <span className="font-semibold text-primary">{latlonLabel}</span> between{" "}
                      <span className="font-semibold text-primary">{result.window}</span>, the risk level is{" "}
                      <span className={`font-bold ${riskColor(result.risk_level)}`}>{result.risk_level}</span> with a{" "}
                      <span className={`font-bold ${riskColor(result.risk_level)}`}>{result.probability_percent.toFixed(1)}%</span>{" "}
                      chance of precipitation exceeding {result.threshold_mm}mm.
                      <span className="text-muted-foreground"> (Source: {result.source}, {result.confidence} confidence)</span>
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
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
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
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
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export JSON
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppPage;
