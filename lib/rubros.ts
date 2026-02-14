export type RubroTemplate = {
  slug: string;
  name: string;
  menu: {
    booking: string;
    prices: string;
    cancel: string;
    my_appointments: string;
    human: string;
    info: string;
    policy: string;
  };
  politicas: string;
  datos_reserva: string[];
  services_default: { nombre: string; duracion_min: number; precio: number }[];
};

export const RUBROS: RubroTemplate[] = [
  {
    slug: "dentista",
    name: "Odontología",
    menu: { booking: "Reservar Turno", prices: "Precios", cancel: "Cancelar", my_appointments: "Mis Turnos", human: "Hablar con Recepción", info: "Info Clínica", policy: "Políticas" },
    politicas: "Cancelaciones con 24hs de anticipación.",
    datos_reserva: ["Nombre", "DNI", "Obra Social"],
    services_default: [
      { nombre: "Consulta General", duracion_min: 30, precio: 15000 },
      { nombre: "Limpieza Dental", duracion_min: 45, precio: 25000 },
      { nombre: "Blanqueamiento", duracion_min: 60, precio: 80000 },
    ],
  },
  {
    slug: "psicologia",
    name: "Psicología",
    menu: { booking: "Reservar Sesión", prices: "Aranceles", cancel: "Reprogramar/Cancelar", my_appointments: "Mis Sesiones", human: "Hablar con Secretaría", info: "Info Consultorio", policy: "Políticas" },
    politicas: "Cancelaciones con 24hs. Posibilidad de reprogramar 1 vez sin cargo.",
    datos_reserva: ["Nombre", "DNI", "Email", "Motivo de consulta"],
    services_default: [
      { nombre: "Primera Entrevista", duracion_min: 60, precio: 22000 },
      { nombre: "Sesión Individual", duracion_min: 50, precio: 18000 },
      { nombre: "Terapia de Pareja", duracion_min: 60, precio: 28000 },
    ],
  },
  {
    slug: "clinica",
    name: "Clínica General",
    menu: { booking: "Reservar Turno", prices: "Copagos", cancel: "Cancelar", my_appointments: "Mis Turnos", human: "Hablar con Recepción", info: "Especialidades", policy: "Políticas" },
    politicas: "Llegar 10 minutos antes. Traer estudios previos si aplica.",
    datos_reserva: ["Nombre", "DNI", "Cobertura", "Teléfono"],
    services_default: [
      { nombre: "Consulta Clínica", duracion_min: 30, precio: 18000 },
      { nombre: "Control Preventivo", duracion_min: 40, precio: 24000 },
      { nombre: "Teleconsulta", duracion_min: 20, precio: 12000 },
    ],
  },
  {
    slug: "estetica",
    name: "Estética & Belleza",
    menu: { booking: "Reservar Turno", prices: "Ver Planes", cancel: "Cancelar", my_appointments: "Mis Turnos", human: "Hablar con Asesora", info: "Tratamientos", policy: "Políticas" },
    politicas: "Seña obligatoria para bloquear turno. Reprogramación con 12hs.",
    datos_reserva: ["Nombre", "DNI", "Teléfono", "Preferencias"],
    services_default: [
      { nombre: "Limpieza Facial", duracion_min: 60, precio: 30000 },
      { nombre: "Peeling", duracion_min: 45, precio: 35000 },
      { nombre: "Depilación Láser", duracion_min: 30, precio: 28000 },
    ],
  },
  {
    slug: "gimnasio",
    name: "Gimnasio & Fitness",
    menu: { booking: "Reservar Clase", prices: "Planes", cancel: "Cancelar", my_appointments: "Mis Clases", human: "Hablar con Staff", info: "Info Gym", policy: "Reglamento" },
    politicas: "Uso obligatorio de toalla y reserva previa para clases con cupo.",
    datos_reserva: ["Nombre", "DNI", "Apto Físico"],
    services_default: [
      { nombre: "Pase Diario", duracion_min: 1440, precio: 5000 },
      { nombre: "Clase Crossfit", duracion_min: 60, precio: 3000 },
      { nombre: "Clase Yoga", duracion_min: 60, precio: 3000 },
    ],
  },
  {
    slug: "veterinaria",
    name: "Veterinaria",
    menu: { booking: "Reservar Consulta", prices: "Precios", cancel: "Cancelar", my_appointments: "Mis Turnos", human: "Hablar con Recepción", info: "Especialidades", policy: "Políticas" },
    politicas: "Urgencias con prioridad. Traer libreta sanitaria en controles.",
    datos_reserva: ["Nombre Tutor", "Mascota", "Especie", "Edad", "Teléfono"],
    services_default: [
      { nombre: "Consulta Veterinaria", duracion_min: 30, precio: 17000 },
      { nombre: "Vacunación", duracion_min: 20, precio: 12000 },
      { nombre: "Control Post-operatorio", duracion_min: 25, precio: 15000 },
    ],
  },
  {
    slug: "educacion",
    name: "Educación / Academia",
    menu: { booking: "Reservar Clase", prices: "Aranceles", cancel: "Reprogramar", my_appointments: "Mis Clases", human: "Hablar con Administración", info: "Cursos", policy: "Reglamento" },
    politicas: "Inscripciones sujetas a cupo. Reprogramación con 24hs.",
    datos_reserva: ["Nombre", "DNI", "Email", "Curso de interés"],
    services_default: [
      { nombre: "Clase de Prueba", duracion_min: 60, precio: 0 },
      { nombre: "Curso Regular", duracion_min: 90, precio: 18000 },
      { nombre: "Tutoría Individual", duracion_min: 60, precio: 22000 },
    ],
  },
  {
    slug: "legal",
    name: "Estudio Jurídico",
    menu: { booking: "Reservar Consulta", prices: "Honorarios", cancel: "Cancelar", my_appointments: "Mis Reuniones", human: "Hablar con Asistente", info: "Áreas", policy: "Políticas" },
    politicas: "Consulta inicial con seña. Documentación previa recomendada.",
    datos_reserva: ["Nombre", "DNI", "Email", "Tipo de caso"],
    services_default: [
      { nombre: "Consulta Inicial", duracion_min: 45, precio: 30000 },
      { nombre: "Seguimiento de Caso", duracion_min: 30, precio: 22000 },
      { nombre: "Asesoría Express", duracion_min: 20, precio: 15000 },
    ],
  },
  {
    slug: "inmobiliaria",
    name: "Inmobiliaria",
    menu: { booking: "Agendar Visita", prices: "Comisiones", cancel: "Cancelar", my_appointments: "Mis Visitas", human: "Hablar con Asesor", info: "Propiedades", policy: "Políticas" },
    politicas: "Visitas sujetas a disponibilidad y validación de datos de contacto.",
    datos_reserva: ["Nombre", "DNI", "Teléfono", "Propiedad de interés"],
    services_default: [
      { nombre: "Visita a Propiedad", duracion_min: 45, precio: 0 },
      { nombre: "Asesoría de Compra", duracion_min: 60, precio: 25000 },
      { nombre: "Tasación Inicial", duracion_min: 60, precio: 30000 },
    ],
  },
  {
    slug: "hotel",
    name: "Hotelería",
    menu: { booking: "Reservar Habitación", prices: "Tarifas", cancel: "Cancelar", my_appointments: "Mi Estadía", human: "Recepción", info: "Info Hotel", policy: "Check-in/out" },
    politicas: "Check-in 14hs / Check-out 10hs. Tarifa no reembolsable en promos.",
    datos_reserva: ["Nombre", "DNI", "Tarjeta Crédito"],
    services_default: [
      { nombre: "Habitación Doble", duracion_min: 1440, precio: 45000 },
      { nombre: "Suite Ejecutiva", duracion_min: 1440, precio: 85000 },
    ],
  },
  {
    slug: "nutricion",
    name: "Nutrición",
    menu: { booking: "Reservar Consulta", prices: "Planes", cancel: "Reprogramar", my_appointments: "Mis Consultas", human: "Hablar con Asistente", info: "Programas", policy: "Políticas" },
    politicas: "Cancelaciones con 24hs. Incluye seguimiento por objetivos.",
    datos_reserva: ["Nombre", "DNI", "Email", "Objetivo nutricional"],
    services_default: [
      { nombre: "Consulta Inicial", duracion_min: 60, precio: 24000 },
      { nombre: "Control Nutricional", duracion_min: 40, precio: 18000 },
      { nombre: "Plan Deportivo", duracion_min: 50, precio: 28000 },
    ],
  },
  {
    slug: "preparacion_fisica",
    name: "Preparación Física",
    menu: { booking: "Reservar Sesión", prices: "Planes", cancel: "Cancelar", my_appointments: "Mis Sesiones", human: "Hablar con Coach", info: "Programas", policy: "Reglamento" },
    politicas: "Evaluación previa obligatoria. Reprogramación con 12hs.",
    datos_reserva: ["Nombre", "DNI", "Apto físico", "Objetivo deportivo"],
    services_default: [
      { nombre: "Evaluación Inicial", duracion_min: 60, precio: 20000 },
      { nombre: "Sesión Personalizada", duracion_min: 60, precio: 17000 },
      { nombre: "Plan de Alto Rendimiento", duracion_min: 75, precio: 32000 },
    ],
  },
  {
    slug: "escribania",
    name: "Escribanía",
    menu: { booking: "Reservar Reunión", prices: "Honorarios", cancel: "Cancelar", my_appointments: "Mis Reuniones", human: "Hablar con Secretaría", info: "Trámites", policy: "Políticas" },
    politicas: "Traer documentación completa para cada trámite. Turnos con confirmación previa.",
    datos_reserva: ["Nombre", "DNI", "Email", "Tipo de trámite"],
    services_default: [
      { nombre: "Consulta Inicial", duracion_min: 40, precio: 26000 },
      { nombre: "Firma de Escritura", duracion_min: 60, precio: 45000 },
      { nombre: "Certificación de Firma", duracion_min: 20, precio: 15000 },
    ],
  },
  {
    slug: "contable",
    name: "Estudio Contable",
    menu: { booking: "Reservar Asesoría", prices: "Honorarios", cancel: "Reprogramar", my_appointments: "Mis Reuniones", human: "Hablar con Asistente", info: "Servicios", policy: "Políticas" },
    politicas: "Enviar documentación con 24hs para optimizar la consulta.",
    datos_reserva: ["Nombre", "CUIT/CUIL", "Email", "Tipo de consulta"],
    services_default: [
      { nombre: "Asesoría Impositiva", duracion_min: 45, precio: 28000 },
      { nombre: "Planificación Fiscal", duracion_min: 60, precio: 38000 },
      { nombre: "Reunión de Balance", duracion_min: 50, precio: 32000 },
    ],
  },
];

export function getRubroBySlug(slug: string) {
  return RUBROS.find((r) => r.slug === slug);
}
