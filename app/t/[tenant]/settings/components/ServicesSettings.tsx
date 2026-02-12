"use client";

import { Briefcase, Clock } from 'lucide-react';

export function ServicesSettings({ services, tenant }: any) {
  // Simple formatter
  const formatPrice = (value: number, currency: string) => {
    // DB stores integer units (e.g. 18000 for $18,000)
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency || 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in">
       <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 ring-4 ring-blue-50/50 dark:ring-blue-900/10">
                <Briefcase className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Servicios Ofrecidos</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Gestiona el catálogo de prestaciones.</p>
            </div>
          </div>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">+ Agregar Servicio</button>
       </div>

       <div className="space-y-3">
          {(services || []).map((s: any) => (
             <div key={s.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs">
                      {s.name.substring(0,2).toUpperCase()}
                   </div>
                   <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{s.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                         <Clock className="w-3 h-3" /> {s.durationMin} min • {formatPrice(s.price, s.currency || tenant.currency)}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="text-xs font-medium text-slate-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 transition-all">Editar</button>
                </div>
             </div>
          ))}
          {(!services || services.length === 0) && <p className="text-slate-400 text-center py-8">No hay servicios configurados.</p>}
       </div>
    </div>
  )
}
