export type SalesRubroPlaybook = {
  slug: string;
  name: string;
  target: string;
  pains: string[];
  valueProps: string[];
  faq: { q: string; a: string }[];
  discoveryQuestions: string[];
};

export const SALES_RUBROS: SalesRubroPlaybook[] = [
  {
    slug: "clinica",
    name: "Clínicas / Centros médicos",
    target: "Clínicas, consultorios y centros de salud",
    pains: ["ausentismo", "demoras", "agenda desordenada", "seguimiento manual"],
    valueProps: ["agenda inteligente por profesional", "recordatorios automáticos", "cobro de señas", "cola con demoras en tiempo real"],
    discoveryQuestions: ["¿Cuántos profesionales atienden por día?", "¿Cuántos turnos mensuales manejan?", "¿Cobran señas o prepagos?"],
    faq: [
      { q: "¿Sirve para múltiples profesionales?", a: "Sí, maneja agendas separadas por profesional/sede y reasignaciones automáticas." },
      { q: "¿Puede avisar demoras?", a: "Sí, detecta retrasos y notifica por WhatsApp con reprogramación sugerida." },
      { q: "¿Se integra con pagos?", a: "Sí, Mercado Pago para señas, consultas y mensualidades con link automático." },
    ],
  },
  {
    slug: "psicologia",
    name: "Psicología / Salud mental",
    target: "Consultorios psicológicos y equipos terapéuticos",
    pains: ["cancelaciones tardías", "recordatorios manuales", "seguimiento de pacientes"],
    valueProps: ["agenda recurrente", "recordatorio empático", "historial de contacto", "cobro anticipado"],
    discoveryQuestions: ["¿Trabajan sesiones individuales o grupales?", "¿Cobran por sesión o packs mensuales?", "¿Cuánto ausentismo tienen?"],
    faq: [
      { q: "¿Se puede automatizar recordatorios semanales?", a: "Sí, con reglas por paciente y profesional." },
      { q: "¿Soporta pagos previos?", a: "Sí, envía links de pago antes de cada sesión o por abono." },
      { q: "¿Podemos manejar lista de espera?", a: "Sí, con reasignación automática cuando alguien cancela." },
    ],
  },
  {
    slug: "odontologia",
    name: "Odontología",
    target: "Clínicas odontológicas",
    pains: ["huecos en agenda", "pacientes no confirmados", "seguimiento de tratamientos"],
    valueProps: ["confirmación automática", "plantillas por tratamiento", "control de demoras por box"],
    discoveryQuestions: ["¿Cuántos boxes activos tienen?", "¿Qué porcentaje de turnos se cancela?", "¿Cobran seña?"],
    faq: [
      { q: "¿Puede diferenciar limpiezas vs ortodoncia?", a: "Sí, por servicio, duración y profesional." },
      { q: "¿Gestiona urgencias?", a: "Sí, permite cupos de urgencia y cola priorizada." },
      { q: "¿Integra WhatsApp?", a: "Sí, confirmaciones, recordatorios y reprogramación automática." },
    ],
  },
  {
    slug: "estetica",
    name: "Estética / Belleza",
    target: "Centros estéticos y spas",
    pains: ["turnos vacíos", "cancelación última hora", "falta de fidelización"],
    valueProps: ["campañas por WhatsApp", "agenda por cabina", "combos y promos"],
    discoveryQuestions: ["¿Qué tratamientos tienen mayor demanda?", "¿Cobran señas?", "¿Manejan cabinas o box?"],
    faq: [
      { q: "¿Puede vender combos?", a: "Sí, combos, packs y recordatorios de mantenimiento." },
      { q: "¿Se puede cobrar por adelantado?", a: "Sí, con links automáticos." },
      { q: "¿Maneja profesionales rotativos?", a: "Sí, agenda por recurso y disponibilidad." },
    ],
  },
  {
    slug: "gimnasio",
    name: "Gym / Fitness",
    target: "Gimnasios, estudios y boxes",
    pains: ["clases sobrecargadas", "no-shows", "cobros atrasados"],
    valueProps: ["reservas por clase", "cupos", "pagos recurrentes", "alerts en tiempo real"],
    discoveryQuestions: ["¿Cuántas clases por día?", "¿Tienen cupos por clase?", "¿Cobran mensual o por clase?"],
    faq: [
      { q: "¿Controla cupos?", a: "Sí, por clase y sede." },
      { q: "¿Automatiza cobro mensual?", a: "Sí, suscripciones y links automáticos." },
      { q: "¿Manda recordatorio pre-clase?", a: "Sí, por WhatsApp con botón de confirmar." },
    ],
  },
  {
    slug: "veterinaria",
    name: "Veterinaria",
    target: "Clínicas veterinarias",
    pains: ["urgencias sin triage", "recordatorios de vacunas", "sobrecarga telefónica"],
    valueProps: ["triaje inicial por bot", "recordatorio de vacunas", "agenda por profesional"],
    discoveryQuestions: ["¿Atienden urgencias 24/7?", "¿Tienen plan de vacunación?", "¿Cuántos veterinarios trabajan?"],
    faq: [
      { q: "¿Sirve para campañas de vacunación?", a: "Sí, campañas segmentadas por tipo de mascota." },
      { q: "¿Puede filtrar urgencias?", a: "Sí, con reglas de prioridad y derivación." },
      { q: "¿Integra pagos?", a: "Sí, señas y cobro de consultas por link." },
    ],
  },
  {
    slug: "educacion",
    name: "Educación / Academias",
    target: "Institutos, academias y centros de formación",
    pains: ["ausentismo", "consultas repetidas", "inscripciones manuales"],
    valueProps: ["inscripción automática", "FAQ académico", "recordatorios de clase y pago"],
    discoveryQuestions: ["¿Cursos recurrentes o cohortes?", "¿Cobran mensualidad?", "¿Manejan sedes?"],
    faq: [
      { q: "¿Automatiza inscripción?", a: "Sí, con captura de datos y envío al CRM." },
      { q: "¿Maneja grupos?", a: "Sí, por curso, sede y docente." },
      { q: "¿Envía avisos de pago?", a: "Sí, con links de pago y seguimiento." },
    ],
  },
  {
    slug: "legal",
    name: "Legal / Estudios jurídicos",
    target: "Estudios jurídicos y asesores",
    pains: ["coordinación de reuniones", "seguimiento de leads", "tiempos administrativos"],
    valueProps: ["agenda consultiva", "captura de caso inicial", "CRM con ticket y prioridad"],
    discoveryQuestions: ["¿Cuántas consultas iniciales por semana?", "¿Necesitan calificar casos?", "¿Manejan varias áreas legales?"],
    faq: [
      { q: "¿Sirve para filtrar casos?", a: "Sí, con formularios y scoring inicial." },
      { q: "¿Puede priorizar urgencias?", a: "Sí, por tipo de caso y SLA." },
      { q: "¿Integra canales?", a: "Sí, WhatsApp y formulario web en un mismo CRM." },
    ],
  },
  {
    slug: "inmobiliaria",
    name: "Inmobiliaria",
    target: "Inmobiliarias y brokers",
    pains: ["seguimiento lento", "leads fríos", "visitas no coordinadas"],
    valueProps: ["agendado de visitas", "pipeline comercial", "recordatorios y seguimiento"],
    discoveryQuestions: ["¿Cuántos leads ingresan por mes?", "¿Trabajan alquiler y venta?", "¿Necesitan distribuir leads?"],
    faq: [
      { q: "¿Puede asignar leads por agente?", a: "Sí, reparto y SLA por asesor." },
      { q: "¿Automatiza visitas?", a: "Sí, agenda y confirmación automática." },
      { q: "¿Mide conversión?", a: "Sí, por etapa y origen del lead." },
    ],
  },
  {
    slug: "general",
    name: "Servicios Profesionales",
    target: "Pymes de servicios",
    pains: ["falta de orden", "seguimiento manual", "cobranza ineficiente"],
    valueProps: ["agenda+CRM+bot", "captura de leads", "pagos automatizados"],
    discoveryQuestions: ["¿Qué servicio principal ofrecen?", "¿Cuántos clientes atienden al mes?", "¿Cuál es su mayor cuello de botella?"],
    faq: [
      { q: "¿Se adapta a cualquier rubro?", a: "Sí, se personaliza menús, flujos y mensajes por rubro." },
      { q: "¿Cuánto tarda en implementarse?", a: "Onboarding guiado en pocos días para operar en producción." },
      { q: "¿Puedo empezar modular?", a: "Sí, podés iniciar con WhatsApp+CRM y luego escalar." },
    ],
  },
];

