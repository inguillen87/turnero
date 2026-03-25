"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import {
  Calendar,
  Users,
  BarChart3,
  Clock,
  ArrowUpRight,
  Zap,
  MoreVertical,
  Activity,
  Bot,
  FileDown,
  Table,
  Wallet,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

type FinanceOverview = {
  summary: {
    paidThisMonth: number;
    pendingThisMonth: number;
    noShowLossThisMonth: number;
    avgTicketPaid: number;
    collectionRate: number;
    upcomingBookedRevenue: number;
  };
  monthly: Array<{
    month: string;
    paid: number;
    pending: number;
    noShowLoss: number;
  }>;
};

type WeeklyPlanResponse = {
  generatedAt: string;
  currency: string;
  kpis: {
    collectionRate: number;
    noShowRate: number;
    pendingThisMonth: number;
  };
  plan: Array<{
    id: string;
    title: string;
    impact: "high" | "medium" | "low";
    effort: "high" | "medium" | "low";
    owner: "recepcion" | "operaciones" | "marketing";
    nextStep: string;
  }>;
};

type WeeklyPlanStateResponse = {
  states: Record<string, boolean>;
  recentEvents: Array<{
    actionId: string;
    completed: boolean;
    actor?: string;
    source: string;
    createdAt: string;
  }>;
};

