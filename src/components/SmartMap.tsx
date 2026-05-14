// Stylized "smart city" map with animated heat, AQI, routes and pulse markers (no Mapbox token needed)
import { useState } from "react";
import { Flame, Wind, Route, Shield, Eye } from "lucide-react";

const layers = [
  { id: "heat", label: "Heat", icon: Flame, color: "var(--neon)" },
  { id: "aqi", label: "AQI", icon: Wind, color: "var(--cyan)" },
  { id: "routes", label: "Routes", icon: Route, color: "var(--emerald)" },
  { id: "safety", label: "Safety", icon: Shield, color: "var(--violet)" },
  { id: "access", label: "Access", icon: Eye, color: "var(--accent)" },
];

export function SmartMap() {
  const [active, setActive] = useState<string[]>(["heat", "aqi", "routes"]);
  const toggle = (id: string) => setActive(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
  const on = (id: string) => active.includes(id);

  return (
    <div className="relative glass-strong rounded-3xl overflow-hidden h-[640px]">
      {/* base map */}
      <svg viewBox="0 0 1200 700" className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0,229,255,0.08)" strokeWidth="1"/>
          </pattern>
          <linearGradient id="path-grad" x1="0" x2="1">
            <stop offset="0%" stopColor="#00e5ff"/>
            <stop offset="100%" stopColor="#00ff9f"/>
          </linearGradient>
          <linearGradient id="path-safe" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c4dff"/>
            <stop offset="100%" stopColor="#00e5ff"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="700" fill="#06101e"/>
        <rect width="1200" height="700" fill="url(#grid2)"/>

        {/* "blocks" */}
        <g opacity="0.35">
          {Array.from({ length: 80 }).map((_, i) => {
            const x = (i % 10) * 120 + 20;
            const y = Math.floor(i / 10) * 80 + 20;
            return <rect key={i} x={x} y={y} width="100" height="60" rx="4" fill="#0c1a2e" stroke="rgba(0,229,255,0.08)"/>;
          })}
        </g>

        {/* roads */}
        <g stroke="rgba(255,255,255,0.08)" strokeWidth="2">
          {Array.from({ length: 9 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 80 + 80} x2="1200" y2={i * 80 + 80}/>)}
          {Array.from({ length: 11 }).map((_, i) => <line key={`v${i}`} x1={i * 120 + 20} y1="0" x2={i * 120 + 20} y2="700"/>)}
        </g>

        {/* heat overlay */}
        {on("heat") && (
          <g style={{ mixBlendMode: "screen" }}>
            <circle cx="280" cy="220" r="160" fill="#ff6b00" opacity="0.28"/>
            <circle cx="900" cy="180" r="200" fill="#ff2e63" opacity="0.22"/>
            <circle cx="700" cy="500" r="180" fill="#ff6b00" opacity="0.25"/>
          </g>
        )}
        {/* aqi overlay */}
        {on("aqi") && (
          <g style={{ mixBlendMode: "screen" }}>
            <circle cx="500" cy="350" r="220" fill="#00e5ff" opacity="0.18"/>
            <circle cx="1050" cy="500" r="180" fill="#00ff9f" opacity="0.22"/>
          </g>
        )}

        {/* shaded route */}
        {on("routes") && (
          <path d="M 80 600 C 250 500, 380 540, 500 420 S 800 300, 1080 240"
                fill="none" stroke="url(#path-grad)" strokeWidth="5" strokeLinecap="round"
                strokeDasharray="2000" strokeDashoffset="2000"
                style={{ animation: "route-draw 3s ease-out forwards", filter: "drop-shadow(0 0 8px #00e5ff)" }}/>
        )}

        {/* safety route */}
        {on("safety") && (
          <path d="M 120 120 C 320 220, 480 180, 620 280 S 980 380, 1120 620"
                fill="none" stroke="url(#path-safe)" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8"
                style={{ filter: "drop-shadow(0 0 6px #7c4dff)" }}/>
        )}

        {/* accessibility markers */}
        {on("access") && (
          <g>
            {[[200,150],[420,260],[760,360],[1000,540],[300,520]].map(([x,y],i)=>(
              <g key={i}>
                <circle cx={x} cy={y} r="14" fill="none" stroke="#00e5ff" strokeWidth="2" opacity="0.6">
                  <animate attributeName="r" values="14;28;14" dur="2.4s" repeatCount="indefinite" begin={`${i*0.4}s`}/>
                  <animate attributeName="opacity" values="0.7;0;0.7" dur="2.4s" repeatCount="indefinite" begin={`${i*0.4}s`}/>
                </circle>
                <circle cx={x} cy={y} r="5" fill="#00e5ff"/>
              </g>
            ))}
          </g>
        )}

        {/* live pulse points */}
        {[[290,210,"#ff6b00"],[860,180,"#ff2e63"],[680,490,"#ff6b00"],[1080,240,"#00ff9f"]].map(([x,y,c],i)=>(
          <g key={i}>
            <circle cx={x as number} cy={y as number} r="6" fill={c as string}/>
            <circle cx={x as number} cy={y as number} r="6" fill="none" stroke={c as string} strokeWidth="2">
              <animate attributeName="r" values="6;28;6" dur="2s" repeatCount="indefinite" begin={`${i*0.5}s`}/>
              <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" begin={`${i*0.5}s`}/>
            </circle>
          </g>
        ))}
      </svg>

      {/* layer toggles */}
      <div className="absolute top-4 left-4 glass rounded-2xl p-2 flex flex-col gap-1">
        {layers.map(l => {
          const active = on(l.id);
          return (
            <button key={l.id} onClick={() => toggle(l.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition ${active ? "bg-white/10" : "hover:bg-white/5 opacity-60"}`}>
              <l.icon className="h-4 w-4" style={{ color: l.color }}/>
              {l.label}
              <span className={`ml-2 h-2 w-2 rounded-full`} style={{ background: active ? l.color : "transparent", border: `1px solid ${l.color}` }}/>
            </button>
          );
        })}
      </div>

      {/* live HUD */}
      <div className="absolute top-4 right-4 glass rounded-2xl px-4 py-3 text-xs space-y-1 font-mono">
        <div className="flex items-center gap-2 text-[color:var(--emerald)]">
          <span className="h-2 w-2 rounded-full bg-[color:var(--emerald)] animate-glow-pulse"/> LIVE FEED
        </div>
        <div className="text-muted-foreground">12.9716°N · 77.5946°E</div>
        <div>Sensors: <span className="text-foreground">2,481 online</span></div>
        <div>Latency: <span className="text-[color:var(--accent)]">38ms</span></div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 glass rounded-2xl p-4 flex flex-wrap items-center gap-4 text-xs">
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
