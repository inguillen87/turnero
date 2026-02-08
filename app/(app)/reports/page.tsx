"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { useFetch } from "@/hooks/useFetch";
import { FaFileExcel, FaFilePdf } from "react-icons/fa6";

export default function ReportsPage() {
  const { data: appointments } = useFetch<any[]>('/api/appointments');

  const handleExportExcel = () => {
    if (!appointments) return;

    const data = appointments.map(a => ({
      Fecha: format(new Date(a.startAt), 'yyyy-MM-dd'),
      Hora: format(new Date(a.startAt), 'HH:mm'),
      Cliente: a.clientName,
      Servicio: a.service?.name,
      Precio: a.service?.price,
      Staff: a.staff?.name,
      Estado: a.status
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Turnos");
    XLSX.writeFile(wb, "reporte_turnos.xlsx");
  };

  const handleExportPDF = () => {
    if (!appointments) return;

    const doc = new jsPDF();
    doc.text("Reporte de Turnos", 14, 20);

    const tableData = appointments.map(a => [
        format(new Date(a.startAt), 'yyyy-MM-dd'),
        format(new Date(a.startAt), 'HH:mm'),
        a.clientName,
        a.service?.name,
        `$${a.service?.price}`,
        a.status
    ]);

    autoTable(doc, {
        head: [['Fecha', 'Hora', 'Cliente', 'Servicio', 'Precio', 'Estado']],
        body: tableData,
        startY: 30,
    });

    doc.save("reporte_turnos.pdf");
  };

  return (
    <div className="flex flex-col h-full space-y-8">
       <div>
         <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Reportes y Exportación</h2>
         <p className="text-slate-500">Descarga la información de tu negocio.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div onClick={handleExportExcel} className="glass-card p-8 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all cursor-pointer group bg-white dark:bg-slate-800">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FaFileExcel className="text-4xl"/>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Exportar a Excel</h3>
              <p className="text-slate-500 text-sm">Descarga un archivo .xlsx con todos los detalles para análisis.</p>
          </div>

          <div onClick={handleExportPDF} className="glass-card p-8 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all cursor-pointer group bg-white dark:bg-slate-800">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FaFilePdf className="text-4xl"/>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Exportar a PDF</h3>
              <p className="text-slate-500 text-sm">Genera un documento imprimible con la agenda diaria o mensual.</p>
          </div>
       </div>
    </div>
  );
}