export default function TenantDashboard() {
  const { tenant } = useParams();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminQuestion, setAdminQuestion] = useState("¿Cuánto ganamos hoy?");
  const [adminAnswer, setAdminAnswer] = useState("Preguntame sobre facturación, pacientes o tratamientos.");
  const [adminLoading, setAdminLoading] = useState(false);
  const [finance, setFinance] = useState<FinanceOverview | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanResponse | null>(null);
  const [doneActions, setDoneActions] = useState<Record<string, boolean>>({});
  const [planEvents, setPlanEvents] = useState<WeeklyPlanStateResponse["recentEvents"]>([]);
  const [operatorName, setOperatorName] = useState("Operador demo");

  const exportAgendaPDF = () => {
    const doc = new jsPDF();
    doc.text("Agenda del día", 14, 10);
    autoTable(doc, {
      head: [["Paciente", "Servicio", "Hora", "Estado"]],
      body: appointments.map((appt) => [
        appt.clientName || "-",
        appt.service?.name || "-",
        appt.startAt ? format(new Date(appt.startAt), "HH:mm") : "-",
        appt.status || "-",
      ]),
      startY: 20,
    });
    doc.save("agenda-dia.pdf");
  };

  const exportAgendaExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      appointments.map((appt) => ({
        Paciente: appt.clientName || "-",
        Servicio: appt.service?.name || "-",
        Hora: appt.startAt ? format(new Date(appt.startAt), "HH:mm") : "-",
        Estado: appt.status || "-",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agenda");
    XLSX.writeFile(wb, "agenda-dia.xlsx");
  };

  // Mock data for demo/fallback purposes
  const mockAppointments = [
    {
      id: "mock-1",
      clientName: "Juan Perez (Demo)",
      service: { name: "Consulta General" },
      startAt: new Date().setHours(9, 0, 0, 0),
      status: "CONFIRMED"
    },
    {
      id: "mock-2",
      clientName: "Maria Garcia (Demo)",
      service: { name: "Limpieza Dental" },
      startAt: new Date().setHours(10, 30, 0, 0),
      status: "PENDING"
    },
    {
      id: "mock-3",
      clientName: "Carlos Lopez (Demo)",
      service: { name: "Ortodoncia" },
      startAt: new Date().setHours(14, 0, 0, 0),
      status: "CONFIRMED"
    }
  ];


  const askAdminBot = async () => {
    setAdminLoading(true);
    try {
      const res = await fetch(`/api/t/${tenant}/admin-bot/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: adminQuestion }),
      });
      const data = await res.json();
      setAdminAnswer(data?.answer || "No pude obtener una respuesta en este momento.");
    } catch {
      setAdminAnswer("Error consultando Admin Bot.");
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    const key = `dashboard:operator:${tenant}`;
    const cached = localStorage.getItem(key);
    if (cached?.trim()) setOperatorName(cached.trim());

    fetch(`/api/t/${tenant}/appointments`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAppointments(data);
        } else {
          setAppointments(mockAppointments);
        }
      })
      .catch(err => {
        console.warn("Using mock data due to API error:", err);
        setAppointments(mockAppointments);
      })
      .finally(() => setLoading(false));

    fetch(`/api/t/${tenant}/finance/overview`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch finance overview");
        return res.json();
      })
      .then((data) => setFinance(data))
      .catch((err) => {
        console.warn("Finance overview unavailable:", err);
        setFinance(null);
      });

    fetch(`/api/t/${tenant}/finance/weekly-plan`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch weekly plan");
        return res.json();
      })
      .then((data) => setWeeklyPlan(data))
      .catch((err) => {
        console.warn("Weekly plan unavailable:", err);
        setWeeklyPlan(null);
      });

    fetch(`/api/t/${tenant}/finance/weekly-plan/state`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch weekly plan state");
        return res.json();
      })
      .then((data: WeeklyPlanStateResponse) => {
        setDoneActions(data?.states ?? {});
        setPlanEvents(data?.recentEvents ?? []);
      })
      .catch((err) => {
        console.warn("Weekly plan state unavailable:", err);
        setDoneActions({});
        setPlanEvents([]);
      });
  }, [tenant]);

  const togglePlanAction = (actionId: string, completed: boolean) => {
    setDoneActions((prev) => ({ ...prev, [actionId]: completed }));
    fetch(`/api/t/${tenant}/finance/weekly-plan/state`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionId, completed, actor: operatorName, source: "dashboard_ui" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("failed");
        return fetch(`/api/t/${tenant}/finance/weekly-plan/state`).then((r) => r.json());
      })
      .then((data: WeeklyPlanStateResponse) => setPlanEvents(data?.recentEvents ?? []))
      .catch((err) => console.warn("Failed to persist weekly action state:", err));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Panel de Control</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Resumen de actividad y métricas clave.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <span className="font-medium text-slate-700 dark:text-slate-200 capitalize">{tenant}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
            title="Turnos Hoy"
            value={loading ? "..." : (appointments.length || "3")}
            icon={<Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400"/>}
            trend="+12% vs ayer"
            delay="delay-0"
        />
        <KpiCard
            title="Pacientes Nuevos"
            value="3"
            icon={<Users className="w-5 h-5 text-green-600 dark:text-green-400"/>}
            trend="+2 esta semana"
            delay="delay-100"
        />
        <KpiCard
            title="Ingresos (Est)"
            value="$45.000"
            icon={<BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400"/>}
            trend="+5% vs mes anterior"
            delay="delay-200"
        />
        <KpiCard
            title="Tasa Ocupación"
            value="85%"
            icon={<Activity className="w-5 h-5 text-orange-600 dark:text-orange-400"/>}
            trend="Alta demanda"
            delay="delay-300"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Motor financiero operativo</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cobranza, riesgo de no-show y proyección de caja en un solo tablero.</p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold uppercase">
              Profesional
            </span>
          </div>

          <div className="h-64">
            {finance?.monthly?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={finance.monthly}>
                  <defs>
                    <linearGradient id="paidFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="pendingFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip formatter={(v: number | undefined) => formatMoney(v ?? 0)} />
                  <Area type="monotone" dataKey="paid" stroke="#4f46e5" fill="url(#paidFill)" strokeWidth={2} />
                  <Area type="monotone" dataKey="pending" stroke="#f59e0b" fill="url(#pendingFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-sm text-slate-500">
                No hay suficientes datos financieros para mostrar tendencia.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <MiniStat title="Cobrado (mes)" value={formatMoney(finance?.summary?.paidThisMonth ?? 0)} icon={<Wallet className="w-4 h-4 text-emerald-600" />} tone="emerald" />
          <MiniStat title="Pendiente (mes)" value={formatMoney(finance?.summary?.pendingThisMonth ?? 0)} icon={<Clock className="w-4 h-4 text-amber-600" />} tone="amber" />
          <MiniStat title="Riesgo no-show" value={formatMoney(finance?.summary?.noShowLossThisMonth ?? 0)} icon={<AlertTriangle className="w-4 h-4 text-rose-600" />} tone="rose" />
          <MiniStat title="Proyección futura" value={formatMoney(finance?.summary?.upcomingBookedRevenue ?? 0)} icon={<TrendingUp className="w-4 h-4 text-indigo-600" />} tone="indigo" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Agenda Column */}
         <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
               <div>
                   <h3 className="font-bold text-slate-800 dark:text-white text-lg">Agenda del Día</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Próximos turnos programados</p>
               </div>
               <div className="flex items-center gap-2">
                  <button onClick={exportAgendaPDF} className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <FileDown className="w-3 h-3" /> PDF
                  </button>
                  <button onClick={exportAgendaExcel} className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Table className="w-3 h-3" /> Excel
                  </button>
                  <Link href={`/t/${tenant}/calendar`} className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    Calendario <ArrowUpRight className="w-3 h-3" />
                  </Link>
               </div>
            </div>
            <div className="flex-1 p-0 min-h-[300px]">
               {loading ? (
                   <div className="flex items-center justify-center h-full">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                   </div>
               ) : (
                   <div className="divide-y divide-slate-100 dark:divide-slate-800">
                       {appointments.map((a, i) => (
                           <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-4 group">
                               <div className="flex flex-col items-center justify-center w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-800 group-hover:scale-105 transition-transform">
                                   <Clock className="w-4 h-4 mb-0.5 opacity-70" />
                                   <span className="text-xs font-bold">
                                       {a.startAt ? format(new Date(a.startAt), 'HH:mm') : '00:00'}
                                   </span>
                               </div>
                               <div className="flex-1">
                                   <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{a.clientName || "Paciente Sin Nombre"}</h4>
                                   <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                                       <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                       {a.service?.name || "Servicio General"}
                                   </p>
                               </div>
                               <div>
                                   <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                       a.status === 'CONFIRMED' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                                       a.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' :
                                       'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                   }`}>
                                       {a.status === 'CONFIRMED' ? 'Confirmado' : a.status === 'PENDING' ? 'Pendiente' : a.status}
                                   </span>
                               </div>
                               <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 dark:text-slate-500 transition-colors">
                                   <MoreVertical className="w-4 h-4" />
                               </button>
                           </div>
                       ))}
                       {appointments.length === 0 && (
                           <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400 dark:text-slate-500">
                               <Calendar className="w-12 h-12 mb-3 opacity-20" />
                               <p className="text-sm">No hay turnos programados para hoy.</p>
                           </div>
                       )}
                   </div>
               )}
            </div>
         </div>

         {/* Side Column (Quick Actions & Automation) */}
         <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <h3 className="font-bold text-slate-800 dark:text-white mb-3 text-sm uppercase tracking-wide opacity-80">
                   Plan Semanal Recomendado
               </h3>
               {weeklyPlan?.plan?.length ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/40">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mb-2">
                      <span>Ejecución semanal</span>
                      <span className="font-semibold">
                        {weeklyPlan.plan.filter((item) => doneActions[item.id]).length}/{weeklyPlan.plan.length}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-300"
                        style={{
                          width: `${(weeklyPlan.plan.filter((item) => doneActions[item.id]).length / weeklyPlan.plan.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {weeklyPlan.plan.slice(0, 2).map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/40">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <label className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(doneActions[item.id])}
                            onChange={(e) =>
                              togglePlanAction(item.id, e.target.checked)
                            }
                            className="mt-0.5"
                          />
                          <span className={doneActions[item.id] ? "line-through opacity-60" : ""}>{item.title}</span>
                        </label>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.impact === "high" ? "bg-rose-100 text-rose-700" : item.impact === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {item.impact.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{item.nextStep}</p>
                    </div>
                  ))}
                  <p className="text-[11px] text-slate-500">
                    Cobranza: <span className="font-semibold">{weeklyPlan.kpis.collectionRate}%</span> ·
                    No-show: <span className="font-semibold">{weeklyPlan.kpis.noShowRate}%</span>
                  </p>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">Últimos movimientos</p>
                    <input
                      value={operatorName}
                      onChange={(e) => {
                        setOperatorName(e.target.value);
                        localStorage.setItem(`dashboard:operator:${tenant}`, e.target.value);
                      }}
                      className="mb-2 w-full rounded-md border border-slate-300 dark:border-slate-700 px-2 py-1 text-[11px] bg-white dark:bg-slate-900"
                      placeholder="Nombre del operador"
                    />
                    <div className="space-y-1">
                      {planEvents.slice(0, 3).map((ev, idx) => (
                        <p key={`${ev.actionId}-${ev.createdAt}-${idx}`} className="text-[11px] text-slate-500">
                          {ev.completed ? "✅" : "↩️"} {ev.actionId} · {(ev.actor || "Operador")} · {new Date(ev.createdAt).toLocaleDateString("es-AR")}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
               ) : (
                <p className="text-sm text-slate-500">No hay plan disponible por el momento.</p>
               )}
            </div>

            {/* Automation Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-2xl shadow-lg shadow-indigo-500/30 relative overflow-hidden group hover:shadow-indigo-500/50 transition-shadow">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-500">
                   <Zap className="w-24 h-24 rotate-12" />
               </div>
               <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-3">
                       <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm shadow-inner">
                           <Zap className="w-4 h-4 text-white" />
                       </div>
                       <h3 className="font-bold text-lg tracking-tight">Bot Activo</h3>
                   </div>
                   <p className="text-indigo-100 text-sm mb-6 leading-relaxed opacity-90">El asistente de WhatsApp está gestionando turnos y respondiendo consultas 24/7.</p>
                   <div className="flex items-center gap-2 text-xs font-mono bg-black/20 backdrop-blur-md p-2.5 rounded-lg border border-white/10 shadow-sm">
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                      </div>
                      <span className="text-white/90 font-medium">En línea</span>
                   </div>
               </div>
            </div>


            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2 text-sm uppercase tracking-wide opacity-80">
                   <Bot className="w-4 h-4" /> Admin Bot
               </h3>
               <textarea
                 value={adminQuestion}
                 onChange={(e) => setAdminQuestion(e.target.value)}
                 className="w-full min-h-[80px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-sm"
               />
               <button onClick={askAdminBot} disabled={adminLoading} className="mt-3 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
                 {adminLoading ? "Consultando..." : "Preguntar"}
               </button>
               <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{adminAnswer}</p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide opacity-80">
                   Accesos Rápidos
               </h3>
               <div className="space-y-2">
                  <ActionLink href={`/t/${tenant}/calendar`} label="Nuevo Turno" />
                  <ActionLink href={`/t/${tenant}/clients`} label="Ver Pacientes" />
                  <ActionLink href={`/t/${tenant}/settings`} label="Configuración" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, trend, delay }: any) {
  return (
    <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all duration-300 animate-fade-in ${delay}`}>
       <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">{icon}</div>
       <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">{title}</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{value}</p>
          {trend && <p className="text-[10px] text-green-600 dark:text-green-400 font-medium mt-1 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded w-fit">{trend}</p>}
       </div>
    </div>
  )
}

function ActionLink({ href, label }: { href: string, label: string }) {
    return (
        <Link href={href} className="block w-full text-left px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium border border-slate-100 dark:border-slate-700 transition-all flex items-center justify-between group">
            <span>{label}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
    )
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function MiniStat({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  tone: "emerald" | "amber" | "rose" | "indigo";
}) {
  const toneMap = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{title}</p>
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${toneMap[tone]}`}>{icon}</div>
      </div>
      <p className="text-xl font-black text-slate-900 dark:text-white mt-2">{value}</p>
    </div>
  );
}
