import { Sun, Route, Shield, Wind, Eye, Image as ImageIcon, GitCompare, Bot } from "lucide-react";

const features = [
  { icon: Sun, title: "Urban Heat Intelligence", tag: "AirSense Climate Engine", desc: "Real-time heat exposure, UV intensity, concrete-vs-greenery analysis and pedestrian comfort scoring.", color: "neon", glow: "glow-orange" },
  { icon: Route, title: "ShadowPath AI", tag: "Thermal Comfort Navigation", desc: "Routes you through the coolest, shaded, low-pollution paths using sun position + tree cover data.", color: "cyan", glow: "glow-cyan" },
  { icon: Shield, title: "SafePath Guardian", tag: "Women Safety Routing", desc: "Avoids isolated streets, prefers lit, crowded, CCTV-monitored zones with live risk scoring.", color: "emerald", glow: "glow-emerald" },
  { icon: Wind, title: "AirSense AI", tag: "Clean Air Intelligence", desc: "Predicts AQI, PM2.5/PM10, NO₂ exposure and recommends respiratory-safe corridors.", color: "cyan", glow: "glow-cyan" },
  { icon: Eye, title: "VisionAssist AI", tag: "Accessibility Navigator", desc: "Voice guidance + obstacle detection for visually impaired pedestrians using on-device CV.", color: "violet", glow: "glow-violet" },
  { icon: ImageIcon, title: "Streetscape Analyzer", tag: "Computer Vision", desc: "Upload any street image — AI detects greenery loss, unsafe sidewalks, and suggests redesigns.", color: "neon", glow: "glow-orange" },
  { icon: GitCompare, title: "Before / After Simulator", tag: "Generative Urbanism", desc: "Visualize an AI-redesigned city with cooler corridors, green roofs and walkable plazas.", color: "violet", glow: "glow-violet" },
  { icon: Bot, title: "Smart City Assistant", tag: "Conversational AI", desc: "Ask anything about climate, safety, or accessibility — get cited, real-time recommendations.", color: "emerald", glow: "glow-emerald" },
];

export function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">The AI Ecosystem</div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Eight intelligence engines. <span className="text-gradient">One operating system.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every module is independently deployable and unified through a real-time event bus —
            so the city responds the moment conditions change.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className={`group relative glass rounded-2xl p-6 hover:${f.glow} transition-all duration-500 hover:-translate-y-1`}>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                   style={{ background: `radial-gradient(400px circle at 50% 0%, var(--${f.color}) / 0.08, transparent 60%)` }} />
              <div className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl ${f.glow}`}
                   style={{ background: "rgba(255,255,255,0.04)" }}>
                <f.icon className="h-5 w-5" style={{ color: `var(--${f.color})` }} />
              </div>
              <div className="mt-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{f.tag}</div>
              <h3 className="mt-1 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
