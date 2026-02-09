import { format } from "date-fns";
import { Clock, User } from "lucide-react";

export function DemoAgenda({ appointments }: { appointments: any[] }) {
  if (!appointments) return <div className="p-4 text-center">Cargando...</div>;

  return (
    <div className="flex flex-col gap-4">
      {appointments.length === 0 && (
         <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
           No hay turnos para hoy.
         </div>
      )}
      {appointments.map((appt) => (
        <div
          key={appt.id}
          className={`p-4 rounded-xl border flex justify-between items-center transition-all animate-fade-in ${appt.status === 'confirmed' ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100'}`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${appt.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
               <p className="font-bold text-slate-800">{format(new Date(appt.startAt), 'HH:mm')}</p>
               <p className="text-sm text-slate-500 flex items-center gap-1"><User className="w-3 h-3"/> {appt.clientName}</p>
            </div>
          </div>

          <div className="text-right">
             <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${appt.status === 'confirmed' ? 'bg-green-200 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
               {appt.status}
             </span>
             <p className="text-xs text-slate-400 mt-1">{appt.service?.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
