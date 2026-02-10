import { prisma } from "@/lib/db";
import { analyzeMessage, AIIntent } from "@/lib/ai";
import { createPaymentPreference } from "@/lib/mercadopago";
import { LOCALES, Locale } from "./locales";

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
  private demoMode: boolean;
  private locale: Locale;
  private strings: any;

  constructor(tenant: any, customer: any, demoMode = false) {
    this.tenant = tenant;
    this.customer = customer;
    this.demoMode = demoMode;

    // Resolve Locale
    const tLocale = (this.tenant.locale || 'es').split('-')[0]; // es-AR -> es
    this.locale = (['es', 'en', 'pt'].includes(tLocale) ? tLocale : 'es') as Locale;

    // Base Strings
    const baseStrings = LOCALES[this.locale];

    // Merge with Tenant Customizations (if any)
    let customStrings: any = {};
    if (this.tenant.metadata) {
        try {
            // Check if metadata is string or object (BotEngine receives tenant which might have parsed JSON or raw string)
            // Prisma usually returns Json as object, but let's be safe
            const meta = typeof this.tenant.metadata === 'string' ? JSON.parse(this.tenant.metadata) : this.tenant.metadata;
            if (meta?.bot_strings) {
                customStrings = meta.bot_strings;
            }
        } catch (e) { /* ignore json error */ }
    }

    // Deep merge for 'menu' object
    this.strings = {
        ...baseStrings,
        ...customStrings,
        menu: { ...baseStrings.menu, ...(customStrings.menu || {}) }
    };
  }

  async processMessage(text: string): Promise<string> {
    const normalized = text.trim().toLowerCase();

    // Global Commands (Multi-lingual)
    if (['menu', 'inicio', 'hola', 'hi', 'olá', 'start', 'reset', 'home'].includes(normalized)) {
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
    if (input.includes("1") || input.includes("reserv") || input.includes("book") || input.includes("agend")) {
      // Start Booking Flow
      await this.setContext({ state: "BOOKING_SELECT_SERVICE", temp: {} });
      const services = this.tenant.services.filter((s: any) => s.active);
      if (services.length === 0) return "Error: No services active.";

      const list = services.map((s: any, i: number) => `${i+1}. ${s.name} ($${s.priceCents/100})`).join('\n');
      return this.strings.service_selection.replace("{list}", list);
    }

    if (input.includes("2") || input.includes("precios") || input.includes("price") || input.includes("preço")) {
      // AI Price Query
      return await this.handleSmartRouting("precios", context);
    }

    if (input.includes("3") || input.includes("cancel") || input.includes("reagend")) {
       await this.setContext({ state: "CANCELLATION_FLOW" });
       return await this.handleCancellation("listar");
    }

    if (input.includes("4") || input.includes("mis turnos") || input.includes("my appoint") || input.includes("meus agend")) {
       let appointments: any[] = [];
       if (this.demoMode) {
         // Mock appointments
         appointments = [{
           startAt: new Date(Date.now() + 86400000),
           service: { name: "Consulta Demo" }
         }];
       } else {
         appointments = await prisma.appointment.findMany({
            where: { customerId: this.customer.id, status: { in: ['CONFIRMED', 'PENDING'] } },
            include: { service: true },
            orderBy: { startAt: 'asc' },
            take: 3
         });
       }
       if (appointments.length === 0) return this.strings.no_appointments;

       const list = appointments.map(a =>
         `🗓 ${a.startAt.toLocaleDateString()} ${a.startAt.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - ${a.service.name}`
       ).join('\n');

       return this.strings.active_appointments.replace("{list}", list);
    }

    if (input.includes("5") || input.includes("human")) {
       return this.strings.handoff;
    }

    if (input.includes("6") || input.includes("info")) {
        return this.strings.info.replace("{name}", this.tenant.name);
    }

    if (input.includes("7") || input.includes("pol")) {
        return this.strings.policy_text;
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
       // Fuzzy match using AI would be better, but let's try strict contains + AI fallback
       selected = services.find((s: any) => s.name.toLowerCase().includes(input));

       if (!selected) {
          // Use AI to extract service name if it was a sentence
          const analysis = await analyzeMessage(input, {
              services: this.tenant.services,
              conversationHistory: [],
              now: new Date(),
              tenantName: this.tenant.name,
              locale: this.locale
          });

          if (analysis.entities?.serviceName) {
              selected = services.find((s: any) => s.name.toLowerCase() === analysis.entities?.serviceName?.toLowerCase());
              // Second pass fuzzy
              if (!selected && analysis.entities.serviceName) {
                 selected = services.find((s: any) => s.name.toLowerCase().includes(analysis.entities!.serviceName!.toLowerCase()));
              }
          }
       }
    }

    if (selected) {
       context.temp = { ...context.temp, serviceId: selected.id, serviceName: selected.name };
       context.state = "BOOKING_SELECT_DATE";
       await this.setContext(context);

       // Calculate Slots (Mock for now, real logic later)
       const slots = this.calculateSlots();
       context.temp.slotsBuffer = slots; // Store for valid selection
       await this.setContext(context);

       const slotList = slots.map((s, i) => `${i+1}. ${new Date(s).toLocaleString(this.locale, {weekday:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}`).join('\n');

       return this.strings.service_chosen.replace("{service}", selected.name).replace("{slots}", slotList);
    }

    return this.strings.service_selection.replace("{list}", services.map((s:any, i:number) => `${i+1}. ${s.name}`).join('\n'));
  }

  private async handleDateSelection(input: string, context: BotContext): Promise<string> {
      // Check if user selected a number from suggestions
      const index = parseInt(input);
      if (!isNaN(index) && context.temp?.slotsBuffer && context.temp.slotsBuffer[index-1]) {
          const selectedSlot = context.temp.slotsBuffer[index-1];
          context.temp.slot = selectedSlot;
          context.state = "BOOKING_CONFIRMATION";
          await this.setContext(context);

          return this.strings.confirm_prompt
            .replace("{service}", context.temp.serviceName)
            .replace("{date}", new Date(selectedSlot).toLocaleString(this.locale));
      }

      // Use AI to parse date
      const analysis = await analyzeMessage(input, {
        services: this.tenant.services,
        conversationHistory: [],
        now: new Date(),
        tenantName: this.tenant.name,
        locale: this.locale
      });

      if (analysis.entities?.date || analysis.entities?.time) {
         const targetDate = analysis.entities.date ? new Date(analysis.entities.date) : new Date();
         if (analysis.entities.time) {
             const [h, m] = analysis.entities.time.split(':');
             targetDate.setHours(parseInt(h), parseInt(m));
         } else {
             targetDate.setHours(10, 0); // Default to 10am
         }

         const selectedSlot = targetDate.toISOString();
         context.temp = { ...context.temp, slot: selectedSlot };
         context.state = "BOOKING_CONFIRMATION";
         await this.setContext(context);

         return this.strings.confirm_prompt
            .replace("{service}", context.temp.serviceName)
            .replace("{date}", targetDate.toLocaleString(this.locale));
      }

      return this.strings.date_prompt;
  }

  private async handleConfirmation(input: string, context: BotContext): Promise<string> {
      const positiveWords = ['si', 'yes', 'ok', 'confirm', 'dale', 'sim', 'claro'];
      if (positiveWords.some(w => input.includes(w))) {
          if (!context.temp?.serviceId || !context.temp.slot) return this.strings.error;

          const startAt = new Date(context.temp.slot);
          const service = this.tenant.services.find((s: any) => s.id === context.temp!.serviceId);
          const endAt = new Date(startAt.getTime() + (service?.durationMin || 30) * 60000);

          let appt: any;
          let paymentMsg = "";

          if (this.demoMode) {
              appt = { id: 'demo-'+Date.now(), startAt, service, status: "CONFIRMED" };
              // In demo mode, we just simulate the link
              if (service && service.priceCents > 0) {
                  paymentMsg = this.strings.payment_link.replace("{link}", "https://mpago.la/demo");
              }
          } else {
              // Create Appointment
              appt = await prisma.appointment.create({
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

              // Check for Payment Requirement
              if (service && service.priceCents > 0) {
                 const link = await createPaymentPreference(
                     [{ title: service.name, unit_price: service.priceCents / 100, quantity: 1 }],
                     { email: this.customer.email || "guest@turnero.com" },
                     appt.id
                 );
                 if (link) {
                     await prisma.appointment.update({ where: { id: appt.id }, data: { paymentLink: link } });
                     paymentMsg = this.strings.payment_link.replace("{link}", link);
                 }
              }
          }

          // Reset Context
          await this.setContext({ state: "IDLE" });

          return this.strings.confirmed
            .replace("{service}", service?.name)
            .replace("{date}", startAt.toLocaleString(this.locale))
            .replace("{payment}", paymentMsg);
      }

      return this.strings.cancelled;
  }

  private async handleCancellation(input: string): Promise<string> {
      if (input === "listar") {
          let appointments: any[] = [];

          if (this.demoMode) {
              appointments = [{
                  startAt: new Date(Date.now() + 86400000),
                  service: { name: "Consulta Demo" }
              }];
          } else {
              appointments = await prisma.appointment.findMany({
                where: { customerId: this.customer.id, status: { in: ['CONFIRMED'] }, startAt: { gt: new Date() } },
                include: { service: true }
             });
          }

         if (appointments.length === 0) {
             await this.setContext({ state: "IDLE" });
             return this.strings.no_appointments;
         }

         const list = appointments.map((a, i) => `${i+1}. ${a.service.name} (${a.startAt.toLocaleDateString(this.locale)})`).join('\n');
         return this.strings.active_appointments.replace("{list}", list);
      }

      // Handle number selection to cancel... (Simplified for now)
      return this.strings.handoff;
  }

  private async handleSmartRouting(text: string, context: BotContext): Promise<string> {
      // Use AI
      const analysis = await analyzeMessage(text, {
          services: this.tenant.services,
          conversationHistory: [], // TODO: Load history
          now: new Date(),
          tenantName: this.tenant.name,
          locale: this.locale
      });

      if (analysis.intent === "booking") {
          // If AI detects booking intent, try to extract entities and jump start
          await this.setContext({ state: "BOOKING_SELECT_SERVICE", temp: {} });

          // If service name is present, try to jump to date selection
          if (analysis.entities?.serviceName) {
             const found = this.tenant.services.find((s: any) => s.name.toLowerCase().includes(analysis.entities!.serviceName!.toLowerCase()));
             if (found) {
                 // Simulate service selection
                 // We pass the exact name so handleServiceSelection finds it
                 return await this.handleServiceSelection(found.name, { state: "BOOKING_SELECT_SERVICE", temp: {} });
             }
          }

          return await this.handleMenuSelection("1", { state: "MENU_SELECTION" });
      }

      if (analysis.intent === "query_prices") {
          const list = this.tenant.services.map((s: any) => `• ${s.name}: $${s.priceCents/100}`).join('\n');
          return this.strings.prices_list.replace("{list}", list);
      }

      if (analysis.intent === "cancellation") {
          await this.setContext({ state: "CANCELLATION_FLOW" });
          return await this.handleCancellation("listar");
      }

      if (analysis.intent === "handoff") {
          return this.strings.handoff;
      }

      if (analysis.intent === "confirmation") {
          // If we got a stray confirmation, maybe we should be in confirmation state?
          // If we have temp data, jump there
          if (context.temp?.serviceId && context.temp?.slot) {
              return await this.handleConfirmation("si", context);
          }
      }

      return analysis.message;
  }

  // --- Helpers ---

  private async setContext(ctx: BotContext) {
      this.customer.metadata = JSON.stringify(ctx);
      if (!this.demoMode) {
        await prisma.customer.update({
            where: { id: this.customer.id },
            data: { metadata: this.customer.metadata }
        });
      }
  }

  private renderMenu(): string {
      const m = this.strings.menu;
      return this.strings.greeting.replace("{name}", this.tenant.name) + `
1. ${m.booking}
2. ${m.prices}
3. ${m.cancel}
4. ${m.my_appointments}
5. ${m.human}
6. ${m.info}
7. ${m.policy}

${this.strings.prompt_selection}`;
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
