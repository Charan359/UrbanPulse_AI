import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Mail, Lock, Loader2, ArrowRight, Activity } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose(); // Close on successful login
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccess('Registration successful! Check your email to verify your account.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md glass-strong rounded-3xl p-8 glow-cyan overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute inset-0 grid-bg opacity-30" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative h-12 w-12 rounded-2xl glow-orange grid place-items-center bg-[var(--bg-deep-2)]">
              <Activity className="h-6 w-6 text-[color:var(--neon)]" />
              <span className="absolute inset-0 rounded-2xl animate-pulse-ring" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center tracking-tight mb-2">
            {isLogin ? 'Access Command Center' : 'Initialize Protocol'}
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-8">
            {isLogin ? 'Enter your credentials to connect' : 'Register a new operator clearance'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] ml-1">Identity (Email)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@urbanpulse.ai"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--cyan)]/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-[color:var(--cyan)] ml-1">Security Key (Password)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--cyan)]/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-[color:var(--destructive)] bg-[color:var(--destructive)]/10 border border-[color:var(--destructive)]/20 rounded-lg p-3 text-center">
                {error}
              </div>
            )}
            
            {success && (
              <div className="text-xs text-[color:var(--emerald)] bg-[color:var(--emerald)]/10 border border-[color:var(--emerald)]/20 rounded-lg p-3 text-center">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium glow-cyan disabled:opacity-50 transition-all"
              style={{ background: "var(--gradient-cool)" }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Authenticate' : 'Establish Link'} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an access code? " : "Already registered? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[color:var(--cyan)] hover:underline hover:text-white transition-colors"
            >
              {isLogin ? 'Request access' : 'Return to login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
