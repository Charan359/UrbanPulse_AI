import { useState, useEffect, useRef } from "react";
import { Eye, Volume2, VolumeX, AlertTriangle, Footprints, Mic, MicOff, Globe, Navigation, MapPin, Shield } from "lucide-react";
import { speak, stopSpeaking, startListening, stopListening, VOICE_LANGUAGES, isSpeaking } from "@/lib/voice";
import { askUrbanPulseAI } from "@/lib/groq";
import { useActiveRoute } from "@/contexts/RouteContext";

// Simulated obstacle alerts for the demo
const OBSTACLE_ALERTS = [
  { type: "warning", msg: "Pothole detected 3 meters ahead. Shift right.", delay: 3000 },
  { type: "info", msg: "Pedestrian crossing in 12 meters. Traffic signal is green. Safe to cross.", delay: 8000 },
  { type: "warning", msg: "Vehicle approaching from left. Wait 4 seconds.", delay: 14000 },
  { type: "success", msg: "Clear pathway ahead for 50 meters. Tree shade detected.", delay: 19000 },
  { type: "info", msg: "Turn right at Cubbon Park entrance. Tactile paving available.", delay: 25000 },
];

function VisionAssist() {
  const [voiceLang, setVoiceLang] = useState('en-IN');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [narrationOn, setNarrationOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [alerts, setAlerts] = useState<{ type: string; msg: string; time: string }[]>([]);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const alertTimers = useRef<NodeJS.Timeout[]>([]);
  const { activeRoute } = useActiveRoute();
  const alertsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (alertsEndRef.current) {
      alertsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [alerts]);

  // Start navigation simulation
  const startNavigation = () => {
    setNavActive(true);
    setAlerts([]);

    const routeDesc = activeRoute
      ? `Starting navigation from ${activeRoute.from.name.split(',')[0]} to ${activeRoute.to.name.split(',')[0]}.`
      : "Starting navigation demo. Walk forward.";

    speak(routeDesc, voiceLang);
    setAlerts([{ type: "info", msg: routeDesc, time: new Date().toLocaleTimeString() }]);

    // Queue obstacle alerts
    alertTimers.current = OBSTACLE_ALERTS.map(a =>
      setTimeout(() => {
        const entry = { ...a, time: new Date().toLocaleTimeString() };
        setAlerts(prev => [...prev, entry]);
        if (narrationOn) speak(a.msg, voiceLang);
      }, a.delay)
    );
  };

  const stopNavigation = () => {
    setNavActive(false);
    alertTimers.current.forEach(clearTimeout);
    alertTimers.current = [];
    stopSpeaking();
    speak("Navigation stopped.", voiceLang);
  };

  // Voice query to AI
  const askVoice = async (text: string) => {
    if (!text.trim()) return;
    setIsThinking(true);
    setVoiceQuery(text);
    const response = await askUrbanPulseAI([
      { role: 'system', content: `You are VisionAssist AI, helping a visually impaired pedestrian navigate safely. Keep answers very short (1-2 sentences), clear, and actionable. Speak as if narrating to someone who cannot see. Current language: ${voiceLang}` },
      { role: 'user', content: text },
    ]);
    setAiResponse(response);
    setIsThinking(false);
    speak(response, voiceLang);
  };

  const toggleMic = () => {
    if (listening) {
      stopListening();
      setListening(false);
    } else {
      setVoiceQuery("");
      setAiResponse("");
      const started = startListening({
        lang: voiceLang,
        continuous: false,
        onResult: (transcript, isFinal) => {
          setVoiceQuery(transcript);
          if (isFinal) {
            setListening(false);
            stopListening();
            askVoice(transcript);
          }
        },
        onError: () => setListening(false),
        onEnd: () => setListening(false),
      });
      if (started) {
        setListening(true);
        speak("Listening. Please speak now.", voiceLang);
      }
    }
  };

  // Cleanup
  useEffect(() => () => {
    alertTimers.current.forEach(clearTimeout);
    stopSpeaking();
    stopListening();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <main className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--emerald)]">● VisionAssist AI</div>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">The city, narrated.</h1>
            <p className="mt-2 text-lg text-muted-foreground">AI Navigation for Visually Impaired Pedestrians</p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xl">
              On-device computer vision detects obstacles, uneven pavements, blocked pathways, construction
              zones and approaching vehicles, narrating real-time audio guidance.
              Speak to VisionAssist in <strong>any language</strong> — it understands and responds.
            </p>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={navActive ? stopNavigation : startNavigation}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all ${navActive ? 'glow-orange' : 'glow-emerald'}`}
                style={{ background: navActive ? "var(--gradient-heat)" : "var(--gradient-cool)" }}>
                <Navigation className="h-4 w-4" />
                {navActive ? "Stop Navigation" : "Start Navigation"}
              </button>

              <button onClick={() => { setNarrationOn(!narrationOn); speak(narrationOn ? 'Voice narration off.' : 'Voice narration on. I will announce obstacles.', voiceLang); }}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium glass transition ${narrationOn ? 'glow-emerald' : ''}`}>
                {narrationOn ? <Volume2 className="h-4 w-4 text-[color:var(--emerald)]" /> : <VolumeX className="h-4 w-4" />}
                {narrationOn ? "Narration ON" : "Narration OFF"}
              </button>

              {/* Language picker */}
              <div className="relative">
                <button onClick={() => setShowLangPicker(!showLangPicker)}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium glass hover:bg-white/10">
                  <Globe className="h-4 w-4" />
                  {VOICE_LANGUAGES.find(l => l.code === voiceLang)?.label || 'Auto'}
                </button>
                {showLangPicker && (
                  <div className="absolute left-0 top-12 z-50 glass-strong rounded-xl py-1 w-52 max-h-60 overflow-y-auto shadow-xl">
                    {VOICE_LANGUAGES.map(l => (
                      <button key={l.code} onClick={() => { setVoiceLang(l.code); setShowLangPicker(false); speak(`Language set to ${l.label}.`, l.code || 'en-IN'); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition ${voiceLang === l.code ? 'text-[color:var(--cyan)] font-semibold' : ''}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Eye, label: "Detection Acc.", value: "98.2%" },
                { icon: Volume2, label: "Voice Latency", value: "38ms" },
                { icon: AlertTriangle, label: "Alerts/day", value: "14,820" },
                { icon: Footprints, label: "Users Active", value: "3,210" },
              ].map((m, i) => (
                <div key={i} className="glass rounded-2xl p-4 text-center">
                  <m.icon className="h-5 w-5 mx-auto text-[color:var(--emerald)]" />
                  <div className="mt-2 text-2xl font-bold">{m.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Capabilities + APIs */}
          <div className="lg:w-80 space-y-4">
            <div className="glass-strong rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Capabilities</div>
              <ul className="space-y-2 text-sm">
                {[
                  "Obstacle & curb detection (YOLOv8)",
                  "Smart-crossing with traffic awareness",
                  "Voice descriptions of surroundings",
                  "Haptic feedback for direction changes",
                  "Multilingual voice assistant (15 languages)",
                  "AI-powered route narration",
                ].map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--emerald)] mt-1.5 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-strong rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">REST Endpoints</div>
              <div className="space-y-2 font-mono text-xs">
                {["/vision/analyze", "/vision/navigation", "/vision/alerts", "/vision/voice-query"].map(api => (
                  <div key={api} className="flex justify-between items-center glass rounded-lg px-3 py-2">
                    <span><span className="text-[color:var(--emerald)]">GET</span> {api}</span>
                    <span className="text-[color:var(--emerald)]">200</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Voice Assistant Section */}
        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          {/* Voice Query Panel */}
          <div className="glass-strong rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-12 w-12 rounded-2xl grid place-items-center ${listening ? 'glow-orange animate-pulse' : 'glow-emerald'}`}
                style={{ background: listening ? "var(--gradient-heat)" : "rgba(255,255,255,0.04)" }}>
                {listening ? <Mic className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-[color:var(--emerald)]" />}
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Voice Assistant</div>
                <h3 className="text-lg font-semibold">
                  {listening ? 'Listening…' : 'Tap to speak'}
                </h3>
              </div>
            </div>

            <button onClick={toggleMic}
              className={`w-full rounded-2xl py-6 text-center text-lg font-medium transition-all ${
                listening ? 'glow-orange animate-pulse' : 'glass hover:bg-white/10'
              }`}
              style={listening ? { background: "var(--gradient-heat)" } : {}}>
              {listening ? (
                <span className="flex items-center justify-center gap-3">
                  <MicOff className="h-6 w-6" /> Stop Listening
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Mic className="h-6 w-6" /> Tap to Speak — Any Language
                </span>
              )}
            </button>

            {voiceQuery && (
              <div className="mt-4 glass rounded-2xl p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">You said:</div>
                <p className="text-sm font-medium">"{voiceQuery}"</p>
              </div>
            )}

            {isThinking && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 rounded-full border-2 border-[color:var(--cyan)] border-t-transparent animate-spin" />
                Processing your voice…
              </div>
            )}

            {aiResponse && (
              <div className="mt-3 glass rounded-2xl p-4 border-l-2" style={{ borderColor: "var(--emerald)" }}>
                <div className="text-[10px] uppercase tracking-widest text-[color:var(--emerald)] mb-1">AI Response (spoken aloud):</div>
                <p className="text-sm leading-relaxed">{aiResponse}</p>
              </div>
            )}
          </div>

          {/* Live Alert Feed */}
          <div className="glass-strong rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl grid place-items-center glow-cyan" style={{ background: "rgba(255,255,255,0.04)" }}>
                <Shield className="h-6 w-6 text-[color:var(--cyan)]" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Navigation Alerts</div>
                <h3 className="text-lg font-semibold">{navActive ? 'Live Feed' : 'Waiting…'}</h3>
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="glass rounded-2xl p-6 text-center text-muted-foreground text-sm">
                  <Navigation className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  Press "Start Navigation" to see live obstacle alerts
                </div>
              ) : (
                alerts.map((a, i) => (
                  <div key={i} className={`glass rounded-xl px-4 py-3 flex items-start gap-3 animate-rise ${
                    a.type === 'warning' ? 'border-l-2 border-[color:var(--neon)]' :
                    a.type === 'success' ? 'border-l-2 border-[color:var(--emerald)]' :
                    'border-l-2 border-[color:var(--cyan)]'
                  }`}>
                    <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
                      a.type === 'warning' ? 'text-[color:var(--neon)]' :
                      a.type === 'success' ? 'text-[color:var(--emerald)]' :
                      'text-[color:var(--cyan)]'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm">{a.msg}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{a.time}</p>
                    </div>
                    <button onClick={() => speak(a.msg, voiceLang)} className="p-1 rounded hover:bg-white/10 shrink-0" title="Read aloud">
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
              <div ref={alertsEndRef} />
            </div>

            {/* Active route info */}
            {activeRoute && (
              <div className="mt-4 glass rounded-2xl p-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Active Route</div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-[color:var(--emerald)]" />
                  <span className="font-medium">{activeRoute.from.name.split(',')[0]}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{activeRoute.to.name.split(',')[0]}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default VisionAssist;
