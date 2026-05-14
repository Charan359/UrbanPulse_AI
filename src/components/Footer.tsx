export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="text-muted-foreground">
          © {new Date().getFullYear()} UrbanPulse AI · <span className="text-foreground">Designing cooler, safer, healthier cities with AI.</span>
        </div>
        <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-muted-foreground">
          <span>ShadowPath</span><span>·</span><span>SafePath</span><span>·</span><span>AirSense</span><span>·</span><span>VisionAssist</span>
        </div>
      </div>
    </footer>
  );
}
