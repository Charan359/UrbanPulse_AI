import { Bot, Send, Sparkles, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { askUrbanPulseAI } from "@/lib/groq";

const seed = [
  { role: "ai", text: "Hi, I'm UrbanPulse AI. Ask me about heat, air quality, safety, or accessibility in your city." },
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, isTyping]);

  const send = async (text: string) => {
    if (!text.trim() || isTyping) return;
    const nextMsgs = [...msgs, { role: "user" as const, text }];
    setMsgs(nextMsgs);
    setInput("");
    setIsTyping(true);

    // Format for Groq
    const chatHistory = nextMsgs.map(m => ({
      role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
      content: m.text
    }));

    const responseText = await askUrbanPulseAI(chatHistory);
    
    setMsgs([...nextMsgs, { role: "ai", text: responseText }]);
    setIsTyping(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full glow-orange grid place-items-center animate-pulse-ring"
        style={{ background: "var(--gradient-aurora)" }} aria-label="AI Assistant">
        <Bot className="h-6 w-6 text-white"/>
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] glass-strong rounded-3xl overflow-hidden shadow-2xl animate-rise">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg grid place-items-center" style={{ background: "var(--gradient-aurora)" }}>
                <Sparkles className="h-4 w-4 text-white"/>
              </div>
              <div>
                <div className="text-sm font-semibold">UrbanPulse AI</div>
                <div className="text-[10px] uppercase tracking-widest text-[color:var(--emerald)]">● Online</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/10"><X className="h-4 w-4"/></button>
          </div>

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
          </div>

          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {presets.map(p => (
              <button key={p} onClick={() => send(p)} className="text-[11px] glass rounded-full px-2.5 py-1 hover:bg-white/10">
                {p}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="p-3 border-t border-white/10 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
                   disabled={isTyping}
                   placeholder="Ask UrbanPulse…"
                   className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--accent)] disabled:opacity-50"/>
            <button disabled={isTyping || !input.trim()} className="rounded-xl px-3 grid place-items-center glow-cyan disabled:opacity-50" style={{ background: "var(--gradient-cool)" }}>
              <Send className="h-4 w-4 text-[color:var(--primary-foreground)]"/>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
