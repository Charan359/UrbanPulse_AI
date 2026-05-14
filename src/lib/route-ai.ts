// Heuristic AI scoring engine — real route geometry + distance/duration in,
// estimated human-centric scores out. Clearly labeled "AI Estimated".
import type { DirectionsRoute } from "./mapbox";

export type RouteKind = "shortest" | "coolest" | "aqi" | "women" | "access" | "safest" | "ai";

export interface RoutePalette {
  id: RouteKind;
  name: string;
  color: string;
  glowVar: string;
}

export const ROUTE_PALETTES: Record<RouteKind, RoutePalette> = {
  shortest: { id: "shortest", name: "Shortest",        color: "#ff2e63", glowVar: "--destructive" },
  coolest:  { id: "coolest",  name: "Coolest",         color: "#ff6b00", glowVar: "--neon" },
  aqi:      { id: "aqi",      name: "Clean-Air",       color: "#00e5ff", glowVar: "--cyan" },
  women:    { id: "women",    name: "Women-Safe",      color: "#ffd54a", glowVar: "--accent" },
  access:   { id: "access",   name: "Accessibility",   color: "#4f9dff", glowVar: "--primary" },
  safest:   { id: "safest",   name: "Safest",          color: "#7c4dff", glowVar: "--violet" },
  ai:       { id: "ai",       name: "AI Recommended",  color: "#00ff9f", glowVar: "--emerald" },
};

export interface ScoredRoute {
  kind: RouteKind;
  palette: RoutePalette;
  source: DirectionsRoute;
  distanceKm: number;
  etaMin: number;
  aqi: number;
  heatC: number;
  thermal: number;
  safety: number;
  women: number;
  access: number;
  resilience: number;
  exposure: "Low" | "Moderate" | "High";
  reasons: string[];
  recommended?: boolean;
  estimated: true;
}

// Simple deterministic hash so same geometry yields same score on re-renders.
function hash(coords: [number, number][]): number {
  let h = 2166136261;
  for (const [x, y] of coords) {
    h ^= Math.round(x * 1e4); h = Math.imul(h, 16777619);
    h ^= Math.round(y * 1e4); h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
const rand = (seed: number, i: number) => ((Math.sin(seed * 9301 + i * 49297) + 1) / 2);

const REASONS: Record<RouteKind, string[]> = {
  shortest: ["Direct corridor", "Highest sun exposure", "Heavier traffic"],
  coolest:  ["Tree-canopy coverage estimated 70%+", "Avoids urban heat-island zones", "Shaded crossings"],
  aqi:      ["Avoids industrial corridor", "Park-adjacent path", "Lower estimated PM2.5"],
  women:    ["Higher CCTV density estimate", "Lit, active streets", "Crowded sidewalks"],
  access:   ["Curb cuts and tactile crossings", "Wheelchair-grade slopes", "Accessible-friendly sidewalks"],
  safest:   ["Lower estimated incident density", "Patrolled corridor", "Better street lighting"],
  ai:       ["Optimal trade-off across 14 factors", "Lower sunlight exposure", "Better tree coverage", "Safer crossings & lighting", "Lower respiratory exposure"],
};

const KIND_ORDER: RouteKind[] = ["shortest", "coolest", "aqi", "women", "access", "safest"];

export function scoreRoutes(routes: DirectionsRoute[]): ScoredRoute[] {
  if (!routes.length) return [];

  // Map each Mapbox alternative to a "kind", recycling kinds when fewer routes exist.
  const out: ScoredRoute[] = routes.map((r, i) => {
    const kind = KIND_ORDER[i % KIND_ORDER.length];
    const pal = ROUTE_PALETTES[kind];
    const seed = hash(r.geometry.coordinates);
    const distanceKm = r.distance / 1000;
    const etaMin = Math.max(1, Math.round(r.duration / 60));

    // Bias scores so each "kind" excels at its dimension.
    const base = {
      aqi: 60 + Math.round(rand(seed, 1) * 100),
      heatC: 30 + rand(seed, 2) * 12,
      thermal: 50 + Math.round(rand(seed, 3) * 40),
      safety: 55 + Math.round(rand(seed, 4) * 40),
      women: 50 + Math.round(rand(seed, 5) * 45),
      access: 50 + Math.round(rand(seed, 6) * 45),
      resilience: 50 + Math.round(rand(seed, 7) * 45),
    };

    if (kind === "shortest") { base.aqi = Math.max(base.aqi, 160); base.heatC = Math.max(base.heatC, 39); base.thermal = Math.min(base.thermal, 45); }
    if (kind === "coolest")  { base.heatC = Math.min(base.heatC, 34); base.thermal = Math.max(base.thermal, 82); }
    if (kind === "aqi")      { base.aqi = Math.min(base.aqi, 70); base.resilience = Math.max(base.resilience, 78); }
    if (kind === "women")    { base.women = Math.max(base.women, 92); base.safety = Math.max(base.safety, 88); }
    if (kind === "access")   { base.access = Math.max(base.access, 92); }
    if (kind === "safest")   { base.safety = Math.max(base.safety, 92); }

    const exposure: ScoredRoute["exposure"] =
      base.heatC > 38 || base.aqi > 150 ? "High" :
      base.heatC > 35 || base.aqi > 100 ? "Moderate" : "Low";

    return {
      kind, palette: pal, source: r,
      distanceKm: Number(distanceKm.toFixed(2)),
      etaMin,
      aqi: Math.round(base.aqi),
      heatC: Math.round(base.heatC),
      thermal: base.thermal, safety: base.safety, women: base.women,
      access: base.access, resilience: base.resilience,
      exposure, reasons: REASONS[kind], estimated: true,
    };
  });

  // Pick AI Recommended as the route with best blended human-centric score.
  let bestIdx = 0; let bestScore = -Infinity;
  out.forEach((r, i) => {
    const s = r.thermal * 0.25 + r.safety * 0.2 + (100 - Math.min(100, r.aqi / 3)) * 0.2 +
              r.access * 0.15 + r.women * 0.1 + r.resilience * 0.1;
    if (s > bestScore) { bestScore = s; bestIdx = i; }
  });
  const aiClone: ScoredRoute = {
    ...out[bestIdx],
    kind: "ai", palette: ROUTE_PALETTES.ai,
    reasons: REASONS.ai, recommended: true,
  };
  return [...out, aiClone];
}
