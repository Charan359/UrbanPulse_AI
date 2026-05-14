import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass-strong rounded-3xl p-10 glow-cyan">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Signal lost</h2>
        <p className="mt-2 text-sm text-muted-foreground">This sector isn't in the city grid yet.</p>
        <Link to="/" className="mt-6 inline-flex rounded-xl px-4 py-2 text-sm font-medium glow-orange"
              style={{ background: "var(--gradient-heat)" }}>Return home</Link>
      </div>
    </div>
  );
}

export default NotFound;