export function detectSalesRubro(text: string, fallback = "general") {
  const input = (text || "").toLowerCase();
  const direct = SALES_RUBROS.find((r) => input.includes(r.slug) || input.includes(r.name.toLowerCase()));
  if (direct) return direct;

  const hints: Record<string, string[]> = {
    clinica: ["clínica", "consultorio", "paciente", "medico", "médico"],
    psicologia: ["psicolog", "terapia", "sesión"],
    odontologia: ["odont", "dent", "diente"],
    estetica: ["estética", "estetica", "spa", "belleza"],
    gimnasio: ["gym", "gim", "crossfit", "fitness"],
    veterinaria: ["veterin", "mascota"],
    educacion: ["academia", "curso", "instituto", "alumno"],
    legal: ["abogado", "legal", "estudio jurídico", "juridico"],
    inmobiliaria: ["inmobiliaria", "propiedad", "alquiler", "venta"],
  };

  for (const [slug, words] of Object.entries(hints)) {
    if (words.some((w) => input.includes(w))) {
      return SALES_RUBROS.find((r) => r.slug === slug)!;
    }
  }

  return SALES_RUBROS.find((r) => r.slug === fallback) || SALES_RUBROS[SALES_RUBROS.length - 1];
}

export function buildSalesRubroPrompt(rubro: SalesRubroPlaybook) {
  return `Rubro detectado: ${rubro.name}.
Dolores típicos: ${rubro.pains.join(", ")}.
Propuesta de valor: ${rubro.valueProps.join(", ")}.
Preguntas de discovery sugeridas: ${rubro.discoveryQuestions.join(" | ")}.
FAQ base:
${rubro.faq.map((f) => `- ${f.q}: ${f.a}`).join("\n")}`;
}
