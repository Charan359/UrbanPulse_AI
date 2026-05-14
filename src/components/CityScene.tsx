// Animated futuristic city skyline + heat overlays + particles (pure SVG/CSS)
export function CityScene() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* heat blobs */}
      <div className="heat-blob absolute -top-20 -left-20 h-[420px] w-[420px] rounded-full"
           style={{ background: "radial-gradient(circle, #ff6b00 0%, transparent 70%)" }} />
      <div className="heat-blob absolute top-40 right-0 h-[520px] w-[520px] rounded-full animate-drift"
           style={{ background: "radial-gradient(circle, #00e5ff 0%, transparent 70%)" }} />
      <div className="heat-blob absolute bottom-0 left-1/3 h-[480px] w-[480px] rounded-full animate-drift"
           style={{ background: "radial-gradient(circle, #7c4dff 0%, transparent 70%)" }} />

      {/* particles */}
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            top: `${(i * 53) % 100}%`,
            left: `${(i * 37) % 100}%`,
            width: 2 + (i % 4),
            height: 2 + (i % 4),
            background: i % 3 === 0 ? "#00e5ff" : i % 3 === 1 ? "#ff6b00" : "#00ff9f",
            boxShadow: "0 0 10px currentColor",
            color: i % 3 === 0 ? "#00e5ff" : i % 3 === 1 ? "#ff6b00" : "#00ff9f",
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${6 + (i % 5)}s`,
            opacity: 0.7,
          }}
        />
      ))}

      {/* skyline silhouette */}
      <svg className="absolute bottom-0 left-0 w-full h-[55%]" viewBox="0 0 1440 600" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bldg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0a1628" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#020611" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="route" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#00ff9f" />
            <stop offset="100%" stopColor="#7c4dff" />
          </linearGradient>
        </defs>
        {/* back layer */}
        <g fill="url(#bldg)" opacity="0.7">
          {Array.from({ length: 28 }).map((_, i) => {
            const w = 30 + ((i * 17) % 40);
            const h = 120 + ((i * 53) % 280);
            const x = i * 52;
            return <rect key={i} x={x} y={600 - h} width={w} height={h} />;
          })}
        </g>
        {/* front layer */}
        <g fill="#020611">
          {Array.from({ length: 18 }).map((_, i) => {
            const w = 60 + ((i * 23) % 70);
            const h = 180 + ((i * 71) % 320);
            const x = i * 80;
            return <rect key={i} x={x} y={600 - h} width={w} height={h} rx="3" />;
          })}
        </g>
        {/* window lights */}
        <g fill="#00e5ff" opacity="0.8">
          {Array.from({ length: 80 }).map((_, i) => (
            <rect key={i} x={(i * 37) % 1440} y={300 + ((i * 91) % 280)} width="2" height="2">
              <animate attributeName="opacity" values="0.2;1;0.2" dur={`${2 + (i % 5)}s`} repeatCount="indefinite" begin={`${i * 0.1}s`} />
            </rect>
          ))}
        </g>
        {/* glowing route */}
        <path d="M0 540 C 240 500, 360 560, 600 510 S 1080 460, 1440 500"
              fill="none" stroke="url(#route)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray="2200" strokeDashoffset="2200"
              style={{ animation: "route-draw 3.5s ease-out forwards", filter: "drop-shadow(0 0 6px #00e5ff)" }}/>
      </svg>

      {/* sun/moon */}
      <div className="absolute top-20 right-24 h-32 w-32 rounded-full animate-glow-pulse"
           style={{ background: "radial-gradient(circle, #ff6b00 0%, transparent 70%)", filter: "blur(8px)" }} />
    </div>
  );
}
