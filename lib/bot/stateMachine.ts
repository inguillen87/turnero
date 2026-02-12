// lib/bot/stateMachine.ts
import { analyzeMessage } from "../ai.ts";
import type { AIIntent } from "../ai.ts";
import { getAvailableSlots, reserveSlot } from "./slots.ts";
import type { Slot } from "./slots.ts";

export type BookingState =
  | "HOME"
  | "CHOOSE_SERVICE"
  | "CHOOSE_SLOT"
  | "CONFIRM"
  | "CANCEL_FLOW"
  | "MY_APPTS";

export type Session = {
  state: BookingState;
  serviceId?: string;
  slotId?: string;
  updatedAt: number;
  history?: { role: 'user' | 'assistant'; content: string }[];
  cachedSlots?: Slot[]; // Cache slots shown to user to map selection 1,2,3
};

// DEMO DATA (This could come from DB in future)
export const DEFAULT_SERVICES = [
  { id: "consulta", name: "Consulta General", price: 50000, durationMin: 30 },
  { id: "limpieza", name: "Limpieza Dental", price: 35000, durationMin: 30 },
  { id: "ortodoncia", name: "Ortodoncia", price: 80000, durationMin: 45 },
  { id: "blanqueamiento", name: "Blanqueamiento", price: 120000, durationMin: 60 },
];

const APP_NAME = process.env.APP_NAME || "Turnero Pro";

export function menu(appName?: string) {
  return (
`👋 Hola! Soy el asistente de *${appName || APP_NAME}*.

Respondé con un número o escribe lo que necesitas:
1) 📅 Reservar turno
2) 💰 Ver precios
3) 🔁 Cancelar
4) 👤 Mis turnos
5) 🧑‍💼 Hablar con humano
9) 📌 Menú`
  );
}

export function helpLine() {
  return `Tip: "9" menú, "0" volver.`;
}

function formatServices(services: any[]) {
  return services.map((s, i) => `${i + 1}) ${s.name} ($${(s.price || s.priceCents/100).toLocaleString("es-AR")})`).join("\n");
}

function findServiceByChoice(choice: string, services: any[]) {
  const n = Number(choice);
  if (!Number.isNaN(n) && n >= 1 && n <= services.length) return services[n - 1];
  const byName = services.find((s) => s.name.toLowerCase().includes(choice));
  return byName || null;
}

function findServiceByName(name: string, services: any[]) {
    if (!name) return null;
    const lower = name.toLowerCase();
    return services.find(s => s.name.toLowerCase().includes(lower)) || null;
}

function bodyRawMask(v: string) {
  if (!v) return "";
  if (v.length <= 4) return "****";
  return v.slice(0, 2) + "****" + v.slice(-2);
}

export interface BotContext {
    tenantName: string;
    services?: any[];
    botSettings?: {
        personality?: string;
        tenantType?: string;
        customInstructions?: string;
    };
}

