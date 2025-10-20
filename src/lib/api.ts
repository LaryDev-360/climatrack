// ---- Types ----
export type RiskResponse = {
  probability_percent: number;
  risk_level: "low" | "moderate" | "elevated" | "high";
  message: string;
  threshold_mm: number;
  window: string;              // "14:00 - 18:00"
  date: string;                // "2025-10-10"
  location: { lat: number; lon: number };
  source: "forecast" | "climatology";
  confidence: "high" | "medium" | "low" | "historical";
  days_ahead: number | null;
};

// ---- Type Guard ----
export function isRiskResponse(x: any): x is RiskResponse {
  return x
    && typeof x.probability_percent === "number"
    && ["low","moderate","elevated","high"].includes(x.risk_level)
    && typeof x.message === "string"
    && typeof x.threshold_mm === "number"
    && typeof x.window === "string"
    && typeof x.date === "string"
    && x.location && typeof x.location.lat === "number" && typeof x.location.lon === "number"
    && ["forecast","climatology"].includes(x.source)
    && ["high","medium","low","historical"].includes(x.confidence)
    && (x.days_ahead === null || typeof x.days_ahead === "number");
}

// ---- API call ----
export async function fetchRisk(params: {
  lat: number;
  lon: number;
  dateISO: string; // yyyy-mm-dd
  h1: number;      // 0..23
  h2: number;      // 0..23 (h2>h1)
  mm: number;      // >0
}): Promise<RiskResponse> {
  // En dev: proxy Vite => /risk → http://localhost:8000/risk
  // En prod: si VITE_API_URL est défini, on le préfixe
  const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
  const prefix = base ? base : "";

  const url = `${prefix}/risk?lat=${params.lat}&lon=${params.lon}&date=${params.dateISO}&h1=${params.h1}&h2=${params.h2}&mm=${params.mm}`;
  // const url = `${prefix}/risk?lat=${params.lat}&lon=${params.lon}&date=${params.dateISO}&h1=${params.h1}&h2=${params.h2}&mm=${params.mm}`;

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const ct = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`API /risk error ${res.status} @ ${res.url}: ${text.slice(0,200)}`);
  }
  if (!ct.includes("application/json")) {
    throw new Error(`Expected JSON but got '${ct}' from ${res.url}. Preview: ${text.slice(0,200)}`);
  }

  const json = JSON.parse(text);
  if (!isRiskResponse(json)) {
    console.error("Bad payload:", json);
    throw new Error("Invalid /risk payload shape");
  }
  return json;
}
