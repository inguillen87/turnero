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
  options?: { label: string; value: string }[];
}

export interface AIContext {
    services: { id: string; name: string; priceCents: number }[];
    conversationHistory: { role: 'user' | 'assistant'; content: string }[];
    now: Date;
    tenantName: string;
    locale: string; // 'es', 'en', 'pt'
    tenantType?: string; // 'medical', 'beauty', 'general'
    botPersonality?: string; // 'professional', 'friendly', 'empathetic', 'sales'
    customInstructions?: string;
}

export async function analyzeMessage(
  message: string,
  context: AIContext,
  systemPromptOverride?: string
): Promise<AIResponse> {
  const serviceList = context.services.map(s => `- ${s.name} ($${s.priceCents/100})`).join('\n');

  // Dynamic Personality Construction
  let personalityInstruction = "You are a helpful and efficient assistant.";
  if (context.botPersonality === 'empathetic') {
      personalityInstruction = "You are a warm, caring, and highly empathetic assistant. If the user expresses pain, urgency, or doubt, show genuine concern before proceeding. Prioritize their well-being.";
  } else if (context.botPersonality === 'friendly') {
      personalityInstruction = "You are a cheerful, super friendly, and enthusiastic assistant. Use emojis where appropriate. Make the user feel welcome and excited.";
  } else if (context.botPersonality === 'professional') {
      personalityInstruction = "You are a highly professional, polite, and concise assistant. Maintain a formal but approachable tone. Focus on efficiency.";
  } else if (context.botPersonality === 'sales') {
      personalityInstruction = "You are a persuasive and sales-oriented assistant. Always highlight the value of services. If a user asks for a price, mention the benefits. Try to upsell premium services if appropriate.";
  }

  // Dynamic Tenant Type Context
  let typeInstruction = "";
  if (context.tenantType === 'medical') {
      typeInstruction = "This is a medical facility. Treat all information with privacy. Be precise about times.";
  } else if (context.tenantType === 'beauty') {
      typeInstruction = "This is a beauty/wellness center. Focus on relaxation, aesthetic results, and self-care.";
  }

  const generatedSystemPrompt = `
    ${personalityInstruction}
    ${typeInstruction}
    You work for "${context.tenantName}".
    ${context.customInstructions ? `Special Instructions: ${context.customInstructions}` : ''}

    Current Date: ${context.now.toLocaleString()}
    Language: Reply in ${context.locale === 'pt' ? 'Portuguese' : context.locale === 'en' ? 'English' : 'Spanish'}.

    Services Offered:
    ${serviceList}

    Your Goal:
    - Identify the user's intent clearly.
    - If they want to book, extract specific details (Service, Date, Time).
    - If they are undecided, ask clarifying questions or suggest popular options.
    - If they confirm, acknowledge it.
    - ALWAYS provide a 'message' that is ready to send to the user via WhatsApp. Keep it under 300 characters usually, unless detailed info is requested.
    - ALWAYS provide 'options' (suggested quick replies) to guide the user.

    Intents:
    - booking: User wants to schedule.
    - query_prices: User asks for prices.
    - query_owner: User asks for manager/human.
    - cancellation: User wants to cancel.
    - confirmation: User confirms a proposal.
    - handoff: User is angry or needs complex help.
    - faq: General questions.
    - other: Greeting/Unclear.

    Output JSON Format:
    {
      "intent": "booking|query_prices|...",
      "message": "The actual text reply to the user...",
      "entities": {
        "serviceName": "extracted service name",
        "date": "YYYY-MM-DD",
        "time": "HH:mm",
        "personName": "User Name"
      },
      "options": [ { "label": "Reply Button 1", "value": "payload1" } ]
    }
  `;

  const systemPrompt = systemPromptOverride || generatedSystemPrompt;

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
      temperature: 0.7, // Slightly higher for more "human" feel
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content");
    return JSON.parse(content) as AIResponse;
  } catch (error) {
    // console.warn("OpenAI Error (Using Fallback Logic):", error);

    // FALLBACK LOGIC (Heuristics)
    const lower = message.toLowerCase();

    // Check for Service Names
    const foundService = context.services.find(s => {
        const sName = s.name.toLowerCase();
        if (lower.includes(sName)) return true;
        const words = sName.split(' ');
        return words.some(w => w.length > 3 && lower.includes(w));
    });

    if (lower.includes("precio") || lower.includes("costo") || lower.includes("price") || lower.includes("preço")) {
        return { intent: "query_prices", message: "Here are the prices..." };
    }

    if (lower.includes("cancel") || lower.includes("reprogramar")) {
        return { intent: "cancellation", message: "Let's cancel..." };
    }

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
