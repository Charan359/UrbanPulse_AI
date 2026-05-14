import { Route as RouteIcon, Sun, Thermometer, Leaf, Footprints } from "lucide-react";
import { FeaturePage } from "@/components/FeaturePage";

function ShadowPath() {
  return (
    <FeaturePage
      eyebrow="ShadowPath AI"
      title="Walk the city's coolest paths."
      tagline="AI-Powered Thermal Comfort Navigation"
      icon={RouteIcon}
      color="cyan"
      description="ShadowPath fuses sun position, tree canopy, surface albedo, traffic and pollution data to recommend the coolest, shaded, low-pollution path between any two points — updating every minute as the sun moves."
      metrics={[
        { icon: Thermometer, label: "Avg Temp Saved", value: 5.4, suffix: "°C" },
        { icon: Sun, label: "UV Avoided", value: 38, suffix: "%" },
        { icon: Leaf, label: "Canopy Coverage", value: 62, suffix: "%" },
        { icon: Footprints, label: "Routes Today", value: 2840, suffix: "+" },
      ]}
      bullets={[
        "Real-time sun position + 3D building shadow simulation",
        "Tree canopy density from satellite imagery",
        "Pollution & UV exposure penalty in routing graph",
        "Pedestrian-friendly preference weights",
      ]}
      apis={["/routes/shadowpath", "/routes/thermal", "/routes/optimize"]}
    />
  );
}

export default ShadowPath;
