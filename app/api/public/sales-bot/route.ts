import { NextRequest, NextResponse } from "next/server";
import { analyzeMessage } from "@/lib/ai";
import { registerSalesLead } from "@/lib/sales-leads";

const SELLER_NAME = process.env.SALES_SELLER_NAME || "Marce";
const SELLER_WHATSAPP_E164 = process.env.SALES_WHATSAPP_E164 || "+5492613168608";

function buildSellerWhatsAppLink() {
  const digits = SELLER_WHATSAPP_E164.replace(/\D/g, "");
  const text = encodeURIComponent("Hola Marce, quiero avanzar con Turnero Pro.");
  return `https://wa.me/${digits}?text=${text}`;
}

const SALES_SYSTEM_PROMPT = `
Sos el BOT IA comercial de Turnero Pro para captación B2B.
Tu objetivo es convertir prospectos en demos o llamada comercial.

Reglas:
- Detectá rubro (clínica, psicología, pyme, profesional independiente).
- Detectá necesidad: plataforma completa o stack modular (WhatsApp + CRM + agenda/cola de turnos).
- Hacé preguntas cortas para calificar (volumen de turnos, equipo, dolor principal, urgencia).
- Siempre ofrecé siguiente paso claro: demo de 20 min o propuesta directa.
- Ofrecé en algún momento hablar directo con el vendedor ${SELLER_NAME} por WhatsApp (${SELLER_WHATSAPP_E164}).
- Respuestas breves, pro, persuasivas, en español rioplatense.

Output JSON:
{
  "intent": "...",
  "message": "...",
  "options": [{"label":"...","value":"..."}],
  "entities": {"segment":"...","planPreference":"full|modular|unknown"}
}
`;

const SALES_SERVICES = [
  { id: "full", name: "Plataforma Completa", priceCents: 3000000 },
  { id: "wa-crm-agenda", name: "WhatsApp + CRM + Agenda", priceCents: 1400000 },
  { id: "wa-only", name: "Automatización WhatsApp", priceCents: 700000 },
];

export async function POST(req: NextRequest) {
  try {
    const { message, history, anonId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    await registerSalesLead({
      message,
      anonId,
      source: "widget",
    });

    const response = await analyzeMessage(
      message,
      {
        services: SALES_SERVICES,
        conversationHistory: history || [],
        now: new Date(),
        tenantName: "Turnero Pro Sales",
        locale: "es",
        botPersonality: "sales",
      },
      SALES_SYSTEM_PROMPT
    );

    const contactOption = {
      label: `💬 Hablar con ${SELLER_NAME}`,
      value: "contact_seller",
    };

    const options = Array.isArray(response.options) ? response.options : [];
    const hasContactOption = options.some((o) => o?.value === "contact_seller");

    return NextResponse.json({
      ...response,
      options: hasContactOption ? options : [...options.slice(0, 3), contactOption],
      seller: {
        name: SELLER_NAME,
        whatsapp: SELLER_WHATSAPP_E164,
        url: buildSellerWhatsAppLink(),
      },
    });
  } catch (error) {
    console.error("Sales bot error", error);
    return NextResponse.json({
      intent: "other",
      message: "Se cortó un instante. Si querés, avanzamos con una demo de 20 min para tu rubro.",
      options: [
        { label: "✅ Quiero demo", value: "Quiero demo" },
        { label: "💬 Solo WhatsApp + CRM + Agenda", value: "Necesito solo whatsapp crm agenda" },
        { label: `📲 Contactar a ${SELLER_NAME}`, value: "contact_seller" },
      ],
      seller: {
        name: SELLER_NAME,
        whatsapp: SELLER_WHATSAPP_E164,
        url: buildSellerWhatsAppLink(),
      },
    });
  }
}