// Core Logic: Accepts input body and current session, returns reply and next session state
export async function handleMessage(
    body: string,
    session: Session,
    context?: BotContext
) {
  const services = context?.services || DEFAULT_SERVICES;
  const tenantName = context?.tenantName || APP_NAME;

  // Initialize history if missing
  if (!session.history) session.history = [];

  // Global Navigation (Deterministic)
  if (body === "menu" || body === "menú" || body === "9") {
    session.state = "HOME";
    session.serviceId = undefined;
    session.slotId = undefined;
    session.cachedSlots = undefined;
    session.history.push({ role: 'user', content: body });
    const reply = menu(tenantName);
    session.history.push({ role: 'assistant', content: reply });
    return { reply, session };
  }
  if (body === "0") {
    session.state = "HOME";
    session.serviceId = undefined;
    session.slotId = undefined;
    session.cachedSlots = undefined;
    const reply = menu(tenantName);
    session.history.push({ role: 'user', content: body });
    session.history.push({ role: 'assistant', content: reply });
    return { reply, session };
  }

  // --- DETERMINISTIC STATE HANDLING ---

  // HOME - Deterministic Override
  if (session.state === "HOME") {
    if (body === "1") {
      session.state = "CHOOSE_SERVICE";
      return {
        reply: `📅 *Reservar turno*\n¿Qué servicio buscás?\n${formatServices(services)}\n\nRespondé con el número.\n${helpLine()}`,
        session,
      };
    }
    if (body === "2") {
      return {
        reply: `💰 *Precios*\n${formatServices(services)}\n\n${helpLine()}`,
        session,
      };
    }
    if (body === "3") {
      session.state = "CANCEL_FLOW";
      return { reply: `🔁 *Cancelar*\nPasame tu DNI o teléfono.\n${helpLine()}`, session };
    }
    if (body === "4") {
      session.state = "MY_APPTS";
      return { reply: `👤 *Mis turnos*\nPasame tu DNI o teléfono.\n${helpLine()}`, session };
    }
    if (body === "5") {
      return { reply: `🧑‍💼 Te paso con un humano.\n(Demo)\n${helpLine()}`, session };
    }
  }

  // CHOOSE_SERVICE (Deterministic)
  if (session.state === "CHOOSE_SERVICE") {
    const service = findServiceByChoice(body, services);
    if (service) {
        session.serviceId = service.id;
        session.state = "CHOOSE_SLOT";

        // Fetch dynamic slots
        const slots = await getAvailableSlots();
        session.cachedSlots = slots.slice(0, 5); // Show top 5

        const slotsText = session.cachedSlots.map((s, i) => `${i + 1}) ${s.label}`).join("\n");

        return {
        reply:
`✅ Elegiste *${service.name}*.
🗓 Horarios disponibles:
${slotsText}

Respondé con 1-${session.cachedSlots.length}.
${helpLine()}`,
        session,
        };
    }
  }

  // CHOOSE_SLOT (Deterministic)
  if (session.state === "CHOOSE_SLOT") {
    const idx = Number(body) - 1;
    if (session.cachedSlots && !Number.isNaN(idx) && idx >= 0 && idx < session.cachedSlots.length) {
        session.slotId = session.cachedSlots[idx].id;
        session.state = "CONFIRM";
        const service = services.find((s) => s.id === session.serviceId);
        return {
        reply:
`Vas a reservar:
- Servicio: *${service?.name || session.serviceId}*
- Horario: *${session.cachedSlots[idx].label}*

Confirmá:
1) ✅ Confirmar
2) ❌ Cancelar
${helpLine()}`,
        session,
        };
    } else {
        return { reply: `Opción inválida. Elegí del 1 al ${session.cachedSlots?.length || 0}.\n${helpLine()}`, session };
    }
  }

  // CONFIRM (Deterministic)
  if (session.state === "CONFIRM") {
    if (body === "1" || body === "si" || body === "sí" || body === "confirmar" || body === "yes") {
      const service = services.find((s) => s.id === session.serviceId);

      // Try to reserve
      const reserved = await reserveSlot(session.slotId!);

      if (!reserved) {
          session.state = "CHOOSE_SLOT";
          // Refresh slots
          const slots = await getAvailableSlots();
          session.cachedSlots = slots.slice(0, 5);
          const slotsText = session.cachedSlots.map((s, i) => `${i + 1}) ${s.label}`).join("\n");
          return {
              reply: `⚠️ Lo siento, ese horario ya fue ocupado por otra persona hace instantes.\n\nElegí otro:\n${slotsText}`,
              session
          }
      }

      // Find label for response (might be in cache or we reconstruct it, simplistic here)
      // Ideally we stored the label in session, but we can assume success
      const slotLabel = session.cachedSlots?.find(s => s.id === session.slotId)?.label || "Horario Reservado";
      const slotIso = session.cachedSlots?.find(s => s.id === session.slotId)?.dateIso;

      session.state = "HOME";
      session.serviceId = undefined;
      session.slotId = undefined;
      session.cachedSlots = undefined;
      const payLink = "https://mpago.la/demo";

      const actionPayload = {
          id: Date.now(),
          startAt: slotIso || new Date().toISOString(),
          clientName: 'Usuario WhatsApp',
          status: 'confirmed',
          serviceName: service?.name,
          service: service
      };

      return {
        reply:
`✅ *Turno confirmado*
- ${service?.name}
- ${slotLabel}

💳 Para finalizar, aboná la seña: ${payLink}

${menu(tenantName)}`,
        session,
        action: {
            type: 'APPOINTMENT_CREATED',
            payload: actionPayload
        }
      };
    }
    if (body === "2" || body === "no" || body === "cancelar") {
      session.state = "HOME";
      session.serviceId = undefined;
      session.slotId = undefined;
      return { reply: `Cancelado.\n\n${menu(tenantName)}`, session };
    }
  }

  // CANCEL/MY_APPTS (Deterministic)
  if (session.state === "CANCEL_FLOW") {
    session.state = "HOME";
    return { reply: `🔁 (Demo) Cancelación recibida para: ${bodyRawMask(body)}\n\n${menu(tenantName)}`, session };
  }
  if (session.state === "MY_APPTS") {
    session.state = "HOME";
    return {
      reply:
`👤 (Demo) Turnos para: ${bodyRawMask(body)}
- Mié 11 10:00 (Ortodoncia) ✅
- Vie 13 12:00 (Consulta) ⏳

${menu(tenantName)}`,
      session,
    };
  }

  // --- AI FALLBACK ---
  try {
      const aiResult = await analyzeMessage(body, {
          services: services.map(s => ({
              id: s.id,
              name: s.name,
              priceCents: s.price ? s.price * 100 : s.priceCents || 0
          })),
          conversationHistory: session.history,
          now: new Date(),
          tenantName: tenantName,
          locale: 'es',
          botPersonality: context?.botSettings?.personality,
          tenantType: context?.botSettings?.tenantType,
          customInstructions: context?.botSettings?.customInstructions
      });

      session.history.push({ role: 'user', content: body });
      session.history.push({ role: 'assistant', content: aiResult.message });

      if (aiResult.intent === 'booking') {
          if (aiResult.entities?.serviceName) {
              const service = findServiceByName(aiResult.entities.serviceName, services);
              if (service) {
                  session.serviceId = service.id;
                  session.state = "CHOOSE_SLOT";

                  // AI Logic should also fetch dynamic slots
                  const slots = await getAvailableSlots();
                  session.cachedSlots = slots.slice(0, 5);
                  const slotsText = session.cachedSlots.map((s, i) => `${i + 1}) ${s.label}`).join("\n");

                  return {
                      reply: `(AI) Entendido, buscas ${service.name}.\n\n🗓 Horarios disponibles:\n${slotsText}\n\nRespondé con 1-${session.cachedSlots.length}.`,
                      session
                  }
              }
          }
          session.state = "CHOOSE_SERVICE";
          return {
              reply: `(AI) ${aiResult.message}\n\n¿Qué servicio te interesa?\n${formatServices(services)}`,
              session
          };
      }

      if (aiResult.intent === 'query_prices') {
          return { reply: `(AI) ${aiResult.message}\n\n${formatServices(services)}`, session };
      }

      return { reply: aiResult.message, session };

  } catch (e) {
      console.error("AI Error", e);
      session.state = "HOME";
      return { reply: menu(tenantName), session };
  }
}
