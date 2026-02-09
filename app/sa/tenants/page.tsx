"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, Plus, MoreHorizontal, LayoutDashboard } from "lucide-react";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/sa/tenants')
      .then(res => res.json())
      .then(data => setTenants(data));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Tenants</h1>
          <p className="text-slate-500">Gestión de suscripciones y clínicas</p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" /> Nuevo Tenant
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
           <div className="relative flex-1">
             <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
             <input
               placeholder="Buscar por nombre o slug..."
               className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
             />
           </div>
           <select className="px-4 py-2 rounded-lg border border-slate-200 bg-white">
             <option>Todos los estados</option>
             <option>Active</option>
             <option>Suspended</option>
           </select>
        </div>

        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-800">{t.name}</td>
                <td className="px-6 py-4 font-mono text-slate-500">{t.slug}</td>
                <td className="px-6 py-4"><span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-bold uppercase">{t.plan}</span></td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-slate-400 hover:text-slate-600 p-2"><MoreHorizontal className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
