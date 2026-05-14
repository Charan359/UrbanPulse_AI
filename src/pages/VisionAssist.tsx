import { Eye, Volume2, AlertTriangle, Footprints } from "lucide-react";
import { FeaturePage } from "@/components/FeaturePage";

function VisionAssist() {
  return (
    <FeaturePage
      eyebrow="VisionAssist AI"
      title="The city, narrated."
      tagline="AI Navigation for Visually Impaired Pedestrians"
      icon={Eye}
      color="emerald"
      description="On-device computer vision detects obstacles, uneven pavements, blocked pathways, construction zones and approaching vehicles, narrating real-time audio guidance: 'Vehicle approaching from the left. Safe crossing in 4 seconds.'"
      metrics={[
        { icon: Eye, label: "Detection Acc.", value: 98.2, suffix: "%" },
        { icon: Volume2, label: "Voice Latency", value: 38, suffix: "ms" },
        { icon: AlertTriangle, label: "Alerts/day", value: 14820 },
        { icon: Footprints, label: "Users Active", value: 3210 },
      ]}
      bullets={[
        "Obstacle & curb detection (YOLOv8)",
        "Smart-crossing assistant with traffic awareness",
        "Voice descriptions of surroundings",
        "Haptic feedback for direction changes",
      ]}
      apis={["/vision/analyze", "/vision/navigation", "/vision/alerts"]}
    />
  );
}

export default VisionAssist;
