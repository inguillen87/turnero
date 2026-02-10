export type Locale = 'es' | 'en' | 'pt';

export const LOCALES: Record<Locale, any> = {
  es: {
    greeting: "Hola! Soy el asistente de *{name}*.",
    menu: {
      booking: "📅 Reservar turno",
      prices: "💰 Ver precios",
      cancel: "🔁 Cancelar/Reprogramar",
      my_appointments: "👤 Mis turnos",
      human: "🧑‍💼 Hablar con humano",
      info: "ℹ️ Info (Ubicación)",
      policy: "🧾 Políticas"
    },
    prompt_selection: "Responde con el número.",
    service_selection: "¿Qué servicio buscas?\n{list}\n\nEscribe el número o el nombre.",
    service_chosen: "Has elegido {service}. 🗓 Horarios sugeridos:\n{slots}\n\nResponde con el número (1-3) o escribe otra fecha (ej: 'mañana a las 10').",
    date_prompt: "Por favor elige una opción numérica (1-3) o escribe 'mañana a las 10'.",
    confirm_prompt: "Vas a reservar: {service}\n📅 {date}\n\nResponde 'SI' para confirmar.",
    confirmed: "✅ Turno Confirmado!\n{service}\n{date}{payment}",
    cancelled: "Reserva cancelada. Escribe 'menu' para volver.",
    no_appointments: "No tienes turnos pendientes.",
    active_appointments: "Tus turnos:\n{list}",
    prices_list: "Nuestros precios:\n{list}",
    handoff: "Un humano te responderá pronto. Dejá tu consulta aquí 👇",
    info: "📍 {name}\nHorarios: Lun-Vie 9-18hs.\nDirección: Av. Siempre Viva 123.",
    policy_text: "Seña del 50% requerida. Cancelaciones 24hs antes.",
    error: "Lo siento, no te entendí bien. Escribe 'menu' para ver opciones.",
    payment_link: "\n\n💳 Para finalizar, aboná la seña aquí: {link}"
  },
  en: {
    greeting: "Hi! I'm the assistant for *{name}*.",
    menu: {
      booking: "📅 Book Appointment",
      prices: "💰 See Prices",
      cancel: "🔁 Cancel/Reschedule",
      my_appointments: "👤 My Appointments",
      human: "🧑‍💼 Talk to Human",
      info: "ℹ️ Info (Location)",
      policy: "🧾 Policies"
    },
    prompt_selection: "Reply with the number.",
    service_selection: "Which service?\n{list}\n\nType the number or name.",
    service_chosen: "You chose {service}. 🗓 Suggested slots:\n{slots}\n\nReply with number (1-3) or type a date (e.g. 'tomorrow at 10').",
    date_prompt: "Please choose a number (1-3) or type 'tomorrow at 10'.",
    confirm_prompt: "Booking: {service}\n📅 {date}\n\nReply 'YES' to confirm.",
    confirmed: "✅ Confirmed!\n{service}\n{date}{payment}",
    cancelled: "Cancelled. Type 'menu' to restart.",
    no_appointments: "No pending appointments.",
    active_appointments: "Your appointments:\n{list}",
    prices_list: "Our prices:\n{list}",
    handoff: "A human will reply soon. Leave your message below 👇",
    info: "📍 {name}\nHours: Mon-Fri 9am-6pm.\nAddress: 123 Main St.",
    policy_text: "50% deposit required. 24h cancellation notice.",
    error: "Sorry, I didn't understand. Type 'menu' for options.",
    payment_link: "\n\n💳 Pay deposit here: {link}"
  },
  pt: {
    greeting: "Olá! Sou o assistente da *{name}*.",
    menu: {
      booking: "📅 Agendar horário",
      prices: "💰 Ver preços",
      cancel: "🔁 Cancelar/Reagendar",
      my_appointments: "👤 Meus agendamentos",
      human: "🧑‍💼 Falar com humano",
      info: "ℹ️ Info (Localização)",
      policy: "🧾 Políticas"
    },
    prompt_selection: "Responda com o número.",
    service_selection: "Qual serviço?\n{list}\n\nDigite o número ou nome.",
    service_chosen: "Você escolheu {service}. 🗓 Horários sugeridos:\n{slots}\n\nResponda com o número (1-3) ou digite outra data (ex: 'amanhã às 10').",
    date_prompt: "Por favor escolha um número (1-3) ou digite 'amanhã às 10'.",
    confirm_prompt: "Reservando: {service}\n📅 {date}\n\nResponda 'SIM' para confirmar.",
    confirmed: "✅ Confirmado!\n{service}\n{date}{payment}",
    cancelled: "Cancelado. Digite 'menu' para reiniciar.",
    no_appointments: "Sem agendamentos pendentes.",
    active_appointments: "Seus agendamentos:\n{list}",
    prices_list: "Nossos preços:\n{list}",
    handoff: "Um humano responderá em breve. Deixe sua mensagem abaixo 👇",
    info: "📍 {name}\nHorários: Seg-Sex 9-18h.\nEndereço: Av. Principal 123.",
    policy_text: "Sinal de 50% necessário. Cancelamento com 24h.",
    error: "Desculpe, não entendi. Digite 'menu' para opções.",
    payment_link: "\n\n💳 Pague o sinal aqui: {link}"
  }
};
