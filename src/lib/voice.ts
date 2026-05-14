// Voice AI utilities — Web Speech API (works in all modern browsers, no API key needed)

// ═══ TEXT-TO-SPEECH (TTS) ═══

let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Speak text aloud. Cancels any ongoing speech first.
 * Supports multiple languages via BCP-47 codes (e.g., 'en-IN', 'hi-IN', 'kn-IN', 'te-IN').
 */
export function speak(text: string, lang = 'en-IN') {
  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Try to find a good voice for the language
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && v.localService)
    || voices.find(v => v.lang.startsWith(lang.split('-')[0]))
    || voices.find(v => v.lang.startsWith('en'));
  if (preferred) utterance.voice = preferred;

  currentUtterance = utterance;
  speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  return speechSynthesis.speaking;
}

// ═══ SPEECH-TO-TEXT (STT) ═══

type SpeechRecognitionType = typeof window extends { SpeechRecognition: infer T } ? T : any;

let recognition: any = null;

interface ListenOptions {
  lang?: string;        // BCP-47 language (default: '' = auto-detect)
  continuous?: boolean; // Keep listening after pauses
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

/**
 * Start listening. Works with any language the browser supports.
 * Use lang='' for auto-detection or specify e.g. 'hi-IN' for Hindi.
 */
export function startListening(options: ListenOptions): boolean {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    options.onError?.('Speech recognition not supported in this browser');
    return false;
  }

  stopListening();

  recognition = new SpeechRecognition();
  recognition.lang = options.lang || ''; // empty = auto-detect
  recognition.continuous = options.continuous ?? false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    let finalTranscript = '';
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    if (finalTranscript) {
      options.onResult(finalTranscript, true);
    } else if (interimTranscript) {
      options.onResult(interimTranscript, false);
    }
  };

  recognition.onerror = (event: any) => {
    if (event.error !== 'aborted') {
      options.onError?.(event.error);
    }
  };

  recognition.onend = () => {
    options.onEnd?.();
  };

  recognition.start();
  return true;
}

export function stopListening() {
  if (recognition) {
    try { recognition.stop(); } catch {}
    recognition = null;
  }
}

export function isListeningActive(): boolean {
  return recognition !== null;
}

// ═══ LANGUAGE MAP ═══

export const VOICE_LANGUAGES = [
  { code: '', label: 'Auto-detect' },
  { code: 'en-IN', label: 'English' },
  { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
  { code: 'kn-IN', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
  { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
  { code: 'ml-IN', label: 'മലയാളം (Malayalam)' },
  { code: 'mr-IN', label: 'मराठी (Marathi)' },
  { code: 'bn-IN', label: 'বাংলা (Bengali)' },
  { code: 'gu-IN', label: 'ગુજરાતી (Gujarati)' },
  { code: 'es-ES', label: 'Español (Spanish)' },
  { code: 'fr-FR', label: 'Français (French)' },
  { code: 'ar-SA', label: 'العربية (Arabic)' },
  { code: 'zh-CN', label: '中文 (Chinese)' },
  { code: 'ja-JP', label: '日本語 (Japanese)' },
];
