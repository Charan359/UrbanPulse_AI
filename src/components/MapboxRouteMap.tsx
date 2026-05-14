import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ScoredRoute } from "@/lib/route-ai";

interface Props {
  from?: [number, number];
  to?: [number, number];
  routes: ScoredRoute[];
  activeKind?: string;
  onActivate?: (kind: string) => void;
}

function pulseIcon(color: string, size = 14) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px; height:${size}px; border-radius:50%;
      background:${color}; box-shadow: 0 0 12px ${color};
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function LeafletRouteMap({ from, to, routes, activeKind, onActivate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const markerLayerRef = useRef<L.LayerGroup>(L.layerGroup());

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [12.9716, 77.5946], // Bengaluru
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.attribution({ position: "bottomright" }).addTo(map);

    routeLayerRef.current.addTo(map);
    markerLayerRef.current.addTo(map);

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Draw routes and markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    routeLayerRef.current.clearLayers();
    markerLayerRef.current.clearLayers();

    // Origin / destination markers
    if (from) {
      L.marker([from[1], from[0]], { icon: pulseIcon("#00ff9f", 16) })
        .bindPopup("<b>Origin</b>")
        .addTo(markerLayerRef.current);
    }
    if (to) {
      L.marker([to[1], to[0]], { icon: pulseIcon("#ff6b00", 16) })
        .bindPopup("<b>Destination</b>")
        .addTo(markerLayerRef.current);
    }

    // Draw routes - inactive first, active last (on top)
    const ordered = [...routes].sort((a, b) =>
      a.kind === activeKind ? 1 : b.kind === activeKind ? -1 : 0
    );

    ordered.forEach((r) => {
      const isActive = r.kind === activeKind;
      const coords: [number, number][] = r.source.geometry.coordinates.map(
        (c: number[]) => [c[1], c[0]] as [number, number]
      );

      // Glow layer (wider, blurred)
      L.polyline(coords, {
        color: r.palette.color,
        weight: isActive ? 14 : 8,
        opacity: isActive ? 0.35 : 0.15,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(routeLayerRef.current);

      // Crisp line
      const line = L.polyline(coords, {
        color: r.palette.color,
        weight: isActive ? 5 : 3,
        opacity: isActive ? 1 : 0.6,
        lineCap: "round",
        lineJoin: "round",
      })
        .bindPopup(`<b>${r.palette.name}</b><br/>${r.distanceKm} km · ${r.etaMin} min`)
        .addTo(routeLayerRef.current);

      if (onActivate) {
        line.on("click", () => onActivate(r.kind));
      }
    });

    // Fit bounds
    if (routes.length) {
      const allCoords: [number, number][] = [];
      routes.forEach(r =>
        r.source.geometry.coordinates.forEach((c: number[]) =>
          allCoords.push([c[1], c[0]])
        )
      );
      if (allCoords.length) {
        map.fitBounds(L.latLngBounds(allCoords), { padding: [60, 60], maxZoom: 16 });
      }
    } else if (from && to) {
      map.fitBounds(
        L.latLngBounds([[from[1], from[0]], [to[1], to[0]]]),
        { padding: [60, 60], maxZoom: 15 }
      );
    } else if (from) {
      map.setView([from[1], from[0]], 14);
    }
  }, [routes, activeKind, from, to, onActivate]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
