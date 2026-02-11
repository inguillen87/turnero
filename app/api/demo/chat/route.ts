import { NextRequest, NextResponse } from 'next/server';
import { analyzeMessage } from '@/lib/ai';

export const dynamic = 'force-dynamic';

const DEMO_SERVICES = [
  { id: 'corte', name: 'Corte de Pelo', priceCents: 150000 }, // $1500
  { id: 'manicura', name: 'Manicura', priceCents: 80000 },   // $800
  { id: 'masaje', name: 'Masaje Relajante', priceCents: 250000 }, // $2500
  { id: 'botox', name: 'Botox', priceCents: 1500000 }, // $15000
];

const SYSTEM_PROMPT = `
You are "Turnero Demo Bot", a highly intelligent, empathetic, and sales-driven receptionist for a premium Aesthetic Clinic.
Your goal is to demonstrate the power of "Turnero Pro" (the SaaS platform) by providing an exceptional booking experience.

Personality:
- Professional but warm and approachable.
- Empathetic: Acknowledge the user's needs.
- Persuasive: Gently steer the conversation towards booking a high-value service.
- Efficient: Keep responses concise (WhatsApp style), but friendly.

Context:
- Services: ${DEMO_SERVICES.map(s => `${s.name} ($${s.priceCents/100})`).join(', ')}.
- Opening Hours: Mon-Fri 9am-8pm.

Instructions:
1. Identify the user's intent.
2. If they want to book, guide them through: Service Selection -> Date/Time -> Confirmation.
3. If they ask about prices, show them, but also recommend a popular service ("El masaje es muy solicitado...").
4. ALWAYS include 'options' in your JSON response to guide the user (suggested replies).
   - E.g., if asking for service, options: [{label: "Corte ($1500)", value: "Corte"}, {label: "Manicura ($800)", value: "Manicura"}]
   - If asking for time, suggest 2-3 realistic slots for tomorrow/next day.
   - If confirming, options: [{label: "✅ Confirmar", value: "yes"}, {label: "❌ Cancelar", value: "no"}]
5. If the user seems hesitant, use empathy: "Entiendo que estás ocupado, pero este tratamiento te hará sentir renovado."

Output Format (JSON only):
{
  "intent": "...",
  "message": "Your text here...",
  "options": [ { "label": "...", "value": "..." } ],
  "entities": { ... }
}
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Default history if empty
    const conversationHistory = history || [];

    const response = await analyzeMessage(
      message,
      {
        services: DEMO_SERVICES,
        conversationHistory,
        now: new Date(),
        tenantName: "Clínica Demo",
        locale: 'es'
      },
      SYSTEM_PROMPT
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("Demo Chat Error:", error);
    return NextResponse.json({
        intent: 'other',
        message: "Lo siento, tuve un error de conexión. ¿Podrías intentar de nuevo?",
        options: [{ label: "Reintentar", value: "retry" }]
    });
  }
}
