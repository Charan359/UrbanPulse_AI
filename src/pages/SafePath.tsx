import { Shield, Camera, Users, MapPin } from "lucide-react";
import { FeaturePage } from "@/components/FeaturePage";

function SafePath() {
  return (
    <FeaturePage
      eyebrow="SafePath Guardian"
      title="Always on the safer side."
      tagline="AI-Powered Women Safety Navigation"
      icon={Shield}
      color="violet"
      description="SafePath Guardian computes a Women Safety Index from CCTV density, lighting, foot traffic, incident history and time-of-day — preferring lit, crowded, surveilled corridors and avoiding isolated streets."
      metrics={[
        { icon: Shield, label: "Safety Score", value: 91, suffix: "%", trend: 1.8 },
        { icon: Camera, label: "CCTV Nodes", value: 1240 },
        { icon: Users, label: "Foot Traffic", value: 4.2, suffix: "x" },
        { icon: MapPin, label: "Routes Served", value: 18420 },
      ]}
      bullets={[
        "Risk-zone detection from incident & lighting data",
        "Time-of-day adaptive routing",
        "One-tap SOS with live route share",
        "Trusted contacts geofence alerts",
      ]}
      apis={["/safety/analyze", "/safety/routes"]}
    />
  );
}

export default SafePath;
