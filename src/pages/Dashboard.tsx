import { MetricCard } from "@/components/MetricCard";
import { SmartMap } from "@/components/SmartMap";
import { Sun, Wind, Shield, Eye, Leaf, Footprints, Thermometer, Gauge } from "lucide-react";

const sparks = [
  [4, 8, 6, 10, 7, 12, 9, 14, 11, 16],
  [12, 9, 14, 8, 13, 7, 11, 6, 9, 5],
  [3, 5, 4, 8, 7, 10, 9, 12, 11, 13],
  [9, 11, 8, 12, 10, 14, 12, 15, 13, 16],
];

function Dashboard() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">Command Center</div>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">Bengaluru · <span className="text-gradient">Live</span></h1>
            <p className="mt-2 text-muted-foreground text-sm font-mono">Sensors 2,481 online · Model UrbanPulse-v4.2 · Updated 12s ago</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full glass text-xs flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[color:var(--emerald)] animate-glow-pulse"/> All systems nominal
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Thermometer} label="Urban Heat Score" value={78.4} suffix="°" trend={-3.2} color="neon" spark={sparks[0]} />
          <MetricCard icon={Wind} label="AQI Index" value={42} trend={-12.1} color="cyan" spark={sparks[1]} />
          <MetricCard icon={Sun} label="Thermal Comfort" value={86} suffix="%" trend={2.4} color="emerald" spark={sparks[2]} />
          <MetricCard icon={Shield} label="Women Safety" value={91} suffix="%" trend={1.8} color="violet" spark={sparks[3]} />
          <MetricCard icon={Eye} label="Accessibility" value={74} suffix="%" trend={4.2} color="cyan" spark={sparks[0]} />
          <MetricCard icon={Leaf} label="Climate Resilience" value={68} trend={5.1} color="emerald" spark={sparks[2]} />
          <MetricCard icon={Gauge} label="Sustainability" value={82} suffix="%" trend={3.4} color="neon" spark={sparks[3]} />
          <MetricCard icon={Footprints} label="Walkability" value={71} trend={6.0} color="violet" spark={sparks[1]} />
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2"><SmartMap /></div>
          <div className="space-y-5">
            <div className="glass-strong rounded-3xl p-6 glow-cyan">
              <div className="text-xs uppercase tracking-[0.25em] text-[color:var(--accent)]">AI Recommendations</div>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  ["Reroute 12 buses through MG Rd → Cubbon Park", "AQI -38%"],
                  ["Deploy mist cooling at Town Hall plaza", "−4.2°C"],
                  ["Activate SafePath night corridor on Brigade Rd", "Safety +14%"],
                  ["Plant 180 native trees on Residency Rd", "+9 walkability"],
                ].map(([t, v], i) => (
                  <li key={i} className="flex items-start justify-between gap-3 glass rounded-xl p-3">
                    <span>{t}</span>
                    <span className="font-mono text-xs text-[color:var(--emerald)] whitespace-nowrap">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-strong rounded-3xl p-6 glow-orange relative overflow-hidden">
              <div className="text-xs uppercase tracking-[0.25em] text-[color:var(--neon)]">Heat Forecast · Next 6h</div>
              <svg viewBox="0 0 300 120" className="mt-3 w-full">
                <defs>
                  <linearGradient id="heatfill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b00" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#ff6b00" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0,80 L40,60 L80,70 L120,40 L160,30 L200,50 L240,35 L280,45 L300,40 L300,120 L0,120 Z" fill="url(#heatfill)"/>
                <polyline points="0,80 40,60 80,70 120,40 160,30 200,50 240,35 280,45 300,40"
                          fill="none" stroke="#ff6b00" strokeWidth="2" style={{ filter: "drop-shadow(0 0 6px #ff6b00)" }}/>
              </svg>
              <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground">
                <span>now</span><span>+1h</span><span>+2h</span><span>+3h</span><span>+4h</span><span>+5h</span><span>+6h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
