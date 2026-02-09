"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { Calendar, Users, DollarSign, Clock } from "lucide-react";

export default function TenantDashboard() {
  const { tenant } = useParams();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/t/${tenant}/appointments`)
      .then(res => res.json())
      .then(data => setAppointments(data));
  }, [tenant]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
           <span className="w-2 h-2 bg-green-500 rounded-full"></span>
           {tenant}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Turnos Totales</h3>
              <Calendar className="w-4 h-4 text-slate-400" />
           </div>
           <p className="text-2xl font-bold">{appointments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-500">Ingresos</h3>
              <DollarSign className="w-4 h-4 text-slate-400" />
           </div>
           <p className="text-2xl font-bold">$124.500</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
         <div className="col-span-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4">Próximos Turnos</h3>
            <div className="space-y-4">
               {appointments.slice(0, 5).map((a) => (
                 <div key={a.id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                          {a.clientName.charAt(0)}
                       </div>
                       <div>
                          <p className="font-bold text-sm">{a.clientName}</p>
                          <p className="text-xs text-slate-500">{a.service?.name}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-sm">{format(new Date(a.startAt), 'HH:mm')}</p>
                       <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold uppercase">{a.status}</span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
