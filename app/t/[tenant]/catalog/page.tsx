"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function CatalogPage() {
  const params = useParams();
  const tenantSlug = params.tenant as string;
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [tenantSlug]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`/api/t/${tenantSlug}/catalog/items`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/t/${tenantSlug}/catalog/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setFile(null);
        await fetchItems(); // Refresh list
      } else {
        alert("Upload failed");
      }
    } catch (e) {
      console.error(e);
      alert("Error uploading");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Catálogo de Servicios/Productos</h1>
          <p className="text-slate-500">Sube tu lista de precios (PDF/Excel) y nuestra IA la procesará.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" /> Subir Archivo
          </h3>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors">
            <input
              type="file"
              accept=".pdf,.xlsx,.csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <FileText className="w-10 h-10 text-slate-400 mb-2" />
              <span className="text-sm text-slate-600 font-medium">
                {file ? file.name : "Click para elegir PDF o Excel"}
              </span>
              <span className="text-xs text-slate-400 mt-1">Max 5MB</span>
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {uploading ? "Procesando con IA..." : "Subir y Procesar"}
          </button>
        </div>

        {/* Items List */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" /> Items Detectados ({items.length})
          </h3>

          {loadingItems ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : items.length === 0 ? (
            <div className="text-center p-8 text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
              <p>No hay items cargados aún.</p>
              <p className="text-sm">Sube un archivo para comenzar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-700">Nombre</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Categoría</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Precio</th>
                    <th className="px-4 py-3 font-medium text-slate-700">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                      <td className="px-4 py-3 text-slate-500">{item.category || "-"}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {item.price ? `$${item.price.toLocaleString()}` : <span className="text-amber-500 text-xs bg-amber-50 px-2 py-1 rounded">Consultar</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
