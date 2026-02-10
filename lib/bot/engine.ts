import { prisma } from "@/lib/db";
import { analyzeMessage, AIIntent } from "@/lib/ai";
import { createPaymentPreference } from "@/lib/mercadopago";

// State Definitions
export type BotState =
  | "IDLE"
  | "MENU_SELECTION"
  | "BOOKING_SELECT_SERVICE"
  | "BOOKING_SELECT_DATE"
  | "BOOKING_CONFIRMATION"
  | "CANCELLATION_FLOW"
  | "HANDOFF_WAITING";

interface BotContext {
  state: BotState;
  temp?: {
    serviceId?: string;
    serviceName?: string;
    slot?: string; // ISO
    slotsBuffer?: string[]; // ISO strings of offered slots
  };
}

export class BotEngine {
  private tenant: any;
  private customer: any;

  constructor(tenant: any, customer: any) {
    this.tenant = tenant;
    this.customer = customer;
  }

  async processMessage(text: string): Promise<string> {
    const normalized = text.trim().toLowerCase();

    // Global Commands
    if (['menu', 'inicio', 'hola', 'hi', 'start', 'reset'].includes(normalized)) {
      await this.setContext({ state: "MENU_SELECTION" });
      return this.renderMenu();
    }

    // Load Context
    let context: BotContext = this.customer.metadata ? JSON.parse(this.customer.metadata) : { state: "IDLE" };

    // State Machine
    switch (context.state) {
      case "MENU_SELECTION":
        return await this.handleMenuSelection(normalized, context);

      case "BOOKING_SELECT_SERVICE":
        return await this.handleServiceSelection(normalized, context);

      case "BOOKING_SELECT_DATE":
        return await this.handleDateSelection(normalized, context);

      case "BOOKING_CONFIRMATION":
        return await this.handleConfirmation(normalized, context);

      case "CANCELLATION_FLOW":
        return await this.handleCancellation(normalized);

      case "IDLE":
      default:
        // Use AI for "Smart Router" if no specific flow active
        return await this.handleSmartRouting(text, context);
    }
  }

  // --- Handlers ---

  private async handleMenuSelection(input: string, context: BotContext): Promise<string> {
    if (input.includes("1") || input.includes("reservar")) {
      // Start Booking Flow
      await this.setContext({ state: "BOOKING_SELECT_SERVICE", temp: {} });
      const services = this.tenant.services.filter((s: any) => s.active);
      if (services.length === 0) return "Lo siento, no tenemos servicios disponibles por ahora.";

      const list = services.map((s: any, i: number) => `${i+1}. ${s.name} ($${s.priceCents/100})`).join('\n');
      return `¿Qué servicio buscas?\n${list}\n\nEscribe el número o el nombre.`;
    }

    if (input.includes("2") || input.includes("precios")) {
      // AI Price Query
      return await this.handleSmartRouting("precios", context);
    }

    if (input.includes("3") || input.includes("cancelar")) {
       await this.setContext({ state: "CANCELLATION_FLOW" });
       return await this.handleCancellation("listar");
    }

    if (input.includes("4") || input.includes("mis turnos")) {
       const appointments = await prisma.appointment.findMany({
          where: { customerId: this.customer.id, status: { in: ['CONFIRMED', 'PENDING'] } },
          include: { service: true },
          orderBy: { startAt: 'asc' },
          take: 3
       });
       if (appointments.length === 0) return "No tienes turnos pendientes.";
       return "Tus turnos:\n" + appointments.map(a =>
         `🗓 ${a.startAt.toLocaleDateString()} ${a.startAt.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - ${a.service.name}`
       ).join('\n');
    }

    if (input.includes("5") || input.includes("humano")) {
       return "Un humano te responderá pronto. Dejá tu consulta aquí 👇";
    }

    if (input.includes("6") || input.includes("info")) {
        // Mock Info
        return `📍 ${this.tenant.name}\nHorarios: Lun-Vie 9-18hs.\nDirección: Av. Siempre Viva 123.`;
    }

    if (input.includes("7") || input.includes("politica")) {
        return "Seña del 50% requerida para confirmar. Cancelaciones con 24hs de anticipación.";
    }

    // Default Fallback
    return await this.handleSmartRouting(input, context);
  }

  private async handleServiceSelection(input: string, context: BotContext): Promise<string> {
    // Try to match by number or name
    const services = this.tenant.services.filter((s: any) => s.active);
    let selected: any;

    const index = parseInt(input);
    if (!isNaN(index) && index > 0 && index <= services.length) {
       selected = services[index - 1];
    } else {
       // Fuzzy match
       selected = services.find((s: any) => s.name.toLowerCase().includes(input));
    }

    if (selected) {
       context.temp = { ...context.temp, serviceId: selected.id, serviceName: selected.name };
       context.state = "BOOKING_SELECT_DATE";
       await this.setContext(context);

       // Calculate Slots (Mock for now, real logic later)
       const slots = this.calculateSlots();
       context.temp.slotsBuffer = slots; // Store for valid selection
       await this.setContext(context);

       const slotList = slots.map((s, i) => `${i+1}. ${new Date(s).toLocaleString([], {weekday:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}`).join('\n');

       return `Has elegido ${selected.name}. 🗓 Horarios sugeridos:\n${slotList}\n\nResponde con el número (1-3) o escribe otra fecha.`;
    }

    return "No entendí qué servicio quieres. Por favor elige un número de la lista.";
  }

