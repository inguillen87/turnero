import { NextRequest, NextResponse } from "next/server";
import { analyzeMessage } from "@/lib/ai";
import { registerSalesLead } from "@/lib/sales-leads";
import { buildSalesRubroPrompt, detectSalesRubro, SALES_RUBROS } from "@/lib/sales-rubros";

const SELLER_NAME = process.env.SALES_SELLER_NAME || "Marce";
const SELLER_WHATSAPP_E164 = process.env.SALES_WHATSAPP_E164 || "+5492613168608";
const SELLER_EMAIL = process.env.SALES_SELLER_EMAIL || "ventas@turnero.app";

function buildSellerWhatsAppLink() {
  const digits = SELLER_WHATSAPP_E164.replace(/\D/g, "");
  const text = encodeURIComponent("Hola Marce, quiero avanzar con Turnero Pro.");
  return `https://wa.me/${digits}?text=${text}`;
}

function fallbackSalesResponse(rubroName: string) {
  return {
    intent: "qualification",
    message: `Excelente, te ayudo con ${rubroName}. Contame cuántos turnos manejan por mes y si querés la solución completa o modular (WhatsApp + CRM + Agenda).`,
    options: [
      { label: "Quiero solución completa", value: "full_suite" },
      { label: "Solo WhatsApp + CRM + Agenda", value: "modular" },
      { label: `Hablar con ${SELLER_NAME}`, value: "contact_seller" },
    ],
  };
}

const SALES_SERVICES = [
  { id: "full", name: "Plataforma Completa", priceCents: 3000000 },
  { id: "wa-crm-agenda", name: "WhatsApp + CRM + Agenda", priceCents: 1400000 },
  { id: "wa-only", name: "Automatización WhatsApp", priceCents: 700000 },
];

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const message = typeof payload?.message === "string" ? payload.message.replace(/\s+/g, " ").trim() : "";
    const history = Array.isArray(payload?.history) ? payload.history : [];
    const anonId = typeof payload?.anonId === "string" ? payload.anonId.trim().slice(0, 80) : undefined;

    if (!message || message.length < 2) {
      return NextResponse.json({ error: "Message required (min 2 chars)" }, { status: 400 });
    }

    if (message.length > 1200) {
      return NextResponse.json({ error: "Message too long (max 1200 chars)" }, { status: 400 });
    }

    const fullContextText = [message, ...history.map((h: any) => h?.content || "")].join("\n");
    const rubro = detectSalesRubro(fullContextText);

    await registerSalesLead({
      message,
      anonId,
      source: "widget",
      rubro: rubro.slug,
    });

    const FAQQuickAnswers = rubro.faq.map((f) => `- ${f.q}: ${f.a}`).join("\n");

    const SALES_SYSTEM_PROMPT = `
Sos el BOT IA comercial enterprise de Turnero Pro para captación B2B en LATAM.
Objetivo: convertir prospectos en demo o cierre.

${buildSalesRubroPrompt(rubro)}

Reglas:
- Respondé con foco en rubro detectado: ${rubro.name}.
- Mencioná beneficios concretos: WhatsApp + CRM + Agenda + Pagos + IA + tiempo real.
- Cuando el usuario haga preguntas típicas, apoyate en esta base FAQ:
${FAQQuickAnswers}
- Siempre capturá datos gradualmente: nombre, empresa, email, whatsapp, tamaño del equipo y volumen mensual.
- Siempre ofrecé siguiente paso claro: demo de 20 min o contacto comercial directo.
- Ofrecé hablar con ${SELLER_NAME} por WhatsApp (${SELLER_WHATSAPP_E164}) o mail (${SELLER_EMAIL}).
- Estilo: español rioplatense, claro, profesional y persuasivo.

Output JSON:
{
  "intent": "...",
  "message": "...",
  "options": [{"label":"...","value":"..."}],
  "entities": {
    "segment": "...",
    "planPreference": "full|modular|unknown",
    "rubro": "${rubro.slug}",
    "leadName": "...",
    "leadEmail": "...",
    "leadPhone": "..."
  }
}
`;

    const response = await analyzeMessage(
      message,
      {
        services: SALES_SERVICES,
        conversationHistory: history,
        now: new Date(),
        tenantName: "Turnero Pro Sales",
        locale: "es",
        botPersonality: "sales",
      },
      SALES_SYSTEM_PROMPT
    ).catch(() => fallbackSalesResponse(rubro.name));

    const options = Array.isArray(response.options) ? response.options : [];
    const contactOption = { label: `💬 Hablar con ${SELLER_NAME}`, value: "contact_seller" };
    const rubroOptions = SALES_RUBROS.slice(0, 6).map((r) => ({ label: `Rubro: ${r.name}`, value: `rubro:${r.slug}` }));
    const merged = [...options, contactOption, ...rubroOptions]
      .filter((opt, idx, arr) => arr.findIndex((o) => o.value === opt.value) === idx)
      .slice(0, 6);

    return NextResponse.json({
      ...response,
      entities: {
        ...(response as any).entities,
        rubro: rubro.slug,
      },
      options: merged,
      seller: {
        name: SELLER_NAME,
        whatsapp: SELLER_WHATSAPP_E164,
        email: SELLER_EMAIL,
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
        email: SELLER_EMAIL,
        url: buildSellerWhatsAppLink(),
      },
    });
  }
}
