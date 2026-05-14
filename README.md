<p align="center">
  <img src="https://img.shields.io/badge/UrbanPulse-AI-ff6b00?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiAyMmgyMEwxMiAyeiIgZmlsbD0iI2ZmNmIwMCIvPjwvc3ZnPg==" alt="UrbanPulse AI"/>
  <br/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" alt="Vite"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?style=flat-square&logo=supabase" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Groq-LLM-F55036?style=flat-square" alt="Groq"/>
  <img src="https://img.shields.io/badge/Mapbox-GL-000?style=flat-square&logo=mapbox" alt="Mapbox"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License"/>
</p>

# 🏙️ UrbanPulse AI

> **"Designing Cooler, Safer, Healthier & Climate-Resilient Cities with AI."**

UrbanPulse AI is a **production-grade, futuristic AI-powered smart city intelligence platform** built for the next generation of human-centered cities. It provides real-time insights into urban heat, air quality, women safety routing, and accessibility navigation — powered by AI-driven recommendations and live sensor fusion.

---

## 🌍 Problem Statement

Cities are facing unprecedented challenges:

- 🔥 **Urban Heat Islands** — Concrete jungles trap heat, raising temperatures by 5–10°C above rural areas.
- 🌫️ **Air Pollution** — Over 90% of the world's population breathes polluted air (WHO).
- 🚶‍♀️ **Women Safety** — Poorly lit, isolated streets create danger zones, especially after dark.
- ♿ **Accessibility Gaps** — Visually impaired and mobility-challenged citizens lack safe navigation tools.
- 🌪️ **Climate Vulnerability** — Cities are unprepared for extreme weather events and rising temperatures.

**UrbanPulse AI addresses all of these with a single unified platform.**

---

## 💡 Our Solution

A modular, AI-powered **Smart City Operating System** that:

1. Maps urban heat in real-time and recommends cooler pedestrian corridors.
2. Scores air quality block-by-block and routes citizens through the cleanest paths.
3. Calculates women safety indices using CCTV density, lighting, foot traffic, and incident data.
4. Provides voice-navigated obstacle detection for visually impaired pedestrians.
5. Offers an AI assistant (powered by Groq LLM) for instant climate and urban planning queries.

---

## 🔥 Core Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | **Urban Heat Intelligence** | Live block-level thermal comfort mapping with sun-position simulation |
| 2 | **ShadowPath AI** | Sun-aware routing that avoids UV exposure and hot surfaces |
| 3 | **SafePath Guardian AI** | CCTV, lighting, and incident-aware women safety navigation |
| 4 | **AirSense AI** | AQI-optimized routing with PM2.5, NO₂, and CO₂ predictions |
| 5 | **VisionAssist AI** | Voice-navigated obstacle detection for visually impaired users |
| 6 | **AI Smart City Assistant** | Conversational AI powered by Groq (Llama 3) for urban queries |
| 7 | **Smart City Dashboard** | Real-time command center with sensor fusion and analytics |
| 8 | **AI Route Optimization** | Multi-factor route scoring (thermal + AQI + safety + accessibility) |
| 9 | **Climate Risk Prediction** | Forecasting urban heat events and pollution spikes |
| 10 | **Generative Urbanism** | AI-powered before/after city redesign visualizations |

---

## 📊 Dashboard Sections

