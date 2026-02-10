import OpenAI from 'openai';

// Lazy init or dummy to prevent crash on import if env missing
const apiKey = process.env.OPENAI_API_KEY || 'dummy-key';
const openai = new OpenAI({
  apiKey: apiKey,
});

export type AIIntent =
  | 'booking'
  | 'query_prices'
  | 'query_owner'
  | 'cancellation'
  | 'confirmation'
  | 'handoff'
  | 'faq'
  | 'other';

export interface AIResponse {
  intent: AIIntent;
  message: string;
  entities?: {
    serviceName?: string;
    date?: string; // YYYY-MM-DD
    time?: string; // HH:mm
    slotIndex?: number;
    personName?: string;
  };
}

export async function analyzeMessage(
  message: string,
  context: {
    services: { id: string; name: string; priceCents: number }[];
    conversationHistory: { role: 'user' | 'assistant'; content: string }[];
    now: Date;
    tenantName: string;
  }
): Promise<AIResponse> {
  const serviceList = context.services.map(s => `- ${s.name} ($${s.priceCents/100})`).join('\n');

  const systemPrompt = `
    You are the smart receptionist for "${context.tenantName}".
    Current Date: ${context.now.toLocaleString()}

    Services:
    ${serviceList}

    Intents:
    - booking: User wants to schedule an appointment. Extract service, date, time.
    - query_prices: User asks for prices. List them.
    - query_owner: User asks for the owner/manager.
    - cancellation: User wants to cancel or reschedule.
    - confirmation: User says "yes", "confirm", "ok" to a proposed slot.
    - handoff: User explicitly asks for a human, support, or is frustrated.
    - faq: User asks about location, hours, parking, policies (if not booking specific).
    - other: Greeting or unclear.

    Output JSON:
    {
      "intent": "...",
      "message": "Response in Spanish. Be concise (WhatsApp style).",
      "entities": {
        "serviceName": "...",
        "date": "YYYY-MM-DD",
        "time": "HH:mm",
        "personName": "User's name if introduced"
      }
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...context.conversationHistory.map(h => ({ role: h.role, content: h.content } as OpenAI.Chat.ChatCompletionMessageParam)),
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content");
    return JSON.parse(content) as AIResponse;
  } catch (error) {
    console.error("OpenAI Error:", error);
    return { intent: "other", message: "Lo siento, no te entendí bien." };
  }
}
