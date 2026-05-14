import { NavLink, Link, useNavigate } from "react-router-dom";
import { Activity, Menu, X, User as UserIcon, LogOut, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { AuthModal } from "./AuthModal";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/routes", label: "Route Engine" },
  { to: "/shadowpath", label: "ShadowPath AI" },
  { to: "/airsense", label: "AirSense AI" },
  { to: "/safepath", label: "SafePath" },
  { to: "/visionassist", label: "VisionAssist" },
  { to: "/about", label: "About" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <div className="glass-strong rounded-2xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative h-9 w-9 rounded-xl glow-orange grid place-items-center bg-[var(--bg-deep-2)]">
              <Activity className="h-5 w-5 text-[color:var(--neon)]" />
              <span className="absolute inset-0 rounded-xl animate-pulse-ring" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">UrbanPulse <span className="text-gradient">AI</span></div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Smart City OS</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive
                      ? "text-foreground bg-white/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-white/5 transition"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[color:var(--primary-foreground)] glow-orange"
              style={{ background: "var(--gradient-heat)" }}
            >
              Launch Dashboard
            </Link>
            
            {user ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium glass hover:bg-white/5 transition"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium glass hover:bg-white/5 transition"
              >
                <UserIcon className="h-4 w-4" />
                Connect
              </button>
            )}

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/5"
              onClick={() => setOpen(o => !o)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden glass-strong mt-2 rounded-2xl p-2 flex flex-col">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <button onClick={() => { handleLogout(); setOpen(false); }}
                className="px-4 py-3 rounded-lg text-sm hover:bg-white/5 text-left flex items-center gap-2 text-[color:var(--destructive)]">
                <LogOut className="h-4 w-4" /> Sign Out ({user.email?.split('@')[0]})
              </button>
            ) : (
              <button onClick={() => { setIsAuthOpen(true); setOpen(false); }}
                className="px-4 py-3 rounded-lg text-sm hover:bg-white/5 text-left flex items-center gap-2">
                <UserIcon className="h-4 w-4" /> Sign In
              </button>
            )}
          </div>
        )}
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
}
