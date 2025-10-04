import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2, Sparkles } from "lucide-react";

interface Alternative {
  lat: number;
  lon: number;
  name: string;
  probability_percent: number;
  distance_km: number;
}

interface AlternativeResponse {
  original_location: {
    lat: number;
    lon: number;
    name: string;
    probability_percent: number;
  };
  good_alternatives: Alternative[];
  has_better_options: boolean;
}

interface Props {
  lat: number;
  lon: number;
  date: string;
  h1: number;
  h2: number;
  currentRisk: number;
  onSelectLocation?: (lat: number, lon: number, name: string) => void;
}

export default function AlternativeSuggestion({ lat, lon, date, h1, h2, currentRisk, onSelectLocation }: Props) {
  const [activity, setActivity] = useState("");
  const [loading, setLoading] = useState(false);
  const [alternatives, setAlternatives] = useState<AlternativeResponse | null>(null);
  const [error, setError] = useState("");

  const searchAlternatives = async () => {
    if (!activity.trim()) {
      setError("Veuillez entrer une activité");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(
        `http://localhost:8000/scan-area?lat=${lat}&lon=${lon}&date=${date}&h1=${h1}&h2=${h2}&radius_km=30&num_points=6&max_risk=40&include_geocoding=true`
      );
      
      if (!response.ok) throw new Error("Erreur lors de la recherche");
      
      const data = await response.json();
      setAlternatives(data);
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="gradient-card border-border/50 p-4 shadow-elevated md:p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold md:mb-6 md:text-xl">
        <Sparkles className="h-5 w-5 text-primary" />
        Alternative Locations
      </h3>
      
      <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900 p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">⚠️</span>
          <div>
            <div className="font-semibold text-orange-900 dark:text-orange-100">
              High Rain Risk ({currentRisk.toFixed(1)}%)
            </div>
            <p className="text-xs text-orange-800 dark:text-orange-200">
              Find better locations within 30km radius
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex-1">

          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Quelle activité ? (ex: pique-nique, mariage, barbecue...)"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchAlternatives()}
              className="flex-1"
            />
            <Button 
              onClick={searchAlternatives}
              disabled={loading || !activity.trim()}
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <MapPin className="mr-2 h-4 w-4" />
                  Find
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {alternatives && (
            <div className="space-y-3">
              {alternatives.has_better_options ? (
                <>
                  <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 p-2">
                    <div className="text-sm font-medium text-green-700 dark:text-green-300">
                      🎉 {alternatives.good_alternatives.length} better location(s) found!
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    {alternatives.good_alternatives.slice(0, 3).map((alt, idx) => (
                      <div
                        key={idx}
                        onClick={() => onSelectLocation?.(alt.lat, alt.lon, alt.name)}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            {alt.name || `Location ${idx + 1}`}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alt.distance_km.toFixed(1)} km
                            </span>
                            <span className={`font-semibold ${
                              alt.probability_percent < 20 ? 'text-green-600 dark:text-green-400' :
                              alt.probability_percent < 30 ? 'text-blue-600 dark:text-blue-400' :
                              'text-yellow-600 dark:text-yellow-400'
                            }`}>
                              {alt.probability_percent.toFixed(1)}% risk
                            </span>
                          </div>
                        </div>
                        <div className="ml-3 text-2xl">
                          {alt.probability_percent < 20 ? '✅' :
                           alt.probability_percent < 30 ? '👍' : '⚠️'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 p-2">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      💡 <strong>{alternatives.good_alternatives[0].name}</strong> seems to be the best option for your {activity} ({alternatives.good_alternatives[0].distance_km.toFixed(1)}km away).
                    </p>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-border/50 bg-muted/20 p-3 text-sm text-muted-foreground">
                  No significantly better alternatives found within 30km radius. Weather conditions are similar across the region.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
