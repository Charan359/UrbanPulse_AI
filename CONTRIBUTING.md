# Contributing to UrbanPulse AI

Thank you for your interest in contributing to UrbanPulse AI! This document provides guidelines for contributing to this hackathon project.

## 🌿 Branch Strategy

| Branch | Owner | Purpose |
|--------|-------|---------|
| `main` | Team | Stable, production-ready code |
| `charan-backend` | Charan | Backend, Supabase, APIs, AI |
| `shrujan-ui` | Shrujan | Frontend UI, dashboard, animations |
| `kruthika-maps-ai` | Kruthika | Maps, AQI overlays, route optimization |

## 📋 Commit Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add futuristic landing page
fix: resolve Supabase authentication bug
style: improve dashboard responsiveness
docs: update README architecture section
refactor: optimize route recommendation logic
```

## 🔧 Development Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/Charan359/UrbanPulse_AI.git
   cd UrbanPulse_AI
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your keys.

3. Start the dev server:
   ```bash
   npm run dev
   ```

## 🚀 Pull Request Process

1. Create your feature branch from `main`.
2. Make your changes with meaningful commits.
3. Ensure the build passes: `npm run build`.
4. Submit a PR with a clear description.

## 🏗️ Architecture

```
src/
├── components/     # Reusable UI components
│   └── ui/         # Shadcn UI primitives
├── contexts/       # React Context providers (Auth)
├── hooks/          # Custom React hooks
├── lib/            # Utilities (Supabase, Groq, Mapbox)
├── pages/          # Route page components
└── styles.css      # Global styles & design tokens
```
