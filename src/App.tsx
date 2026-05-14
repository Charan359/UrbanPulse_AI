import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Assistant } from "@/components/Assistant";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages for code-splitting
const Index = lazy(() => import("@/pages/Index"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const RoutesPage = lazy(() => import("@/pages/RoutesPage"));
const ShadowPath = lazy(() => import("@/pages/ShadowPath"));
const AirSense = lazy(() => import("@/pages/AirSense"));
const SafePath = lazy(() => import("@/pages/SafePath"));
const VisionAssist = lazy(() => import("@/pages/VisionAssist"));
const About = lazy(() => import("@/pages/About"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageLoader() {
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[color:var(--cyan)] mx-auto" />
        <p className="text-sm text-muted-foreground font-mono">Loading module…</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Navbar />
      <main className="min-h-screen">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/shadowpath" element={<ShadowPath />} />
            <Route path="/airsense" element={<AirSense />} />
            <Route path="/safepath" element={<SafePath />} />
            <Route path="/visionassist" element={<VisionAssist />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Assistant />
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
