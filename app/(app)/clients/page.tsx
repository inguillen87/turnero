"use client";

import { useFetch } from "@/hooks/useFetch";
import { FaUserPlus, FaMagnifyingGlass } from "react-icons/fa6";

export default function ClientsPage() {
  const { data: clients } = useFetch<any[]>('/api/clients');

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Pacientes</h2>
        <div className="flex gap-4">
            <div className="relative">
                <FaMagnifyingGlass className="absolute left-3 top-3 text-slate-400 w-4 h-4"/>
                <input type="text" placeholder="Buscar paciente..." className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"/>
            </div>
            <button className="btn-primary flex items-center gap-2">
                <FaUserPlus /> Nuevo Paciente
            </button>
        </div>
      </div>

      <div className="glass-card flex-1 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700 uppercase text-xs font-bold text-slate-500 tracking-wider">
                    <tr>
                        <th className="p-4">Nombre</th>
                        <th className="p-4">Contacto</th>
                        <th className="p-4">Última Visita</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {clients?.map((client) => (
                        <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <td className="p-4 font-bold text-slate-800 dark:text-white">{client.name}</td>
                            <td className="p-4">
                                <div className="text-slate-500">{client.email}</div>
                                <div className="text-xs text-slate-400">{client.phone}</div>
                            </td>
                            <td className="p-4 text-slate-500">-</td>
                            <td className="p-4"><span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded text-xs font-bold uppercase">Activo</span></td>
                            <td className="p-4 text-right">
                                <button className="text-slate-400 hover:text-blue-500 font-bold text-xs border dark:border-slate-700 px-3 py-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm">Ver Historia</button>
                            </td>
                        </tr>
                    ))}
                    {!clients && <tr className="text-center p-8"><td colSpan={5} className="text-center p-8 text-slate-400">Cargando...</td></tr>}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
