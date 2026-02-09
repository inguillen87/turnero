"use client";

import { useState } from "react";
import { format } from "date-fns";
import { FaUserPlus, FaCheck, FaXmark, FaCalendarCheck, FaChartLine } from "react-icons/fa6";
import { useFetch } from "@/hooks/useFetch";
import { es } from "date-fns/locale";

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
  const { data: appointments, error } = useFetch<Appointment[]>('/api/appointments');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const today = new Date();

  const total = appointments?.length || 0;
  const confirmed = appointments?.filter((a) => a.status === 'confirmed').length || 0;
  const cancelled = appointments?.filter((a) => a.status === 'cancelled').length || 0;
  const revenue = appointments?.reduce((acc, a) => acc + (a.service?.price || 0), 0) || 0;

  const selectedAppt = appointments?.find((a) => a.id === selectedId);

  return (
    <div className="flex flex-col h-full space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Recepción</h2>
          <p className="text-slate-500 dark:text-slate-400">Resumen del día de hoy</p>
        </div>
        <div className="self-start md:self-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl shadow-sm text-sm font-semibold capitalize text-slate-700 dark:text-slate-200">
           {format(today, 'PPPP', { locale: es })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Turnos" value={total} icon={<FaCalendarCheck className="w-5 h-5"/>} color="blue" />
        <KpiCard title="Confimados" value={confirmed} icon={<FaCheck className="w-5 h-5"/>} color="green" />
        <KpiCard title="Cancelados" value={cancelled} icon={<FaXmark className="w-5 h-5"/>} color="red" />
        <KpiCard title="Ingresos" value={`$${revenue}`} icon={<FaChartLine className="w-5 h-5"/>} color="violet" />
      </div>

      {/* Content Area */}
      <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-[500px]">
        {/* List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full">
           <div className="glass-card p-4 bg-white dark:bg-slate-900 flex-1 flex flex-col min-h-[400px]">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Próximos Turnos</h3>
               <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">{appointments?.length || 0}</span>
             </div>

             <div className="flex-1 overflow-y-auto space-y-3 custom-scroll pr-1">
               {!appointments && <div className="p-8 text-center text-sm text-slate-400">Cargando turnos...</div>}
               {appointments && appointments.length === 0 && (
                  <div className="p-8 text-center text-sm text-slate-400 flex flex-col items-center gap-2">
                    <FaCalendarCheck className="w-8 h-8 opacity-20" />
                    No hay turnos hoy.
                  </div>
               )}
               {appointments?.map((appt) => (
                 <div
                   key={appt.id}
                   onClick={() => setSelectedId(appt.id)}
                   className={`p-4 rounded-xl border cursor-pointer transition-all group ${selectedId === appt.id ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20 dark:border-indigo-500 shadow-md' : 'bg-white border-slate-100 dark:bg-slate-800/50 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800'}`}
                 >
                   <div className="flex justify-between items-center mb-1">
                     <span className="font-bold text-slate-800 dark:text-white text-lg">{format(new Date(appt.startAt), 'HH:mm')}</span>
                     <StatusBadge status={appt.status} />
                   </div>
                   <div className="font-semibold text-slate-700 dark:text-slate-200">{appt.clientName || 'Sin Nombre'}</div>
                   <div className="text-xs text-slate-500 flex justify-between mt-2">
                      <span>{appt.service?.name}</span>
                      <span className="font-medium text-slate-400 group-hover:text-indigo-500 transition-colors">Ver detalles →</span>
                   </div>
                 </div>
               ))}
             </div>

             <button className="btn-primary w-full flex items-center justify-center gap-2 mt-4 py-3 text-sm">
               <FaUserPlus /> Nuevo Turno
             </button>
           </div>
        </div>

        {/* Detail Panel */}
        <div className={`fixed inset-0 z-50 lg:static lg:inset-auto lg:z-auto lg:flex-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none p-6 lg:p-0 flex flex-col justify-center items-center transition-all duration-300 ${selectedId ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 lg:translate-y-0 lg:opacity-100 lg:block pointer-events-none lg:pointer-events-auto'}`}>

           {/* Mobile Close Button */}
           <button onClick={() => setSelectedId(null)} className="lg:hidden absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
             <FaXmark className="w-6 h-6" />
           </button>

           <div className="glass-card w-full max-w-md lg:max-w-none h-full p-8 flex flex-col items-center justify-center bg-white dark:bg-slate-900 lg:h-auto lg:aspect-square xl:aspect-video relative shadow-2xl lg:shadow-none border border-slate-200 dark:border-slate-700">
             {selectedAppt ? (
               <div className="w-full flex flex-col items-center text-center animate-fade-in">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mb-6 shadow-xl shadow-indigo-500/30">
                    {selectedAppt.clientName?.charAt(0) || '?'}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{selectedAppt.clientName}</h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">
                    {selectedAppt.service?.name} • {selectedAppt.staff?.name}
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full mb-8">
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Hora</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">{format(new Date(selectedAppt.startAt), 'HH:mm')}</p>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Precio</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">${selectedAppt.service?.price}</p>
                     </div>
                  </div>

                  <div className="flex flex-col w-full gap-3">
                     <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2">
                        <FaCheck /> Confirmar Asistencia
                     </button>
                     <div className="flex gap-3">
                        <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700 font-bold py-3.5 rounded-xl transition-colors">
                           Reprogramar
                        </button>
                        <button className="flex-1 bg-white border border-red-100 hover:bg-red-50 text-red-600 dark:bg-slate-800 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20 font-bold py-3.5 rounded-xl transition-colors">
                           Cancelar
                        </button>
                     </div>
                  </div>
               </div>
             ) : (
               <div className="text-center text-slate-400 flex flex-col items-center">
                 <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <FaCalendarCheck className="w-8 h-8 opacity-30" />
                 </div>
                 <p className="text-lg font-medium">Selecciona un turno</p>
                 <p className="text-sm">Verás los detalles aquí</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, color }: any) {
    const colors: any = {
        blue: 'border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-900/10',
        green: 'border-green-500 text-green-500 bg-green-50 dark:bg-green-900/10',
        red: 'border-red-500 text-red-500 bg-red-50 dark:bg-red-900/10',
        violet: 'border-violet-500 text-violet-500 bg-violet-50 dark:bg-violet-900/10',
    };
    const theme = colors[color] || colors.blue;

    return (
        <div className={`glass-card p-4 border-l-4 ${color === 'blue' ? 'border-blue-500' : ''} ${color === 'green' ? 'border-green-500' : ''} ${color === 'red' ? 'border-red-500' : ''} ${color === 'violet' ? 'border-violet-500' : ''} flex flex-col justify-between bg-white dark:bg-slate-800 hover:transform hover:translate-y-[-2px] transition-transform duration-200`}>
            <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <div className={`p-1.5 rounded-lg ${theme.split(' ')[1]} ${theme.split(' ')[2]}`}>{icon}</div>
            </div>
            <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{value}</p>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
        cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
        done: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    };
    return (
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${styles[status] || "bg-slate-100 text-slate-500"}`}>
            {status}
        </span>
    );
}
