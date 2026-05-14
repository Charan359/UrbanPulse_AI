import { Bot, Send, Sparkles, X, Loader2, Mic, MicOff, Volume2, VolumeX, Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { askUrbanPulseAI } from "@/lib/groq";
import { speak, stopSpeaking, startListening, stopListening, VOICE_LANGUAGES } from "@/lib/voice";

const seed = [
  { role: "ai", text: "Hi, I'm UrbanPulse AI. Ask me about heat, air quality, safety, or accessibility in your city. You can also speak to me — tap the 🎤 mic button!" },
];
const presets = [
  "Which route has the best air quality?",
  "Suggest climate-safe redesign ideas.",
  "Which pathway is safest right now?",
  "How can MG Road become cooler?",
];

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{role: 'ai' | 'user', text: string}[]>(seed as any);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceLang, setVoiceLang] = useState('');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, isTyping, interimText]);

  // Speak AI responses if voice is enabled
  const speakResponse = (text: string) => {
    if (!voiceEnabled) return;
    // Strip markdown for cleaner speech
    const clean = text.replace(/[*_#`]/g, '').replace(/\[.*?\]\(.*?\)/g, '').trim();
    speak(clean, voiceLang || 'en-IN');
  };

  const send = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const nextMsgs = [...msgs, { role: "user" as const, text }];
    setMsgs(nextMsgs);
    setInput("");
    setInterimText("");
    setIsTyping(true);

    const chatHistory = nextMsgs.map(m => ({
      role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
      content: m.text
    }));

    const responseText = await askUrbanPulseAI(chatHistory);
    
    setMsgs([...nextMsgs, { role: "ai", text: responseText }]);
    setIsTyping(false);
    speakResponse(responseText);
  };

  const toggleMic = () => {
    if (listening) {
      stopListening();
      setListening(false);
      // Send whatever was captured
      if (interimText.trim()) {
        send(interimText.trim());
      }
    } else {
      setInterimText("");
      const started = startListening({
        lang: voiceLang,
        continuous: true,
        onResult: (transcript, isFinal) => {
          if (isFinal) {
            setInterimText(prev => (prev + ' ' + transcript).trim());
          } else {
            setInput(transcript);
          }
        },
        onError: (err) => {
          console.error("Voice error:", err);
          setListening(false);
        },
        onEnd: () => {
          setListening(false);
        },
      });
      if (started) setListening(true);
    }
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full glow-orange grid place-items-center animate-pulse-ring"
        style={{ background: "var(--gradient-aurora)" }} aria-label="AI Assistant">
        <Bot className="h-6 w-6 text-white"/>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] glass-strong rounded-3xl overflow-hidden shadow-2xl animate-rise">
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: "var(--gradient-aurora)" }}>
                <Sparkles className="h-4 w-4 text-white"/>
              </div>
              <div>
                <div className="text-sm font-semibold">UrbanPulse AI</div>
                <div className="text-[10px] uppercase tracking-widest text-[color:var(--emerald)]">
                  {listening ? '🔴 Listening…' : '● Online'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Voice on/off */}
              <button onClick={toggleVoice} className="p-1.5 rounded hover:bg-white/10 transition"
                title={voiceEnabled ? 'Mute voice' : 'Enable voice'}>
                {voiceEnabled ? <Volume2 className="h-3.5 w-3.5 text-[color:var(--emerald)]" /> : <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>
              {/* Language picker */}
              <div className="relative">
                <button onClick={() => setShowLangPicker(!showLangPicker)}
                  className="p-1.5 rounded hover:bg-white/10 transition" title="Voice language">
                  <Globe className="h-3.5 w-3.5" />
                </button>
                {showLangPicker && (
                  <div className="absolute right-0 top-8 z-50 glass-strong rounded-xl py-1 w-44 max-h-48 overflow-y-auto shadow-xl">
                    {VOICE_LANGUAGES.map(l => (
                      <button key={l.code} onClick={() => { setVoiceLang(l.code); setShowLangPicker(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 transition ${voiceLang === l.code ? 'text-[color:var(--cyan)] font-semibold' : ''}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => { setOpen(false); stopSpeaking(); stopListening(); setListening(false); }}
                className="p-1.5 rounded hover:bg-white/10"><X className="h-4 w-4"/></button>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto" ref={scrollRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] text-sm rounded-2xl px-3 py-2 ${
                  m.role === "user" ? "bg-[color:var(--accent)]/20 text-foreground" : "glass"
                }`} style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] text-sm rounded-2xl px-3 py-2 glass flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[color:var(--cyan)]" /> Thinking...
                </div>
              </div>
            )}
            {listening && interimText && (
              <div className="flex justify-end">
                <div className="max-w-[80%] text-sm rounded-2xl px-3 py-2 bg-[color:var(--accent)]/10 text-muted-foreground italic">
                  🎤 {interimText}
                </div>
              </div>
            )}
          </div>

          {/* Presets */}
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {presets.map(p => (
              <button key={p} onClick={() => send(p)} className="text-[11px] glass rounded-full px-2.5 py-1 hover:bg-white/10">
                {p}
              </button>
            ))}
          </div>

          {/* Input + Voice */}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="p-3 border-t border-white/10 flex gap-2">
            <button type="button" onClick={toggleMic}
              className={`rounded-xl px-3 grid place-items-center transition-all ${listening ? 'glow-orange animate-pulse' : 'hover:bg-white/10'}`}
              style={listening ? { background: "var(--gradient-heat)" } : {}}
              title={listening ? "Stop listening" : "Start voice input"}>
              {listening ? <MicOff className="h-4 w-4 text-white" /> : <Mic className="h-4 w-4" />}
            </button>
            <input value={listening ? interimText : input}
                   onChange={(e) => { if (!listening) setInput(e.target.value); }}
                   disabled={isTyping}
                   placeholder={listening ? "Speak now…" : "Ask UrbanPulse…"}
                   className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--accent)] disabled:opacity-50"/>
            <button disabled={isTyping || (!input.trim() && !interimText.trim())}
              className="rounded-xl px-3 grid place-items-center glow-cyan disabled:opacity-50"
              style={{ background: "var(--gradient-cool)" }}>
              <Send className="h-4 w-4 text-[color:var(--primary-foreground)]"/>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
