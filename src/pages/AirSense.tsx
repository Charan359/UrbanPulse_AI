import { Wind, Activity, Droplets, Cloud } from "lucide-react";
import { FeaturePage } from "@/components/FeaturePage";

function AirSense() {
  return (
    <FeaturePage
      eyebrow="AirSense AI"
      title="Breathe the cleanest path."
      tagline="AI-Powered Clean Air Intelligence"
      icon={Wind}
      color="cyan"
      description="AirSense ingests live sensor + satellite data to predict AQI, PM2.5, PM10, CO₂ and NO₂ exposure block-by-block, scoring respiratory safety and surfacing the cleanest corridors for your commute."
      metrics={[
        { icon: Wind, label: "Live AQI", value: 42, trend: -12 },
        { icon: Droplets, label: "PM2.5", value: 18, suffix: " µg" },
        { icon: Cloud, label: "NO₂", value: 28, suffix: " ppb" },
        { icon: Activity, label: "Sensors", value: 2481 },
      ]}
      bullets={[
        "Hyperlocal AQI prediction (100m grid)",
        "Respiratory safety score per route",
        "Pollution-source attribution (traffic / industry / construction)",
        "WHO threshold alerts in real-time",
      ]}
      apis={["/aqi/analyze", "/aqi/predict", "/aqi/routes"]}
    />
  );
}

export default AirSense;
