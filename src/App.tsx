import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Assistant } from "@/components/Assistant";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import RoutesPage from "@/pages/RoutesPage";
import ShadowPath from "@/pages/ShadowPath";
import AirSense from "@/pages/AirSense";
import SafePath from "@/pages/SafePath";
import VisionAssist from "@/pages/VisionAssist";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";

import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="min-h-screen">
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
      </main>
      <Footer />
      <Assistant />
    </AuthProvider>
  );
}

export default App;
