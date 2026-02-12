"use client";

import { Settings } from 'lucide-react';

export function GeneralSettings({ tenant }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in">
       <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
         <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-50/50 dark:ring-indigo-900/10">
           <Settings className="w-6 h-6" />
         </div>
         <div>
           <h3 className="text-lg font-bold text-slate-900 dark:text-white">Información General</h3>
           <p className="text-sm text-slate-500 dark:text-slate-400">Datos básicos de tu organización.</p>
         </div>
       </div>

       <div className="space-y-6 max-w-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nombre Comercial</label>
                <input type="text" defaultValue={tenant.name} className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all text-slate-900 dark:text-white" />
             </div>

             <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Slug (URL)</label>
                <div className="relative">
                   <span className="absolute left-4 top-2.5 text-slate-400 text-sm font-mono">/t/</span>
                   <input type="text" value={tenant.slug} disabled className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 text-sm cursor-not-allowed font-mono" />
                </div>
             </div>

             <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Teléfono</label>
                <input type="tel" defaultValue={tenant.phone || "+54 9 11 ..."} className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all text-slate-900 dark:text-white" />
             </div>

             <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Dirección</label>
                <input type="text" defaultValue={tenant.address || ""} placeholder="Calle 123, Ciudad" className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all text-slate-900 dark:text-white" />
             </div>

             <div className="col-span-2">
               <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Zona Horaria</label>
               <select className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 text-sm outline-none transition-all text-slate-900 dark:text-white appearance-none">
                 <option>America/Argentina/Buenos_Aires (GMT-3)</option>
                 <option>America/Santiago (GMT-4)</option>
                 <option>America/Mexico_City (GMT-6)</option>
               </select>
             </div>
          </div>
       </div>
    </div>
  )
}
