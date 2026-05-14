// Voice Commands — maps spoken phrases to navigation actions
import type { NavigateFunction } from 'react-router-dom';

export interface VoiceCommand {
  phrases: string[];
  action: (nav: NavigateFunction, speak: (text: string) => void) => void;
  description: string;
}

export const VOICE_COMMANDS: VoiceCommand[] = [
  {
    phrases: ['go to dashboard', 'open dashboard', 'dashboard', 'command center'],
    action: (nav, speak) => { speak('Opening the dashboard.'); nav('/dashboard'); },
    description: 'Navigate to Dashboard',
  },
  {
    phrases: ['find route', 'find a route', 'route engine', 'open routes', 'navigate', 'go to routes'],
    action: (nav, speak) => { speak('Opening the route engine. Tell me your destination.'); nav('/routes'); },
    description: 'Open Route Engine',
  },
  {
    phrases: ['open aqi', 'air quality', 'airsense', 'air sense', 'pollution'],
    action: (nav, speak) => { speak('Opening air quality intelligence.'); nav('/airsense'); },
    description: 'Open AirSense AI',
  },
  {
    phrases: ['open safety', 'safe path', 'safepath', 'women safety', 'safety routing'],
    action: (nav, speak) => { speak('Opening SafePath Guardian.'); nav('/safepath'); },
    description: 'Open SafePath',
  },
  {
    phrases: ['open shadow', 'shadow path', 'shadowpath', 'cool route', 'shade'],
    action: (nav, speak) => { speak('Opening ShadowPath AI for cool route navigation.'); nav('/shadowpath'); },
    description: 'Open ShadowPath',
  },
  {
    phrases: ['open vision', 'vision assist', 'visionassist', 'accessibility'],
    action: (nav, speak) => { speak('Opening VisionAssist navigation.'); nav('/visionassist'); },
    description: 'Open VisionAssist',
  },
  {
    phrases: ['go home', 'home page', 'go to home', 'main page'],
    action: (nav, speak) => { speak('Going to the home page.'); nav('/'); },
    description: 'Go Home',
  },
  {
    phrases: ['about', 'about page', 'about project'],
    action: (nav, speak) => { speak('Opening about page.'); nav('/about'); },
    description: 'Open About',
  },
  {
    phrases: ['stop speaking', 'stop', 'be quiet', 'mute', 'silence'],
    action: (_nav, speak) => { speechSynthesis.cancel(); speak('Voice paused.'); },
    description: 'Stop speaking',
  },
  {
    phrases: ['help', 'what can i say', 'commands', 'options'],
    action: (_nav, speak) => {
      speak('You can say: find route, go to dashboard, open AQI, open safety, open vision assist, stop speaking, repeat, or logout.');
    },
    description: 'List commands',
  },
  {
    phrases: ['repeat', 'say again', 'what did you say'],
    action: (_nav, _speak) => { /* handled by provider — re-speaks last utterance */ },
    description: 'Repeat last message',
  },
];

/**
 * Match spoken text to a command.
 * Returns the matched command or null.
 */
export function matchCommand(transcript: string): VoiceCommand | null {
  const lower = transcript.toLowerCase().trim();
  for (const cmd of VOICE_COMMANDS) {
    for (const phrase of cmd.phrases) {
      if (lower.includes(phrase)) return cmd;
    }
  }
  return null;
}

/**
 * Extract a destination from natural speech.
 * Examples: "I want to go to MG Road" → "MG Road"
 *           "Take me to Cubbon Park" → "Cubbon Park"
 */
export function extractDestination(transcript: string): string | null {
  const patterns = [
    /(?:go to|take me to|navigate to|route to|directions to|head to|get to)\s+(.+)/i,
    /(?:i want to go to|i need to go to|i want to visit|take me)\s+(.+)/i,
    /(?:find route to|find a route to|route for)\s+(.+)/i,
    /(?:safest route to|best route to|accessible route to)\s+(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = transcript.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/[.!?]+$/, '').trim();
    }
  }
  return null;
}

/**
 * Page announcements for talkback
 */
export const PAGE_ANNOUNCEMENTS: Record<string, string> = {
  '/': 'You are on the home page. Say find route, dashboard, or help for options.',
  '/dashboard': 'You are on the dashboard. Say route, AQI, heat map, safety, or help.',
  '/routes': 'You are on the route engine. Tell me where you want to go, or type a destination.',
  '/shadowpath': 'You are on ShadowPath AI. This finds the coolest, shaded routes for you.',
  '/airsense': 'You are on AirSense AI. This shows air quality and clean-air routes.',
  '/safepath': 'You are on SafePath Guardian. This finds the safest routes with good lighting and CCTV.',
  '/visionassist': 'You are on VisionAssist. Tap the big microphone button to speak, or say start navigation.',
  '/about': 'You are on the about page. This describes the UrbanPulse AI project.',
};
