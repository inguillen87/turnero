// lib/bot/stateMachine.ts

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
};

// DEMO DATA (This could come from DB in future)
export const DEFAULT_SERVICES = [
  { id: "consulta", name: "Consulta General", price: 50000, durationMin: 30 },
  { id: "limpieza", name: "Limpieza Dental", price: 35000, durationMin: 30 },
  { id: "ortodoncia", name: "Ortodoncia", price: 80000, durationMin: 45 },
  { id: "blanqueamiento", name: "Blanqueamiento", price: 120000, durationMin: 60 },
];

export const SLOTS = [
  { id: "s1", label: "Mié 11 - 10:00" },
  { id: "s2", label: "Mié 11 - 11:00" },
  { id: "s3", label: "Mié 11 - 14:00" },
];

const APP_NAME = process.env.APP_NAME || "Turnero Pro";

export function menu() {
  return (
`👋 Hola! Soy el asistente de *${APP_NAME}*.

Respondé con un número:
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
  return services.map((s, i) => `${i + 1}) ${s.name} ($${s.price.toLocaleString("es-AR")})`).join("\n");
}

function findServiceByChoice(choice: string, services: any[]) {
  const n = Number(choice);
  if (!Number.isNaN(n) && n >= 1 && n <= services.length) return services[n - 1];
  const byName = services.find((s) => s.name.toLowerCase().includes(choice));
  return byName || null;
}

function bodyRawMask(v: string) {
  if (!v) return "";
  if (v.length <= 4) return "****";
  return v.slice(0, 2) + "****" + v.slice(-2);
}

// Core Logic: Accepts input body and current session, returns reply and next session state
export async function handleMessage(body: string, session: Session, customServices?: any[]) {
  const services = customServices || DEFAULT_SERVICES;

  // Global Navigation
  if (body === "" || body === "hola" || body === "buenas" || body === "menu" || body === "menú" || body === "9") {
    session.state = "HOME";
    session.serviceId = undefined;
    session.slotId = undefined;
    return { reply: menu(), session };
  }
  if (body === "0") {
    session.state = "HOME";
    session.serviceId = undefined;
    session.slotId = undefined;
    return { reply: menu(), session };
  }

  // HOME
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

    return { reply: `No entendí. Respondé con un número.\n\n${menu()}`, session };
  }

  // CHOOSE_SERVICE
  if (session.state === "CHOOSE_SERVICE") {
    const service = findServiceByChoice(body, services);
    if (!service) {
      return { reply: `Servicio inválido.\n${formatServices(services)}\n${helpLine()}`, session };
    }
    session.serviceId = service.id;
    session.state = "CHOOSE_SLOT";
    return {
      reply:
`✅ Elegiste *${service.name}*.
🗓 Horarios sugeridos:
1) ${SLOTS[0].label}
2) ${SLOTS[1].label}
3) ${SLOTS[2].label}

Respondé con 1-3.
${helpLine()}`,
      session,
    };
  }

  // CHOOSE_SLOT
  if (session.state === "CHOOSE_SLOT") {
    const idx = Number(body) - 1;
    if (Number.isNaN(idx) || idx < 0 || idx >= SLOTS.length) {
      return { reply: `Horario inválido. Respondé 1-3.\n${helpLine()}`, session };
    }
    session.slotId = SLOTS[idx].id;
    session.state = "CONFIRM";
    const service = services.find((s) => s.id === session.serviceId);
    return {
      reply:
`Vas a reservar:
- Servicio: *${service?.name || session.serviceId}*
- Horario: *${SLOTS[idx].label}*

Confirmá:
1) ✅ Confirmar
2) ❌ Cancelar
${helpLine()}`,
      session,
    };
  }

  // CONFIRM
  if (session.state === "CONFIRM") {
    if (body === "1" || body === "si" || body === "sí" || body === "confirmar") {
      const service = services.find((s) => s.id === session.serviceId);
      const slot = SLOTS.find((s) => s.id === session.slotId);
      session.state = "HOME";

      // In prod: Save to DB here
      // For now, create the mock payment link
      const payLink = "https://mpago.la/demo"; // Or internal /demo/checkout link

      // We'll reset session data after confirming
      session.serviceId = undefined;
      session.slotId = undefined;

      return {
        reply:
`✅ *Turno confirmado*
- ${service?.name}
- ${slot?.label}

💳 Para finalizar, aboná la seña: ${payLink}

${menu()}`,
        session,
        action: { // Optional: Return action for frontend/demo simulator to update UI
            type: 'APPOINTMENT_CREATED',
            payload: {
                id: Date.now(),
                startAt: new Date().toISOString(), // Mock date based on slot logic if possible, or just now
                clientName: 'Usuario WhatsApp',
                status: 'confirmed',
                serviceName: service?.name
            }
        }
      };
    }

    if (body === "2" || body === "no" || body === "cancelar") {
      session.state = "HOME";
      session.serviceId = undefined;
      session.slotId = undefined;
      return { reply: `Cancelado.\n\n${menu()}`, session };
    }

    return { reply: `Respondé 1 o 2.\n${helpLine()}`, session };
  }

  // CANCEL_FLOW
  if (session.state === "CANCEL_FLOW") {
    // Mock cancellation logic
    session.state = "HOME";
    return { reply: `🔁 (Demo) Cancelación recibida para: ${bodyRawMask(body)}\n\n${menu()}`, session };
  }

  // MY_APPTS
  if (session.state === "MY_APPTS") {
    session.state = "HOME";
    return {
      reply:
`👤 (Demo) Turnos para: ${bodyRawMask(body)}
- Mié 11 10:00 (Ortodoncia) ✅
- Vie 13 12:00 (Consulta) ⏳

${menu()}`,
      session,
    };
  }

  // Fallback
  session.state = "HOME";
  return { reply: menu(), session };
}
