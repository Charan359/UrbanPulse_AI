import type { LucideIcon } from "lucide-react";
import { Counter } from "./Counter";

export function MetricCard({
  icon: Icon, label, value, suffix = "", trend, color = "cyan", spark,
}: {
  icon: LucideIcon; label: string; value: number; suffix?: string;
  trend?: number; color?: "cyan" | "neon" | "emerald" | "violet"; spark?: number[];
}) {
  const glow = `glow-${color}`;
  return (
    <div className={`glass rounded-2xl p-5 ${glow} relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl`}
             style={{ background: "rgba(255,255,255,0.04)" }}>
          <Icon className="h-5 w-5" style={{ color: `var(--${color})` }}/>
        </div>
        {trend != null && (
          <span className={`text-xs font-mono ${trend >= 0 ? "text-[color:var(--emerald)]" : "text-[color:var(--destructive)]"}`}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-4 text-3xl font-semibold tabular-nums">
        <Counter to={value} suffix={suffix} decimals={value % 1 !== 0 ? 1 : 0}/>
      </div>
      <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      {spark && (
        <svg viewBox="0 0 100 30" className="mt-3 w-full h-8">
          <polyline
            fill="none"
            stroke={`var(--${color})`}
            strokeWidth="2"
            points={spark.map((v, i) => `${(i / (spark.length - 1)) * 100},${30 - (v / Math.max(...spark)) * 28}`).join(" ")}
            style={{ filter: `drop-shadow(0 0 4px var(--${color}))` }}
          />
        </svg>
      )}
    </div>
  );
}
