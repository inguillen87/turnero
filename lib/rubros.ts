export const RUBROS = [
  {
    slug: "dentista",
    name: "Odontología",
    menu: { booking: "Reservar Turno", prices: "Precios", cancel: "Cancelar", my_appointments: "Mis Turnos", human: "Hablar con Recepción", info: "Info Clínica", policy: "Políticas" },
    politicas: "Cancelaciones con 24hs de anticipación.",
    datos_reserva: ["Nombre", "DNI", "Obra Social"],
    services_default: [
      { nombre: "Consulta General", duracion_min: 30, precio: 15000 },
      { nombre: "Limpieza Dental", duracion_min: 45, precio: 25000 },
      { nombre: "Blanqueamiento", duracion_min: 60, precio: 80000 }
    ]
  },
  {
    slug: "gimnasio",
    name: "Gimnasio & Fitness",
    menu: { booking: "Reservar Clase", prices: "Planes", cancel: "Cancelar", my_appointments: "Mis Clases", human: "Hablar con Staff", info: "Info Gym", policy: "Reglamento" },
    politicas: "Uso obligatorio de toalla.",
    datos_reserva: ["Nombre", "DNI", "Apto Físico"],
    services_default: [
      { nombre: "Pase Diario", duracion_min: 1440, precio: 5000 },
      { nombre: "Clase Crossfit", duracion_min: 60, precio: 3000 },
      { nombre: "Clase Yoga", duracion_min: 60, precio: 3000 }
    ]
  },
  {
    slug: "hotel",
    name: "Hotelería",
    menu: { booking: "Reservar Habitación", prices: "Tarifas", cancel: "Cancelar", my_appointments: "Mi Estadía", human: "Recepción", info: "Info Hotel", policy: "Check-in/out" },
    politicas: "Check-in 14hs / Check-out 10hs.",
    datos_reserva: ["Nombre", "DNI", "Tarjeta Crédito"],
    services_default: [
      { nombre: "Habitación Doble", duracion_min: 1440, precio: 45000 },
      { nombre: "Suite Ejecutiva", duracion_min: 1440, precio: 85000 }
    ]
  }
];
