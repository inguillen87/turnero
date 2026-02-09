"use client";

import { useFetch } from "@/hooks/useFetch";
import { format, startOfWeek, addDays, getHours, set } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const days = Array.from({ length: 5 }).map((_, i) => addDays(start, i)); // Mon-Fri
  const hours = Array.from({ length: 10 }).map((_, i) => i + 9); // 09:00 - 18:00

  // Mock data or fetch
  const { data: appointments } = useFetch<any[]>('/api/appointments');

  const getAppointmentsForSlot = (day: Date, hour: number) => {
    if (!appointments) return null;
    return appointments.find(a => {
        const d = new Date(a.startAt);
        return d.getDate() === day.getDate() &&
               d.getMonth() === day.getMonth() &&
               getHours(d) === hour;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Agenda</h2>
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-1 rounded-lg border dark:border-slate-700 shadow-sm">
           <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><FaChevronLeft className="w-4 h-4 text-slate-500"/></button>
           <span className="text-sm font-bold w-32 text-center text-slate-700 dark:text-slate-200 capitalize">
               {format(currentDate, 'MMMM yyyy', { locale: es })}
           </span>
           <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><FaChevronRight className="w-4 h-4 text-slate-500"/></button>
        </div>
      </div>

      <div className="flex-1 glass-card overflow-hidden flex flex-col bg-white dark:bg-slate-900">
        {/* Header Row */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
            <div className="w-16 border-r border-slate-200 dark:border-slate-800 p-4"></div>
            {days.map(d => (
                <div key={d.toString()} className="flex-1 p-4 text-center border-r border-slate-200 dark:border-slate-800 last:border-none">
                    <p className="text-xs text-slate-400 uppercase font-bold">{format(d, 'EEE', { locale: es })}</p>
                    <p className={`text-lg font-bold ${d.getDate() === new Date().getDate() ? 'text-blue-600' : 'text-slate-800 dark:text-white'}`}>{format(d, 'd')}</p>
                </div>
            ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto custom-scroll relative">
            {hours.map(h => (
                <div key={h} className="flex min-h-[80px] border-b border-slate-100 dark:border-slate-800/50">
                    <div className="w-16 border-r border-slate-200 dark:border-slate-800 p-2 text-xs text-slate-400 text-right sticky left-0 bg-white dark:bg-slate-900">
                        {h}:00
                    </div>
                    {days.map(d => {
                        const appt = getAppointmentsForSlot(d, h);
                        return (
                            <div key={d.toString()} className="flex-1 border-r border-slate-100 dark:border-slate-800/50 relative group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors p-1">
                                {appt ? (
                                    <div className="w-full h-full bg-blue-100 dark:bg-blue-900/40 border-l-4 border-blue-500 rounded p-1.5 cursor-pointer hover:brightness-95 transition-all shadow-sm">
                                        <p className="font-bold text-xs text-blue-800 dark:text-blue-300 truncate">{appt.clientName}</p>
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 truncate">{appt.service?.name}</p>
                                    </div>
                                ) : (
                                    <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center">
                                        <button className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg transform scale-90 hover:scale-100 transition-all">+</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
