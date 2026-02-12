"use client";

import { User, Phone, Calendar, MoreHorizontal, Search, Filter, X, FileText, Activity, CreditCard, Clock, AlertTriangle, ShieldCheck, Banknote, MessageCircle } from "lucide-react";
import { useState } from "react";

export function DemoPatients() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
    {
        id: 1,
        name: "Juan Perez (Demo)",
        phone: "+54 9 11 1234 5678",
        email: "juan@demo.com",
        lastVisit: "Hace 2 días",
        totalVisits: 5,
        status: "Active",
        notes: "Paciente regular. Prefiere turnos por la tarde.",
        cancellationRate: 0,
        riskLevel: "LOW"
    },
    {
        id: 2,
        name: "Maria Garcia (Demo)",
        phone: "+54 9 11 8765 4321",
        email: "maria@demo.com",
        lastVisit: "Hoy",
        totalVisits: 12,
        status: "Active",
        notes: "Tratamiento de ortodoncia en curso.",
        cancellationRate: 5,
        riskLevel: "LOW"
    },
    {
        id: 3,
        name: "Carlos Lopez",
        phone: "+54 9 11 5555 0000",
        email: "carlos@test.com",
        lastVisit: "Hace 1 mes",
        totalVisits: 1,
        status: "Inactive",
        notes: "Primera consulta realizada. Canceló 2 veces seguidas.",
        cancellationRate: 66,
        riskLevel: "HIGH"
    },
    {
        id: 4,
        name: "Ana Torres",
        phone: "+54 9 11 4444 3333",
        email: "ana@test.com",
        lastVisit: "Nunca",
        totalVisits: 0,
        status: "New",
        notes: "Nuevo ingreso via Instagram.",
        cancellationRate: 0,
        riskLevel: "MEDIUM" // New logic
    },
  ];

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Patient List */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 w-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div>
              <h3 className="font-bold text-slate-800 text-lg">Pacientes</h3>
              <p className="text-slate-500 text-sm">Gestiona tu base de datos de clientes</p>
           </div>
           <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
              + Nuevo Paciente
           </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex gap-4">
            <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, email o teléfono..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                <Filter className="w-4 h-4" />
                Filtros
            </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto custom-scroll">
          <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                  <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 pl-6">Nombre</th>
                      <th className="py-3 hidden md:table-cell">Contacto</th>
                      <th className="py-3 hidden lg:table-cell">Estado</th>
                      <th className="py-3 hidden xl:table-cell">Riesgo</th>
                      <th className="py-3 text-right pr-6">Acciones</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                  {filteredPatients.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedPatient(p)}
                        className="hover:bg-indigo-50/50 transition-colors cursor-pointer group pl-6"
                      >
                          <td className="py-4 pl-6">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                      {p.name.charAt(0)}
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{p.name}</p>
                                      <p className="text-xs text-slate-400 font-mono">ID: #{p.id}</p>
                                  </div>
                              </div>
                          </td>
                          <td className="py-4 hidden md:table-cell">
                              <div className="text-sm text-slate-600 flex flex-col gap-1">
                                  <span className="flex items-center gap-1 font-medium"><Phone className="w-3 h-3 text-slate-400"/> {p.phone}</span>
                                  <span className="text-xs text-slate-400">{p.email}</span>
                              </div>
                          </td>
                          <td className="py-4 hidden lg:table-cell">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                  p.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                  p.status === 'New' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                  'bg-slate-50 text-slate-500 border-slate-200'
                              }`}>
                                  {p.status}
                              </span>
                          </td>
                          <td className="py-4 hidden xl:table-cell">
                              {p.riskLevel === 'HIGH' && (
                                  <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-100 w-fit">
                                      <AlertTriangle className="w-3 h-3" /> Alto Riesgo
                                  </span>
                              )}
                              {p.riskLevel === 'LOW' && (
                                  <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100 w-fit">
                                      <ShieldCheck className="w-3 h-3" /> Confiable
                                  </span>
                              )}
                          </td>
                          <td className="py-4 text-right pr-6">
                              <button className="text-slate-300 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-full">
                                  <MoreHorizontal className="w-5 h-5" />
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
      </div>

      {/* Full Screen Modal for Patient History */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl flex overflow-hidden animate-in zoom-in-95 duration-300 relative border border-white/20">

                {/* Close Button */}
                <button
                    onClick={() => setSelectedPatient(null)}
                    className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-slate-100 rounded-full transition-colors shadow-sm"
                >
                    <X className="w-6 h-6 text-slate-500" />
                </button>

                {/* Left Panel: Profile & Risk */}
                <div className="w-1/3 bg-slate-50/50 border-r border-slate-200 p-8 flex flex-col gap-6 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-200 ring-4 ring-white">
                            {selectedPatient.name.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">{selectedPatient.name}</h2>
                        <p className="text-indigo-600 font-medium text-sm">{selectedPatient.email}</p>

                        <div className="mt-6 flex justify-center gap-3">
                            <button className="flex-1 bg-white border border-slate-200 py-2 rounded-xl text-xs font-bold text-slate-600 hover:border-indigo-200 hover:text-indigo-600 transition-colors shadow-sm flex items-center justify-center gap-2">
                                <Phone className="w-3 h-3" /> Llamar
                            </button>
                            <button className="flex-1 bg-white border border-slate-200 py-2 rounded-xl text-xs font-bold text-slate-600 hover:border-green-200 hover:text-green-600 transition-colors shadow-sm flex items-center justify-center gap-2">
                                <MessageCircle className="w-3 h-3" /> WhatsApp
                            </button>
                        </div>
                    </div>

                    {/* AI Risk Analysis Card */}
                    <div className={`p-5 rounded-2xl border shadow-sm ${
                        selectedPatient.riskLevel === 'HIGH' ? 'bg-red-50 border-red-100' : 'bg-white border-slate-200'
                    }`}>
                        <h4 className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-2">
                            {selectedPatient.riskLevel === 'HIGH' ? (
                                <><AlertTriangle className="w-4 h-4 text-red-500" /> <span className="text-red-600">Alerta de Riesgo</span></>
                            ) : (
                                <><ShieldCheck className="w-4 h-4 text-green-500" /> <span className="text-green-600">Perfil Confiable</span></>
                            )}
                        </h4>

                        {selectedPatient.riskLevel === 'HIGH' ? (
                            <div className="space-y-2">
                                <p className="text-sm text-red-800 font-medium">Tasa de cancelación: {selectedPatient.cancellationRate}%</p>
                                <p className="text-xs text-red-600 leading-relaxed">
                                    Este paciente cancela frecuentemente. Se recomienda solicitar <strong>pago adelantado</strong> o seña del 50%.
                                </p>
                                <button className="w-full mt-2 bg-red-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                                    <Banknote className="w-3 h-3" /> Solicitar Seña
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-green-800 font-medium">Asistencia perfecta</p>
                                <p className="text-xs text-green-600 leading-relaxed">
                                    Paciente VIP. Suele llegar puntual. No requiere seña obligatoria.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Estadísticas</h4>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600">Turnos Totales</span>
                                <span className="font-bold text-slate-800">{selectedPatient.totalVisits}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Cancelaciones</span>
                                <span className={`font-bold ${selectedPatient.cancellationRate > 20 ? 'text-red-500' : 'text-slate-800'}`}>
                                    {selectedPatient.cancellationRate > 0 ? '2' : '0'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-yellow-800 text-sm italic relative">
                            <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-100 rounded-bl-lg"></div>
                            "{selectedPatient.notes}"
                        </div>
                    </div>
                </div>

                {/* Right Panel: History Timeline */}
                <div className="flex-1 bg-white p-8 overflow-y-auto custom-scroll relative">
                    <div className="sticky top-0 bg-white/90 backdrop-blur-sm z-10 pb-4 border-b border-slate-100 mb-6 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-indigo-600" />
                            Historial Clínico
                        </h3>
                        <button className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                            + Agregar Nota
                        </button>
                    </div>

                    <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
                        {/* Timeline Items (Mock) - customized based on risk */}
                        {[
                            { date: "Hoy, 10:00", type: "Consulta", title: "Limpieza Dental", status: "Completado", doctor: "Dra. Ana Gomez", notes: "Paciente refiere sensibilidad leve." },
                            selectedPatient.riskLevel === 'HIGH' ? { date: "05 Nov 2023", type: "Cancelacion", title: "Turno Cancelado", status: "Cancelado", reason: "No avisó (No Show)" } : null,
                            selectedPatient.riskLevel === 'HIGH' ? { date: "01 Nov 2023", type: "Cancelacion", title: "Turno Cancelado", status: "Cancelado", reason: "Canceló sobre la hora" } : null,
                            { date: "15 Ene 2024", type: "Pago", title: "Pago Recibido", status: "Aprobado", amount: "$3.500", method: "Mercado Pago" },
                            { date: "10 Dic 2023", type: "Consulta", title: "Consulta General", status: "Completado", doctor: "Dr. Admin", notes: "Control rutinario. Todo en orden." },
                        ].filter(Boolean).map((item: any, i) => (
                            <div key={i} className="pl-8 relative group animate-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${
                                    item.type === 'Consulta' ? 'bg-indigo-500' :
                                    item.type === 'Pago' ? 'bg-green-500' : 'bg-red-400'
                                }`}></div>

                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                                            <p className="text-xs text-slate-500">{item.date}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                                            item.status === 'Completado' || item.status === 'Aprobado' ? 'bg-green-100 text-green-700' :
                                            item.status === 'Cancelado' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    {item.type === 'Consulta' && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <User className="w-3 h-3" /> {item.doctor}
                                            </div>
                                            <p className="text-sm text-slate-600 italic">"{item.notes}"</p>
                                        </div>
                                    )}

                                    {item.type === 'Cancelacion' && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded border border-red-100">
                                                Motivo: {item.reason}
                                            </p>
                                        </div>
                                    )}

                                    {item.type === 'Pago' && (
                                        <div className="flex items-center gap-4 text-sm font-medium text-slate-700 bg-white p-2 rounded-lg border border-slate-100">
                                            <span className="flex items-center gap-1 text-green-600"><CreditCard className="w-3 h-3" /> {item.amount}</span>
                                            <span className="text-xs text-slate-400">{item.method}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
