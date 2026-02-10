"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { Download } from 'lucide-react';

const data = [
  { name: 'Lun', turnos: 40 },
  { name: 'Mar', turnos: 30 },
  { name: 'Mie', turnos: 20 },
  { name: 'Jue', turnos: 27 },
  { name: 'Vie', turnos: 18 },
  { name: 'Sab', turnos: 23 },
  { name: 'Dom', turnos: 34 },
];

const pieData = [
  { name: 'Consulta General', value: 400 },
  { name: 'Ortodoncia', value: 300 },
  { name: 'Limpieza', value: 300 },
  { name: 'Implantes', value: 200 },
];

const COLORS = ['#6366f1', '#10b981', '#3b82f6', '#f59e0b'];

export function DemoReports() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Reportes y Estadísticas</h2>
                <p className="text-slate-500">Analiza el rendimiento de tu clínica</p>
            </div>
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Exportar PDF
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Turnos por Día */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-700 mb-4">Turnos por Día</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="turnos" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Servicios Más Solicitados */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-700 mb-4">Servicios Populares</h3>
                <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="ml-4 space-y-2">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-slate-600">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Crecimiento Mensual */}
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
                <h3 className="font-bold text-slate-700 mb-4">Crecimiento de Pacientes (Últimos 6 meses)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                            { name: 'Ene', value: 10 },
                            { name: 'Feb', value: 15 },
                            { name: 'Mar', value: 12 },
                            { name: 'Abr', value: 25 },
                            { name: 'May', value: 30 },
                            { name: 'Jun', value: 45 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
}
