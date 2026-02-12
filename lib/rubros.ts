export const RUBROS = [
  {
    "slug": "dentista",
    "nombre": "Odontología",
    "emoji": "🦷",
    "tono": "profesional, claro, contenedor",
    "menu_principal": [
      "📅 Sacar turno",
      "💲 Tratamientos y precios",
      "🦷 Urgencia / dolor",
      "🧾 Obras sociales",
      "📍 Ubicación y horarios",
      "👤 Hablar con recepción"
    ],
    "datos_reserva": ["nombre", "telefono", "motivo", "obra_social", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 6,
      "senia": { "activa": true, "monto": 10000 },
      "no_show": "pierde_senia",
      "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Consulta + diagnóstico", "duracion_min": 30, "precio": 18000 },
      { "nombre": "Limpieza dental", "duracion_min": 45, "precio": 25000 },
      { "nombre": "Urgencia / dolor", "duracion_min": 30, "precio": 30000 },
      { "nombre": "Extracción simple", "duracion_min": 45, "precio": 55000 }
    ],
    "catalog_tipos": ["servicio"],
    "demo_quick_prompts": [
      "Quiero un turno para limpieza esta semana",
      "¿Cuánto sale una consulta?",
      "Necesito urgencia por dolor"
    ]
  },
  {
    "slug": "medico_clinico",
    "nombre": "Consultorio Médico",
    "emoji": "🩺",
    "tono": "serio, humano, preciso",
    "menu_principal": [
      "📅 Pedir turno",
      "🧾 Obras sociales y valores",
      "🧪 Estudios / preparación",
      "🚑 Urgencias (derivación)",
      "📍 Ubicación y horarios",
      "👤 Hablar con secretaría"
    ],
    "datos_reserva": ["nombre", "telefono", "motivo", "obra_social", "primera_vez", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 4,
      "senia": { "activa": false },
      "no_show": "reagendar_sujeto",
      "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Consulta clínica", "duracion_min": 20, "precio": 20000 },
      { "nombre": "Control / seguimiento", "duracion_min": 15, "precio": 16000 },
      { "nombre": "Apto físico (básico)", "duracion_min": 20, "precio": 22000 }
    ],
    "catalog_tipos": ["servicio"],
    "demo_quick_prompts": ["Necesito turno para consulta", "¿Atiende por obra social?", "¿Qué necesito para un apto físico?"]
  },
  {
    "slug": "psicologia",
    "nombre": "Psicología",
    "emoji": "🧠",
    "tono": "empático, privado, cuidadoso",
    "menu_principal": [
      "📅 Agendar sesión",
      "💲 Honorarios",
      "🕒 Modalidad (presencial / online)",
      "🔁 Reprogramar / cancelar",
      "📍 Ubicación",
      "👤 Contacto directo"
    ],
    "datos_reserva": ["nombre", "telefono", "modalidad", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 12,
      "senia": { "activa": true, "monto": 15000 },
      "no_show": "se_cobra_sesion",
      "buffer_min": 10
    },
    "services_default": [
      { "nombre": "Sesión individual", "duracion_min": 50, "precio": 25000 },
      { "nombre": "Sesión online", "duracion_min": 50, "precio": 24000 },
      { "nombre": "Terapia de pareja", "duracion_min": 60, "precio": 32000 }
    ],
    "catalog_tipos": ["servicio", "plan"],
    "demo_quick_prompts": ["Quiero una primera sesión online", "¿Cuánto sale?", "Necesito cambiar mi turno"]
  },
  {
    "slug": "kinesiologia",
    "nombre": "Kinesiología / Rehabilitación",
    "emoji": "🏥",
    "tono": "técnico-amigable, práctico",
    "menu_principal": [
      "📅 Reservar turno",
      "🏥 Tratamientos",
      "💲 Precios",
      "📄 Orden médica / cobertura",
      "📍 Cómo llegar",
      "👤 Hablar con recepción"
    ],
    "datos_reserva": ["nombre", "telefono", "zona_a_tratar", "orden_medica", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 6,
      "senia": { "activa": false },
      "no_show": "reagendar",
      "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Evaluación inicial", "duracion_min": 40, "precio": 22000 },
      { "nombre": "Sesión de kinesiología", "duracion_min": 45, "precio": 20000 },
      { "nombre": "Rehabilitación deportiva", "duracion_min": 60, "precio": 28000 }
    ],
    "catalog_tipos": ["servicio", "plan"],
    "demo_quick_prompts": ["Me duele la rodilla, quiero evaluación", "¿Trabajan con orden médica?", "¿Cuánto sale una sesión?"]
  },
  {
    "slug": "nutricion",
    "nombre": "Nutrición",
    "emoji": "🥗",
    "tono": "cálido, motivador, ordenado",
    "menu_principal": ["📅 Sacar turno", "💲 Consultas y planes", "🧾 Obra social", "📍 Ubicación", "🔁 Reprogramar", "👤 Contacto"],
    "datos_reserva": ["nombre", "telefono", "objetivo", "modalidad", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 8,
      "senia": { "activa": true, "monto": 12000 },
      "no_show": "pierde_senia",
      "buffer_min": 10
    },
    "services_default": [
      { "nombre": "Consulta inicial", "duracion_min": 50, "precio": 26000 },
      { "nombre": "Control", "duracion_min": 30, "precio": 18000 },
      { "nombre": "Plan mensual (seguimiento)", "duracion_min": 0, "precio": 65000 }
    ],
    "catalog_tipos": ["servicio", "plan"],
    "demo_quick_prompts": ["Quiero bajar de peso, ¿tenés turnos?", "¿Cuánto sale la consulta?", "¿Hacés online?"]
  },
  {
    "slug": "dermatologia_estetica_medica",
    "nombre": "Dermatología / Estética Médica",
    "emoji": "✨",
    "tono": "premium, claro, responsable",
    "menu_principal": ["📅 Agendar consulta", "💲 Tratamientos y valores", "📌 Preparación", "🧾 Coberturas", "📍 Ubicación", "👤 Hablar con recepción"],
    "datos_reserva": ["nombre", "telefono", "motivo", "primera_vez", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 12,
      "senia": { "activa": true, "monto": 20000 },
      "no_show": "pierde_senia",
      "buffer_min": 10
    },
    "services_default": [
      { "nombre": "Consulta dermatológica", "duracion_min": 30, "precio": 35000 },
      { "nombre": "Peeling (desde)", "duracion_min": 45, "precio": 90000 },
      { "nombre": "Limpieza profunda", "duracion_min": 60, "precio": 60000 }
    ],
    "catalog_tipos": ["servicio"],
    "demo_quick_prompts": ["Quiero consulta por acné", "¿Cuánto sale un peeling?", "Necesito reprogramar"]
  },
  {
    "slug": "veterinaria",
    "nombre": "Veterinaria",
    "emoji": "🐾",
    "tono": "amable, directo, resolutivo",
    "menu_principal": ["🐶 Sacar turno", "💉 Vacunas", "🚑 Urgencias", "💲 Precios", "📍 Horarios", "👤 Hablar con el vet"],
    "datos_reserva": ["nombre", "telefono", "mascota_tipo", "mascota_edad", "motivo", "urgencia", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 3,
      "senia": { "activa": false },
      "no_show": "reagendar",
      "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Consulta general", "duracion_min": 25, "precio": 15000 },
      { "nombre": "Vacuna (aplicación)", "duracion_min": 15, "precio": 12000 },
      { "nombre": "Desparasitación", "duracion_min": 15, "precio": 10000 },
      { "nombre": "Urgencia", "duracion_min": 30, "precio": 25000 }
    ],
    "catalog_tipos": ["servicio", "producto"],
    "demo_quick_prompts": ["Necesito turno para vacuna", "Mi perro está vomitando, ¿urgencia?", "¿Cuánto sale la consulta?"]
  },
  {
    "slug": "barberia",
    "nombre": "Barbería",
    "emoji": "💈",
    "tono": "rápido, canchero, claro",
    "menu_principal": ["✂️ Reservar", "💲 Servicios y precios", "🧔 Elegir barbero", "🔥 Promos", "📍 Ubicación", "🔁 Cambiar turno"],
    "datos_reserva": ["nombre", "telefono", "servicio", "barbero_preferido", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 2,
      "senia": { "activa": false },
      "no_show": "reagendar",
      "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Corte", "duracion_min": 30, "precio": 10000 },
      { "nombre": "Barba", "duracion_min": 20, "precio": 8000 },
      { "nombre": "Corte + barba", "duracion_min": 45, "precio": 16000 }
    ],
    "catalog_tipos": ["servicio"],
    "demo_quick_prompts": ["Quiero corte + barba mañana", "¿Cuánto sale el corte?", "¿Puedo elegir barbero?"]
  },
  {
    "slug": "peluqueria",
    "nombre": "Peluquería",
    "emoji": "💇‍♀️",
    "tono": "amable, comercial",
    "menu_principal": ["📅 Reservar", "💲 Servicios", "🎨 Color y tratamientos", "🔥 Promos", "📍 Ubicación", "🔁 Reprogramar"],
    "datos_reserva": ["nombre", "telefono", "servicio", "largo_pelo", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 3,
      "senia": { "activa": true, "monto": 8000 },
      "no_show": "pierde_senia",
      "buffer_min": 10
    },
    "services_default": [
      { "nombre": "Corte mujer", "duracion_min": 45, "precio": 14000 },
      { "nombre": "Brushing", "duracion_min": 40, "precio": 12000 },
      { "nombre": "Color (desde)", "duracion_min": 90, "precio": 60000 }
    ],
    "catalog_tipos": ["servicio", "producto"],
    "demo_quick_prompts": ["Quiero turno para corte", "¿Cuánto sale el color?", "Necesito reprogramar"]
  },
  {
    "slug": "unias_estetica",
    "nombre": "Uñas / Estética",
    "emoji": "💅",
    "tono": "detallista, ordenado",
    "menu_principal": ["💅 Reservar", "💲 Precios", "🎁 Promos", "🕒 Duraciones", "📍 Ubicación", "🔁 Cambiar turno"],
    "datos_reserva": ["nombre", "telefono", "servicio", "primera_vez", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 4,
      "senia": { "activa": true, "monto": 8000 },
      "no_show": "pierde_senia", "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Semipermanente", "duracion_min": 60, "precio": 18000 },
      { "nombre": "Kapping", "duracion_min": 75, "precio": 24000 },
      { "nombre": "Soft gel", "duracion_min": 90, "precio": 30000 },
      { "nombre": "Pedicuría", "duracion_min": 60, "precio": 22000 }
    ],
    "catalog_tipos": ["servicio"],
    "demo_quick_prompts": ["Quiero semi el sábado", "¿Cuánto sale pedicuría?", "¿Tenés promos?"]
  },
  {
    "slug": "depilacion",
    "nombre": "Depilación",
    "emoji": "🧴",
    "tono": "claro, cuidadoso",
    "menu_principal": ["📅 Turnos", "💲 Zonas y precios", "🧾 Preparación", "🔁 Reprogramar", "📍 Ubicación", "👤 Contacto"],
    "datos_reserva": ["nombre", "telefono", "zona", "tipo", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 4,
      "senia": { "activa": true, "monto": 7000 },
      "no_show": "pierde_senia",
      "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Axilas", "duracion_min": 15, "precio": 8000 },
      { "nombre": "Piernas completas", "duracion_min": 45, "precio": 22000 },
      { "nombre": "Cavado", "duracion_min": 20, "precio": 14000 }
    ],
    "catalog_tipos": ["servicio"],
    "demo_quick_prompts": ["Quiero turno para piernas completas", "¿Cuánto sale cavado?", "¿Cómo me preparo?"]
  },
  {
    "slug": "spa_masajes",
    "nombre": "Spa / Masajes",
    "emoji": "💆",
    "tono": "calmo, premium",
    "menu_principal": ["🧖 Reservar", "💆 Tipos de masaje", "💲 Precios", "🎁 Gift cards", "📍 Ubicación", "🔁 Reprogramar"],
    "datos_reserva": ["nombre", "telefono", "servicio", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 8,
      "senia": { "activa": true, "monto": 15000 },
      "no_show": "se_cobra_sesion",
      "buffer_min": 10
    },
    "services_default": [
      { "nombre": "Relax 60'", "duracion_min": 60, "precio": 35000 },
      { "nombre": "Descontracturante 60'", "duracion_min": 60, "precio": 38000 },
      { "nombre": "Limpieza facial", "duracion_min": 60, "precio": 32000 },
      { "nombre": "Combo masaje + facial", "duracion_min": 120, "precio": 65000 }
    ],
    "catalog_tipos": ["servicio", "plan"],
    "demo_quick_prompts": ["Quiero un descontracturante", "¿Tienen gift card?", "¿Cuánto sale el combo?"]
  },
  {
    "slug": "tatuajes",
    "nombre": "Tatuajes / Piercing",
    "emoji": "🖋️",
    "tono": "canchero, directo, con reglas",
    "menu_principal": ["📅 Turnos", "💲 Precios estimados", "📌 Cuidados", "🖼️ Enviar idea", "📍 Ubicación", "👤 Hablar con artista"],
    "datos_reserva": ["nombre", "telefono", "tipo", "zona_cuerpo", "tamano_aprox", "referencia_imagen", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 24,
      "senia": { "activa": true, "monto": 25000 },
      "no_show": "pierde_senia",
      "buffer_min": 15
    },
    "services_default": [
      { "nombre": "Piercing (desde)", "duracion_min": 20, "precio": 25000 },
      { "nombre": "Tattoo chico (desde)", "duracion_min": 60, "precio": 90000 },
      { "nombre": "Seña de reserva", "duracion_min": 0, "precio": 25000 }
    ],
    "catalog_tipos": ["servicio"],
    "demo_quick_prompts": ["Quiero un tattoo chico", "¿Cuánta seña pedís?", "Te mando referencia del diseño"]
  },
  {
    "slug": "gimnasio",
    "nombre": "Gimnasio",
    "emoji": "🏋️",
    "tono": "motivador, claro",
    "menu_principal": ["🏋️ Planes", "📅 Reservar clase", "🕒 Horarios", "💲 Precios", "🥗 Asesoría", "📍 Ubicación"],
    "datos_reserva": ["nombre", "telefono", "clase_o_plan", "nivel", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 2,
      "senia": { "activa": false },
      "no_show": "pierde_cupo",
      "buffer_min": 0
    },
    "services_default": [
      { "nombre": "Pase por día", "duracion_min": 60, "precio": 6000 },
      { "nombre": "Mensual", "duracion_min": 0, "precio": 25000 },
      { "nombre": "Personal trainer (1)", "duracion_min": 60, "precio": 12000 },
      { "nombre": "Clase funcional (suelta)", "duracion_min": 60, "precio": 5000 }
    ],
    "catalog_tipos": ["plan", "clase", "servicio"],
    "demo_quick_prompts": ["Quiero probar una clase hoy", "¿Cuánto sale la mensualidad?", "Reservame cupo para funcional"]
  },
  {
    "slug": "pilates_yoga",
    "nombre": "Pilates / Yoga",
    "emoji": "🧘",
    "tono": "tranquilo, guía",
    "menu_principal": ["🧘 Reservar clase", "🗓️ Horarios y cupos", "💲 Planes", "📌 Nivel", "🎟️ Clase de prueba", "📍 Ubicación"],
    "datos_reserva": ["nombre", "telefono", "clase", "nivel", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 3,
      "senia": { "activa": false },
      "no_show": "descuenta_clase",
      "buffer_min": 0
    },
    "services_default": [
      { "nombre": "Clase suelta", "duracion_min": 60, "precio": 7000 },
      { "nombre": "Mensual 8 clases", "duracion_min": 0, "precio": 38000 },
      { "nombre": "Mensual libre", "duracion_min": 0, "precio": 52000 },
      { "nombre": "Clase de prueba", "duracion_min": 60, "precio": 0 }
    ],
    "catalog_tipos": ["plan", "clase"],
    "demo_quick_prompts": ["Quiero clase de prueba", "¿Qué planes tienen?", "Reservame martes 19hs"]
  },
  {
    "slug": "personal_trainer",
    "nombre": "Personal Trainer",
    "emoji": "🏃",
    "tono": "motivador, personal",
    "menu_principal": ["📅 Agendar sesión", "💲 Packs", "📌 Objetivos", "🕒 Disponibilidad", "📍 Lugar", "👤 Contacto"],
    "datos_reserva": ["nombre", "telefono", "objetivo", "lugar", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 8,
      "senia": { "activa": true, "monto": 10000 },
      "no_show": "se_cobra_sesion",
      "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Sesión 1:1", "duracion_min": 60, "precio": 15000 },
      { "nombre": "Pack 8 sesiones", "duracion_min": 0, "precio": 100000 },
      { "nombre": "Evaluación inicial", "duracion_min": 60, "precio": 18000 }
    ],
    "catalog_tipos": ["servicio", "plan"],
    "demo_quick_prompts": ["Quiero arrancar para bajar grasa", "¿Tenés pack mensual?", "Agendame una evaluación"]
  },
  {
    "slug": "academia_idiomas",
    "nombre": "Academia / Clases (Idiomas, Música, etc.)",
    "emoji": "🎓",
    "tono": "ordenado, educativo",
    "menu_principal": ["📅 Reservar clase", "🗓️ Horarios", "💲 Planes", "📌 Nivel", "🧾 Inscripción", "📍 Ubicación / online"],
    "datos_reserva": ["nombre", "telefono", "curso", "nivel", "modalidad", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 6,
      "senia": { "activa": false },
      "no_show": "descuenta_clase",
      "buffer_min": 0
    },
    "services_default": [
      { "nombre": "Clase individual", "duracion_min": 60, "precio": 12000 },
      { "nombre": "Pack 4 clases", "duracion_min": 0, "precio": 42000 },
      { "nombre": "Nivelación", "duracion_min": 30, "precio": 0 }
    ],
    "catalog_tipos": ["plan", "clase"],
    "demo_quick_prompts": ["Quiero clases de inglés", "¿Cuánto sale el pack?", "Necesito nivelación"]
  },
  {
    "slug": "taller_mecanico",
    "nombre": "Taller Mecánico",
    "emoji": "🔧",
    "tono": "técnico, confiable",
    "menu_principal": ["🔧 Pedir turno", "🚗 Servicios", "💲 Presupuesto estimado", "🕒 Tiempos", "📍 Ubicación", "👤 Hablar con el taller"],
    "datos_reserva": ["nombre", "telefono", "vehiculo", "problema", "check_engine", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 4,
      "senia": { "activa": false },
      "no_show": "reagendar",
      "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Diagnóstico (escaneo básico)", "duracion_min": 40, "precio": 20000 },
      { "nombre": "Cambio de aceite (MO)", "duracion_min": 45, "precio": 18000 },
      { "nombre": "Alineación + balanceo", "duracion_min": 60, "precio": 35000 },
      { "nombre": "Service frenos (desde)", "duracion_min": 120, "precio": 60000 }
    ],
    "catalog_tipos": ["servicio", "producto"],
    "demo_quick_prompts": ["Tengo la luz de check prendida", "¿Cuánto sale alineación?", "¿Cuándo lo pueden ver?"]
  },
  {
    "slug": "service_celulares",
    "nombre": "Service de Celulares / Tecnología",
    "emoji": "📱",
    "tono": "rápido, con disclaimer",
    "menu_principal": ["📱 Pedir turno", "💥 Reparaciones", "💲 Precios", "⏱️ Tiempos", "✅ Garantía", "📍 Ubicación"],
    "datos_reserva": ["nombre", "telefono", "modelo", "falla", "golpe_agua", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 2,
      "senia": { "activa": false },
      "no_show": "reagendar",
      "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Diagnóstico", "duracion_min": 20, "precio": 8000 },
      { "nombre": "Cambio pantalla (desde)", "duracion_min": 90, "precio": 90000 },
      { "nombre": "Cambio batería (desde)", "duracion_min": 60, "precio": 45000 },
      { "nombre": "Pin de carga (desde)", "duracion_min": 60, "precio": 55000 }
    ],
    "catalog_tipos": ["servicio", "producto"],
    "demo_quick_prompts": ["Se me rompió la pantalla", "¿Cuánto tarda la batería?", "Quiero turno para diagnóstico"]
  },
  {
    "slug": "instalador_hvac",
    "nombre": "Instalación / Service Aire-Caldera",
    "emoji": "🧰",
    "tono": "práctico, técnico",
    "menu_principal": ["📅 Turno", "🧰 Servicios", "💲 Presupuesto", "📌 Zona de cobertura", "📍 Visita a domicilio", "👤 Contacto"],
    "datos_reserva": ["nombre", "telefono", "servicio", "direccion", "zona", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 6,
      "senia": { "activa": false },
      "no_show": "reagendar",
      "buffer_min": 10
    },
    "services_default": [
      { "nombre": "Visita técnica (diagnóstico)", "duracion_min": 60, "precio": 25000 },
      { "nombre": "Instalación aire (desde)", "duracion_min": 180, "precio": 120000 },
      { "nombre": "Service / limpieza", "duracion_min": 90, "precio": 65000 }
    ],
    "catalog_tipos": ["servicio"],
    "demo_quick_prompts": ["Necesito service de aire", "¿Cuánto sale la visita técnica?", "¿Trabajan a domicilio?"]
  },
  {
    "slug": "gestoria_tramites",
    "nombre": "Gestoría / Trámites",
    "emoji": "📄",
    "tono": "ordenado, checklist",
    "menu_principal": ["📅 Agendar", "📄 Servicios", "💲 Costos (desde)", "📌 Requisitos", "🕒 Tiempos", "👤 Contacto"],
    "datos_reserva": ["nombre", "telefono", "tramite", "documentacion", "modalidad", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 6,
      "senia": { "activa": false },
      "no_show": "reagendar",
      "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Consulta inicial", "duracion_min": 30, "precio": 20000 },
      { "nombre": "Gestión completa (desde)", "duracion_min": 0, "precio": 90000 }
    ],
    "catalog_tipos": ["servicio"],
    "demo_quick_prompts": ["Necesito hacer un trámite", "¿Qué papeles necesito?", "Quiero agendar una consulta"]
  },
  {
    "slug": "inmobiliaria",
    "nombre": "Inmobiliaria (Visitas)",
    "emoji": "🏠",
    "tono": "comercial, claro",
    "menu_principal": ["🏠 Agendar visita", "💲 Consultar propiedades", "📍 Zonas", "🧾 Requisitos", "🔁 Reprogramar", "👤 Asesor"],
    "datos_reserva": ["nombre", "telefono", "propiedad_interes", "zona", "modalidad_visita", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 4,
      "senia": { "activa": false },
      "no_show": "reagendar",
      "buffer_min": 10
    },
    "services_default": [
      { "nombre": "Visita guiada", "duracion_min": 30, "precio": 0 },
      { "nombre": "Asesoría alquiler/compra", "duracion_min": 30, "precio": 0 }
    ],
    "catalog_tipos": ["producto", "plan"],
    "demo_quick_prompts": ["Quiero agendar visita", "Busco 2 dormitorios", "¿Qué requisitos piden?"]
  },
  {
    "slug": "abogado",
    "nombre": "Estudio Jurídico",
    "emoji": "⚖️",
    "tono": "formal, sin prometer resultados",
    "menu_principal": ["⚖️ Agendar consulta", "📄 Áreas", "💲 Honorarios (desde)", "🧾 Documentación", "🔁 Reprogramar", "👤 Contacto"],
    "datos_reserva": ["nombre", "telefono", "tema", "modalidad", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 8,
      "senia": { "activa": true, "monto": 15000 },
      "no_show": "se_cobra_consulta",
      "buffer_min": 10
    },
    "services_default": [
      { "nombre": "Consulta inicial", "duracion_min": 40, "precio": 25000 },
      { "nombre": "Asesoría laboral (desde)", "duracion_min": 60, "precio": 40000 },
      { "nombre": "Familia (desde)", "duracion_min": 60, "precio": 50000 }
    ],
    "catalog_tipos": ["servicio"],
    "demo_quick_prompts": ["Necesito una consulta laboral", "¿Qué documentación llevo?", "¿Hacen online?"]
  },
  {
    "slug": "contabilidad",
    "nombre": "Estudio Contable",
    "emoji": "📊",
    "tono": "práctico, checklist",
    "menu_principal": ["📅 Agendar", "🧾 Servicios", "💲 Planes mensuales", "📄 Documentación", "🔁 Reprogramar", "👤 Contacto"],
    "datos_reserva": ["nombre", "telefono", "tipo_cliente", "motivo", "preferencia_dia", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 6,
      "senia": { "activa": false },
      "no_show": "reagendar",
      "buffer_min": 5
    },
    "services_default": [
      { "nombre": "Consulta contable", "duracion_min": 45, "precio": 25000 },
      { "nombre": "Alta/recategorización monotributo", "duracion_min": 30, "precio": 30000 },
      { "nombre": "Plan PyME mensual (desde)", "duracion_min": 0, "precio": 90000 }
    ],
    "catalog_tipos": ["servicio", "plan"],
    "demo_quick_prompts": ["Quiero reunión por monotributo", "¿Qué planes mensuales tienen?", "¿Qué papeles necesito?"]
  },
  {
    "slug": "hotel",
    "nombre": "Hotel / Hostería",
    "emoji": "🏨",
    "tono": "hospitalario, claro, confirmatorio",
    "menu_principal": ["🏨 Reservar", "💲 Tarifas", "📅 Disponibilidad", "🕒 Check-in/out", "🍳 Servicios", "📍 Ubicación"],
    "datos_reserva": ["nombre", "telefono", "fecha_ingreso", "fecha_salida", "huespedes", "tipo_habitacion"],
    "politicas": {
      "cancelacion_horas": 24,
      "senia": { "activa": true, "monto": 30000 },
      "no_show": "pierde_senia",
      "buffer_min": 0
    },
    "services_default": [
      { "nombre": "Habitación standard (noche)", "duracion_min": 0, "precio": 75000 },
      { "nombre": "Habitación superior (noche)", "duracion_min": 0, "precio": 98000 },
      { "nombre": "Desayuno (por persona)", "duracion_min": 0, "precio": 9000 }
    ],
    "catalog_tipos": ["habitacion", "servicio", "plan"],
    "demo_quick_prompts": ["¿Tenés disponibilidad este finde?", "¿Cuánto sale por noche?", "Quiero reservar 2 noches"]
  },
  {
    "slug": "cabanas",
    "nombre": "Cabañas / Alojamiento",
    "emoji": "🛖",
    "tono": "amable, turístico",
    "menu_principal": ["🛖 Reservar", "💲 Tarifas", "📅 Disponibilidad", "🐶 Pet friendly", "🔥 Servicios", "📍 Ubicación"],
    "datos_reserva": ["nombre", "telefono", "fecha_ingreso", "fecha_salida", "huespedes", "pet_friendly"],
    "politicas": {
      "cancelacion_horas": 48,
      "senia": { "activa": true, "monto": 30000 },
      "no_show": "pierde_senia",
      "buffer_min": 0
    },
    "services_default": [
      { "nombre": "Cabaña 2 pax (noche)", "duracion_min": 0, "precio": 85000 },
      { "nombre": "Cabaña 4 pax (noche)", "duracion_min": 0, "precio": 120000 }
    ],
    "catalog_tipos": ["habitacion", "plan"],
    "demo_quick_prompts": ["¿Son pet friendly?", "Quiero reservar cabaña 4 pax", "¿Tarifas para semana próxima?"]
  },
  {
    "slug": "tours_excursiones",
    "nombre": "Tours / Excursiones",
    "emoji": "🗺️",
    "tono": "entusiasta, claro",
    "menu_principal": ["🗺️ Reservar tour", "💲 Precios", "🕒 Horarios", "📌 Qué incluye", "👥 Cupos", "📍 Punto de encuentro"],
    "datos_reserva": ["nombre", "telefono", "tour", "fecha", "personas", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 24,
      "senia": { "activa": true, "monto": 15000 },
      "no_show": "pierde_senia",
      "buffer_min": 0
    },
    "services_default": [
      { "nombre": "City tour (por persona)", "duracion_min": 180, "precio": 25000 },
      { "nombre": "Tour bodega (por persona)", "duracion_min": 240, "precio": 42000 }
    ],
    "catalog_tipos": ["tour", "plan", "servicio"],
    "demo_quick_prompts": ["Quiero reservar un tour", "¿Qué incluye?", "¿Cuántos cupos quedan?"]
  },
  {
    "slug": "bodega_visitas",
    "nombre": "Bodega (Visitas / Degustaciones)",
    "emoji": "🍷",
    "tono": "premium, turístico",
    "menu_principal": ["🍷 Reservar visita", "💲 Experiencias", "🕒 Horarios", "🍇 Qué incluye", "🛍️ Tienda", "📍 Cómo llegar"],
    "datos_reserva": ["nombre", "telefono", "experiencia", "fecha", "personas", "preferencia_hora"],
    "politicas": {
      "cancelacion_horas": 24,
      "senia": { "activa": true, "monto": 20000 },
      "no_show": "pierde_senia", "buffer_min": 0
    },
    "services_default": [
      { "nombre": "Visita + degustación básica (pp)", "duracion_min": 90, "precio": 28000 },
      { "nombre": "Experiencia premium (pp)", "duracion_min": 120, "precio": 45000 }
    ],
    "catalog_tipos": ["tour", "plan", "producto"],
    "demo_quick_prompts": ["Quiero visitar la bodega", "¿Cuánto sale la premium?", "¿Qué días hay disponibilidad?"]
  },
  {
    "slug": "canchas_padel_futbol",
    "nombre": "Canchas (Pádel / Fútbol / Tenis)",
    "emoji": "🎾",
    "tono": "rápido, confirmatorio",
    "menu_principal": ["🎾 Reservar cancha", "🕒 Horarios disponibles", "💲 Tarifas", "💳 Señar", "🌧️ Lluvia", "📍 Ubicación"],
    "datos_reserva": ["nombre", "telefono", "deporte", "fecha", "hora", "duracion_min"],
    "politicas": {
      "cancelacion_horas": 6,
      "senia": { "activa": true, "monto": 10000 },
      "no_show": "pierde_senia",
      "buffer_min": 0
    },
    "services_default": [
      { "nombre": "Pádel 60'", "duracion_min": 60, "precio": 18000 },
      { "nombre": "Fútbol 5 60'", "duracion_min": 60, "precio": 25000 },
      { "nombre": "Tenis 60'", "duracion_min": 60, "precio": 20000 }
    ],
    "catalog_tipos": ["turno_slot", "servicio"],
    "demo_quick_prompts": ["¿Hay pádel hoy 21hs?", "Quiero reservar fútbol 5", "¿Cómo se seña?"]
  },
  {
    "slug": "salon_eventos",
    "nombre": "Salón de Eventos",
    "emoji": "🎉",
    "tono": "comercial, formal",
    "menu_principal": ["🎉 Consultar fecha", "💲 Paquetes", "🍽️ Catering", "🎧 Servicios extra", "📍 Ubicación", "👤 Asesor"],
    "datos_reserva": ["nombre", "telefono", "fecha", "cantidad_invitados", "tipo_evento", "horario"],
    "politicas": {
      "cancelacion_horas": 72,
      "senia": { "activa": true, "monto": 80000 },
      "no_show": "pierde_senia",
      "buffer_min": 0
    },
    "services_default": [
      { "nombre": "Alquiler salón (base)", "duracion_min": 0, "precio": 300000 },
      { "nombre": "Paquete con catering (desde)", "duracion_min": 0, "precio": 650000 }
    ],
    "catalog_tipos": ["plan", "servicio"],
    "demo_quick_prompts": ["¿Tenés fecha disponible?", "¿Qué paquetes ofrecen?", "Somos 80 personas"]
  },
  {
    "slug": "restaurante_reservas",
    "nombre": "Restaurante (Reservas)",
    "emoji": "🍽️",
    "tono": "amable, rápido",
    "menu_principal": ["🍽️ Reservar mesa", "🕒 Horarios", "👥 Cantidad", "🎂 Evento", "📍 Ubicación", "📋 Menú"],
    "datos_reserva": ["nombre", "telefono", "fecha", "hora", "personas", "evento"],
    "politicas": {
      "cancelacion_horas": 4,
      "senia": { "activa": false },
      "no_show": "bloquear_reincidentes",
      "buffer_min": 0
    },
    "services_default": [
      { "nombre": "Reserva mesa", "duracion_min": 90, "precio": 0 }
    ],
    "catalog_tipos": ["producto"],
    "demo_quick_prompts": ["Quiero reservar para 4", "¿Tienen mesa hoy 21hs?", "¿Qué menú tienen?"]
  }
];
