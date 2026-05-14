import { Mic, MicOff, Volume2, VolumeX, Globe } from 'lucide-react';
import { useState } from 'react';
import { useVoiceAssist } from './VoiceAssistProvider';
import { VOICE_LANGUAGES } from '@/lib/voice';

export function VoiceCommandButton() {
  const {
    enabled, setEnabled, listening, speaking,
    voiceLang, setVoiceLang,
    startVoiceInput, stopVoiceInput,
    pendingDestination,
  } = useVoiceAssist();

  const [showLang, setShowLang] = useState(false);

  if (!enabled) {
    return (
      <button onClick={() => setEnabled(true)}
        className="fixed bottom-6 left-6 z-40 h-12 w-12 rounded-full glass grid place-items-center hover:bg-white/10 transition group"
        title="Enable Voice Mode" aria-label="Enable Voice Assist">
        <Volume2 className="h-5 w-5 text-muted-foreground group-hover:text-[color:var(--emerald)]" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-2">
      {/* Language picker */}
      {showLang && (
        <div className="glass-strong rounded-2xl py-1 w-48 max-h-52 overflow-y-auto shadow-xl mb-1 animate-rise">
          {VOICE_LANGUAGES.map(l => (
            <button key={l.code} onClick={() => { setVoiceLang(l.code); setShowLang(false); }}
              className={`w-full text-left px-4 py-2 text-xs hover:bg-white/10 transition ${voiceLang === l.code ? 'text-[color:var(--cyan)] font-semibold' : ''}`}>
              {l.label}
            </button>
          ))}
        </div>
      )}

      {/* Pending destination indicator */}
      {pendingDestination && (
        <div className="glass-strong rounded-xl px-3 py-2 text-xs max-w-[200px] animate-rise">
          📍 <strong>{pendingDestination}</strong>
          <div className="text-[10px] text-muted-foreground mt-0.5">Say "yes" to confirm</div>
        </div>
      )}

      {/* Button row */}
      <div className="flex items-center gap-2">
        {/* Main mic button */}
        <button onClick={listening ? stopVoiceInput : startVoiceInput}
          className={`h-14 w-14 rounded-full grid place-items-center shadow-lg transition-all ${
            listening
              ? 'glow-orange scale-110'
              : speaking
                ? 'glow-emerald'
                : 'glow-cyan'
          }`}
          style={{
            background: listening ? 'var(--gradient-heat)' : speaking ? 'var(--gradient-cool)' : 'var(--gradient-aurora)',
          }}
          title={listening ? 'Stop listening' : 'Start voice input'}
          aria-label={listening ? 'Stop listening' : 'Speak a command'}>
          {listening ? (
            <MicOff className="h-6 w-6 text-white animate-pulse" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
          {/* Pulse ring when listening */}
          {listening && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'var(--neon)' }} />
              <span className="absolute inset-0 rounded-full animate-pulse-ring" />
            </>
          )}
          {/* Speaking indicator */}
          {speaking && !listening && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[color:var(--emerald)] animate-pulse" />
          )}
        </button>

        {/* Language toggle */}
        <button onClick={() => setShowLang(!showLang)}
          className="h-10 w-10 rounded-full glass grid place-items-center hover:bg-white/10 transition"
          title="Change language">
          <Globe className="h-4 w-4" />
        </button>

        {/* Disable voice */}
        <button onClick={() => { setEnabled(false); stopVoiceInput(); }}
          className="h-10 w-10 rounded-full glass grid place-items-center hover:bg-white/10 transition"
          title="Disable voice mode">
          <VolumeX className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Status label */}
      <div className="text-[10px] uppercase tracking-widest ml-1">
        {listening ? (
          <span className="text-[color:var(--neon)]">🔴 Listening…</span>
        ) : speaking ? (
          <span className="text-[color:var(--emerald)]">🔊 Speaking…</span>
        ) : (
          <span className="text-muted-foreground">🎤 Voice Ready</span>
        )}
      </div>
    </div>
  );
}
