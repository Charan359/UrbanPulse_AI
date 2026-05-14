import { useState } from "react";
import { Sun, Route, Shield, Wind, Eye, Image as ImageIcon, GitCompare, Bot, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Sun, title: "Urban Heat Intelligence", tag: "AirSense Climate Engine",
    desc: "Real-time heat exposure, UV intensity, concrete-vs-greenery analysis and pedestrian comfort scoring.",
    color: "neon", glow: "glow-orange", link: "/dashboard",
    detail: {
      what: "Uses satellite thermal imaging and IoT sensor data to map surface temperatures at the block level. AI models estimate pedestrian comfort by analyzing concrete-vs-greenery ratios, wind corridors, and sun angles.",
      metrics: ["Surface temperature (°C)", "UV index", "Pedestrian comfort score", "Concrete-to-green ratio"],
      tech: "Sentinel-2 thermal bands, OpenWeather API, sun position algorithms, random forest regression",
    }
  },
  {
    icon: Route, title: "ShadowPath AI", tag: "Thermal Comfort Navigation",
    desc: "Routes you through the coolest, shaded, low-pollution paths using sun position + tree cover data.",
    color: "cyan", glow: "glow-cyan", link: "/shadowpath",
    detail: {
      what: "Calculates sun angles in real-time and overlays tree canopy data to find routes with maximum shade. The algorithm penalizes south-facing exposed segments and rewards park-adjacent corridors.",
      metrics: ["Shade coverage %", "Tree canopy density", "Sun exposure minutes", "Temperature delta vs shortest route"],
      tech: "Solar position algorithm (SPA), LiDAR canopy data, OSRM routing with custom edge weights",
    }
  },
  {
    icon: Shield, title: "SafePath Guardian", tag: "Women Safety Routing",
    desc: "Avoids isolated streets, prefers lit, crowded, CCTV-monitored zones with live risk scoring.",
    color: "emerald", glow: "glow-emerald", link: "/safepath",
    detail: {
      what: "Combines CCTV density maps, street lighting data, foot traffic patterns, and historical incident reports to calculate a real-time safety score per street segment. Routes are optimized to maximize safety while minimizing detour distance.",
      metrics: ["Safety score (0–100)", "CCTV density", "Street lighting level", "Crowd density estimate"],
      tech: "Geospatial incident clustering, foot traffic heatmaps, lighting classification from street-view imagery",
    }
  },
  {
    icon: Wind, title: "AirSense AI", tag: "Clean Air Intelligence",
    desc: "Predicts AQI, PM2.5/PM10, NO₂ exposure and recommends respiratory-safe corridors.",
    color: "cyan", glow: "glow-cyan", link: "/airsense",
    detail: {
      what: "Fuses government AQI station data with hyperlocal IoT sensor readings to predict air quality at 100m resolution. Routes pedestrians through the cleanest paths, avoiding industrial zones and traffic hotspots.",
      metrics: ["AQI (0–500)", "PM2.5 (µg/m³)", "PM10", "NO₂ exposure", "Respiratory risk score"],
      tech: "Gradient-boosted AQI prediction, wind dispersion modeling, sensor fusion with Kalman filters",
    }
  },
  {
    icon: Eye, title: "VisionAssist AI", tag: "Accessibility Navigator",
    desc: "Voice guidance + obstacle detection for visually impaired pedestrians using on-device CV.",
    color: "violet", glow: "glow-violet", link: "/visionassist",
    detail: {
      what: "Uses phone camera and on-device computer vision to detect obstacles (poles, potholes, vehicles) in real-time. Provides haptic and voice feedback for navigation with support for tactile paving and audio traffic signals.",
      metrics: ["Obstacle detection accuracy", "Sidewalk quality score", "Tactile path coverage", "Audio signal availability"],
      tech: "YOLOv8 on-device inference, depth estimation, speech synthesis, vibration feedback API",
    }
  },
  {
    icon: ImageIcon, title: "Streetscape Analyzer", tag: "Computer Vision",
    desc: "Upload any street image — AI detects greenery loss, unsafe sidewalks, and suggests redesigns.",
    color: "neon", glow: "glow-orange", link: "/dashboard",
    detail: {
      what: "Processes street-level images with semantic segmentation to classify vegetation, pavement quality, street furniture, and hazards. Generates a health report with actionable recommendations for urban planners.",
      metrics: ["Green cover %", "Pavement condition score", "Walkability rating", "Hazard count"],
      tech: "DeepLab V3+ semantic segmentation, image quality assessment, GPT-4V for report generation",
    }
  },
  {
    icon: GitCompare, title: "Before / After Simulator", tag: "Generative Urbanism",
    desc: "Visualize an AI-redesigned city with cooler corridors, green roofs and walkable plazas.",
    color: "violet", glow: "glow-violet", link: "/dashboard",
    detail: {
      what: "Takes current street imagery and generates photorealistic renderings of climate-adapted redesigns — adding tree canopies, green roofs, permeable pavements, and rain gardens. Compares before/after thermal and AQI impact.",
      metrics: ["Temperature reduction estimate", "Green cover increase", "Runoff reduction", "AQI improvement"],
      tech: "Stable Diffusion inpainting, ControlNet for architectural coherence, thermal simulation models",
    }
  },
  {
    icon: Bot, title: "Smart City Assistant", tag: "Conversational AI",
    desc: "Ask anything about climate, safety, or accessibility — get cited, real-time recommendations.",
    color: "emerald", glow: "glow-emerald", link: "/dashboard",
    detail: {
      what: "A conversational AI powered by Groq's Llama 3 model that answers questions about urban climate, safety, mobility, and sustainability. Provides contextual recommendations based on the user's location and current conditions.",
      metrics: ["Response latency (<500ms)", "Context accuracy", "Citation rate", "User satisfaction"],
      tech: "Groq SDK, Llama 3 8B, RAG with urban knowledge base, location-aware context injection",
    }
  },
];

