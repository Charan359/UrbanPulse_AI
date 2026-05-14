<p align="center">
  <img src="https://img.shields.io/badge/UrbanPulse-AI-ff6b00?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMiAyMmgyMEwxMiAyeiIgZmlsbD0iI2ZmNmIwMCIvPjwvc3ZnPg==" alt="UrbanPulse AI"/>
  <br/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" alt="Vite"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?style=flat-square&logo=supabase" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Groq-LLM-F55036?style=flat-square" alt="Groq"/>
  <img src="https://img.shields.io/badge/Leaflet-OpenStreetMap-199900?style=flat-square&logo=leaflet" alt="Leaflet"/>
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
6. Generates **6 AI-scored route alternatives** per search with multi-factor comparison.
7. Supports **dark & light themes** across the entire app including maps.
8. **Voice AI** — speaks navigation alerts aloud and accepts voice commands in **15 languages**.

---

## 🔥 Core Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | **Urban Heat Intelligence** | Live block-level thermal comfort mapping with sun-position simulation |
| 2 | **ShadowPath AI** | Sun-aware routing that avoids UV exposure and hot surfaces |
| 3 | **SafePath Guardian AI** | CCTV, lighting, and incident-aware women safety navigation |
| 4 | **AirSense AI** | AQI-optimized routing with PM2.5, NO₂, and CO₂ predictions |
| 5 | **VisionAssist AI** | Voice-navigated obstacle detection + multilingual voice assistant (15 languages) |
| 6 | **AI Smart City Assistant** | Voice-enabled conversational AI powered by Groq (Llama 3) with TTS/STT |
| 7 | **Smart City Dashboard** | Real-time command center with sensor fusion and analytics |
| 8 | **AI Route Optimization** | Multi-factor route scoring (thermal + AQI + safety + accessibility) |
| 9 | **Interactive Leaflet Map** | Live OpenStreetMap with heat zones, AQI overlays, and route visualization |
| 10 | **Dark/Light Theme** | Full theme system with theme-aware maps (CARTO dark/light tiles) |
| 11 | **Voice AI Engine** | Multilingual TTS/STT using Web Speech API — 15 languages, zero API keys |

---

## 📊 Dashboard Sections