  private async handleDateSelection(input: string, context: BotContext): Promise<string> {
      // Check if user selected a number from suggestions
      const index = parseInt(input);
      if (!isNaN(index) && context.temp?.slotsBuffer && context.temp.slotsBuffer[index-1]) {
          const selectedSlot = context.temp.slotsBuffer[index-1];
          context.temp.slot = selectedSlot;
          context.state = "BOOKING_CONFIRMATION";
          await this.setContext(context);

          return `Vas a reservar: ${context.temp.serviceName}\n📅 ${new Date(selectedSlot).toLocaleString()}\n\nResponde "SI" para confirmar.`;
      }

      // If user wrote a custom date, we'd need AI or complex parsing.
      // For MVP, just re-ask or use smart routing if completely lost.
      return "Por favor elige una de las opciones numéricas (1-3) por ahora.";
  }

  private async handleConfirmation(input: string, context: BotContext): Promise<string> {
      if (['si', 'yes', 'ok', 'confirmar'].includes(input)) {
          if (!context.temp?.serviceId || !context.temp.slot) return "Error de datos. Escribe 'menu' para reiniciar.";

          const startAt = new Date(context.temp.slot);
          const service = this.tenant.services.find((s: any) => s.id === context.temp!.serviceId);
          const endAt = new Date(startAt.getTime() + (service?.durationMin || 30) * 60000);

          // Create Appointment
          const appt = await prisma.appointment.create({
             data: {
                 tenantId: this.tenant.id,
                 customerId: this.customer.id,
                 serviceId: service!.id,
                 startAt,
                 endAt,
                 status: "CONFIRMED", // Or PENDING if payment required
                 source: "WHATSAPP_BOT",
                 priceCents: service?.priceCents,
                 paymentStatus: "PENDING"
             }
          });

          // Check for Payment Requirement (Mock logic: all > $0 need payment)
          let paymentMsg = "";
          if (service && service.priceCents > 0) {
             const link = await createPaymentPreference(
                 [{ title: service.name, unit_price: service.priceCents / 100, quantity: 1 }],
                 { email: this.customer.email || "guest@turnero.com" },
                 appt.id
             );
             if (link) {
                 await prisma.appointment.update({ where: { id: appt.id }, data: { paymentLink: link } });
                 paymentMsg = `\n\n💳 Para finalizar, aboná la seña aquí: ${link}`;
             }
          }

          // Reset Context
          await this.setContext({ state: "IDLE" });

          return `✅ Turno Confirmado!\n${service?.name}\n${startAt.toLocaleString()}${paymentMsg}`;
      }

      return "Reserva cancelada. Escribe 'menu' para volver.";
  }

  private async handleCancellation(input: string): Promise<string> {
      if (input === "listar") {
          const appointments = await prisma.appointment.findMany({
            where: { customerId: this.customer.id, status: { in: ['CONFIRMED'] }, startAt: { gt: new Date() } },
            include: { service: true }
         });
         if (appointments.length === 0) {
             await this.setContext({ state: "IDLE" });
             return "No tienes turnos futuros para cancelar.";
         }
         return "Tus turnos activos:\n" + appointments.map((a, i) => `${i+1}. ${a.service.name} (${a.startAt.toLocaleDateString()})`).join('\n') + "\n\nPara cancelar, escribe el número.";
      }

      // Handle number selection to cancel... (Simplified for now)
      return "Para cancelar, por favor contacta a soporte humano por ahora. Opción 5.";
  }

  private async handleSmartRouting(text: string, context: BotContext): Promise<string> {
      // Use AI
      const analysis = await analyzeMessage(text, {
          services: this.tenant.services,
          conversationHistory: [], // TODO: Load history
          now: new Date(),
          tenantName: this.tenant.name
      });

      if (analysis.intent === "booking") {
          // If AI detects booking intent, try to extract entities and jump start
          await this.setContext({ state: "BOOKING_SELECT_SERVICE", temp: {} });
          return await this.handleMenuSelection("1", { state: "MENU_SELECTION" }); // Simulate menu click
      }

      return analysis.message;
  }

  // --- Helpers ---

  private async setContext(ctx: BotContext) {
      this.customer.metadata = JSON.stringify(ctx);
      await prisma.customer.update({
          where: { id: this.customer.id },
          data: { metadata: this.customer.metadata }
      });
  }

  private renderMenu(): string {
      return `Hola! Soy el asistente de *${this.tenant.name}*.
1. 📅 Reservar turno
2. 💰 Ver precios
3. 🔁 Cancelar/Reprogramar
4. 👤 Mis turnos
5. 🧑‍💼 Hablar con humano
6. ℹ️ Info (Ubicación)
7. 🧾 Políticas

Responde con el número.`;
  }

  private calculateSlots(): string[] {
      // Mock Slots: Tomorrow at 10, 11, 14
      const d = new Date();
      d.setDate(d.getDate() + 1);
      const s1 = new Date(d); s1.setHours(10, 0, 0, 0);
      const s2 = new Date(d); s2.setHours(11, 0, 0, 0);
      const s3 = new Date(d); s3.setHours(14, 0, 0, 0);
      return [s1.toISOString(), s2.toISOString(), s3.toISOString()];
  }
}
