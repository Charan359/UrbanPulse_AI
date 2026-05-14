import { Link } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { SmartMap } from "@/components/SmartMap";
import { BeforeAfter } from "@/components/BeforeAfter";
import { ArrowRight, Cpu, Globe2, Activity } from "lucide-react";

function Index() {
  return (
    <>
      <Hero />

      <Features />

      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">Live City Map</div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Real-time intelligence overlays</h2>
            </div>
            <p className="text-muted-foreground max-w-md">Toggle heat, AQI, safety, accessibility, and AI-optimized routes across the metro grid.</p>
          </div>
          <SmartMap />
        </div>
      </section>

      <section id="demo" className="relative py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">AI Simulation</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Before · After — drag to compare</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">Generative urbanism reimagines streets with cooler corridors, green roofs, walkable plazas and clean-air paths.</p>
          <div className="mt-10"><BeforeAfter /></div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-strong rounded-3xl p-10 lg:p-14 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="relative grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">Built for the next century</div>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">A smart-city OS that scales from neighborhoods to nations.</h2>
                <p className="mt-4 text-muted-foreground">Modular AI engines, real-time sensor fusion and a unified API — deployable on any cloud, embeddable in any city dashboard.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium glow-orange"
                        style={{ background: "var(--gradient-heat)" }}>
                    Open Command Center <ArrowRight className="h-4 w-4"/>
                  </Link>
                  <Link to="/about" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium glass hover:bg-white/5">
                    Read the white paper
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Cpu, label: "Modular AI engines", value: "8 services" },
                  { icon: Globe2, label: "Cities online", value: "26 metros" },
                  { icon: Activity, label: "Daily decisions", value: "4.8M / day" },
                ].map((s, i) => (
                  <div key={i} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl grid place-items-center glow-cyan" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <s.icon className="h-5 w-5 text-[color:var(--accent)]"/>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
                      <div className="text-lg font-semibold">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Index;
