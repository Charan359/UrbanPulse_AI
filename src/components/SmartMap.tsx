import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Flame, Wind, Route, Shield, Eye } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useActiveRoute } from "@/contexts/RouteContext";

const layers = [
  { id: "heat", label: "Heat", icon: Flame, color: "var(--neon)" },
  { id: "aqi", label: "AQI", icon: Wind, color: "var(--cyan)" },
  { id: "routes", label: "Routes", icon: Route, color: "var(--emerald)" },
  { id: "safety", label: "Safety", icon: Shield, color: "var(--violet)" },
  { id: "access", label: "Access", icon: Eye, color: "var(--accent)" },
];

// Bengaluru center
const CITY_CENTER: [number, number] = [12.9716, 77.5946];

// Simulated heat zones
const HEAT_ZONES = [
  { center: [12.975, 77.600] as [number, number], radius: 600, color: "#ff6b00", label: "MG Road — 42°C" },
  { center: [12.966, 77.580] as [number, number], radius: 500, color: "#ff2e63", label: "Town Hall — AQI 162" },
  { center: [12.980, 77.575] as [number, number], radius: 450, color: "#ff6b00", label: "Cubbon Park — 38°C" },
];

// AQI zones
const AQI_ZONES = [
  { center: [12.960, 77.595] as [number, number], radius: 700, color: "#00e5ff", label: "South Blvd — AQI 42" },
  { center: [12.985, 77.610] as [number, number], radius: 550, color: "#00ff9f", label: "Whitefield — AQI 28" },
];

// Safety markers
const SAFETY_MARKERS = [
  { pos: [12.974, 77.604] as [number, number], label: "CCTV Node · Brigade Rd", safe: true },
  { pos: [12.968, 77.590] as [number, number], label: "Low-Lit Zone · Avoid after 9PM", safe: false },
  { pos: [12.978, 77.582] as [number, number], label: "CCTV Node · Church St", safe: true },
  { pos: [12.982, 77.598] as [number, number], label: "Foot Traffic: High", safe: true },
];

// Accessibility points
const ACCESS_POINTS = [
  { pos: [12.972, 77.597] as [number, number], label: "Ramp Access · Metro Station" },
  { pos: [12.969, 77.585] as [number, number], label: "Tactile Path · Bus Stop" },
  { pos: [12.977, 77.570] as [number, number], label: "Audio Signal · Crossing" },
];

// ShadowPath route
const SHADOW_ROUTE: [number, number][] = [
  [12.963, 77.590], [12.967, 77.588], [12.970, 77.585],
  [12.974, 77.582], [12.977, 77.578], [12.980, 77.575],
  [12.983, 77.572],
];

// Safe path route
const SAFE_ROUTE: [number, number][] = [
  [12.970, 77.605], [12.972, 77.602], [12.974, 77.600],
  [12.976, 77.597], [12.978, 77.594], [12.980, 77.590],
];

function pulseIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:14px; height:14px; border-radius:50%;
      background:${color}; box-shadow: 0 0 12px ${color};
      animation: pulse-dot 2s ease-in-out infinite;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export function SmartMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const layerGroups = useRef<Record<string, L.LayerGroup>>({});
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userRouteLayer = useRef<L.LayerGroup>(L.layerGroup());
  const [active, setActive] = useState<string[]>(["heat", "aqi", "routes"]);
  const { theme } = useTheme();
  const { activeRoute } = useActiveRoute();

  const toggle = (id: string) =>
    setActive(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
  const on = (id: string) => active.includes(id);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      center: CITY_CENTER,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // Themed tiles
    const tileUrl = theme === 'light'
      ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    const tiles = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
    tileLayerRef.current = tiles;

    L.control.attribution({ position: "bottomright" }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // ── Heat layer ──
    const heatLayer = L.layerGroup();
    HEAT_ZONES.forEach(z => {
      L.circle(z.center, { radius: z.radius, color: z.color, fillColor: z.color, fillOpacity: 0.25, weight: 1 })
        .bindPopup(`<b>${z.label}</b>`)
        .addTo(heatLayer);
    });

    // ── AQI layer ──
    const aqiLayer = L.layerGroup();
    AQI_ZONES.forEach(z => {
      L.circle(z.center, { radius: z.radius, color: z.color, fillColor: z.color, fillOpacity: 0.2, weight: 1 })
        .bindPopup(`<b>${z.label}</b>`)
        .addTo(aqiLayer);
    });

    // ── Routes layer ──
    const routeLayer = L.layerGroup();
    L.polyline(SHADOW_ROUTE, { color: "#00ff9f", weight: 4, opacity: 0.8, dashArray: "10 6" })
      .bindPopup("<b>ShadowPath</b><br/>Coolest route · -5.4°C avg")
      .addTo(routeLayer);
    L.marker(SHADOW_ROUTE[0], { icon: pulseIcon("#00ff9f") }).bindPopup("Start").addTo(routeLayer);
    L.marker(SHADOW_ROUTE[SHADOW_ROUTE.length - 1], { icon: pulseIcon("#00ff9f") }).bindPopup("Destination").addTo(routeLayer);

    // ── Safety layer ──
    const safetyLayer = L.layerGroup();
    L.polyline(SAFE_ROUTE, { color: "#7c4dff", weight: 4, opacity: 0.8, dashArray: "8 8" })
      .bindPopup("<b>SafePath</b><br/>Highest safety score · 91%")
      .addTo(safetyLayer);
    SAFETY_MARKERS.forEach(m => {
      L.marker(m.pos, { icon: pulseIcon(m.safe ? "#7c4dff" : "#ff2e63") })
        .bindPopup(`<b>${m.label}</b>`)
        .addTo(safetyLayer);
    });

    // ── Accessibility layer ──
    const accessLayer = L.layerGroup();
    ACCESS_POINTS.forEach(p => {
      L.marker(p.pos, { icon: pulseIcon("#00e5ff") })
        .bindPopup(`<b>${p.label}</b>`)
        .addTo(accessLayer);
    });

    layerGroups.current = {
      heat: heatLayer,
      aqi: aqiLayer,
      routes: routeLayer,
      safety: safetyLayer,
      access: accessLayer,
    };

    leafletMap.current = map;

    return () => { map.remove(); leafletMap.current = null; };
  }, []);

  // Swap tiles when theme changes
  useEffect(() => {
    const map = leafletMap.current;
    if (!map || !tileLayerRef.current) return;
    const newUrl = theme === 'light'
      ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    tileLayerRef.current.setUrl(newUrl);
  }, [theme]);

  // Sync active layers
  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;
    Object.entries(layerGroups.current).forEach(([id, group]) => {
      if (active.includes(id)) {
        if (!map.hasLayer(group)) map.addLayer(group);
      } else {
        if (map.hasLayer(group)) map.removeLayer(group);
      }
    });
  }, [active]);

  // Draw user's active route from Route Engine
  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;
    userRouteLayer.current.clearLayers();
    if (!activeRoute) return;

    const coords: [number, number][] = activeRoute.coordinates.map(
      c => [c[1], c[0]] as [number, number]
    );

    // Glow
    L.polyline(coords, {
      color: activeRoute.color, weight: 12, opacity: 0.3, lineCap: "round", lineJoin: "round",
    }).addTo(userRouteLayer.current);
    // Crisp line
    L.polyline(coords, {
      color: activeRoute.color, weight: 4, opacity: 1, lineCap: "round", lineJoin: "round",
    }).bindPopup(`<b>${activeRoute.from.name.split(',')[0]} → ${activeRoute.to.name.split(',')[0]}</b>`)
      .addTo(userRouteLayer.current);

    // Markers
    L.marker(coords[0], { icon: pulseIcon("#00ff9f") })
      .bindPopup(`<b>From:</b> ${activeRoute.from.name.split(',')[0]}`)
      .addTo(userRouteLayer.current);
    L.marker(coords[coords.length - 1], { icon: pulseIcon("#ff6b00") })
      .bindPopup(`<b>To:</b> ${activeRoute.to.name.split(',')[0]}`)
      .addTo(userRouteLayer.current);

    if (!map.hasLayer(userRouteLayer.current)) map.addLayer(userRouteLayer.current);
    map.fitBounds(L.latLngBounds(coords), { padding: [60, 60], maxZoom: 15 });
  }, [activeRoute]);

  return (
    <div className="relative glass-strong rounded-3xl overflow-hidden h-[640px]">
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Layer toggles */}
      <div className="absolute top-4 left-4 z-[400] glass rounded-2xl p-2 flex flex-col gap-1">
        {layers.map(l => {
          const isActive = on(l.id);
          return (
            <button key={l.id} onClick={() => toggle(l.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition ${isActive ? "bg-white/10" : "hover:bg-white/5 opacity-60"}`}>
              <l.icon className="h-4 w-4" style={{ color: l.color }}/>
              {l.label}
              <span className="ml-2 h-2 w-2 rounded-full" style={{ background: isActive ? l.color : "transparent", border: `1px solid ${l.color}` }}/>
            </button>
          );
        })}
      </div>

      {/* Live HUD */}
      <div className="absolute top-4 right-4 z-[400] glass rounded-2xl px-4 py-3 text-xs space-y-1 font-mono">
        <div className="flex items-center gap-2 text-[color:var(--emerald)]">
          <span className="h-2 w-2 rounded-full bg-[color:var(--emerald)] animate-glow-pulse"/> LIVE FEED
        </div>
        <div className="text-muted-foreground">12.9716°N · 77.5946°E</div>
        <div>Sensors: <span className="text-foreground">2,481 online</span></div>
        <div>Latency: <span className="text-[color:var(--accent)]">38ms</span></div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] glass rounded-2xl p-4 flex flex-wrap items-center gap-4 text-xs">
        <Legend color="#ff6b00" label="Heat zone (>38°C)"/>
        <Legend color="#ff2e63" label="High AQI (>150)"/>
        <Legend color="#00ff9f" label="Cool corridor"/>
        <Legend color="#7c4dff" label="Safe path"/>
        <Legend color="#00e5ff" label="Accessibility node"/>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }}/>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
