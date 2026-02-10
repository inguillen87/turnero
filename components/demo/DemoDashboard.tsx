"use client";

import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Lun', turnos: 40, ingresos: 2400 },
  { name: 'Mar', turnos: 30, ingresos: 1398 },
  { name: 'Mie', turnos: 20, ingresos: 9800 },
  { name: 'Jue', turnos: 27, ingresos: 3908 },
  { name: 'Vie', turnos: 18, ingresos: 4800 },
  { name: 'Sab', turnos: 23, ingresos: 3800 },
  { name: 'Dom', turnos: 34, ingresos: 4300 },
];

export function DemoDashboard({ appointments }: { appointments: any[] }) {
  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
            title="Turnos Hoy"
            value={appointments.length.toString()}
            change="+12%"
            trend="up"
            icon={Calendar}
            color="indigo"
        />
        <KpiCard
            title="Pacientes Nuevos"
            value="12"
            change="+5%"
            trend="up"
            icon={Users}
            color="emerald"
        />
        <KpiCard
            title="Ingresos (Est)"
            value="$45.000"
            change="+8%"
            trend="up"
            icon={DollarSign}
            color="blue"
        />
        <KpiCard
            title="Tasa Cancelación"
            value="4.2%"
            change="-2%"
            trend="down" // Good for cancellation
            icon={Activity}
            color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area (Recharts) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Rendimiento Semanal</h3>
                    <p className="text-slate-500 text-sm">Turnos completados vs Proyectados</p>
                </div>
                <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none text-slate-600 font-medium cursor-pointer hover:bg-slate-100 transition-colors">
                    <option>Esta Semana</option>
                    <option>Últimos 30 días</option>
                    <option>Este Año</option>
                </select>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="ingresos"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIngresos)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 text-lg">Actividad Reciente</h3>
                <button className="text-indigo-600 hover:bg-indigo-50 p-1 rounded transition-colors">
                    <TrendingUp className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto custom-scroll pr-2">
                {[
                    { text: "Juan Perez reservó un turno", sub: "Limpieza Dental - Mañana 10:00", time: "Hace 5 min", type: "success" },
                    { text: "Maria Gomez canceló", sub: "Consulta General", time: "Hace 1 hora", type: "danger" },
                    { text: "Nuevo paciente registrado", sub: "Carlos Rodriguez", time: "Hace 2 horas", type: "info" },
                    { text: "Recordatorio enviado", sub: "A Pedro Martinez (WhatsApp)", time: "Hace 3 horas", type: "neutral" },
                    { text: "Pago recibido", sub: "Factura #1234 - $5000", time: "Hace 4 horas", type: "success" },
                ].map((item, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                        <div className={`relative mt-1 flex-shrink-0 w-2 h-2 rounded-full ${
                            item.type === 'success' ? 'bg-emerald-500' :
                            item.type === 'danger' ? 'bg-red-500' :
                            item.type === 'info' ? 'bg-blue-500' : 'bg-slate-300'
                        }`}>
                            <span className={`absolute top-0 left-0 w-full h-full rounded-full animate-ping opacity-75 ${
                                item.type === 'success' ? 'bg-emerald-400' : 'hidden'
                            }`}></span>
                        </div>
                        <div className="pb-6 border-l border-slate-100 pl-6 ml-[-21px] group-last:border-0 group-last:pb-0">
                            <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{item.text}</p>
                            <p className="text-xs text-slate-500 mb-1">{item.sub}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-100">
                Ver historial completo
            </button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, trend, icon: Icon, color }: any) {
    const colors: any = {
        indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
        orange: "bg-orange-50 text-orange-600 ring-orange-100",
    };

    const isPositive = trend === 'up';

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default relative overflow-hidden">
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-10 transition-opacity ${colors[color].split(' ')[1].replace('text-', 'bg-')}`}></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ring-1 ${colors[color]} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                    isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {change}
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-slate-500 text-sm font-medium mb-1 group-hover:text-slate-600 transition-colors">{title}</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
            </div>
        </div>
    );
}
