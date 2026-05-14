// Real Mapbox API wrappers (Geocoding + Directions)
// Token is provided via VITE_MAPBOX_TOKEN env or runtime localStorage entry.

const LS_KEY = "urbanpulse:mapbox_token";

export function getMapboxToken(): string {
  const env = (import.meta as any).env?.VITE_MAPBOX_TOKEN as string | undefined;
  if (env) return env;
  if (typeof window !== "undefined") return localStorage.getItem(LS_KEY) ?? "";
  return "";
}

export function setMapboxToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem(LS_KEY, token.trim());
}

export interface GeocodeFeature {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
}

export async function geocode(query: string, proximity?: [number, number]): Promise<GeocodeFeature[]> {
  const token = getMapboxToken();
  if (!token || !query.trim()) return [];
  const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("autocomplete", "true");
  url.searchParams.set("limit", "5");
  if (proximity) url.searchParams.set("proximity", `${proximity[0]},${proximity[1]}`);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  return (data.features ?? []).map((f: any) => ({
    id: f.id, place_name: f.place_name, center: f.center as [number, number],
  }));
}

export interface DirectionsRoute {
  geometry: { type: "LineString"; coordinates: [number, number][] };
  distance: number; // meters
  duration: number; // seconds
  weight_name?: string;
}

export type DirectionsProfile = "driving" | "walking" | "cycling" | "driving-traffic";

export async function directions(
  from: [number, number],
  to: [number, number],
  profile: DirectionsProfile = "walking",
): Promise<DirectionsRoute[]> {
  const token = getMapboxToken();
  if (!token) throw new Error("Missing Mapbox token");
  const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`;
  const url = new URL(`https://api.mapbox.com/directions/v5/mapbox/${profile}/${coords}`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("alternatives", "true");
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("overview", "full");
  url.searchParams.set("steps", "false");
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Directions request failed");
  const data = await res.json();
  return (data.routes ?? []) as DirectionsRoute[];
}
