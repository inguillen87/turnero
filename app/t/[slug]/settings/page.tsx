"use client";

import { useFetch } from "@/hooks/useFetch";
import { FaGear, FaBuilding, FaUserCheck, FaCalendarPlus, FaMoneyBillWave } from "react-icons/fa6";

export default function SettingsPage() {
  const { data: services } = useFetch<any[]>('/api/services');
  const { data: staff } = useFetch<any[]>('/api/staff');

  return (
    <div className="flex flex-col h-full space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Configuración</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Profile Card */}
        <div className="glass-card p-6 border-t-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400">
                <FaBuilding className="w-5 h-5"/>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Clínica</h3>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                    <input type="text" className="w-full mt-1 p-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700" defaultValue="Demo Clinic" />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Dirección</label>
                    <input type="text" className="w-full mt-1 p-2 border rounded-lg text-sm bg-slate-50 dark:bg-slate-800 dark:border-slate-700" placeholder="Calle 123" />
                </div>
                <button className="btn-primary w-full mt-2">Guardar</button>
            </div>
        </div>

        {/* Services Card */}
        <div className="glass-card p-6 border-t-4 border-green-500">
            <div className="flex items-center gap-3 mb-4 text-green-600 dark:text-green-400">
                <FaMoneyBillWave className="w-5 h-5"/>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Servicios</h3>
            </div>
            <div className="space-y-3 custom-scroll overflow-y-auto max-h-64 pr-2">
                {services?.map(s => (
                    <div key={s.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
                        <div>
                            <p className="font-bold text-sm text-slate-700 dark:text-slate-200">{s.name}</p>
                            <p className="text-xs text-slate-500">{s.durationMin} min</p>
                        </div>
                        <span className="font-bold text-green-600 dark:text-green-400">${s.price}</span>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 text-sm font-bold text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">+ Agregar Servicio</button>
        </div>

        {/* Staff Card */}
        <div className="glass-card p-6 border-t-4 border-violet-500">
            <div className="flex items-center gap-3 mb-4 text-violet-600 dark:text-violet-400">
                <FaUserCheck className="w-5 h-5"/>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Staff</h3>
            </div>
            <div className="space-y-3 custom-scroll overflow-y-auto max-h-64 pr-2">
                {staff?.map(st => (
                    <div key={st.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-xs">
                                {st.name.charAt(0)}
                            </div>
                            <p className="font-bold text-sm text-slate-700 dark:text-slate-200">{st.name}</p>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${st.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                ))}
            </div>
             <button className="w-full mt-4 text-sm font-bold text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">+ Nuevo Profesional</button>
        </div>
      </div>
    </div>
  );
}
