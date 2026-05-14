import { useEffect, useMemo, useRef, useState } from "react";
import {
  Navigation, Sparkles, Wind, Flame, Shield, Accessibility,
  Bot, Clock, MapPin, Eye, ChevronRight, Zap, Sun, Users,
  Leaf, Activity, Volume2, Loader2,
} from "lucide-react";
import { LeafletRouteMap } from "@/components/MapboxRouteMap";
import {
  geocode, directions, getMapboxToken,
  type GeocodeFeature,
} from "@/lib/mapbox";
import { scoreRoutes, type ScoredRoute, ROUTE_PALETTES } from "@/lib/route-ai";
import { useActiveRoute } from "@/contexts/RouteContext";

function RoutesPage() {
  const [from, setFrom] = useState<GeocodeFeature | null>(null);
  const [to, setTo] = useState<GeocodeFeature | null>(null);
  const [profile, setProfile] = useState<"walking" | "driving" | "cycling">("walking");
  const [routes, setRoutes] = useState<ScoredRoute[]>([]);
  const [active, setActive] = useState<string>("ai");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setActiveRoute } = useActiveRoute();



  const findRoutes = async () => {
    setError(null);
    if (!from || !to) { setError("Please select locations from the dropdown suggestions."); return; }
    setLoading(true);
    try {
      const raw = await directions(from.center, to.center, profile);
      if (!raw.length) throw new Error("No routes found between those locations.");
      const scored = scoreRoutes(raw);
      setRoutes(scored);
      setActive("ai");
    } catch (e: any) {
      console.error("Route error:", e);
      setError(e?.message ?? "Routing failed. Please try different locations.");
    } finally {
      setLoading(false);
    }
  };

  const current = useMemo(
    () => routes.find(r => r.kind === active) ?? routes[0],
    [routes, active],
  );

  // Sync selected route to global context so other pages can show it
  useEffect(() => {
    if (current && from && to) {
      setActiveRoute({
        from: { name: from.place_name, center: from.center },
        to: { name: to.place_name, center: to.center },
        coordinates: current.source.geometry.coordinates,
        profile,
        kind: current.kind,
        color: current.palette.color,
      });
    }
  }, [current, from, to, profile]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <main className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--cyan)] mb-2 flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> AI Route Optimization · Live OpenStreetMap
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Real-World <span className="text-gradient">Smart Mobility</span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Real geocoding & directions, layered with AI-estimated thermal, air, safety and accessibility scoring.
            </p>
          </div>
          <LiveHud />
        </div>



        {/* Search panel */}
        <div className="glass-strong rounded-3xl p-4 md:p-5 mb-6 relative overflow-hidden">
          {loading && <div className="absolute inset-x-0 top-0 h-px bg-[color:var(--cyan)] animate-scan-line" />}
          <div className="grid md:grid-cols-12 gap-3 items-stretch">
            <PlaceField
              icon={MapPin} color="var(--emerald)" label="From"
              placeholder="Search source location"
              value={from} onSelect={setFrom}
            />
            <PlaceField
              icon={Navigation} color="var(--cyan)" label="To"
              placeholder="Search destination"
              value={to} onSelect={setTo}
            />
            <div className="md:col-span-2">
              <select
                value={profile}
                onChange={e => setProfile(e.target.value as typeof profile)}
                className="w-full h-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--cyan)]/40"
              >
                <option value="walking">Walking</option>
                <option value="cycling">Cycling</option>
                <option value="driving">Driving</option>
              </select>
            </div>
            <button
              onClick={findRoutes}
              disabled={loading || !from || !to}
              className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium glow-emerald disabled:opacity-50"
              style={{ background: "var(--gradient-cool)" }}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {loading ? "Routing…" : "Find Smart Routes"}
            </button>
          </div>

          {error && <div className="mt-3 text-xs text-[color:var(--destructive)]">{error}</div>}

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { k: "ai", label: "AI Recommended", icon: Sparkles },
              { k: "safest", label: "Safest", icon: Shield },
              { k: "coolest", label: "Coolest", icon: Flame },
              { k: "aqi", label: "Lowest AQI", icon: Wind },
              { k: "access", label: "Accessibility", icon: Accessibility },
              { k: "women", label: "Women-Safe", icon: Users },
            ].map(b => {
              const exists = routes.some(r => r.kind === b.k);
              return (
                <button key={b.k} onClick={() => exists && setActive(b.k)}
                  className={`inline-flex items-center gap-2 text-xs px-3 py-2 rounded-xl border transition ${
                    active === b.k ? "border-white/30 bg-white/10" :
                    exists ? "border-white/10 hover:bg-white/5 text-muted-foreground" :
                    "border-white/5 opacity-40 cursor-not-allowed text-muted-foreground"
                  }`}>
                  <b.icon className="h-3.5 w-3.5" /> {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map + side panel */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative h-[640px] rounded-3xl overflow-hidden glass-strong">
            <LeafletRouteMap
              from={from?.center} to={to?.center}
              routes={routes} activeKind={active} onActivate={setActive}
            />
            {current && (
              <div className="absolute bottom-4 left-4 glass rounded-2xl px-4 py-3 text-xs flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full animate-glow-pulse"
                      style={{ background: current.palette.color, boxShadow: `0 0 10px ${current.palette.color}` }}/>
                <span className="font-mono">{current.palette.name} active</span>
                <span className="text-muted-foreground">· {current.distanceKm} km · {current.etaMin} min</span>
              </div>
            )}
          </div>

          <div className="glass-strong rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-[color:var(--emerald)]" />
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Why this route?</div>
            </div>
            {current ? (
              <>
                <div className="text-2xl font-semibold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: current.palette.color, boxShadow: `0 0 10px ${current.palette.color}` }}/>
                  {current.palette.name}
                  {current.recommended && (
                    <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-[color:var(--emerald)]/15 text-[color:var(--emerald)]">AI Pick</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Ring label="Thermal" value={current.thermal} color="var(--neon)" />
                  <Ring label="Safety" value={current.safety} color="var(--violet)" />
                  <Ring label="Air Quality" value={100 - Math.min(100, current.aqi/3)} color="var(--cyan)" />
                  <Ring label="Access" value={current.access} color="var(--primary)" />
                </div>

                <div className="space-y-2 pt-2">
                  {current.reasons.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-[color:var(--emerald)]" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 p-3 text-xs flex items-start gap-2 bg-white/[0.02]">
                  <Volume2 className="h-4 w-4 mt-0.5 text-[color:var(--cyan)]" />
                  <span className="text-muted-foreground">
                    Voice: <span className="text-foreground">"Switching to {current.palette.name} — lower estimated exposure ahead."</span>
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
                  AI Estimated Score · environmental APIs unavailable
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter a source and destination, then run "Find Smart Routes" to compare AI-scored alternatives.
              </p>
            )}
          </div>
        </div>

        {/* Route comparison cards */}
        {routes.length > 0 && (
          <div className="mt-6">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Route Comparison</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {routes.map(r => (
                <RouteCard key={r.kind} r={r} active={active === r.kind} onClick={() => setActive(r.kind)} />
              ))}
            </div>
          </div>
        )}

        {/* AI factors */}
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <FactorTile icon={Sun} title="Sunlight Exposure" value={current ? `${current.sunlight}%` : "—"} color="var(--neon)" />
          <FactorTile icon={Leaf} title="Tree Coverage" value={current ? `${current.treeCover}%` : "—"} color="var(--emerald)" />
          <FactorTile icon={Wind} title="PM2.5" value={current ? `${current.pm25} µg/m³` : "—"} color="var(--cyan)" />
          <FactorTile icon={Shield} title="CCTV Density" value={current ? `${current.cctvDensity}%` : "—"} color="var(--violet)" />
          <FactorTile icon={Accessibility} title="Sidewalk Quality" value={current ? `${current.sidewalkQuality}%` : "—"} color="var(--primary)" />
          <FactorTile icon={Activity} title="Crowd Density" value={current ? `${current.crowdDensity}%` : "—"} color="var(--accent)" />
        </div>
      </main>
    </div>
  );
}

export default RoutesPage;

/* --- Sub-components --- */




function PlaceField({
  icon: Icon, color, label, placeholder, value, onSelect, disabled,
}: {
  icon: typeof MapPin; color: string; label: string; placeholder: string;
  value: GeocodeFeature | null; onSelect: (f: GeocodeFeature | null) => void; disabled?: boolean;
}) {
  const [q, setQ] = useState(value?.place_name ?? "");
  const [results, setResults] = useState<GeocodeFeature[]>([]);
  const [open, setOpen] = useState(false);
  const tRef = useRef<number | null>(null);

  useEffect(() => { setQ(value?.place_name ?? ""); }, [value?.id]);

  useEffect(() => {
    if (!q.trim() || q === value?.place_name) { setResults([]); return; }
    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(async () => {
      try {
        const r = await geocode(q);
        setResults(r); setOpen(true);
      } catch { setResults([]); }
    }, 250);
    return () => { if (tRef.current) window.clearTimeout(tRef.current); };
  }, [q, value?.place_name]);

  return (
    <div className="md:col-span-3 relative">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color }} />
        <input
          value={q}
          disabled={disabled}
          onChange={e => { setQ(e.target.value); if (value) onSelect(null); }}
          onFocus={() => results.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--cyan)]/40 disabled:opacity-50"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-30 left-0 right-0 mt-1 glass-strong rounded-xl overflow-hidden border border-white/10 max-h-72 overflow-y-auto">
          {results.map(r => (
            <button key={r.id}
              onMouseDown={e => e.preventDefault()}
              onClick={() => { onSelect(r); setQ(r.place_name); setOpen(false); }}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-white/5 border-b border-white/5 last:border-0">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-[color:var(--cyan)]" />
                <span className="truncate">{r.place_name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Ring({ label, value, color }: { label: string; value: number; color: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const c = 2 * Math.PI * 26;
  const off = c - (v / 100) * c;
  return (
    <div className="rounded-2xl border border-white/10 p-3 flex items-center gap-3 bg-white/[0.02]">
      <svg viewBox="0 0 64 64" className="h-14 w-14 -rotate-90">
        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <circle cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dashoffset .8s ease" }}/>
      </svg>
      <div>
        <div className="text-lg font-semibold tabular-nums">{v}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function RouteCard({ r, active, onClick }: { r: ScoredRoute; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`text-left rounded-2xl p-4 border transition relative overflow-hidden ${
        active ? "border-white/30 bg-white/[0.06]" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
      }`}>
      <span className="absolute inset-x-0 top-0 h-px" style={{ background: r.palette.color, boxShadow: `0 0 8px ${r.palette.color}` }}/>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: r.palette.color, boxShadow: `0 0 8px ${r.palette.color}` }}/>
          <span className="font-medium">{r.palette.name}</span>
        </div>
        {r.recommended && <span className="text-[10px] uppercase tracking-widest text-[color:var(--emerald)]">AI</span>}
      </div>
      <div className="mt-3 flex items-baseline gap-3">
        <div className="text-2xl font-semibold tabular-nums">{r.etaMin}<span className="text-xs text-muted-foreground"> min</span></div>
        <div className="text-xs text-muted-foreground tabular-nums">{r.distanceKm} km</div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        <Stat label="AQI" value={r.aqi} bad={r.aqi > 150}/>
        <Stat label="Heat" value={`${r.heatC}°`} bad={r.heatC > 38}/>
        <Stat label="Safe" value={r.safety} good={r.safety > 80}/>
        <Stat label="Acc" value={r.access} good={r.access > 80}/>
      </div>
      <div className="mt-3 text-[10px] flex items-center gap-1 text-muted-foreground">
        <Eye className="h-3 w-3" /> Exposure: <span className={
          r.exposure === "High" ? "text-[color:var(--destructive)]" :
          r.exposure === "Moderate" ? "text-[color:var(--accent)]" : "text-[color:var(--emerald)]"
        }>{r.exposure}</span>
      </div>
    </button>
  );
}

function Stat({ label, value, bad, good }: { label: string; value: number | string; bad?: boolean; good?: boolean }) {
  const color = bad ? "text-[color:var(--destructive)]" : good ? "text-[color:var(--emerald)]" : "text-foreground";
  return (
    <div>
      <div className={`text-sm font-mono ${color}`}>{value}</div>
      <div>{label}</div>
    </div>
  );
}

function FactorTile({ icon: Icon, title, value, color }: { icon: typeof Sun; title: string; value: string; color: string }) {
  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: "rgba(255,255,255,0.04)" }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

function LiveHud() {
  return (
    <div className="glass rounded-2xl px-4 py-3 flex items-center gap-4 text-xs font-mono">
      <span className="flex items-center gap-2 text-[color:var(--emerald)]">
        <span className="h-2 w-2 rounded-full bg-[color:var(--emerald)] animate-glow-pulse"/> AI ONLINE
      </span>
      <span className="text-muted-foreground">·</span>
      <span><Clock className="inline h-3 w-3 mr-1" />Live · OpenStreetMap</span>
    </div>
  );
}
