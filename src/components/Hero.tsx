import { Link } from "react-router-dom";
import { Sparkles, PlayCircle, ArrowRight, Wind, Sun, Shield, Eye } from "lucide-react";
import { CityScene } from "./CityScene";
import { Counter } from "./Counter";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] pt-32 pb-20 overflow-hidden">
      <CityScene />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] text-[color:var(--accent)]">
          <span className="h-2 w-2 rounded-full bg-[color:var(--emerald)] animate-glow-pulse" />
          Live · Climate Intelligence Online
          <Sparkles className="h-3.5 w-3.5" />
        </div>

        <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight max-w-5xl animate-rise">
          AI-Powered <span className="text-gradient">Climate-Resilient</span>
          <br className="hidden sm:block" /> Smart City Intelligence Platform
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground animate-rise" style={{ animationDelay: ".1s" }}>
          UrbanPulse AI combines thermal safety, air quality intelligence, women safety, accessibility navigation,
          and sustainable mobility into one futuristic AI ecosystem.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 animate-rise" style={{ animationDelay: ".2s" }}>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium text-[color:var(--primary-foreground)] glow-orange hover:scale-[1.02] transition"
            style={{ background: "var(--gradient-heat)" }}
          >
            Launch Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#features" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium glass hover:bg-white/5 transition">
            Explore AI Features
          </a>
          <a href="#demo" className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium glass hover:bg-white/5 transition">
            <PlayCircle className="h-4 w-4 text-[color:var(--accent)]" /> Watch Demo
          </a>
        </div>

        {/* floating analytics cards */}
        <div className="relative mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 animate-rise" style={{ animationDelay: ".3s" }}>
          {[
            { icon: Sun, label: "Heat Index", value: 78.4, suffix: "°", glow: "glow-orange", color: "var(--neon)" },
            { icon: Wind, label: "Air Quality", value: 42, suffix: " AQI", glow: "glow-cyan", color: "var(--cyan)" },
            { icon: Shield, label: "Safety Score", value: 91, suffix: "%", glow: "glow-emerald", color: "var(--emerald)" },
            { icon: Eye, label: "Routes Optimized", value: 12480, suffix: "+", glow: "glow-violet", color: "var(--violet)" },
          ].map((s, i) => (
            <div key={i} className={`glass rounded-2xl p-5 ${s.glow} relative overflow-hidden animate-float`}
                 style={{ animationDelay: `${i * 0.4}s` }}>
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30"
                   style={{ background: `radial-gradient(circle, ${s.color}, transparent)` }}/>
              <s.icon className="h-5 w-5" style={{ color: `var(--${s.color === "var(--neon)" ? "neon" : s.color === "var(--cyan)" ? "cyan" : s.color === "var(--emerald)" ? "emerald" : "violet"})` }} />
              <div className="mt-4 text-3xl font-semibold tabular-nums">
                <Counter to={s.value} suffix={s.suffix} decimals={s.value < 100 && s.value % 1 !== 0 ? 1 : 0} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
