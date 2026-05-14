// Geocoding via Nominatim (free OSM) + Routing via OSRM (free OSM)
// No API key required!

const LS_KEY = "urbanpulse:mapbox_token";

export function getMapboxToken(): string {
  return "osm"; // Always return a truthy value so the UI never gates on a token
}

export function setMapboxToken(_token: string) {
  // No-op — we no longer need a token
}

export interface GeocodeFeature {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
}

export async function geocode(query: string, proximity?: [number, number]): Promise<GeocodeFeature[]> {
  if (!query.trim()) return [];

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "5");
  url.searchParams.set("addressdetails", "1");

  // Bias results towards Bengaluru
  if (proximity) {
    url.searchParams.set("viewbox", `${proximity[0] - 0.5},${proximity[1] - 0.5},${proximity[0] + 0.5},${proximity[1] + 0.5}`);
    url.searchParams.set("bounded", "0");
  } else {
    // Default: bias to Bengaluru, India
    url.searchParams.set("viewbox", "77.3,12.7,77.9,13.2");
    url.searchParams.set("bounded", "0");
  }

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "UrbanPulseAI/1.0" },
  });
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();

  return (data ?? []).map((item: any) => ({
    id: String(item.place_id),
    place_name: item.display_name,
    center: [parseFloat(item.lon), parseFloat(item.lat)] as [number, number],
  }));
}

export interface DirectionsRoute {
  geometry: { type: "LineString"; coordinates: [number, number][] };
  distance: number; // meters
  duration: number; // seconds
  weight_name?: string;
}

export type DirectionsProfile = "driving" | "walking" | "cycling" | "driving-traffic";

// Map our profile names to OSRM profile names
function osrmProfile(profile: DirectionsProfile): string {
  switch (profile) {
    case "walking": return "foot";
    case "cycling": return "bike";
    case "driving":
    case "driving-traffic":
    default: return "car";
  }
}

export async function directions(
  from: [number, number],
  to: [number, number],
  profile: DirectionsProfile = "walking",
): Promise<DirectionsRoute[]> {
  // OSRM public demo server — only supports 'driving' profile
  // We use driving geometry and scale duration for other modes
  const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?alternatives=true&geometries=geojson&overview=full`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Directions request failed");
  const data = await res.json();

  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error(data.message || "No routes found");
  }

  // Duration multipliers relative to driving
  const durationScale = profile === "walking" ? 4.5 : profile === "cycling" ? 2.0 : 1.0;

  return data.routes.map((r: any) => ({
    geometry: r.geometry,
    distance: r.distance,
    duration: r.duration * durationScale,
    weight_name: r.weight_name,
  }));
}
