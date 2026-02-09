"use client";

import { useState } from "react";
import { Users, Search, Filter, FileDown, Table } from 'lucide-react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  createdAt: string | Date;
  _count: {
    appointments: number;
  };
}

interface ClientsListProps {
  initialClients: Client[];
}

export default function ClientsList({ initialClients }: ClientsListProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Listado de Pacientes", 14, 10);

    const tableData = filteredClients.map(c => [
        c.name,
        c.phone,
        c.email || "-",
        c._count.appointments.toString(),
        new Date(c.createdAt).toLocaleDateString()
    ]);

    autoTable(doc, {
        head: [['Nombre', 'Teléfono', 'Email', 'Turnos', 'Fecha Alta']],
        body: tableData,
        startY: 20,
    });

    doc.save("pacientes.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredClients.map(c => ({
        Nombre: c.name,
        Telefono: c.phone,
        Email: c.email || "-",
        Turnos: c._count.appointments,
        FechaAlta: new Date(c.createdAt).toLocaleDateString()
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pacientes");
    XLSX.writeFile(wb, "pacientes.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pacientes</h2>
        <div className="flex flex-wrap gap-2">
           <button
             onClick={exportPDF}
             className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-600 shadow-sm"
             title="Exportar a PDF"
           >
             <FileDown className="w-4 h-4" /> <span className="hidden sm:inline">PDF</span>
           </button>
           <button
             onClick={exportExcel}
             className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-600 shadow-sm"
             title="Exportar a Excel"
           >
             <Table className="w-4 h-4" /> <span className="hidden sm:inline">Excel</span>
           </button>
           <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-600 shadow-sm">
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
               <input
                 type="text"
                 placeholder="Buscar por nombre, teléfono o email..."
                 className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 ring-indigo-500/20 text-sm outline-none"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <div className="overflow-x-auto">
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
                {filteredClients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                            {c.name.charAt(0)}
                        </div>
                        {c.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        <p className="text-xs">{c.email || "-"}</p>
                        <p className="text-xs">{c.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">{c._count.appointments}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Ver Ficha</button>
                    </td>
                </tr>
                ))}
                {filteredClients.length === 0 && (
                    <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400">
                        <Users className="w-12 h-12 mx-auto mb-3 text-slate-200 dark:text-slate-700" />
                        {searchTerm ? "No se encontraron resultados." : "No hay pacientes registrados aún."}
                    </td>
                    </tr>
                )}
            </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
