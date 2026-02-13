import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date = new Date()) {
  const day = date.getDay() || 7;
  const d = new Date(date);
  d.setDate(date.getDate() - (day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function detectIntent(question: string) {
  const q = question.toLowerCase();
  if (q.includes("libre") || q.includes("vacaciones") || q.includes("comer") || q.includes("familiar") || q.includes("mujer")) return "availability_planning";
  if (q.includes("ganamos") || q.includes("factur") || q.includes("ingreso")) return "revenue_today";
  if (q.includes("pacientes") && q.includes("semana")) return "patients_week";
  if (q.includes("tratamiento") || q.includes("cirugia") || q.includes("consult")) return "services_month";
  return "summary";
}

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tenant: string }> }
) {
  const { tenant: slug } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug } });
  if (!tenant) return NextResponse.json({ message: "Tenant not found" }, { status: 404 });

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  const hasAccess =
    role === "SUPER_ADMIN" ||
    (await prisma.tenantUser.findFirst({ where: { tenantId: tenant.id, userId } }));

  if (!hasAccess) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const question = String(body?.question || "");
  const intent = detectIntent(question);

  const sinceDay = startOfDay();
  const sinceWeek = startOfWeek();
  const sinceMonth = startOfMonth();
  const next3DaysEnd = endOfDay(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  const next14DaysEnd = endOfDay(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));

  const [revenueTodayRows, patientsWeek, servicesMonthRows, upcoming3DaysRows, upcoming14DaysRows] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        tenantId: tenant.id,
        createdAt: { gte: sinceDay },
        paymentStatus: { in: ["PAID", "approved", "AUTHORIZED"] },
      },
      select: { price: true },
    }),
    prisma.appointment.count({
      where: {
        tenantId: tenant.id,
        startAt: { gte: sinceWeek },
        status: { in: ["CONFIRMED", "DONE", "PENDING"] },
      },
    }),
    prisma.appointment.findMany({
      where: { tenantId: tenant.id, startAt: { gte: sinceMonth } },
      select: { service: { select: { name: true } } },
    }),
    prisma.appointment.findMany({
      where: {
        tenantId: tenant.id,
        startAt: { gte: sinceDay, lte: next3DaysEnd },
        status: { in: ["CONFIRMED", "DONE", "PENDING"] },
      },
      orderBy: { startAt: "asc" },
      select: {
        startAt: true,
        endAt: true,
        contact: { select: { name: true } },
        service: { select: { name: true } },
      },
    }),
    prisma.appointment.findMany({
      where: {
        tenantId: tenant.id,
        startAt: { gte: sinceDay, lte: next14DaysEnd },
        status: { in: ["CONFIRMED", "DONE", "PENDING"] },
      },
      orderBy: { startAt: "asc" },
      select: { startAt: true, endAt: true },
    }),
  ]);

  const revenueToday = revenueTodayRows.reduce((acc, row) => acc + (row.price || 0), 0);

  const groupedServices = servicesMonthRows.reduce<Record<string, number>>((acc, row) => {
    const name = row.service?.name || "Sin servicio";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const topServices = Object.entries(groupedServices)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, total]) => ({ name, total }));

  const dayLoadMap = new Map<string, number>();
  for (const row of upcoming14DaysRows) {
    const key = row.startAt.toISOString().slice(0, 10);
    dayLoadMap.set(key, (dayLoadMap.get(key) || 0) + 1);
  }

  let bestDay: { date: string; count: number } | null = null;
  for (let i = 0; i < 14; i += 1) {
    const d = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    const count = dayLoadMap.get(key) || 0;
    if (!bestDay || count < bestDay.count) {
      bestDay = { date: key, count };
    }
  }

  const upcoming3Summary = upcoming3DaysRows
    .slice(0, 6)
    .map((row) => {
      const when = row.startAt.toLocaleString();
      const who = row.contact?.name || "Paciente";
      const service = row.service?.name || "Servicio";
      return `${when} · ${who} (${service})`;
    })
    .join(" | ");

  const availabilityAnswer = bestDay
    ? `Para organizarte: el día más liviano en próximos 14 días es ${bestDay.date} (${bestDay.count} turnos). Próximos 3 días tenés ${upcoming3DaysRows.length} compromisos${upcoming3Summary ? `. Agenda cercana: ${upcoming3Summary}.` : "."} Si querés mini-vacaciones, te conviene bloquear ventanas ese día y reprogramar desde calendario.`
    : "No encontré agenda para próximos días. Podés tomarte el día libre y abrir slots luego.";

  const responseByIntent: Record<string, string> = {
    availability_planning: availabilityAnswer,
    revenue_today: `Facturación de hoy: ${revenueToday} ${tenant.currency}.`,
    patients_week: `Pacientes/turnos esta semana: ${patientsWeek}.`,
    services_month: `Top tratamientos del mes: ${topServices.map((s) => `${s.name} (${s.total})`).join(", ") || "sin datos"}.`,
    summary: `Resumen rápido — Hoy facturado: ${revenueToday} ${tenant.currency}, Semana: ${patientsWeek} turnos, Top servicios: ${topServices.map((s) => `${s.name} (${s.total})`).join(", ") || "sin datos"}.`,
  };

  return NextResponse.json({
    answer: responseByIntent[intent],
    intent,
    metrics: {
      revenueToday,
      patientsWeek,
      topServices,
      planning: {
        bestDay,
        upcoming3DaysCount: upcoming3DaysRows.length,
      },
    },
  });
}
