import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getMapboxToken } from "@/lib/mapbox";
import type { ScoredRoute } from "@/lib/route-ai";

interface Props {
  from?: [number, number];
  to?: [number, number];
  routes: ScoredRoute[];
  activeKind?: string;
  onActivate?: (kind: string) => void;
}

export function MapboxRouteMap({ from, to, routes, activeKind, onActivate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const token = getMapboxToken();
    if (!token) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: from ?? [77.5946, 12.9716],
      zoom: 12,
      pitch: 45,
      bearing: -10,
      attributionControl: false,
    });
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
    map.on("load", () => {
      // 3D buildings for the cyberpunk feel
      const layers = map.getStyle().layers ?? [];
      const labelLayer = layers.find(l => l.type === "symbol" && (l.layout as any)?.["text-field"]);
      map.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 13,
        paint: {
          "fill-extrusion-color": "#0c1a2e",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.7,
        },
      }, labelLayer?.id);
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render routes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      // remove old route layers/sources
      const existing = map.getStyle()?.layers ?? [];
      existing.forEach(l => {
        if (l.id.startsWith("route-")) map.removeLayer(l.id);
      });
      Object.keys(map.getStyle()?.sources ?? {}).forEach(id => {
        if (id.startsWith("route-")) map.removeSource(id);
      });
      // markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      if (from) markersRef.current.push(
        new mapboxgl.Marker({ color: "#00ff9f" }).setLngLat(from).addTo(map)
      );
      if (to) markersRef.current.push(
        new mapboxgl.Marker({ color: "#ff6b00" }).setLngLat(to).addTo(map)
      );

      // draw each route, active on top
      const ordered = [...routes].sort((a, b) =>
        a.kind === activeKind ? 1 : b.kind === activeKind ? -1 : 0
      );

      ordered.forEach((r) => {
        const id = `route-${r.kind}`;
        map.addSource(id, {
          type: "geojson",
          data: { type: "Feature", properties: {}, geometry: r.source.geometry as any },
        });
        const isActive = r.kind === activeKind;
        // glow halo
        map.addLayer({
          id: `${id}-glow`, type: "line", source: id,
          paint: {
            "line-color": r.palette.color,
            "line-width": isActive ? 14 : 8,
            "line-blur": isActive ? 10 : 6,
            "line-opacity": isActive ? 0.55 : 0.25,
          },
          layout: { "line-cap": "round", "line-join": "round" },
        });
        // crisp line
        map.addLayer({
          id, type: "line", source: id,
          paint: {
            "line-color": r.palette.color,
            "line-width": isActive ? 5 : 3,
            "line-opacity": isActive ? 1 : 0.7,
          },
          layout: { "line-cap": "round", "line-join": "round" },
        });

        if (onActivate) {
          map.on("click", id, () => onActivate(r.kind));
          map.on("mouseenter", id, () => (map.getCanvas().style.cursor = "pointer"));
          map.on("mouseleave", id, () => (map.getCanvas().style.cursor = ""));
        }
      });

      // fit bounds
      if (routes.length) {
        const bounds = new mapboxgl.LngLatBounds();
        routes.forEach(r => r.source.geometry.coordinates.forEach(c => bounds.extend(c as [number, number])));
        map.fitBounds(bounds, { padding: 80, duration: 1200, pitch: 45 });
      } else if (from && to) {
        map.fitBounds(new mapboxgl.LngLatBounds(from, to), { padding: 80, duration: 1000 });
      } else if (from) {
        map.flyTo({ center: from, zoom: 13, duration: 1000 });
      }
    };
    if (map.isStyleLoaded()) apply();
    else map.once("load", apply);
  }, [routes, activeKind, from, to, onActivate]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
