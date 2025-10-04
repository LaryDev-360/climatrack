// src/lib/rain_to_sky.ts
// Convert rain probability (>= threshold mm) → readable sky summary & advice.

export type SkySummary = {
  label: string;
  subtitle: string;
  icon: "Sun" | "CloudSun" | "Cloud" | "CloudDrizzle" | "CloudRain" | "CloudLightning";
  color: string;
  bg: string;
  advice: string;
};

export function getSkySummary(probabilityPercent: number): SkySummary {
  const p = Math.max(0, Math.min(100, probabilityPercent));

  if (p <= 10) {
    return {
      label: "Sunny",
      subtitle: "Very low rain chance",
      icon: "Sun",
      color: "text-amber-500",
      bg: "bg-amber-50",
      advice: "Perfect conditions for outdoor activities.",
    };
  } else if (p <= 20) {
    return {
      label: "Mostly sunny",
      subtitle: "Low rain chance",
      icon: "CloudSun",
      color: "text-amber-600",
      bg: "bg-amber-50",
      advice: "Proceed as planned; keep an umbrella nearby.",
    };
  } else if (p <= 30) {
    return {
      label: "Partly cloudy",
      subtitle: "Isolated showers possible",
      icon: "CloudSun",
      color: "text-sky-600",
      bg: "bg-sky-50",
      advice: "Light rain possible; prepare light cover.",
    };
  } else if (p <= 40) {
    return {
      label: "Cloudy",
      subtitle: "Chance of showers",
      icon: "Cloud",
      color: "text-sky-700",
      bg: "bg-sky-50",
      advice: "Keep a tent or shelter close by.",
    };
  } else if (p <= 60) {
    return {
      label: "Showers likely",
      subtitle: "Moderate rain risk",
      icon: "CloudDrizzle",
      color: "text-blue-600",
      bg: "bg-blue-50",
      advice: "Plan for backup; rain gear recommended.",
    };
  } else if (p <= 80) {
    return {
      label: "Rain likely",
      subtitle: "High disruption risk",
      icon: "CloudRain",
      color: "text-blue-700",
      bg: "bg-blue-50",
      advice: "Consider rescheduling outdoor events.",
    };
  } else {
    return {
      label: "Heavy rain or storms",
      subtitle: "Very high disruption risk",
      icon: "CloudLightning",
      color: "text-red-600",
      bg: "bg-red-50",
      advice: "Move activities indoors; expect rainfall.",
    };
  }
}