export function Features() {
  const [selected, setSelected] = useState<number | null>(null);
  const f = selected !== null ? features[selected] : null;

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
          {features.map((feat, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`group relative glass rounded-2xl p-6 text-left hover:${feat.glow} transition-all duration-500 hover:-translate-y-1 cursor-pointer`}>
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                   style={{ background: `radial-gradient(400px circle at 50% 0%, var(--${feat.color}) / 0.08, transparent 60%)` }} />
              <div className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl ${feat.glow}`}
                   style={{ background: "rgba(255,255,255,0.04)" }}>
                <feat.icon className="h-5 w-5" style={{ color: `var(--${feat.color})` }} />
              </div>
              <div className="mt-5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{feat.tag}</div>
              <h3 className="mt-1 text-lg font-semibold">{feat.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {f && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass-strong rounded-3xl max-w-2xl w-full p-8 max-h-[85vh] overflow-y-auto animate-rise"
               onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button onClick={() => setSelected(null)}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition">
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4">
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${f.glow}`}
                   style={{ background: "rgba(255,255,255,0.04)" }}>
                <f.icon className="h-7 w-7" style={{ color: `var(--${f.color})` }} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{f.tag}</div>
                <h3 className="text-2xl font-bold">{f.title}</h3>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-5">
              <div>
                <div className="text-xs uppercase tracking-widest text-[color:var(--cyan)] mb-2">What It Does</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.detail.what}</p>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-[color:var(--emerald)] mb-2">Key Metrics</div>
                <div className="grid grid-cols-2 gap-2">
                  {f.detail.metrics.map((m, i) => (
                    <div key={i} className="glass rounded-xl px-3 py-2 text-xs flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(--${f.color})` }} />
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-widest text-[color:var(--violet)] mb-2">Technology Stack</div>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed">{f.detail.tech}</p>
              </div>
            </div>

            {/* Action */}
            <Link to={f.link} onClick={() => setSelected(null)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium glow-emerald"
              style={{ background: "var(--gradient-cool)" }}>
              Explore {f.title} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
