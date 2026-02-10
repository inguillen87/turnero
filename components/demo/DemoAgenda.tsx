import { format, isSameDay, parseISO, addHours, startOfToday } from "date-fns";
import { Clock, User, Calendar as CalIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function DemoAgenda({ appointments }: { appointments: any[] }) {
  const [view, setView] = useState<'list' | 'grid'>('grid');
  const today = startOfToday();

  // Mock slots for grid view
  const hours = Array.from({ length: 13 }, (_, i) => 8 + i); // 8:00 to 20:00

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-700 text-lg">Agenda del Día</h3>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm font-medium px-2 text-slate-600">{format(new Date(), 'dd MMM yyyy')}</span>
                <button className="p-1 hover:bg-slate-100 rounded text-slate-500"><ChevronRight className="w-4 h-4" /></button>
            </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
                onClick={() => setView('grid')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${view === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Grilla
            </button>
            <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${view === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Lista
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scroll relative">
         {view === 'grid' ? (
             <div className="min-w-[600px] p-4">
                 {/* Grid Header */}
                 <div className="grid grid-cols-[60px_1fr] gap-4 mb-4 sticky top-0 bg-white z-10 border-b border-slate-100 pb-2">
                     <div className="text-right text-xs font-bold text-slate-400">Hora</div>
                     <div className="text-xs font-bold text-slate-400 pl-4 border-l border-slate-100">Consultorio 1</div>
                 </div>

                 {/* Grid Body */}
                 <div className="relative">
                     {hours.map(hour => (
                         <div key={hour} className="grid grid-cols-[60px_1fr] gap-4 h-24 group">
                             <div className="text-right text-xs text-slate-400 -mt-2.5 bg-white pr-2 relative z-10 font-mono">
                                {hour}:00
                             </div>
                             <div className="border-t border-slate-100 border-dashed relative h-full group-hover:bg-slate-50/50 transition-colors">
                                 {/* Render appointments for this hour */}
                                 {appointments.filter(appt => {
                                     const d = new Date(appt.startAt);
                                     return d.getHours() === hour;
                                 }).map(appt => (
                                     <div
                                        key={appt.id}
                                        className={`absolute left-2 right-2 top-2 bottom-2 rounded-lg p-3 border shadow-sm cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] flex flex-col justify-center
                                            ${appt.status === 'confirmed' ? 'bg-green-50 border-green-200' : 'bg-indigo-50 border-indigo-200'}
                                        `}
                                     >
                                         <div className="flex justify-between items-start">
                                            <p className={`text-xs font-bold ${appt.status === 'confirmed' ? 'text-green-700' : 'text-indigo-700'}`}>
                                                {format(new Date(appt.startAt), 'HH:mm')} - {appt.clientName}
                                            </p>
                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${appt.status === 'confirmed' ? 'bg-green-200 text-green-800' : 'bg-indigo-200 text-indigo-800'}`}>
                                                {appt.status}
                                            </span>
                                         </div>
                                         <p className="text-xs text-slate-500 mt-1 truncate">{appt.service?.name}</p>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     ))}

                     {/* Current Time Line (Fake) */}
                     <div className="absolute left-[76px] right-0 top-[340px] border-t-2 border-red-400 z-20 flex items-center">
                         <div className="w-2 h-2 bg-red-400 rounded-full -ml-1"></div>
                         <span className="text-[10px] text-red-500 font-bold bg-white px-1 ml-1">11:30</span>
                     </div>
                 </div>
             </div>
         ) : (
            <div className="p-4 space-y-3">
                {appointments.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        No hay turnos agendados.
                    </div>
                )}
                {appointments.map((appt) => (
                    <div
                    key={appt.id}
                    className={`p-4 rounded-xl border flex justify-between items-center transition-all hover:shadow-md cursor-pointer ${appt.status === 'confirmed' ? 'bg-green-50/50 border-green-100' : 'bg-white border-slate-100'}`}
                    >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${appt.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Clock className="w-5 h-5" />
                        </div>
                        <div>
                        <p className="font-bold text-slate-800 text-lg">{format(new Date(appt.startAt), 'HH:mm')}</p>
                        <p className="text-sm text-slate-500 flex items-center gap-1 font-medium"><User className="w-3 h-3"/> {appt.clientName}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {appt.status}
                        </span>
                        <p className="text-xs text-slate-400 mt-1 font-medium">{appt.service?.name}</p>
                    </div>
                    </div>
                ))}
            </div>
         )}
      </div>
    </div>
  );
}
