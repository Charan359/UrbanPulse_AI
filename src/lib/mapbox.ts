// Geocoding via Photon (free OSM) + Routing via OSRM (free OSM)
// No API key required!

export function getMapboxToken(): string {
  return "osm"; // Always truthy — no token needed
}

export function setMapboxToken(_token: string) {}

export interface GeocodeFeature {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
}

export async function geocode(query: string): Promise<GeocodeFeature[]> {
  if (!query.trim()) return [];

  // Photon — free OSM geocoder by Komoot, no auth needed
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "5");
  // Bias results towards Bengaluru
  url.searchParams.set("lat", "12.9716");
  url.searchParams.set("lon", "77.5946");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();

  return (data.features ?? []).map((f: any) => {
    const p = f.properties;
    const parts = [p.name, p.street, p.city, p.state, p.country].filter(Boolean);
    return {
      id: String(f.properties.osm_id ?? Math.random()),
      place_name: parts.join(", "),
      center: [f.geometry.coordinates[0], f.geometry.coordinates[1]] as [number, number],
    };
  });
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
  // OSRM public demo server — only supports 'driving' profile
  const coords = `${from[0]},${from[1]};${to[0]},${to[1]}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?alternatives=true&geometries=geojson&overview=full`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Directions request failed");
  const data = await res.json();

  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error(data.message || "No routes found");
  }

  // Scale duration for walking/cycling since OSRM only has driving
  const durationScale = profile === "walking" ? 4.5 : profile === "cycling" ? 2.0 : 1.0;

  return data.routes.map((r: any) => ({
    geometry: r.geometry,
    distance: r.distance,
    duration: r.duration * durationScale,
    weight_name: r.weight_name,
  }));
}
