"use client";

import { FileDown, Table } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

type LeadRow = {
  id: string;
  contactName: string;
  phone: string;
  rubro: string;
  intent: string;
  score: number;
  status: string;
  lastMessage: string;
};

export default function LeadsTableClient({ leads }: { leads: LeadRow[] }) {
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Leads", 14, 10);
    autoTable(doc, {
      head: [["Prospecto", "Teléfono", "Rubro", "Intento", "Score", "Estado"]],
      body: leads.map((lead) => [lead.contactName, lead.phone, lead.rubro, lead.intent, String(lead.score), lead.status]),
      startY: 20,
    });
    doc.save("leads.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      leads.map((lead) => ({
        Prospecto: lead.contactName,
        Telefono: lead.phone,
        Rubro: lead.rubro,
        Intento: lead.intent,
        Score: lead.score,
        Estado: lead.status,
        UltimoMensaje: lead.lastMessage,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");
    XLSX.writeFile(wb, "leads.xlsx");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <button onClick={exportPDF} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg text-sm">
          <FileDown className="w-4 h-4" /> PDF
        </button>
        <button onClick={exportExcel} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg text-sm">
          <Table className="w-4 h-4" /> Excel
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500">
            <tr>
              <th className="text-left px-4 py-3">Prospecto</th>
              <th className="text-left px-4 py-3">Rubro</th>
              <th className="text-left px-4 py-3">Intento</th>
              <th className="text-left px-4 py-3">Score</th>
              <th className="text-left px-4 py-3">Último mensaje</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">Aún no hay leads. Cuando entren consultas por WhatsApp o widget, aparecerán aquí.</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-slate-100 dark:border-slate-800 align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{lead.contactName}</p>
                    <p className="text-xs text-slate-500">{lead.phone}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{lead.rubro}</td>
                  <td className="px-4 py-3 capitalize">{lead.intent}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">{lead.score}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-md">{lead.lastMessage}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
