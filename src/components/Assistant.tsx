import { Bot, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";

const seed = [
  { role: "ai", text: "Hi, I'm UrbanPulse AI. Ask me about heat, air quality, safety, or accessibility in your city." },
];
const presets = [
  "Which route has the best air quality?",
  "Suggest climate-safe redesign ideas.",
  "Which pathway is safest right now?",
  "How can MG Road become cooler?",
];
const replies: Record<string, string> = {
  air: "Take the Cubbon Park corridor — AQI 38 vs 142 on the highway. Tree canopy lowers PM2.5 by ~62%.",
  redesign: "Add green roofs on 3 buildings, convert 2 lanes to a shaded promenade, plant 180 native trees → est. -7°C surface temp.",
  safe: "SafePath suggests Brigade Rd → Church St → MG Rd. 4 CCTV nodes, lit, foot traffic 4× normal at this hour.",
  cool: "Permeable pavement + 22% more canopy + lighter facade albedo → projected −5.4°C peak temperature, +34 walkability.",
};

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(seed);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const next = [...msgs, { role: "user", text }];
    const key = /air/i.test(text) ? "air" : /redesign|design/i.test(text) ? "redesign"
      : /safe|safety/i.test(text) ? "safe" : /cool|heat|temperature/i.test(text) ? "cool" : "redesign";
    setMsgs(next);
    setInput("");
    setTimeout(() => setMsgs(m => [...m, { role: "ai", text: replies[key] }]), 600);
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

          <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] text-sm rounded-2xl px-3 py-2 ${
                  m.role === "user" ? "bg-[color:var(--accent)]/20 text-foreground" : "glass"
                }`}>{m.text}</div>
              </div>
            ))}
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
                   placeholder="Ask UrbanPulse…"
                   className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--accent)]"/>
            <button className="rounded-xl px-3 grid place-items-center glow-cyan" style={{ background: "var(--gradient-cool)" }}>
              <Send className="h-4 w-4 text-[color:var(--primary-foreground)]"/>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
