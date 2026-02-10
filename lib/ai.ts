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
    locale: string; // 'es', 'en', 'pt'
  }
): Promise<AIResponse> {
  const serviceList = context.services.map(s => `- ${s.name} ($${s.priceCents/100})`).join('\n');

  const systemPrompt = `
    You are the smart receptionist for "${context.tenantName}".
    Current Date: ${context.now.toLocaleString()}
    Language: Reply in ${context.locale === 'pt' ? 'Portuguese' : context.locale === 'en' ? 'English' : 'Spanish'}.

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
      "message": "Response in [Language]. Be concise (WhatsApp style).",
      "entities": {
        "serviceName": "...",
        "date": "YYYY-MM-DD",
        "time": "HH:mm",
        "personName": "User's name if introduced"
      }
    }
  `;

  try {
    if (apiKey === 'dummy-key') throw new Error("Missing API Key");

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
    // console.warn("OpenAI Error (Using Fallback Logic):", error);

    // FALLBACK LOGIC (Heuristics)
    const lower = message.toLowerCase();

    // Check for Service Names
    // Improved fallback: Check if service name is in message OR if message contains significant part of service name
    const foundService = context.services.find(s => {
        const sName = s.name.toLowerCase();
        // Exact containment
        if (lower.includes(sName)) return true;
        // Word overlap (e.g. "Limpieza" matches "Limpieza Dental")
        const words = sName.split(' ');
        return words.some(w => w.length > 3 && lower.includes(w));
    });

    if (lower.includes("precio") || lower.includes("costo") || lower.includes("price") || lower.includes("preço")) {
        return { intent: "query_prices", message: "Here are the prices..." };
    }

    if (lower.includes("cancel") || lower.includes("reprogramar")) {
        return { intent: "cancellation", message: "Let's cancel..." };
    }

    // Date/Time Extraction (Simple)
    let entities: any = {};
    let hasDate = false;

    if (lower.includes("mañana") || lower.includes("tomorrow") || lower.includes("amanhã")) {
        const d = new Date(context.now);
        d.setDate(d.getDate() + 1);
        entities.date = d.toISOString().split('T')[0];
        hasDate = true;
    } else if (lower.includes("hoy") || lower.includes("today") || lower.includes("hoje")) {
        entities.date = context.now.toISOString().split('T')[0];
        hasDate = true;
    }

    const timeMatch = lower.match(/(\d{1,2})(:(\d{2}))?\s*(am|pm|hs|h)?/);
    if (timeMatch) {
        const num = parseInt(timeMatch[1]);
        if (num > 3 || timeMatch[2] || timeMatch[4]) {
            let hour = num;
            if (timeMatch[4] === 'pm' && hour < 12) hour += 12;
            if (timeMatch[4] === 'am' && hour === 12) hour = 0;
            entities.time = `${hour}:${timeMatch[3] || '00'}`;
            hasDate = true;
        }
    }

    if (foundService) {
        entities.serviceName = foundService.name;
        return { intent: "booking", message: "Starting booking...", entities };
    }

    if (hasDate) {
         return { intent: "booking", message: "Date provided", entities };
    }

    if (lower.includes("reservar") || lower.includes("turno") || lower.includes("cita") || lower.includes("book") || lower.includes("agendar")) {
        return { intent: "booking", message: "Booking intent", entities };
    }

    if (['si', 'yes', 'sim', 'ok', 'confirmar', 'dale'].some(w => lower.includes(w))) {
        return { intent: "confirmation", message: "Confirmed." };
    }

    return { intent: "other", message: "Lo siento/Sorry/Desculpe..." };
  }
}
