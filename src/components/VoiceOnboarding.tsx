import { useState } from 'react';
import { Mic, Shield, X, Volume2 } from 'lucide-react';
import { useVoiceAssist } from './VoiceAssistProvider';

/**
 * Shown once before first microphone use.
 * Explains why the mic is needed and asks for permission.
 */
export function VoiceOnboarding() {
  const { enabled, startVoiceInput } = useVoiceAssist();
  const [dismissed, setDismissed] = useState(false);
  const [shown, setShown] = useState(false);

  // Show only once when voice mode becomes enabled
  if (!enabled || dismissed) return null;
  if (!shown) {
    setShown(true);
  }

  const handleAllow = () => {
    setDismissed(true);
    startVoiceInput();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm glass-strong rounded-3xl p-8 text-center animate-rise">
        <button onClick={() => setDismissed(true)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10">
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto h-16 w-16 rounded-2xl glow-emerald grid place-items-center mb-4"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Mic className="h-8 w-8 text-[color:var(--emerald)]" />
        </div>

        <h3 className="text-xl font-bold mb-2">Microphone Access</h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          UrbanPulse AI needs microphone access to understand your destination and guide you by voice. 
          <br /><br />
          <span className="inline-flex items-center gap-1 text-[color:var(--emerald)]">
            <Shield className="h-3 w-3" /> Your voice is never stored or recorded.
          </span>
        </p>

        <div className="space-y-3">
          <button onClick={handleAllow}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium glow-emerald"
            style={{ background: 'var(--gradient-cool)' }}>
            <Volume2 className="h-4 w-4" /> Allow & Start Voice Mode
          </button>
          <button onClick={() => setDismissed(true)}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
