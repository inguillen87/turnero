export const DEMO_TENANTS = [
  {
    "tenant": {
      "slug": "demo-dentista",
      "name": "Demo Odonto Centro",
      "timezone": "America/Argentina/Cordoba",
      "currency": "ARS",
      "plan": "demo"
    },
    "whatsapp_numbers": [{ "toE164": "+14155550001", "label": "DEMO ODONTO" }],
    "rubros": ["dentista"],
    "staff": [{ "name": "Dra. Pérez", "role": "Odontóloga" }, { "name": "Recepción", "role": "Admin" }],
    "staff_hours": [
      { "staffName": "Dra. Pérez", "dow": 1, "start": "09:00", "end": "13:00" },
      { "staffName": "Dra. Pérez", "dow": 3, "start": "14:00", "end": "18:00" },
      { "staffName": "Dra. Pérez", "dow": 5, "start": "09:00", "end": "13:00" }
    ],
    "services": [
      { "rubroSlug": "dentista", "name": "Consulta + diagnóstico", "durationMin": 30, "price": 18000 },
      { "rubroSlug": "dentista", "name": "Limpieza dental", "durationMin": 45, "price": 25000 },
      { "rubroSlug": "dentista", "name": "Urgencia / dolor", "durationMin": 30, "price": 30000 }
    ],
    "catalog_items": [
      { "rubroSlug": "dentista", "tipo": "servicio", "name": "Blanqueamiento", "category": "Estética dental", "price": 120000, "currency": "ARS", "unit": "sesion", "durationMin": 60, "tags": ["estetica"] }
    ]
  },
  {
    "tenant": {
      "slug": "demo-gym",
      "name": "Demo Gym Force",
      "timezone": "America/Argentina/Cordoba",
      "currency": "ARS",
      "plan": "demo"
    },
    "whatsapp_numbers": [{ "toE164": "+14155550002", "label": "DEMO GYM" }],
    "rubros": ["gimnasio", "pilates_yoga"],
    "staff": [{ "name": "Coach Nico", "role": "Trainer" }, { "name": "Profe Pili", "role": "Pilates" }],
    "staff_hours": [
      { "staffName": "Coach Nico", "dow": 1, "start": "18:00", "end": "21:00" },
      { "staffName": "Coach Nico", "dow": 3, "start": "18:00", "end": "21:00" },
      { "staffName": "Profe Pili", "dow": 2, "start": "08:00", "end": "12:00" },
      { "staffName": "Profe Pili", "dow": 4, "start": "08:00", "end": "12:00" }
    ],
    "services": [
      { "rubroSlug": "gimnasio", "name": "Pase por día", "durationMin": 60, "price": 6000 },
      { "rubroSlug": "gimnasio", "name": "Mensual", "durationMin": 0, "price": 25000 },
      { "rubroSlug": "pilates_yoga", "name": "Clase suelta", "durationMin": 60, "price": 7000 }
    ],
    "catalog_items": [
      { "rubroSlug": "gimnasio", "tipo": "plan", "name": "Trimestral", "category": "Planes", "price": 65000, "currency": "ARS", "unit": "plan", "durationMin": 0, "tags": ["promo"] }
    ]
  },
  {
    "tenant": {
      "slug": "demo-hotel",
      "name": "Demo Hotel Andes",
      "timezone": "America/Argentina/Cordoba",
      "currency": "ARS", "plan": "demo"
    },
    "whatsapp_numbers": [{ "toE164": "+14155550003", "label": "DEMO HOTEL" }],
    "rubros": ["hotel"],
    "staff": [{ "name": "Recepción Hotel", "role": "Frontdesk" }],
    "staff_hours": [{ "staffName": "Recepción Hotel", "dow": 1, "start": "09:00", "end": "18:00" }],
    "services": [
      { "rubroSlug": "hotel", "name": "Habitación standard (noche)", "durationMin": 0, "price": 75000 },
      { "rubroSlug": "hotel", "name": "Habitación superior (noche)", "durationMin": 0, "price": 98000 }
    ],
    "catalog_items": [
      { "rubroSlug": "hotel", "tipo": "habitacion", "name": "Standard", "category": "Habitaciones", "price": 75000, "currency": "ARS", "unit": "noche", "durationMin": 0, "tags": ["desayuno_opcional"] },
      { "rubroSlug": "hotel", "tipo": "servicio", "name": "Late check-out", "category": "Servicios", "price": 15000, "currency": "ARS", "unit": "servicio", "durationMin": 0, "tags": [] }
    ]
  },
  {
    "tenant": {
      "slug": "demo-barber",
      "name": "Demo Barber Prime",
      "timezone": "America/Argentina/Cordoba",
      "currency": "ARS",
      "plan": "demo"
    },
    "whatsapp_numbers": [{ "toE164": "+14155550004", "label": "DEMO BARBER" }],
    "rubros": ["barberia"],
    "staff": [{ "name": "Barbero Mati", "role": "Barbero" }, { "name": "Barbera Sol", "role": "Barbera" }],
    "staff_hours": [
      { "staffName": "Barbero Mati", "dow": 2, "start": "16:00", "end": "20:00" },
      { "staffName": "Barbera Sol", "dow": 4, "start": "16:00", "end": "20:00" }
    ],
    "services": [
      { "rubroSlug": "barberia", "name": "Corte", "durationMin": 30, "price": 10000 },
      { "rubroSlug": "barberia", "name": "Barba", "durationMin": 20, "price": 8000 },
      { "rubroSlug": "barberia", "name": "Corte + barba", "durationMin": 45, "price": 16000 }
    ],
    "catalog_items": [
      { "rubroSlug": "barberia", "tipo": "producto", "name": "Pomada (venta)", "category": "Productos", "price": 12000, "currency": "ARS", "unit": "unidad", "durationMin": 0, "tags": ["venta"] }
    ]
  },
  {
    "tenant": {
      "slug": "demo-vet",
      "name": "Demo Vet Patitas",
      "timezone": "America/Argentina/Cordoba",
      "currency": "ARS",
      "plan": "demo"
    },
    "whatsapp_numbers": [{ "toE164": "+14155550005", "label": "DEMO VET" }],
    "rubros": ["veterinaria"],
    "staff": [{ "name": "Dr. García", "role": "Veterinario" }],
    "staff_hours": [{ "staffName": "Dr. García", "dow": 1, "start": "10:00", "end": "14:00" }],
    "services": [
      { "rubroSlug": "veterinaria", "name": "Consulta general", "durationMin": 25, "price": 15000 },
      { "rubroSlug": "veterinaria", "name": "Vacuna (aplicación)", "durationMin": 15, "price": 12000 },
      { "rubroSlug": "veterinaria", "name": "Urgencia", "durationMin": 30, "price": 25000 }
    ],
    "catalog_items": [
      { "rubroSlug": "veterinaria", "tipo": "producto", "name": "Antiparasitario (desde)", "category": "Farmacia", "price": 9000, "currency": "ARS", "unit": "unidad", "durationMin": 0, "tags": ["venta"] }
    ]
  },
  {
    "tenant": {
      "slug": "demo-taller",
      "name": "Demo Taller Motor",
      "timezone": "America/Argentina/Cordoba",
      "currency": "ARS",
      "plan": "demo"
    },
    "whatsapp_numbers": [{ "toE164": "+14155550006", "label": "DEMO TALLER" }],
    "rubros": ["taller_mecanico"],
    "staff": [{ "name": "Mecánico Leo", "role": "Mecánico" }],
    "staff_hours": [
      { "staffName": "Mecánico Leo", "dow": 1, "start": "09:00", "end": "12:00" },
      { "staffName": "Mecánico Leo", "dow": 3, "start": "09:00", "end": "12:00" }
    ],
    "services": [
      { "rubroSlug": "taller_mecanico", "name": "Diagnóstico (escaneo básico)", "durationMin": 40, "price": 20000 },
      { "rubroSlug": "taller_mecanico", "name": "Cambio de aceite (MO)", "durationMin": 45, "price": 18000 }
    ],
    "catalog_items": [
      { "rubroSlug": "taller_mecanico", "tipo": "producto", "name": "Aceite 5W-30 (desde)", "category": "Repuestos", "price": 22000, "currency": "ARS", "unit": "unidad", "durationMin": 0, "tags": ["venta"] }
    ]
  }
];
