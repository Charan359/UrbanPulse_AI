import Groq from 'groq-sdk';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

if (!apiKey) {
  console.warn("Missing VITE_GROQ_API_KEY in .env");
}

export const groq = new Groq({
  apiKey: apiKey || 'placeholder',
  dangerouslyAllowBrowser: true, // We allow browser access for the hackathon prototype
});

export async function askUrbanPulseAI(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are the UrbanPulse AI Assistant, an expert in urban planning, climate resilience, and smart city intelligence.
You provide concise, actionable, and futuristic advice to citizens and planners about:
- Urban Heat Island effects and cooling strategies.
- AQI, air quality, and respiratory safety.
- SafePath (women safety routing) and ShadowPath (sun-aware routing).
- Accessibility and sustainable mobility.
Respond in a friendly, high-tech, and professional tone. Keep responses under 3 paragraphs. Use markdown.`
        },
        ...messages
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 512,
    });

    return chatCompletion.choices[0]?.message?.content || "No response received.";
  } catch (error: any) {
    console.error("Groq AI Error:", error);
    return "Connection to AI core interrupted. Please verify your clearance and try again.";
  }
}