- 🏠 **Landing Page** — Cinematic hero with animated city scene
- 📈 **AI Heat Dashboard** — Live thermal metrics and heat forecasts
- 🌬️ **AQI Dashboard** — Air quality intelligence and sensor readings
- ♻️ **Sustainability Analytics** — Climate resilience and walkability scores
- 🗺️ **Interactive Heatmap** — Mapbox GL with toggleable data overlays
- 🌑 **ShadowPath Navigation** — Sun-aware cool-path finder
- 🛡️ **Women Safety Dashboard** — Safety index with CCTV and lighting data
- ♿ **Accessibility Mode** — VisionAssist navigation interface
- 🤖 **AI Chat Assistant** — Real-time conversational AI (Groq-powered)
- ℹ️ **About Project** — Architecture, mission, and team

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   UrbanPulse AI                      │
│                  (React + Vite SPA)                   │
├─────────────┬─────────────┬─────────────────────────┤
│  Frontend   │   AI Layer  │      Data Layer          │
│             │             │                          │
│ React 19    │ Groq SDK    │ Supabase (Auth + DB)     │
│ Tailwind v4 │ Llama 3     │ Mapbox GL JS             │
│ Glassmorphism│ Route AI   │ OpenWeather API           │
│ OKLCH Colors│ Score Engine│ AQI Sensor APIs           │
│ Framer Motion│            │ Geolocation               │
└─────────────┴─────────────┴─────────────────────────┘
```

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Shadcn UI primitives (46 components)
│   ├── Navbar.tsx        # Navigation with auth integration
│   ├── Hero.tsx          # Animated landing hero
│   ├── SmartMap.tsx       # Mapbox interactive map
│   ├── Assistant.tsx      # Groq AI chat widget
│   ├── AuthModal.tsx      # Supabase login/signup overlay
│   ├── FeaturePage.tsx    # Reusable feature page template
│   └── MetricCard.tsx     # Glowing dashboard metric cards
├── contexts/
│   └── AuthContext.tsx    # Supabase auth state provider
├── hooks/
│   └── use-mobile.tsx     # Responsive breakpoint hook
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── groq.ts            # Groq AI client
│   ├── mapbox.ts          # Mapbox geocoding & directions
│   ├── route-ai.ts        # AI route scoring engine
│   └── utils.ts           # Tailwind merge utility
├── pages/
│   ├── Index.tsx           # Landing page
│   ├── Dashboard.tsx       # Command center
│   ├── RoutesPage.tsx      # AI route optimization
│   ├── ShadowPath.tsx      # Thermal comfort navigation
│   ├── AirSense.tsx        # Air quality intelligence
│   ├── SafePath.tsx        # Women safety routing
│   ├── VisionAssist.tsx    # Accessibility navigation
│   ├── About.tsx           # Project information
│   └── NotFound.tsx        # 404 page
├── styles.css              # Global design tokens & animations
├── App.tsx                 # Router & layout shell
└── main.tsx                # Vite entry point
```

---

## 💻 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 + Vite 7 | UI framework & build tool |
| TypeScript 5.8 | Type safety |
| Tailwind CSS v4 | Utility-first styling |
| Shadcn/UI + Radix | Accessible component library |
| Mapbox GL JS | Interactive 3D maps |
| Recharts | Data visualization |
| Lucide Icons | Icon system |

### Backend & AI
| Technology | Purpose |
|-----------|---------|
| Supabase | Authentication + PostgreSQL database |
| Groq SDK (Llama 3) | Conversational AI assistant |
| Route AI Engine | Multi-factor route scoring algorithm |

### APIs
| API | Purpose |
|-----|---------|
| Mapbox Geocoding | Location search |
| Mapbox Directions | Route generation |
| OpenWeather | Temperature & weather data |
| AQI APIs | Air quality sensor data |

---

## 🎨 Design System

- **Theme**: Cyberpunk smart-city aesthetic with dark mode
- **Colors**: OKLCH color space with neon orange, cyan, emerald, violet accents
- **Effects**: Glassmorphism, glow effects, animated gradients
- **Typography**: Space Grotesk (headings), JetBrains Mono (data), Inter (body)
- **Animations**: Pulse rings, scan lines, gradient shifts, smooth transitions

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+
- A Supabase project
- A Groq API key
- A Mapbox public token (optional, for live maps)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Charan359/UrbanPulse_AI.git
cd UrbanPulse_AI

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your keys

# 4. Start the development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
VITE_MAPBOX_TOKEN=your_mapbox_public_token
```

### Database Setup

Run the SQL schema in your Supabase SQL Editor:
```bash
# Located at: supabase/schema.sql
# Creates: user_profiles, saved_routes, citizen_reports tables
# Includes: RLS policies and auto-profile trigger
```

---

## 🌿 Branch Strategy

| Branch | Owner | Focus |
|--------|-------|-------|
| `main` | Team | Stable, production-ready |
| `charan-backend` | Charan | Backend, Supabase, APIs, AI integration |
| `shrujan-ui` | Shrujan | Frontend UI, dashboard, animations |
| `kruthika-maps-ai` | Kruthika | Maps, AQI overlays, route optimization |

---

## 👨‍💻 Team

| Name | Role | Responsibilities |
|------|------|------------------|
| **Charan** (Team Lead) | Backend & Integration | Supabase, APIs, Groq AI, deployment, final merge |
| **Shrujan** | Frontend & Design | Dashboard UI, animations, responsiveness, landing page |
| **Kruthika** | Maps & AI | Heatmaps, AQI overlays, ShadowPath, route optimization |

---

## 🏆 Hackathon Alignment

This project targets the following impact areas:

- ✅ **Climate Resilience** — Urban heat mapping and cooling corridor identification
- ✅ **Public Health** — AQI-aware routing for respiratory safety
- ✅ **Women Safety** — AI-powered safe navigation with real-time risk scoring
- ✅ **Accessibility** — Voice-navigated obstacle detection for visually impaired
- ✅ **Sustainability** — Green mobility and walkability optimization
- ✅ **Social Impact** — Human-centered design for inclusive smart cities

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for a climate-resilient future.<br/>
  <strong>UrbanPulse AI</strong> — Smart City OS for the Next Century.
</p>
