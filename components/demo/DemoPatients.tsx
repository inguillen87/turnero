"use client";

import { User, Phone, Calendar, MoreHorizontal, Search, Filter, X, FileText, Activity } from "lucide-react";
import { useState } from "react";

export function DemoPatients() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
    { id: 1, name: "Juan Perez (Demo)", phone: "+54 9 11 1234 5678", email: "juan@demo.com", lastVisit: "Hace 2 días", totalVisits: 5, status: "Active", notes: "Paciente regular. Prefiere turnos por la tarde." },
    { id: 2, name: "Maria Garcia (Demo)", phone: "+54 9 11 8765 4321", email: "maria@demo.com", lastVisit: "Hoy", totalVisits: 12, status: "Active", notes: "Tratamiento de ortodoncia en curso." },
    { id: 3, name: "Carlos Lopez", phone: "+54 9 11 5555 0000", email: "carlos@test.com", lastVisit: "Hace 1 mes", totalVisits: 1, status: "Inactive", notes: "Primera consulta realizada." },
    { id: 4, name: "Ana Torres", phone: "+54 9 11 4444 3333", email: "ana@test.com", lastVisit: "Nunca", totalVisits: 0, status: "New", notes: "Nuevo ingreso via Instagram." },
  ];

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Patient List */}
      <div className={`flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${selectedPatient ? 'w-2/3' : 'w-full'}`}>
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
                      <th className="py-3 text-right pr-6">Acciones</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                  {filteredPatients.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedPatient(p)}
                        className={`hover:bg-indigo-50/50 transition-colors cursor-pointer group ${selectedPatient?.id === p.id ? 'bg-indigo-50 border-l-4 border-indigo-500 pl-5' : 'pl-6'}`}
                      >
                          <td className="py-4 pl-6">
                              <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-110 ${
                                      selectedPatient?.id === p.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                      {p.name.charAt(0)}
                                  </div>
                                  <div>
                                      <p className={`font-bold transition-colors ${selectedPatient?.id === p.id ? 'text-indigo-700' : 'text-slate-700'}`}>{p.name}</p>
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

      {/* Patient Details Panel (Right Sidebar) */}
      {selectedPatient && (
          <div className="w-[360px] bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col animate-in slide-in-from-right-10 duration-300 z-20">
              <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-bl-full opacity-50 -mr-10 -mt-10"></div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg mb-4">
                        {selectedPatient.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-slate-800 text-xl leading-tight">{selectedPatient.name}</h3>
                    <p className="text-indigo-600 text-sm font-medium">{selectedPatient.email}</p>
                  </div>

                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 bg-white rounded-full shadow-sm hover:shadow relative z-20"
                  >
                      <X className="w-5 h-5" />
                  </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scroll space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                          <p className="text-xs text-slate-500 uppercase font-bold">Visitas</p>
                          <p className="text-xl font-black text-slate-700">{selectedPatient.totalVisits}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                          <p className="text-xs text-slate-500 uppercase font-bold">Canceladas</p>
                          <p className="text-xl font-black text-slate-700">0</p>
                      </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <User className="w-3 h-3" /> Datos de Contacto
                      </h4>
                      <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-slate-600 bg-white p-3 border border-slate-100 rounded-lg">
                              <Phone className="w-4 h-4 text-indigo-500" />
                              {selectedPatient.phone}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-600 bg-white p-3 border border-slate-100 rounded-lg">
                              <Calendar className="w-4 h-4 text-indigo-500" />
                              Última visita: {selectedPatient.lastVisit}
                          </div>
                      </div>
                  </div>

                  {/* Notes */}
                  <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FileText className="w-3 h-3" /> Notas Clínicas
                      </h4>
                      <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl text-sm text-yellow-800 italic relative">
                          <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-100 rounded-bl-lg"></div>
                          "{selectedPatient.notes}"
                      </div>
                  </div>

                  {/* History Timeline */}
                  <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Activity className="w-3 h-3" /> Historial Reciente
                      </h4>
                      <div className="space-y-4 border-l-2 border-slate-100 pl-4 ml-1">
                          {[1,2].map((_, i) => (
                              <div key={i} className="relative">
                                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                                  <p className="text-sm font-bold text-slate-700">Consulta General</p>
                                  <p className="text-xs text-slate-400">Hace {i+1} meses • Dr. Admin</p>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50">
                  <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                      Agendar Nuevo Turno
                  </button>
              </div>
          </div>
      )}
    </div>
  );
}
