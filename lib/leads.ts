export type LeadPriority = "hot" | "warm" | "cold";

export type LeadTicket = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "open" | "qualified" | "won" | "lost";
  source: "whatsapp" | "widget" | "web";
  channel: "WHATSAPP" | "WIDGET" | "WEB";
  rubro: string;
  summary: string;
  lastMessage: string;
  score: number;
  priority: LeadPriority;
  intent: "booking" | "pricing" | "support" | "other";
};

type ContactMetaShape = {
  leadTickets?: LeadTicket[];
  [k: string]: unknown;
};

const KEYWORDS = {
  booking: ["turno", "reserva", "agendar", "cita", "disponibilidad", "horario"],
  pricing: ["precio", "costo", "cuánto", "cuanto", "plan", "tarifa", "presupuesto"],
  support: ["ayuda", "humano", "asesor", "hablar", "llamar"],
};

const RUBRO_HINTS: Record<string, string[]> = {
  dentista: ["diente", "odont", "limpieza", "blanqueamiento", "ortodoncia"],
  gimnasio: ["gym", "crossfit", "yoga", "entreno", "plan mensual"],
  hotel: ["habitación", "suite", "check-in", "check out", "estadía"],
};

function safeParseMeta(meta?: string | null): ContactMetaShape {
  if (!meta) return {};
  try {
    return JSON.parse(meta) as ContactMetaShape;
  } catch {
    return {};
  }
}

function normalize(text: string) {
  return (text || "").toLowerCase();
}

function inferIntent(message: string): LeadTicket["intent"] {
  const text = normalize(message);
  if (KEYWORDS.booking.some((k) => text.includes(k))) return "booking";
  if (KEYWORDS.pricing.some((k) => text.includes(k))) return "pricing";
  if (KEYWORDS.support.some((k) => text.includes(k))) return "support";
  return "other";
}

function inferRubro(message: string, tenantRubros: string[] = []) {
  const text = normalize(message);

  const foundFromTenant = tenantRubros.find((r) => text.includes(r.toLowerCase()));
  if (foundFromTenant) return foundFromTenant;

  for (const [rubro, hints] of Object.entries(RUBRO_HINTS)) {
    if (hints.some((hint) => text.includes(hint))) return rubro;
  }

  return tenantRubros[0] || "general";
}

function scoreLead(intent: LeadTicket["intent"], message: string): number {
  const base = intent === "booking" ? 80 : intent === "pricing" ? 65 : intent === "support" ? 50 : 35;
  const lenBonus = Math.min(Math.floor(message.length / 40), 15);
  return Math.min(base + lenBonus, 100);
}

function priorityFromScore(score: number): LeadPriority {
  if (score >= 75) return "hot";
  if (score >= 55) return "warm";
  return "cold";
}

export function extractLeadTickets(meta?: string | null): LeadTicket[] {
  const parsed = safeParseMeta(meta);
  return Array.isArray(parsed.leadTickets) ? parsed.leadTickets : [];
}

export function enrichMetaWithLeadTicket(params: {
  meta?: string | null;
  message: string;
  source?: LeadTicket["source"];
  channel?: LeadTicket["channel"];
  tenantRubros?: string[];
}) {
  const parsed = safeParseMeta(params.meta);
  const previous = extractLeadTickets(params.meta);
  const intent = inferIntent(params.message);

  if (intent === "other") {
    return { meta: JSON.stringify(parsed), leadTicket: null };
  }

  const score = scoreLead(intent, params.message);
  const rubro = inferRubro(params.message, params.tenantRubros);
  const now = new Date().toISOString();

  const existingOpen = previous.find((t) => t.status === "open" || t.status === "qualified");

  const ticket: LeadTicket = existingOpen
    ? {
        ...existingOpen,
        updatedAt: now,
        lastMessage: params.message,
        score: Math.max(existingOpen.score, score),
        priority: priorityFromScore(Math.max(existingOpen.score, score)),
        intent,
        summary: `${intent === "booking" ? "Interesado en reservar" : "Consulta comercial"} (${rubro})`,
      }
    : {
        id: `lead_${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        status: "open",
        source: params.source || "whatsapp",
        channel: params.channel || "WHATSAPP",
        rubro,
        summary: `${intent === "booking" ? "Interesado en reservar" : "Consulta comercial"} (${rubro})`,
        lastMessage: params.message,
        score,
        priority: priorityFromScore(score),
        intent,
      };

  const withoutUpdated = previous.filter((t) => t.id !== ticket.id);
  const leadTickets = [ticket, ...withoutUpdated].slice(0, 25);
  const nextMeta: ContactMetaShape = { ...parsed, leadTickets };

  return { meta: JSON.stringify(nextMeta), leadTicket: ticket };
}
