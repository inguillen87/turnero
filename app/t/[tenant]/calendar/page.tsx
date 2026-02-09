import { Calendar, Plus } from 'lucide-react';

export default function CalendarPage({ params }: { params: { tenant: string } }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Agenda</h2>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo Turno
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 h-[600px] flex items-center justify-center text-slate-400 flex-col gap-4">
         <Calendar className="w-16 h-16 text-indigo-100 dark:text-slate-800" />
         <p>Vista de Calendario (Próximamente)</p>
         <p className="text-xs">Aquí se mostrarán los turnos de {params.tenant}</p>
      </div>
    </div>
  )
}
