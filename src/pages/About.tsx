import { Cpu, Globe2, Sparkles, Cloud, Database, Lock } from "lucide-react";

function About() {
  return (
    <div className="pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">About</div>
        <h1 className="mt-3 text-5xl font-bold tracking-tight">
          A climate-intelligence <span className="text-gradient">command center</span> for the next billion urban citizens.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          UrbanPulse AI unifies eight specialized engines — heat, air, safety, accessibility, mobility, vision, generative urbanism and conversational AI —
          into a single real-time platform for cities, planners and citizens.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 gap-5">
          {[
            { icon: Cpu, t: "Modular AI engines", d: "Each engine is independently deployable and exposes a clean REST/GraphQL surface." },
            { icon: Cloud, t: "Edge + Cloud hybrid", d: "Inference runs at the sensor; aggregation and prediction happen in the cloud." },
            { icon: Database, t: "Realtime data fabric", d: "Sensor fusion across 60+ sources via an event-sourced backbone." },
            { icon: Globe2, t: "City-agnostic", d: "Plug into any GIS, any traffic API, any weather provider — adapters included." },
            { icon: Lock, t: "Privacy by design", d: "On-device CV, anonymized telemetry, role-based access and full audit trails." },
            { icon: Sparkles, t: "Generative redesign", d: "AI-assisted what-if planning with measurable climate & safety outcomes." },
          ].map((b, i) => (
            <div key={i} className="glass rounded-2xl p-5 hover:glow-cyan transition">
              <b.icon className="h-5 w-5 text-[color:var(--accent)]"/>
              <div className="mt-3 font-semibold">{b.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 glass-strong rounded-3xl p-8 glow-orange">
          <div className="text-xs uppercase tracking-[0.25em] text-[color:var(--neon)]">The mission</div>
          <p className="mt-3 text-2xl font-semibold leading-snug">
            "Designing cooler, safer, healthier and climate-resilient cities with AI."
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
