import type { LucideIcon } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { SmartMap } from "./SmartMap";

export function FeaturePage({
  eyebrow, title, tagline, icon: Icon, color, description, metrics, bullets, apis,
}: {
  eyebrow: string; title: string; tagline: string; icon: LucideIcon;
  color: "neon" | "cyan" | "emerald" | "violet";
  description: string;
  metrics: { icon: LucideIcon; label: string; value: number; suffix?: string; trend?: number }[];
  bullets: string[];
  apis: string[];
}) {
  const glow = `glow-${color}`;
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div>
            <div className={`inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.25em]`}
                 style={{ color: `var(--${color})` }}>
              <Icon className="h-3.5 w-3.5"/> {eyebrow}
            </div>
            <h1 className="mt-4 text-4xl sm:text-6xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">{tagline}</p>
            <p className="mt-6 text-muted-foreground max-w-3xl">{description}</p>

            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((m, i) => (
                <MetricCard key={i} {...m} color={color} />
              ))}
            </div>
          </div>

          <div className={`glass-strong rounded-3xl p-6 ${glow} relative overflow-hidden`}>
            <div className="absolute inset-0 animate-scan-line"/>
            <div className="relative">
              <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Capabilities</div>
              <ul className="mt-4 space-y-2 text-sm">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full" style={{ background: `var(--${color})`, boxShadow: `0 0 6px var(--${color})` }}/>
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-xs uppercase tracking-[0.25em] text-muted-foreground">REST endpoints</div>
              <div className="mt-3 space-y-1.5 font-mono text-xs">
                {apis.map((a, i) => (
                  <div key={i} className="glass rounded-lg px-3 py-2 flex items-center justify-between">
                    <span><span className="text-[color:var(--accent)]">GET</span> {a}</span>
                    <span className="text-[color:var(--emerald)]">200</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <SmartMap />
        </div>
      </div>
    </div>
  );
}