- 🏠 **Landing Page** — Cinematic hero with animated city scene
- 📈 **AI Heat Dashboard** — Live thermal metrics and heat forecasts
- 🌬️ **AQI Dashboard** — Air quality intelligence and sensor readings
- ♻️ **Sustainability Analytics** — Climate resilience and walkability scores
- 🗺️ **Interactive Leaflet Map** — OpenStreetMap with toggleable data overlays (heat, AQI, routes, safety, accessibility)
- 🌑 **ShadowPath Navigation** — Sun-aware cool-path finder
- 🛡️ **Women Safety Dashboard** — Safety index with CCTV and lighting data
- ♿ **VisionAssist** — Voice navigation with live obstacle alerts, multilingual voice assistant
- 🤖 **AI Chat Assistant** — Voice-enabled conversational AI (Groq + TTS/STT)
- 🛣️ **AI Route Engine** — 6-way route comparison with live factor tiles
- 🎤 **Voice AI** — Speak in any of 15 languages, AI responds aloud
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
│ Tailwind v4 │ Llama 3     │ Leaflet + OpenStreetMap  │
│ Glassmorphism│ Route AI   │ Photon Geocoder (OSM)    │
│ OKLCH Colors│ Score Engine│ OSRM Routing (OSM)       │
│ Theme System│ Voice AI    │ Web Speech API (TTS/STT) │
└─────────────┴─────────────┴─────────────────────────┘
```

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Shadcn UI primitives (46 components)
│   ├── Navbar.tsx        # Navigation with auth + theme toggle
│   ├── Hero.tsx          # Animated landing hero
│   ├── SmartMap.tsx       # Leaflet interactive map with overlays
│   ├── MapboxRouteMap.tsx # Leaflet route visualization map
│   ├── Assistant.tsx      # Voice-enabled Groq AI chat (TTS + STT + 15 languages)
│   ├── AuthModal.tsx      # Supabase login/signup overlay
│   ├── ProtectedRoute.tsx # Auth-gated route wrapper
│   ├── FeaturePage.tsx    # Reusable feature page template
│   └── MetricCard.tsx     # Glowing dashboard metric cards
├── contexts/
│   ├── AuthContext.tsx    # Supabase auth state provider
│   ├── ThemeContext.tsx   # Dark/light theme provider
│   └── RouteContext.tsx   # Shared route state across pages
├── hooks/
│   └── use-mobile.tsx     # Responsive breakpoint hook
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── groq.ts            # Groq AI client
│   ├── mapbox.ts          # Photon geocoding & OSRM routing (free OSM)
│   ├── route-ai.ts        # AI route scoring engine (6-way comparison)
│   ├── voice.ts           # Voice AI engine (TTS + STT, 15 languages)
│   ├── database.ts        # Supabase CRUD helpers
│   └── utils.ts           # Tailwind merge utility
├── pages/
│   ├── Index.tsx           # Landing page with feature modals
│   ├── Dashboard.tsx       # Command center
│   ├── RoutesPage.tsx      # AI route optimization (7 route cards)
│   ├── ShadowPath.tsx      # Thermal comfort navigation
│   ├── AirSense.tsx        # Air quality intelligence
│   ├── SafePath.tsx        # Women safety routing
│   ├── VisionAssist.tsx    # Voice navigation + multilingual voice assistant
│   ├── About.tsx           # Project information
│   └── NotFound.tsx        # 404 page
├── styles.css              # Global design tokens, animations & themes
├── App.tsx                 # Router & layout (ThemeProvider + RouteProvider + AuthProvider)
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
| Leaflet + OpenStreetMap | Interactive maps (CARTO dark/light tiles) |
| Recharts | Data visualization |
| Lucide Icons | Icon system |

### Backend & AI
| Technology | Purpose |
|-----------|---------|
| Supabase | Authentication + PostgreSQL database |
| Groq SDK (Llama 3) | Conversational AI assistant |
| Route AI Engine | Multi-factor route scoring (14 dimensions) |
| Web Speech API | Text-to-Speech + Speech-to-Text (15 languages, zero API keys) |

### APIs (All Free — No API Keys Required for Maps)
| API | Purpose |
|-----|---------|
| Photon (Komoot) | Geocoding — free OSM search, no auth |
| OSRM | Routing — free OSM directions with alternatives |
| OpenStreetMap | Base map tiles via CARTO (dark & light) |
| Supabase | Auth + database (requires project key) |
| Groq | AI chat (requires API key) |

---

## 🎨 Design System

- **Theme**: Dual-mode — Cyberpunk dark + Clean light, toggled via Navbar ☀️/🌙
- **Colors**: OKLCH color space with neon orange, cyan, emerald, violet accents (adapted per theme)
- **Effects**: Glassmorphism (frosted dark/white panels), glow effects, animated gradients
- **Typography**: Space Grotesk (headings), JetBrains Mono (data), Inter (body)
- **Animations**: Pulse rings, scan lines, gradient shifts, smooth transitions
- **Maps**: CARTO tiles switch automatically between `dark_all` and `light_all`

---

## 🛣️ Route AI Engine

The route engine generates **6 AI-scored alternatives** from a single OSRM result:

| Route | Optimizes For | Key Metrics |
|-------|--------------|-------------|
| **Shortest** | Fastest path | High heat/AQI exposure |
| **Coolest** | Low thermal exposure | Tree cover 78%+, heat ≤32°C |
| **Clean-Air** | Lowest PM2.5/AQI | AQI ≤55, avoids industrial zones |
| **Women-Safe** | CCTV + crowd density | Safety 89%+, CCTV 85%+ |
| **Accessibility** | Sidewalk quality | Sidewalk score 88%+, ramp access |
| **Safest** | Overall safety score | Safety 93%+, CCTV 82%+ |
| **AI Recommended** | Blended optimal | Weighted across all 14 factors |

Each route shows **6 live factor tiles**: Sunlight Exposure, Tree Coverage, PM2.5, CCTV Density, Sidewalk Quality, and Crowd Density.

---

## 🎤 Voice AI Engine

UrbanPulse AI includes a **fully multilingual voice system** built on the browser's native Web Speech API — **zero external API keys required**.

### Capabilities

| Feature | Description |
|---------|-------------|
| 🗣️ **Text-to-Speech** | AI narrates navigation alerts, route recommendations, and chat responses aloud |
| 🎙️ **Speech-to-Text** | Users speak questions in any language — transcribed and sent to Groq AI |
| 🌐 **15 Languages** | English, Hindi, Kannada, Telugu, Tamil, Malayalam, Marathi, Bengali, Gujarati, Spanish, French, Arabic, Chinese, Japanese + Auto-detect |
| 🧭 **VisionAssist Navigation** | Live obstacle alerts narrated aloud: "Pothole 3m ahead. Shift right." |
| 💬 **Voice Chat** | Tap mic → speak → AI responds in text + voice |
| 🔇 **Mute Control** | Toggle voice output on/off anytime |

### Where It's Used

1. **AI Assistant** (bottom-right chat bubble) — 🎤 mic button + 🌐 language picker + auto-speaks responses
2. **VisionAssist Page** (`/visionassist`) — Full voice navigation with obstacle alerts, voice query panel, and live alert feed
3. **Route recommendations** — Route narration for visually impaired users

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+
- A Supabase project (for auth & database)
- A Groq API key (for AI assistant)
- **No Mapbox token needed** — maps use free OpenStreetMap

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
