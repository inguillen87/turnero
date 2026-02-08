"use client";

import { useState } from "react";
import { format } from "date-fns";
import { FaUserPlus, FaCheck, FaXmark, FaCalendarCheck, FaChartLine } from "react-icons/fa6";
import { useFetch } from "@/hooks/useFetch";

interface Appointment {
  id: string;
  startAt: string;
  endAt: string;
  clientName?: string;
  status: string;
  service?: { name: string; price: number };
  staff?: { name: string };
  notes?: string;
}

export default function DashboardPage() {
  // Demo fetch - in real app, filter by date
  const { data: appointments, error } = useFetch<Appointment[]>('/api/appointments');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const today = new Date();

  // Basic stats
  const total = appointments?.length || 0;
  const confirmed = appointments?.filter((a) => a.status === 'confirmed').length || 0;
  const cancelled = appointments?.filter((a) => a.status === 'cancelled').length || 0;
  const revenue = appointments?.reduce((acc, a) => acc + (a.service?.price || 0), 0) || 0;

  const selectedAppt = appointments?.find((a) => a.id === selectedId);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Recepción</h2>
          <p className="text-sm text-slate-500">Resumen del día</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 px-4 py-2 rounded-full shadow-sm text-sm font-medium">
           {format(today, 'PPPP')}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Turnos Hoy" value={total} icon={<FaCalendarCheck className="w-5 h-5"/>} color="blue" />
        <KpiCard title="Confirmados" value={confirmed} icon={<FaCheck className="w-5 h-5"/>} color="green" />
        <KpiCard title="Cancelados" value={cancelled} icon={<FaXmark className="w-5 h-5"/>} color="red" />
        <KpiCard title="Ingresos Est." value={`$${revenue}`} icon={<FaChartLine className="w-5 h-5"/>} color="violet" />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 gap-6 overflow-hidden min-h-[400px]">
        {/* List */}
        <div className="w-1/3 flex flex-col gap-4 overflow-hidden h-full glass-card p-4 bg-white dark:bg-slate-900">
           <div className="flex justify-between items-center mb-2">
             <h3 className="font-bold text-slate-700 dark:text-slate-200">Próximos Turnos</h3>
           </div>

           <div className="flex-1 overflow-y-auto space-y-3 custom-scroll pr-2">
             {!appointments && <div className="p-4 text-center text-sm text-slate-400">Cargando...</div>}
             {appointments && appointments.length === 0 && (
                <div className="p-4 text-center text-sm text-slate-400">No hay turnos hoy.</div>
             )}
             {appointments?.map((appt) => (
               <div
                 key={appt.id}
                 onClick={() => setSelectedId(appt.id)}
                 className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedId === appt.id ? 'bg-blue-50 border-blue-500 dark:bg-slate-800 dark:border-blue-500' : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700 hover:shadow-md'}`}
               >
                 <div className="flex justify-between font-bold text-slate-700 dark:text-slate-200 text-sm">
                   <span>{format(new Date(appt.startAt), 'HH:mm')}</span>
                   <StatusBadge status={appt.status} />
                 </div>
                 <div className="font-medium text-slate-800 dark:text-slate-100">{appt.clientName || 'Sin Nombre'}</div>
                 <div className="text-xs text-slate-500">{appt.service?.name}</div>
               </div>
             ))}
           </div>

           <button className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
             <FaUserPlus /> Nuevo Turno
           </button>
        </div>

        {/* Detail Panel */}
        <div className="flex-1 glass-card p-6 flex flex-col relative items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
           {selectedAppt ? (
             <div className="w-full h-full flex flex-col items-center text-center pt-10 animate-fade-in">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg">
                  {selectedAppt.clientName?.charAt(0) || '?'}
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedAppt.clientName}</h2>
                <p className="text-slate-500 mb-6">{selectedAppt.service?.name} • {selectedAppt.staff?.name}</p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                   <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border dark:border-slate-700">
                      <p className="text-xs text-slate-400 uppercase font-bold">Hora</p>
                      <p className="text-lg font-bold">{format(new Date(selectedAppt.startAt), 'HH:mm')}</p>
                   </div>
                   <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border dark:border-slate-700">
                      <p className="text-xs text-slate-400 uppercase font-bold">Precio</p>
                      <p className="text-lg font-bold">${selectedAppt.service?.price}</p>
                   </div>
                </div>

                <div className="flex gap-3 w-full max-w-xs">
                   <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition-colors shadow-lg shadow-green-500/20">Check-In</button>
                   <button className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 font-bold py-2 rounded-lg transition-colors">Editar</button>
                </div>
             </div>
           ) : (
             <div className="text-center text-slate-400">
               <p>Selecciona un turno para ver detalles</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, color }: any) {
    const colors: any = {
        blue: 'border-blue-500 text-blue-500 bg-blue-50',
        green: 'border-green-500 text-green-500 bg-green-50',
        red: 'border-red-500 text-red-500 bg-red-50',
        violet: 'border-violet-500 text-violet-500 bg-violet-50',
    };
    const theme = colors[color] || colors.blue;

    return (
        <div className={`glass-card p-4 border-l-4 ${color === 'blue' ? 'border-blue-500' : ''} ${color === 'green' ? 'border-green-500' : ''} ${color === 'red' ? 'border-red-500' : ''} ${color === 'violet' ? 'border-violet-500' : ''} flex flex-col justify-between bg-white dark:bg-slate-800`}>
            <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <div className={`p-1.5 rounded-lg ${theme.split(' ')[1]} ${theme.split(' ')[2]}`}>{icon}</div>
            </div>
            <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-2 tracking-tight">{value}</p>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        done: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
    return (
        <span className={`text-[10px] px-2 py-0.5 rounded border border-transparent font-bold uppercase ${styles[status] || "bg-slate-100 text-slate-500"}`}>
            {status}
        </span>
    );
}
