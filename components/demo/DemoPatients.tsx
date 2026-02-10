"use client";

import { User, Phone, Calendar, MoreHorizontal } from "lucide-react";

export function DemoPatients() {
  const patients = [
    { id: 1, name: "Juan Perez (Demo)", phone: "+54 9 11 1234 5678", email: "juan@demo.com", lastVisit: "Hace 2 días", totalVisits: 5, status: "Active" },
    { id: 2, name: "Maria Garcia (Demo)", phone: "+54 9 11 8765 4321", email: "maria@demo.com", lastVisit: "Hoy", totalVisits: 12, status: "Active" },
    { id: 3, name: "Carlos Lopez", phone: "+54 9 11 5555 0000", email: "carlos@test.com", lastVisit: "Hace 1 mes", totalVisits: 1, status: "Inactive" },
    { id: 4, name: "Ana Torres", phone: "+54 9 11 4444 3333", email: "ana@test.com", lastVisit: "Nunca", totalVisits: 0, status: "New" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
         <div>
            <h3 className="font-bold text-slate-700 text-lg">Pacientes</h3>
            <p className="text-slate-500 text-sm">Gestiona tu base de datos de clientes</p>
         </div>
         <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
            + Nuevo Paciente
         </button>
      </div>

      <div className="overflow-auto custom-scroll p-4">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-3 pl-2">Nombre</th>
                    <th className="pb-3">Contacto</th>
                    <th className="pb-3">Última Visita</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3 text-right pr-2">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {patients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-4 pl-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                    {p.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700">{p.name}</p>
                                    <p className="text-xs text-slate-400">ID: #{p.id}</p>
                                </div>
                            </div>
                        </td>
                        <td className="py-4">
                            <div className="text-sm text-slate-600 flex flex-col gap-1">
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400"/> {p.phone}</span>
                                <span className="text-xs text-slate-400">{p.email}</span>
                            </div>
                        </td>
                        <td className="py-4">
                            <div className="text-sm text-slate-600">
                                <p>{p.lastVisit}</p>
                                <p className="text-xs text-slate-400">{p.totalVisits} visitas totales</p>
                            </div>
                        </td>
                        <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                p.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' :
                                p.status === 'New' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                                {p.status}
                            </span>
                        </td>
                        <td className="py-4 text-right pr-2">
                            <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
