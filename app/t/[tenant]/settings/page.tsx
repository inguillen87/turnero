import { Settings } from 'lucide-react';

export default async function SettingsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Configuración</h2>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Guardar Cambios
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
         <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
             <Settings className="w-6 h-6" />
           </div>
           <div>
             <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ajustes Generales</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400">Configura los detalles básicos de tu clínica.</p>
           </div>
         </div>

         <div className="space-y-6 max-w-2xl">
           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Tenant</label>
             <input type="text" value={tenant} disabled className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed" />
             <p className="text-xs text-slate-400 mt-1">El slug no se puede cambiar.</p>
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Mostrado</label>
             <input type="text" placeholder="Ej: Clínica Dental Elite" className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500" />
           </div>

           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Zona Horaria</label>
             <select className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 ring-indigo-500/20 focus:border-indigo-500">
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
