import { useRef, useState } from "react";

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    const p = Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100));
    setPos(p);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-5">
      <div ref={ref}
           className="relative glass-strong rounded-3xl overflow-hidden h-[420px] cursor-ew-resize select-none"
           onMouseMove={(e) => e.buttons === 1 && onMove(e)}
           onTouchMove={onMove}>
        {/* AFTER (green city) */}
        <CityLayer kind="after"/>
        {/* BEFORE (heat / concrete) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <CityLayer kind="before"/>
        </div>

        {/* labels */}
        <div className="absolute top-4 left-4 glass rounded-full px-3 py-1 text-xs uppercase tracking-widest">Current</div>
        <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-xs uppercase tracking-widest text-[color:var(--emerald)]">AI Redesign</div>

        {/* slider */}
        <div className="absolute top-0 bottom-0" style={{ left: `${pos}%` }}>
          <div className="absolute top-0 bottom-0 -ml-px w-0.5 bg-[color:var(--accent)]" style={{ boxShadow: "0 0 12px var(--accent)" }}/>
          <div className="absolute top-1/2 -translate-y-1/2 -ml-5 h-10 w-10 rounded-full glass-strong glow-cyan grid place-items-center">
            <span className="text-[color:var(--accent)]">⇆</span>
          </div>
        </div>
        <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(+e.target.value)}
               className="absolute inset-0 w-full opacity-0 cursor-ew-resize"/>
      </div>

      <div className="space-y-3">
        {[
          ["AQI", "168 → 42", "var(--emerald)"],
          ["Heat Index", "41°C → 31°C", "var(--neon)"],
          ["Walkability", "31 → 87", "var(--cyan)"],
          ["Greenery", "8% → 36%", "var(--emerald)"],
          ["Safety Score", "62 → 91", "var(--violet)"],
        ].map(([k, v, c]) => (
          <div key={k} className="glass rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{k}</span>
            <span className="font-mono text-sm" style={{ color: c }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CityLayer({ kind }: { kind: "before" | "after" }) {
  const before = kind === "before";
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0"
           style={{
             background: before
               ? "linear-gradient(180deg, #2a0d04 0%, #4a1a06 50%, #1a0a04 100%)"
               : "linear-gradient(180deg, #042a1d 0%, #064a32 50%, #04221a 100%)",
           }}/>
      {/* heat haze / greenery */}
      <div className="heat-blob absolute inset-0"
           style={{ background: before
             ? "radial-gradient(circle at 30% 60%, #ff6b00, transparent 60%), radial-gradient(circle at 70% 40%, #ff2e63, transparent 60%)"
             : "radial-gradient(circle at 30% 60%, #00ff9f, transparent 60%), radial-gradient(circle at 70% 40%, #00e5ff, transparent 60%)" }}/>
      <svg className="absolute bottom-0 w-full h-2/3" viewBox="0 0 600 300" preserveAspectRatio="none">
        {Array.from({ length: 14 }).map((_, i) => {
          const w = 30 + ((i * 17) % 30);
          const h = 80 + ((i * 53) % 160);
          const x = i * 45;
          return <rect key={i} x={x} y={300 - h} width={w} height={h}
                       fill={before ? "#1a0805" : "#04140d"}
                       stroke={before ? "#ff6b00" : "#00ff9f"} strokeOpacity="0.3"/>;
        })}
        {/* trees on after */}
        {!before && Array.from({ length: 18 }).map((_, i) => (
          <circle key={i} cx={i * 35 + 10} cy={290 - (i % 3) * 6} r="9" fill="#00ff9f" opacity="0.7"/>
        ))}
      </svg>
    </div>
  );
}
