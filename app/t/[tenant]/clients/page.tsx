import { Users, Search, Filter } from 'lucide-react';
import { prisma } from '@/lib/db';

export default async function ClientsPage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant: slug } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
  });

  const clients = tenant ? await prisma.customer.findMany({
    where: { tenantId: tenant.id },
    include: { _count: { select: { appointments: true } } },
    orderBy: { createdAt: 'desc' },
  }) : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pacientes</h2>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm text-slate-600 dark:text-slate-300">
             <Filter className="w-4 h-4" /> Filtros
           </button>
           <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
             + Nuevo Paciente
           </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
         <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input type="text" placeholder="Buscar por nombre, teléfono o email..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 ring-indigo-500/20 text-sm" />
            </div>
         </div>

         <table className="w-full text-sm text-left">
           <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-xs font-semibold">
             <tr>
               <th className="px-6 py-3">Nombre</th>
               <th className="px-6 py-3">Contacto</th>
               <th className="px-6 py-3">Turnos</th>
               <th className="px-6 py-3">Fecha Alta</th>
               <th className="px-6 py-3 text-right">Acciones</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
             {clients.map((c) => (
               <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                 <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">{c.name.charAt(0)}</div>
                    {c.name}
                 </td>
                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    <p className="text-xs">{c.email}</p>
                    <p className="text-xs">{c.phone}</p>
                 </td>
                 <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{c._count.appointments}</td>
                 <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                 <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Ver Ficha</button>
                 </td>
               </tr>
             ))}
             {clients.length === 0 && (
                <tr>
                   <td colSpan={5} className="text-center py-12 text-slate-400">
                      <Users className="w-12 h-12 mx-auto mb-3 text-slate-200 dark:text-slate-700" />
                      No hay pacientes registrados aún.
                   </td>
                </tr>
             )}
           </tbody>
         </table>
      </div>
    </div>
  )
}
