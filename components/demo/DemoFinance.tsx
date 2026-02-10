import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Download } from 'lucide-react';

export function DemoFinance() {
  const transactions = [
    { id: 1, date: "Hoy, 10:30", type: "Ingreso", method: "Tarjeta", amount: "$5.000", description: "Consulta General - Juan Perez", status: "Aprobado" },
    { id: 2, date: "Ayer, 16:45", type: "Ingreso", method: "Efectivo", amount: "$3.500", description: "Limpieza - Maria Garcia", status: "Aprobado" },
    { id: 3, date: "24 Nov, 09:15", type: "Egreso", method: "Transferencia", amount: "-$12.000", description: "Insumos Médicos", status: "Pagado" },
    { id: 4, date: "23 Nov, 14:00", type: "Ingreso", method: "QR", amount: "$8.000", description: "Ortodoncia - Cuota 1", status: "Pendiente" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Finanzas</h2>
                <p className="text-slate-500">Control de ingresos y egresos</p>
            </div>
            <button className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors">
                <Download className="w-4 h-4" /> Reporte Mensual
            </button>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Ingresos (Mes)</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-baseline gap-2">
                        $450.000
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> +12%
                        </span>
                    </h3>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Gastos (Mes)</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-baseline gap-2">
                        $120.000
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> +5%
                        </span>
                    </h3>
                </div>
            </div>

            <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg shadow-indigo-200 relative overflow-hidden group hover:shadow-indigo-300 transition-all duration-300">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10">
                    <p className="text-sm font-bold text-indigo-200 uppercase tracking-wider mb-2">Balance Neto</p>
                    <h3 className="text-3xl font-black text-white tracking-tight flex items-baseline gap-2">
                        $330.000
                    </h3>
                    <p className="text-xs text-indigo-100 mt-2 opacity-80">Proyección cierre de mes: $380.000</p>
                </div>
            </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">Movimientos Recientes</h3>
                <button className="text-indigo-600 text-sm font-bold hover:underline">Ver Todo</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Fecha</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Descripción</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Método</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Monto</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4 text-sm text-slate-500 font-mono">{t.date}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${t.type === 'Ingreso' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {t.type === 'Ingreso' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 text-sm">{t.description}</p>
                                            <p className="text-[10px] text-slate-400 uppercase">{t.type}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-slate-400" />
                                    {t.method}
                                </td>
                                <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'Ingreso' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.amount}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                                        t.status === 'Aprobado' || t.status === 'Pagado' ? 'bg-green-50 text-green-700 border border-green-100' :
                                        'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                    }`}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
