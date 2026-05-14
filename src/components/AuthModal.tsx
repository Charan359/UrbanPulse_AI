import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { upsertUserProfile } from '@/lib/database';
import { X, Mail, Lock, Loader2, ArrowRight, Activity, User, Eye, EyeOff, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup' | 'otp';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [isVisuallyImpaired, setIsVisuallyImpaired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const resetState = () => {
    setError(null);
    setSuccess(null);
  };

  // ── Email + Password Login ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Email OTP (Magic Link) ──
  const handleEmailOTP = async () => {
    resetState();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      });
      if (error) throw error;
      setSuccess('✅ OTP / login link sent to your email. Check your inbox and click the link to sign in.');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth ──
  const handleGoogleLogin = async () => {
    resetState();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/dashboard' },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Google login failed');
      setLoading(false);
    }
  };

  // ── Email + Password Signup ──
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    resetState();
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!gender) { setError('Please select your gender.'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, gender, is_visually_impaired: isVisuallyImpaired },
        },
      });
      if (error) throw error;

      // Create profile in user_profiles table
      if (data.user) {
        try {
          await upsertUserProfile(data.user.id, {
            full_name: fullName,
            email,
            gender,
            is_visually_impaired: isVisuallyImpaired,
          });
        } catch {
          // Profile will be created by trigger if upsert fails
        }
      }

      setSuccess('🎉 Registration successful! Check your email to verify your account.');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md glass-strong rounded-3xl p-8 glow-cyan overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        <button onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10">
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative h-12 w-12 rounded-2xl glow-orange grid place-items-center bg-[var(--bg-deep-2)]">
              <Activity className="h-6 w-6 text-[color:var(--neon)]" />
              <span className="absolute inset-0 rounded-2xl animate-pulse-ring" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center tracking-tight mb-1">
            {mode === 'login' ? 'Access Command Center' : mode === 'otp' ? 'Email OTP Login' : 'Create Account'}
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-6">
            {mode === 'login' ? 'Sign in with email & password' : mode === 'otp' ? 'We\'ll send a login link to your email' : 'Set up your UrbanPulse profile'}
          </p>

          {/* ═══ LOGIN MODE ═══ */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--cyan)]/50" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--cyan)]/50" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <div className="text-xs text-[color:var(--destructive)] bg-[color:var(--destructive)]/10 border border-[color:var(--destructive)]/20 rounded-lg p-3 text-center">{error}</div>}
              {success && <div className="text-xs text-[color:var(--emerald)] bg-[color:var(--emerald)]/10 border border-[color:var(--emerald)]/20 rounded-lg p-3 text-center">{success}</div>}

              <button type="submit" disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium glow-cyan disabled:opacity-50"
                style={{ background: "var(--gradient-cool)" }}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Email OTP */}
              <button type="button" onClick={() => { setMode('otp'); resetState(); }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium glass hover:bg-white/10 transition">
                <Send className="h-4 w-4" /> Login with Email OTP
              </button>

              {/* Google OAuth */}
              <button type="button" onClick={handleGoogleLogin}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium glass hover:bg-white/10 transition">
                <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button type="button" onClick={() => { setMode('signup'); resetState(); }}
                  className="text-[color:var(--cyan)] hover:underline">Create account</button>
              </div>
            </form>
          )}

          {/* ═══ EMAIL OTP MODE ═══ */}
          {mode === 'otp' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--cyan)]/50" />
                </div>
              </div>

              {error && <div className="text-xs text-[color:var(--destructive)] bg-[color:var(--destructive)]/10 border border-[color:var(--destructive)]/20 rounded-lg p-3 text-center">{error}</div>}
              {success && <div className="text-xs text-[color:var(--emerald)] bg-[color:var(--emerald)]/10 border border-[color:var(--emerald)]/20 rounded-lg p-3 text-center">{success}</div>}

              <button onClick={handleEmailOTP} disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium glow-cyan disabled:opacity-50"
                style={{ background: "var(--gradient-cool)" }}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /><span>Send OTP to Email</span></>}
              </button>

              <button type="button" onClick={() => { setMode('login'); resetState(); }}
                className="w-full text-center text-sm text-muted-foreground hover:text-[color:var(--cyan)] transition">
                ← Back to login
              </button>
            </div>
          )}

          {/* ═══ SIGNUP MODE ═══ */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--cyan)]/50" />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--cyan)]/50" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Min 6 characters" required minLength={6}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--cyan)]/50" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] ml-1">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Male', 'Female', 'Prefer not to say'].map(g => (
                    <button key={g} type="button" onClick={() => setGender(g)}
                      className={`rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                        gender === g ? 'glow-cyan text-foreground' : 'glass hover:bg-white/10 text-muted-foreground'
                      }`}
                      style={gender === g ? { background: 'var(--gradient-cool)' } : {}}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visually Impaired */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] ml-1">Visually Impaired?</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Yes', value: true },
                    { label: 'No', value: false },
                  ].map(opt => (
                    <button key={opt.label} type="button" onClick={() => setIsVisuallyImpaired(opt.value)}
                      className={`rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                        isVisuallyImpaired === opt.value ? 'glow-emerald text-foreground' : 'glass hover:bg-white/10 text-muted-foreground'
                      }`}
                      style={isVisuallyImpaired === opt.value ? { background: 'var(--gradient-cool)' } : {}}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                {isVisuallyImpaired && (
                  <p className="text-[10px] text-[color:var(--emerald)] mt-1 ml-1">
                    ✓ VoiceAssist Mode will activate after login — the app will speak to you.
                  </p>
                )}
              </div>

              {error && <div className="text-xs text-[color:var(--destructive)] bg-[color:var(--destructive)]/10 border border-[color:var(--destructive)]/20 rounded-lg p-3 text-center">{error}</div>}
              {success && <div className="text-xs text-[color:var(--emerald)] bg-[color:var(--emerald)]/10 border border-[color:var(--emerald)]/20 rounded-lg p-3 text-center">{success}</div>}

              <button type="submit" disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium glow-cyan disabled:opacity-50"
                style={{ background: "var(--gradient-cool)" }}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><span>Create Account</span><ArrowRight className="h-4 w-4" /></>}
              </button>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); resetState(); }}
                  className="text-[color:var(--cyan)] hover:underline">Sign in</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
