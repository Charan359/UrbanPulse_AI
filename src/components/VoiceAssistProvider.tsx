import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { speak, stopSpeaking, startListening, stopListening, VOICE_LANGUAGES } from '@/lib/voice';
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
  const { profile } = useAuth();
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

  // Auto-enable for visually impaired users
  useEffect(() => {
    if (profile?.is_visually_impaired) {
      setEnabled(true);
    }
  }, [profile]);

  // Welcome greeting after login (once)
  useEffect(() => {
    if (enabled && profile?.is_visually_impaired && !welcomed) {
      setWelcomed(true);
      setTimeout(() => {
        announce(`Welcome to UrbanPulse AI, ${profile.full_name || 'friend'}. I am your voice assistant. Where are you planning to go today?`);
        // Auto-start listening after greeting finishes
        setTimeout(() => startVoiceInput(), 4000);
      }, 1500);
    }
  }, [enabled, profile, welcomed]);

  // Page change announcements
  useEffect(() => {
    if (!enabled) return;
    if (location.pathname !== prevPath.current) {
      prevPath.current = location.pathname;
      const msg = PAGE_ANNOUNCEMENTS[location.pathname];
      if (msg) {
        setTimeout(() => announce(msg), 600);
      }
    }
  }, [location.pathname, enabled]);

  const announce = useCallback((text: string) => {
    if (!enabled && !profile?.is_visually_impaired) return;
    setLastUtterance(text);
    setSpeaking(true);
    const utterance = speak(text, voiceLang || 'en-IN');
    if (utterance) {
      utterance.onend = () => setSpeaking(false);
    } else {
      setSpeaking(false);
    }
  }, [enabled, voiceLang, profile]);

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
      if (lower.includes('yes') || lower.includes('confirm') || lower.includes('okay') || lower.includes('sure')) {
        confirmDestination();
        return;
      }
      if (lower.includes('no') || lower.includes('cancel') || lower.includes('wrong')) {
        rejectDestination();
        return;
      }
    }

    // Try to extract a destination
    const dest = extractDestination(transcript);
    if (dest) {
      setPendingDestination(dest);
      announce(`You want to go to ${dest}. Should I find the safest and most accessible route? Say yes or no.`);
      setTimeout(() => startVoiceInput(), 3500);
      return;
    }

    // Fallback — send to AI assistant or announce
    announce(`I heard: ${transcript}. Try saying 'go to' followed by a place name, or say 'help' for options.`);
  }, [pendingDestination, lastUtterance, navigate, announce]);

  const startVoiceInput = useCallback(() => {
    if (listening) return;
    stopSpeaking();
    setListening(true);
    startListening({
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
  }, [listening, voiceLang, handleTranscript]);

  const stopVoiceInput = useCallback(() => {
    stopListening();
    setListening(false);
  }, []);

  const confirmDestination = useCallback(() => {
    if (!pendingDestination) return;
    announce(`Finding the best accessible route to ${pendingDestination}. Please wait.`);
    // Navigate to routes page with destination
    const dest = pendingDestination;
    setPendingDestination(null);
    navigate('/routes', { state: { voiceDestination: dest } });
  }, [pendingDestination, navigate, announce]);

  const rejectDestination = useCallback(() => {
    setPendingDestination(null);
    announce('Okay, tell me the correct destination. Where do you want to go?');
    setTimeout(() => startVoiceInput(), 2500);
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
