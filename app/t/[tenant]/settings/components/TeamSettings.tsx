"use client";

import { Users } from 'lucide-react';

export function TeamSettings({ professionals }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in">
       <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 ring-4 ring-purple-50/50 dark:ring-purple-900/10">
                <Users className="w-6 h-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Equipo Médico</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Profesionales y sus agendas.</p>
            </div>
          </div>
          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">+ Agregar Profesional</button>
       </div>

       <div className="grid gap-4">
          {(professionals || []).map((p: any) => (
             <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                    {p.name.charAt(0)}
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.specialty || "General"}</p>
                 </div>
                 <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${p.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500'}`}>
                    {p.active ? 'Activo' : 'Inactivo'}
                 </span>
             </div>
          ))}
       </div>
    </div>
  )
}
