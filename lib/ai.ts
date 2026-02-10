import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type AIIntent = 'booking' | 'query_prices' | 'query_owner' | 'other' | 'confirmation' | 'cancellation';

export interface AIResponse {
  intent: AIIntent;
  message: string;
  entities?: {
    serviceName?: string;
    date?: string; // YYYY-MM-DD
    time?: string; // HH:mm
    slotIndex?: number;
  };
}

export async function analyzeMessage(
  message: string,
  context: {
    services: { id: string; name: string; priceCents: number }[];
    conversationHistory: { role: 'user' | 'assistant'; content: string }[];
    now: Date;
  }
): Promise<AIResponse> {
  const serviceList = context.services.map(s => `- ${s.name} ($${s.priceCents/100})`).join('\n');

  const systemPrompt = `
    You are a helpful and intelligent virtual assistant for a business.
    Current Date: ${context.now.toLocaleString()}

    Services available:
    ${serviceList}

    Your goal:
    1. Answer questions about services and prices.
    2. Help the user book an appointment.
    3. Provide owner contact info if asked ("Mi Dueño").

    Output JSON strictly following this schema:
    {
      "intent": "booking" | "query_prices" | "query_owner" | "other" | "confirmation" | "cancellation",
      "message": "The response text to show to the user (in Spanish, friendly but professional). keep it under 160 chars if possible.",
      "entities": {
        "serviceName": "extracted service name if any",
        "date": "extracted date in YYYY-MM-DD if mentioned",
        "time": "extracted time in HH:mm if mentioned",
        "slotIndex": "integer 1-3 if user selects a numbered option presented previously"
      }
    }

    Rules:
    - If user asks for prices, list them.
    - If user wants to book, ask which service.
    - If user chooses a service, ask for a date/time.
    - If user confirms a proposed slot (e.g., "si", "ok"), intent is "confirmation".
    - If user cancels, intent is "cancellation".
    - If user asks for owner info ("dueño"), provide generic info or say "Contacta a soporte@turnero.com".
  `;

  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...context.conversationHistory.map(h => ({ role: h.role, content: h.content } as OpenAI.Chat.ChatCompletionMessageParam)),
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content from OpenAI");

    const parsed = JSON.parse(content) as AIResponse;

    // Safety check on intent
    if (!['booking', 'query_prices', 'query_owner', 'other', 'confirmation', 'cancellation'].includes(parsed.intent)) {
      parsed.intent = 'other';
    }

    return parsed;
  } catch (error) {
    console.error("OpenAI Error:", error);
    return {
      intent: "other",
      message: "Lo siento, tuve un problema técnico. ¿Podrías intentar de nuevo?",
    };
  }
}
