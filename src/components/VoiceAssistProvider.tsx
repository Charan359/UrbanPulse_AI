import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { speak, speakDelayed, stopSpeaking, startListening, stopListening, VOICE_LANGUAGES } from '@/lib/voice';
import { matchCommand, extractDestination, PAGE_ANNOUNCEMENTS } from '@/lib/voiceCommands';

interface VoiceAssistContextType {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  listening: boolean;
  speaking: boolean;
  lastUtterance: string;
  voiceLang: string;
  setVoiceLang: (lang: string) => void;
  startVoiceInput: () => void;
  stopVoiceInput: () => void;
  announce: (text: string) => void;
  pendingDestination: string | null;
  confirmDestination: () => void;
  rejectDestination: () => void;
}

const VoiceAssistContext = createContext<VoiceAssistContextType>({
  enabled: false, setEnabled: () => {}, listening: false, speaking: false,
  lastUtterance: '', voiceLang: 'en-IN', setVoiceLang: () => {},
  startVoiceInput: () => {}, stopVoiceInput: () => {},
  announce: () => {}, pendingDestination: null,
  confirmDestination: () => {}, rejectDestination: () => {},
});

export const useVoiceAssist = () => useContext(VoiceAssistContext);

export function VoiceAssistProvider({ children }: { children: React.ReactNode }) {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [enabled, setEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [lastUtterance, setLastUtterance] = useState('');
  const [voiceLang, setVoiceLang] = useState('en-IN');
  const [pendingDestination, setPendingDestination] = useState<string | null>(null);
  const [welcomed, setWelcomed] = useState(false);
  const prevPath = useRef(location.pathname);
  const enabledRef = useRef(enabled);

  // Keep ref in sync
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  // Auto-enable for visually impaired users
  useEffect(() => {
    if (profile?.is_visually_impaired && user) {
      setEnabled(true);
    }
  }, [profile, user]);

  // Voice welcome greeting — fires when enabled + profile loaded
  useEffect(() => {
    if (!enabled || !profile || welcomed) return;
    if (!profile.is_visually_impaired) return;

    setWelcomed(true);
    const name = profile.full_name || 'friend';

    // Use speakDelayed to ensure browser voices are loaded
    speakDelayed(
      `Welcome to UrbanPulse AI, ${name}. I am your voice assistant. Where are you planning to go today?`,
      1500,
      voiceLang
    ).then(() => {
      // Auto-start listening after welcome finishes
      if (enabledRef.current) {
        setTimeout(() => startVoiceInput(), 500);
      }
    });
  }, [enabled, profile, welcomed]);

  // Page change announcements
  useEffect(() => {
    if (!enabled) return;
    const newPath = location.pathname;
    if (newPath !== prevPath.current) {
      prevPath.current = newPath;
      const msg = PAGE_ANNOUNCEMENTS[newPath];
      if (msg) {
        speakDelayed(msg, 800, voiceLang);
      }
    }
  }, [location.pathname, enabled, voiceLang]);

  // Core announce function — always speaks when enabled
  const announce = useCallback((text: string) => {
    setLastUtterance(text);
    setSpeaking(true);
    const utterance = speak(text, voiceLang || 'en-IN');
    if (utterance) {
      const origOnEnd = utterance.onend;
      utterance.onend = (ev) => {
        setSpeaking(false);
        if (typeof origOnEnd === 'function') origOnEnd.call(utterance, ev);
      };
    } else {
      // Fallback — try speakDelayed
      speakDelayed(text, 300, voiceLang).then(() => setSpeaking(false));
    }
  }, [voiceLang]);

  const handleTranscript = useCallback((transcript: string) => {
    // Check for voice commands first
    const cmd = matchCommand(transcript);
    if (cmd) {
      if (cmd.phrases.includes('repeat')) {
        if (lastUtterance) announce(lastUtterance);
        return;
      }
      cmd.action(navigate, announce);
      return;
    }

    // Check for destination confirmation
    if (pendingDestination) {
      const lower = transcript.toLowerCase();
      if (lower.includes('yes') || lower.includes('confirm') || lower.includes('okay') || lower.includes('sure') || lower.includes('haan') || lower.includes('ha')) {
        confirmDestination();
        return;
      }
      if (lower.includes('no') || lower.includes('cancel') || lower.includes('wrong') || lower.includes('nahi')) {
        rejectDestination();
        return;
      }
    }

    // Try to extract a destination
    const dest = extractDestination(transcript);
    if (dest) {
      setPendingDestination(dest);
      announce(`You want to go to ${dest}. Should I find the safest and most accessible route? Say yes or no.`);
      setTimeout(() => {
        if (enabledRef.current) startVoiceInput();
      }, 4000);
      return;
    }

    // Fallback
    announce(`I heard: ${transcript}. Try saying go to followed by a place name, or say help for options.`);
  }, [pendingDestination, lastUtterance, navigate, announce]);

  const startVoiceInput = useCallback(() => {
    if (listening) return;
    stopSpeaking();
    setListening(true);
    const started = startListening({
      lang: voiceLang,
      continuous: false,
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          setListening(false);
          handleTranscript(transcript);
        }
      },
      onError: (err) => {
        setListening(false);
        if (err === 'not-allowed') {
          announce('Microphone permission is needed. Please allow microphone access in your browser settings.');
        }
      },
      onEnd: () => setListening(false),
    });
    if (!started) setListening(false);
  }, [listening, voiceLang, handleTranscript, announce]);

  const stopVoiceInput = useCallback(() => {
    stopListening();
    setListening(false);
  }, []);

  const confirmDestination = useCallback(() => {
    if (!pendingDestination) return;
    announce(`Finding the best accessible route to ${pendingDestination}. Please wait.`);
    const dest = pendingDestination;
    setPendingDestination(null);
    navigate('/routes', { state: { voiceDestination: dest } });
  }, [pendingDestination, navigate, announce]);

  const rejectDestination = useCallback(() => {
    setPendingDestination(null);
    announce('Okay, tell me the correct destination. Where do you want to go?');
    setTimeout(() => {
      if (enabledRef.current) startVoiceInput();
    }, 3000);
  }, [announce, startVoiceInput]);

  return (
    <VoiceAssistContext.Provider value={{
      enabled, setEnabled, listening, speaking, lastUtterance,
      voiceLang, setVoiceLang, startVoiceInput, stopVoiceInput,
      announce, pendingDestination, confirmDestination, rejectDestination,
    }}>
      {children}
    </VoiceAssistContext.Provider>
  );
}
